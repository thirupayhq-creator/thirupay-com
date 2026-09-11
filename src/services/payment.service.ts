import prisma from "../config/database";
import { getPaymentProvider } from "../providers/payment/payment-provider";
import type { InputJsonValue } from "@prisma/client/runtime/library";

/**
 * Cashfree provider response
 *
 * paymentSessionId is required by Cashfree Checkout.
 */
interface ProviderPaymentResponse {
  providerRef: string;
  paymentSessionId?: string;
}

/**
 * Create Payment Input
 */
interface CreatePaymentInput {
  merchantId: string;
  orderId: string;
  amount: number;
  currency: string;

  paymentMethod?:
    | "UPI"
    | "CARD"
    | "NETBANKING"
    | "WALLET";

  description?: string;
  metadata?: InputJsonValue;
  idempotencyKey?: string;

  customerId?: string;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
}

/**
 * Verify Payment Input
 */
interface VerifyPaymentInput {
  paymentId: string;
  merchantId: string;
}

/**
 * Create Payment
 *
 * Flow:
 *
 * Controller
 *    ↓
 * Payment Service
 *    ↓
 * Cashfree Provider
 *    ↓
 * Cashfree Create Order API
 *    ↓
 * payment_session_id
 *    ↓
 * PostgreSQL
 */
export async function createPayment(
  input: CreatePaymentInput
) {
  const merchantId = input.merchantId?.trim();
  const orderId = input.orderId?.trim();
  const currency = input.currency?.trim().toUpperCase();
  const amount = Number(input.amount);

  if (!merchantId) {
    throw new Error("Merchant ID is required");
  }

  if (!orderId) {
    throw new Error("Order ID is required");
  }

  if (!Number.isFinite(amount) || amount <= 0) {
    throw new Error("Amount must be greater than zero");
  }

  if (!Number.isInteger(Math.round(amount * 100))) {
    throw new Error("Amount is invalid");
  }

  if (!currency) {
    throw new Error("Currency is required");
  }

  if (currency !== "INR") {
    throw new Error("Only INR currency is supported");
  }

  /**
   * ----------------------------------------------------------
   * 1. IDEMPOTENCY CHECK
   * ----------------------------------------------------------
   */
  if (input.idempotencyKey) {
    const idempotencyKey = input.idempotencyKey.trim();

    const existingKey =
      await prisma.idempotencyKey.findUnique({
        where: {
          key_merchantId_endpoint: {
            key: idempotencyKey,
            merchantId,
            endpoint: "POST:/api/v1/payments",
          },
        },
      });

    if (existingKey?.response) {
      const response = existingKey.response;

      if (
        typeof response !== "object" ||
        response === null ||
        !("id" in response) ||
        typeof response.id !== "string"
      ) {
        throw new Error(
          "Stored idempotency response is invalid"
        );
      }

      const existingPayment =
        await prisma.payment.findUnique({
          where: {
            id: response.id,
          },
        });

      if (!existingPayment) {
        throw new Error(
          "Stored idempotency payment was not found"
        );
      }

      return existingPayment;
    }
  }

  /**
   * ----------------------------------------------------------
   * 2. CHECK DUPLICATE ORDER
   * ----------------------------------------------------------
   */
  const existingPayment =
    await prisma.payment.findUnique({
      where: {
        merchantId_orderId: {
          merchantId,
          orderId,
        },
      },
    });

  if (existingPayment) {
    throw new Error(
      "Payment already exists for this order"
    );
  }

  /**
   * ----------------------------------------------------------
   * 3. CHECK MERCHANT
   * ----------------------------------------------------------
   */
  const merchant =
    await prisma.merchant.findUnique({
      where: {
        id: merchantId,
      },
    });

  if (!merchant) {
    throw new Error("Merchant not found");
  }

  if (merchant.status !== "ACTIVE") {
    throw new Error(
      "Merchant must be ACTIVE to create a payment"
    );
  }

  /**
   * ----------------------------------------------------------
   * 4. GET CASHFREE PAYMENT PROVIDER
   * ----------------------------------------------------------
   */
  const provider = getPaymentProvider();

  /**
   * ----------------------------------------------------------
   * 5. CREATE CASHFREE ORDER
   * ----------------------------------------------------------
   *
   * The provider creates the Cashfree order.
   *
   * providerRef       = Cashfree order_id
   * paymentSessionId  = Cashfree payment_session_id
   */
  const providerPayment =
    (await provider.createPayment({
      amount,
      currency,
      orderId,
    })) as ProviderPaymentResponse;

  if (!providerPayment?.providerRef) {
    throw new Error(
      "Cashfree order ID was not returned"
    );
  }

  if (!providerPayment.paymentSessionId) {
    throw new Error(
      "Cashfree payment session ID was not returned"
    );
  }

  /**
   * ----------------------------------------------------------
   * 6. SAVE PAYMENT
   * ----------------------------------------------------------
   */
  const payment =
    await prisma.payment.create({
      data: {
        merchantId,
        orderId,
        amount,
        currency,
        status: "PENDING" as any,
        paymentMethod: (input.paymentMethod ?? "UPI") as any,
        provider: provider.name,
        providerPaymentId: providerPayment.providerRef,
        paymentSessionId: providerPayment.paymentSessionId,
        description: input.description?.trim(),
        metadata: input.metadata,
      },
    });

  /**
   * ----------------------------------------------------------
   * 7. SAVE IDEMPOTENCY RESPONSE
   * ----------------------------------------------------------
   */
  if (input.idempotencyKey) {
    const idempotencyKey =
      input.idempotencyKey.trim();

    try {
      await prisma.idempotencyKey.create({
        data: {
          merchantId,
          key: idempotencyKey,
          endpoint: "POST:/api/v1/payments",
          response: {
            id: payment.id,
            orderId: payment.orderId,
            amount: payment.amount.toString(),
            currency: payment.currency,
            status: payment.status,
            provider: payment.provider,
            providerPaymentId: payment.providerPaymentId,
            paymentSessionId: payment.paymentSessionId,
          },
        },
      });
    } catch (error) {
      /**
       * Another request may have created the same
       * idempotency key concurrently.
       */
      const existingKey =
        await prisma.idempotencyKey.findUnique({
          where: {
            key_merchantId_endpoint: {
              key: idempotencyKey,
              merchantId,
              endpoint: "POST:/api/v1/payments",
            },
          },
        });

      if (!existingKey) {
        throw error;
      }
    }
  }

  return payment;
}

/**
 * Verify Payment
 *
 * Flow:
 *
 * Controller
 *    ↓
 * Payment Service
 *    ↓
 * Cashfree Provider
 *    ↓
 * Cashfree Get Payments API
 *    ↓
 * PostgreSQL
 */
export async function verifyPayment(
  input: VerifyPaymentInput
) {
  const paymentId = input.paymentId?.trim();
  const merchantId = input.merchantId?.trim();

  if (!paymentId) {
    throw new Error("Payment ID is required");
  }

  if (!merchantId) {
    throw new Error("Merchant ID is required");
  }

  /**
   * ----------------------------------------------------------
   * 1. FIND PAYMENT
   * ----------------------------------------------------------
   */
  const payment =
    await prisma.payment.findFirst({
      where: {
        id: paymentId,
        merchantId,
      },
    });

  if (!payment) {
    throw new Error("Payment not found");
  }

  /**
   * ----------------------------------------------------------
   * 2. ALREADY SUCCESSFUL
   * ----------------------------------------------------------
   */
  if (payment.status === "SUCCESS") {
    return payment;
  }

  /**
   * ----------------------------------------------------------
   * 3. CHECK CASHFREE ORDER ID
   * ----------------------------------------------------------
   */
  if (!payment.providerPaymentId) {
    throw new Error(
      "Cashfree order ID not found"
    );
  }

  /**
   * ----------------------------------------------------------
   * 4. GET PAYMENT PROVIDER
   * ----------------------------------------------------------
   */
  const provider = getPaymentProvider();

  /**
   * ----------------------------------------------------------
   * 5. VERIFY THROUGH CASHFREE
   * ----------------------------------------------------------
   */
  const verification =
    await provider.verifyPayment(
      payment.providerPaymentId
    );

  /**
   * ----------------------------------------------------------
   * 6. UPDATE DATABASE
   * ----------------------------------------------------------
   *
   * The current PaymentProvider contract returns
   * { success: boolean }.
   *
   * Webhooks remain the authoritative mechanism for
   * final payment status updates.
   */
  const newStatus =
    verification.success
      ? "SUCCESS"
      : "PENDING";

  const updatedPayment =
    await prisma.payment.update({
      where: {
        id: payment.id,
      },

      data: {
        status: newStatus,

        paidAt:
          newStatus === "SUCCESS"
            ? payment.paidAt ?? new Date()
            : payment.paidAt,
      },
    });

  return updatedPayment;
}

/**
 * Get Payment By ID
 */
export async function getPaymentById(
  paymentId: string,
  merchantId: string
) {
  const normalizedPaymentId =
    paymentId?.trim();

  const normalizedMerchantId =
    merchantId?.trim();

  if (!normalizedPaymentId) {
    throw new Error("Payment ID is required");
  }

  if (!normalizedMerchantId) {
    throw new Error("Merchant ID is required");
  }

  const payment =
    await prisma.payment.findFirst({
      where: {
        id: normalizedPaymentId,
        merchantId: normalizedMerchantId,
      },

      include: {
        refunds: true,
        webhookEvents: true,
      },
    });

  if (!payment) {
    throw new Error("Payment not found");
  }

  return payment;
}