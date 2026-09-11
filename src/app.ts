import express from "express";
import cors from "cors";
import helmet from "helmet";

import authRoutes from "./routes/auth.routes";
import merchantRoutes from "./routes/merchant.routes";
import kycRoutes from "./routes/kyc.routes";
import paymentRoutes from "./routes/payment.routes";
import refundRoutes from "./routes/refund.routes";
import payoutRoutes from "./routes/payout.routes";
import webhookRoutes from "./routes/webhook.routes";

import { errorMiddleware } from "./middleware/error.middleware";

const app = express();

/**
 * ==========================================
 * SECURITY & CORE MIDDLEWARE
 * ==========================================
 */

app.disable("x-powered-by");

app.use(
  helmet({
    crossOriginResourcePolicy: {
      policy: "cross-origin",
    },
  })
);

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

/**
 * ==========================================
 * CASHFREE WEBHOOK RAW BODY
 * ==========================================
 *
 * Cashfree webhook signature verification
 * requires the original/raw request body.
 *
 * This middleware stores the raw body in
 * req.rawBody before JSON parsing.
 */

app.use(
  express.json({
    limit: "1mb",
    verify: (
      req: express.Request & {
        rawBody?: Buffer;
      },
      _res,
      buffer
    ) => {
      req.rawBody = Buffer.from(buffer);
    },
  })
);

app.use(
  express.urlencoded({
    extended: true,
    limit: "1mb",
  })
);

/**
 * ==========================================
 * ROOT ROUTE
 * ==========================================
 */

app.get("/", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "TIRU PAY Backend API is running",
    service: "TIRU PAY",
    version: "1.0.0",
  });
});

/**
 * ==========================================
 * HEALTH CHECK
 * ==========================================
 */

app.get("/health", (_req, res) => {
  res.status(200).json({
    success: true,
    service: "TIRU PAY",
    status: "UP",
    timestamp: new Date().toISOString(),
  });
});

/**
 * ==========================================
 * FRONTEND → BACKEND TEST
 * ==========================================
 *
 * Used to verify that the React frontend
 * can communicate with the Express backend.
 */

app.get("/api/test", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "Frontend connected to backend!",
  });
});

/**
 * ==========================================
 * API ROUTES
 * ==========================================
 */

// Authentication
app.use(
  "/api/v1/auth",
  authRoutes
);

// Merchant
app.use(
  "/api/v1/merchants",
  merchantRoutes
);

// KYC
app.use(
  "/api/v1/kyc",
  kycRoutes
);

// Payments
app.use(
  "/api/v1/payments",
  paymentRoutes
);

// Refunds
app.use(
  "/api/v1",
  refundRoutes
);

// Payouts
app.use(
  "/api/v1/payouts",
  payoutRoutes
);

// Cashfree Webhooks
app.use(
  "/api/v1/webhooks",
  webhookRoutes
);

/**
 * ==========================================
 * 404 HANDLER
 * ==========================================
 *
 * This must remain AFTER all valid routes.
 */

app.use((_req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

/**
 * ==========================================
 * GLOBAL ERROR HANDLER
 * ==========================================
 */

app.use(errorMiddleware);

/**
 * ==========================================
 * EXPORT APP
 * ==========================================
 */

export { app };

export default app;

