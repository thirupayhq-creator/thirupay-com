import { Request, Response, NextFunction } from "express";
import crypto from "crypto";
import prisma from "../config/database";
import { env } from "../config/env";
import { logger } from "../config/logger";

/**
 * Cashfree Webhook
 * POST /api/v1/webhooks/payment
 */
export async function cashfreeWebhook(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    /*
     * Cashfree webhook headers
     */
    const signatureHeader = req.headers["x-webhook-signature"];
    const timestampHeader = req.headers["x-webhook-timestamp"];

    if (
      !signatureHeader ||
      Array.isArray(signatureHeader) ||
      !timestampHeader ||
      Array.isArray(timestampHeader)
    ) {
      res.status(400).json({
        success: false,
        message: "Missing Cashfree webhook signature",
      });
      return;
    }

    /*
     * IMPORTANT:
     * Cashfree signature verification must use the raw request body.
     *
     * Configure this route with express.raw({ type: "application/json" })
     * before this controller.
     */
    const rawBody = Buffer.isBuffer(req.body)
      ? req.body
      : Buffer.from(JSON.stringify(req.body));

    const timestamp = String(timestampHeader);
    const signature = String(signatureHeader);

    /*
     * Cashfree signature payload:
     * timestamp + rawBody
     */
    const signaturePayload = Buffer.concat([
      Buffer.from(timestamp, "utf8"),
      rawBody,
    ]);

    const expectedSignature = crypto
      .createHmac(
        "sha256",
        env.CASHFREE_WEBHOOK_SECRET || env.cashfreeWebhookSecret
      )
      .update(signaturePayload)
      .digest("base64");

    const receivedBuffer = Buffer.from(signature, "utf8");
    const expectedBuffer = Buffer.from(
      expectedSignature,
      "utf8"
    );

    /*
     * Timing-safe signature comparison
     */
    if (
      receivedBuffer.length !== expectedBuffer.length ||
      !crypto.timingSafeEqual(
        receivedBuffer,
        expectedBuffer
      )
    ) {
      logger.warn("Invalid Cashfree webhook signature");

      res.status(401).json({
        success: false,
        message: "Invalid webhook signature",
      });
      return;
    }

    /*
     * Parse webhook body
     */
    let payload: any;

    try {
      payload = Buffer.isBuffer(req.body)
        ? JSON.parse(req.body.toString("utf8"))
        : req.body;
    } catch {
      res.status(400).json({
        success: false,
        message: "Invalid webhook payload",
      });
      return;
    }

    /*
     * Cashfree webhook event information
     */
    const eventType =
      payload?.type ||
      payload?.event ||
      payload?.data?.event_type;

    const cashfreeOrderId =
      payload?.data?.order?.order_id ||
      payload?.data?.order_id;

    const cashfreePaymentId =
      payload?.data?.payment?.cf_payment_id ||
      payload?.data?.payment_id;

    /*
     * Cashfree does not provide the same Razorpay
     * x-razorpay-event-id header.
     *
     * Generate a deterministic event ID from the
     * timestamp + signature + event information.
     */
    const eventId = crypto
      .createHash("sha256")
      .update(
        `${timestamp}:${signature}:${eventType || ""}:${cashfreePaymentId || cashfreeOrderId || ""}`
      )
      .digest("hex");

    if (!eventType) {
      res.status(400).json({
        success: false,
        message: "Webhook event type is missing",
      });
      return;
    }

    /*
     * Check duplicate webhook
     */
    const existingEvent =
      await prisma.webhookEvent.findUnique({
        where: {
          eventId,
        },
      });

    if (existingEvent) {
      logger.info("Cashfree duplicate webhook received", {
        eventId,
        eventType,
      });

      res.status(200).json({
        success: true,
        message: "Webhook already processed",
      });
      return;
    }

    /*
     * Find payment
     *
     * Prefer Cashfree payment ID when available.
     * Otherwise use Cashfree order ID.
     */
    let paymentId: string | undefined;

    if (cashfreePaymentId) {
      const payment = await prisma.payment.findFirst({
        where: {
          providerPaymentId: String(cashfreePaymentId),
        },
        select: {
          id: true,
        },
      });

      paymentId = payment?.id;
    }

    if (!paymentId && cashfreeOrderId) {
      const payment = await prisma.payment.findFirst({
        where: {
          cashfreeOrderId: String(cashfreeOrderId),
        },
        select: {
          id: true,
        },
      });

      paymentId = payment?.id;
    }

    /*
     * Store webhook event
     */
    const webhookEvent =
      await prisma.webhookEvent.create({
        data: {
          eventId,
          eventType: String(eventType),
          provider: "CASHFREE",
          paymentId,
          signature,
          payload,
          status: "RECEIVED",
        },
      });

    /*
     * Payment success
     *
     * Cashfree commonly sends:
     * PAYMENT_SUCCESS_WEBHOOK
     */
    if (
      [
        "PAYMENT_SUCCESS_WEBHOOK",
        "PAYMENT_SUCCESS",
        "payment.success",
      ].includes(String(eventType)) &&
      paymentId
    ) {
      await prisma.payment.update({
        where: {
          id: paymentId,
        },
        data: {
          status: "SUCCESS",
          paidAt: new Date(),
          providerPaymentId: cashfreePaymentId
            ? String(cashfreePaymentId)
            : undefined,
        },
      });

      logger.info("Cashfree payment marked successful", {
        eventId,
        paymentId,
        cashfreeOrderId,
        cashfreePaymentId,
      });
    }

    /*
     * Payment failed
     */
    if (
      [
        "PAYMENT_FAILED_WEBHOOK",
        "PAYMENT_FAILED",
        "payment.failed",
      ].includes(String(eventType)) &&
      paymentId
    ) {
      await prisma.payment.update({
        where: {
          id: paymentId,
        },
        data: {
          status: "FAILED",
          providerPaymentId: cashfreePaymentId
            ? String(cashfreePaymentId)
            : undefined,
        },
      });

      logger.warn("Cashfree payment marked failed", {
        eventId,
        paymentId,
        cashfreeOrderId,
        cashfreePaymentId,
      });
    }

    /*
     * Refund processed
     */
    if (
      [
        "REFUND_STATUS_WEBHOOK",
        "REFUND_SUCCESS",
        "refund.success",
      ].includes(String(eventType)) &&
      paymentId
    ) {
      await prisma.payment.update({
        where: {
          id: paymentId,
        },
        data: {
          status: "REFUNDED",
        },
      });

      logger.info("Cashfree refund webhook processed", {
        eventId,
        paymentId,
        cashfreeOrderId,
      });
    }

    /*
     * Mark webhook as processed
     */
    await prisma.webhookEvent.update({
      where: {
        id: webhookEvent.id,
      },
      data: {
        status: "PROCESSED",
        processedAt: new Date(),
      },
    });

    logger.info("Cashfree webhook processed successfully", {
      eventId,
      eventType,
      paymentId,
      cashfreeOrderId,
      cashfreePaymentId,
    });

    res.status(200).json({
      success: true,
      message: "Webhook processed successfully",
    });
  } catch (error) {
    logger.error(
      "Cashfree webhook processing failed",
      error
    );

    next(error);
  }
}