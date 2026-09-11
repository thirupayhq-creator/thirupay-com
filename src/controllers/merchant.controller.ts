import { Request, Response, NextFunction } from "express";
import prisma from "../config/database";
import { logger } from "../config/logger";

export async function onboardMerchant(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
      return;
    }

    const {
      businessName,
      businessType,
      phone,
    } = req.body;

    // Validate business name
    if (
      typeof businessName !== "string" ||
      businessName.trim().length < 2
    ) {
      res.status(400).json({
        success: false,
        message: "Business name must be at least 2 characters",
      });
      return;
    }

    // Validate business type if supplied
    if (
      businessType !== undefined &&
      businessType !== null &&
      typeof businessType !== "string"
    ) {
      res.status(400).json({
        success: false,
        message: "Business type must be a string",
      });
      return;
    }

    // Validate phone if supplied
    if (
      phone !== undefined &&
      phone !== null &&
      typeof phone !== "string"
    ) {
      res.status(400).json({
        success: false,
        message: "Phone number must be a string",
      });
      return;
    }

    // Check merchant
    const existingMerchant = await prisma.merchant.findUnique({
      where: {
        userId,
      },
    });

    if (!existingMerchant) {
      res.status(404).json({
        success: false,
        message: "Merchant account not found",
      });
      return;
    }

    // Prevent onboarding an already active merchant
    if (existingMerchant.status === "ACTIVE") {
      res.status(409).json({
        success: false,
        message: "Merchant is already active",
        data: {
          merchantId: existingMerchant.id,
          status: existingMerchant.status,
        },
      });
      return;
    }

    // Prevent onboarding a suspended merchant
    if (existingMerchant.status === "SUSPENDED") {
      res.status(403).json({
        success: false,
        message: "Merchant account is suspended",
        data: {
          merchantId: existingMerchant.id,
          status: existingMerchant.status,
        },
      });
      return;
    }

    const merchant = await prisma.merchant.update({
      where: {
        userId,
      },
      data: {
        businessName: businessName.trim(),
        businessType:
          typeof businessType === "string"
            ? businessType.trim()
            : businessType,
        phone:
          typeof phone === "string"
            ? phone.trim()
            : phone,
        status: "PENDING",
      },
    });

    logger.info("Merchant onboarding submitted", {
      merchantId: merchant.id,
      userId,
      status: merchant.status,
    });

    res.status(200).json({
      success: true,
      message: "Merchant onboarding submitted successfully",
      data: {
        merchantId: merchant.id,
        businessName: merchant.businessName,
        businessType: merchant.businessType,
        phone: merchant.phone,
        status: merchant.status,
      },
    });
  } catch (error) {
    logger.error("Merchant onboarding failed", error);
    next(error);
  }
}

export async function getMerchantProfile(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
      return;
    }

    const merchant = await prisma.merchant.findUnique({
      where: {
        userId,
      },
      include: {
        kyc: true,
      },
    });

    if (!merchant) {
      res.status(404).json({
        success: false,
        message: "Merchant not found",
      });
      return;
    }

    logger.info("Merchant profile fetched", {
      merchantId: merchant.id,
      userId,
    });

    res.status(200).json({
      success: true,
      message: "Merchant profile fetched successfully",
      data: {
        merchantId: merchant.id,
        businessName: merchant.businessName,
        businessType: merchant.businessType,
        phone: merchant.phone,
        status: merchant.status,
        createdAt: merchant.createdAt,
        updatedAt: merchant.updatedAt,
        kyc: merchant.kyc
          ? {
              id: merchant.kyc.id,
              status: merchant.kyc.status,
              provider: merchant.kyc.provider,
              providerReference: merchant.kyc.providerReference,
              submittedAt: merchant.kyc.submittedAt,
              verifiedAt: merchant.kyc.verifiedAt,
              rejectedAt: merchant.kyc.rejectedAt,
              rejectionReason: merchant.kyc.rejectionReason,
            }
          : null,
      },
    });
  } catch (error) {
    logger.error("Failed to fetch merchant profile", error);
    next(error);
  }
}