export interface PaymentProvider {
  readonly name: string;

  createPayment(input: {
    amount: number;
    currency: string;
    orderId: string;
  }): Promise<{
    providerRef: string;
  }>;

  verifyPayment(
    providerRef: string
  ): Promise<{
    success: boolean;
  }>;

  refundPayment(
    providerRef: string,
    amount: number
  ): Promise<{
    providerRef: string;
  }>;

  createPayout(input: {
    amount: number;
    currency: string;
    beneficiary: string;
  }): Promise<{
    providerRef: string;
  }>;
}

/**
 * Get configured payment provider.
 *
 * TIRU PAY currently uses:
 * - CASHFREE
 * - MOCK
 *
 * Set PAYMENT_PROVIDER=CASHFREE in .env
 * when using the Cashfree integration.
 */
export function getPaymentProvider(): PaymentProvider {
  const provider = (
    process.env.PAYMENT_PROVIDER || "MOCK"
  )
    .trim()
    .toUpperCase();

  switch (provider) {
    case "CASHFREE":
      /*
       * Cashfree is handled by cashfree.service.ts.
       *
       * Keep this provider factory for the generic
       * provider architecture. If you create a
       * CashfreePaymentProvider class implementing
       * PaymentProvider, return it here.
       */
      throw new Error(
        "Cashfree provider must be connected through cashfree.service.ts"
      );

    case "MOCK":
      return new MockPaymentProvider();

    case "RAZORPAY":
      throw new Error(
        "Razorpay provider is no longer configured. Use CASHFREE or MOCK."
      );

    default:
      throw new Error(
        `Unsupported payment provider: ${provider}`
      );
  }
}

/**
 * Mock payment provider
 *
 * Used for local development and testing when
 * PAYMENT_PROVIDER=MOCK.
 */
class MockPaymentProvider
  implements PaymentProvider
{
  readonly name = "MOCK";

  async createPayment(input: {
    amount: number;
    currency: string;
    orderId: string;
  }): Promise<{
    providerRef: string;
  }> {
    const amount = Number(input.amount);
    const currency = input.currency
      ?.trim()
      .toUpperCase();
    const orderId = input.orderId?.trim();

    if (
      !Number.isFinite(amount) ||
      amount <= 0
    ) {
      throw new Error(
        "Amount must be greater than zero"
      );
    }

    if (!currency) {
      throw new Error("Currency is required");
    }

    if (!orderId) {
      throw new Error("Order ID is required");
    }

    return {
      providerRef:
        `mock_pay_${Date.now()}_${orderId}`,
    };
  }

  async verifyPayment(
    providerRef: string
  ): Promise<{
    success: boolean;
  }> {
    const reference =
      providerRef?.trim();

    if (!reference) {
      throw new Error(
        "Provider payment reference is required"
      );
    }

    return {
      success:
        reference.startsWith("mock_pay_"),
    };
  }

  async refundPayment(
    providerRef: string,
    amount: number
  ): Promise<{
    providerRef: string;
  }> {
    const reference =
      providerRef?.trim();
    const refundAmount = Number(amount);

    if (!reference) {
      throw new Error(
        "Provider payment reference is required"
      );
    }

    if (
      !Number.isFinite(refundAmount) ||
      refundAmount <= 0
    ) {
      throw new Error(
        "Refund amount must be greater than zero"
      );
    }

    return {
      providerRef:
        `mock_ref_${Date.now()}_${Math.random()
          .toString(36)
          .substring(2, 8)}`,
    };
  }

  async createPayout(input: {
    amount: number;
    currency: string;
    beneficiary: string;
  }): Promise<{
    providerRef: string;
  }> {
    const amount = Number(input.amount);
    const currency = input.currency
      ?.trim()
      .toUpperCase();
    const beneficiary =
      input.beneficiary?.trim();

    if (
      !Number.isFinite(amount) ||
      amount <= 0
    ) {
      throw new Error(
        "Payout amount must be greater than zero"
      );
    }

    if (!currency) {
      throw new Error("Currency is required");
    }

    if (!beneficiary) {
      throw new Error(
        "Beneficiary is required"
      );
    }

    return {
      providerRef:
        `mock_payout_${Date.now()}_${Math.random()
          .toString(36)
          .substring(2, 8)}`,
    };
  }
}