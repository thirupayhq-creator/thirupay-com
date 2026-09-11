import { Router } from "express";

import {
  onboardMerchant,
  getMerchantProfile,
} from "../controllers/merchant.controller";

import { authenticate } from "../middleware/auth.middleware";

const router = Router();

/**
 * Merchant Routes
 */

// Merchant onboarding
router.post("/onboard", authenticate, onboardMerchant);

// Get authenticated merchant profile
router.get("/profile", authenticate, getMerchantProfile);

export default router;