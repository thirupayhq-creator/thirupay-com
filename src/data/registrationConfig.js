// Shared constants, validators and helpers for the 3-stage merchant
// registration wizard (Account → Business → KYC & Bank).
import { compressImage } from "../utils/imageCompress";

export const BUSINESS_CATEGORIES = [
  "Retail / Kirana Store",
  "Restaurant / Food",
  "Services",
  "E-commerce / Online Store",
  "Healthcare / Pharmacy",
  "Education",
  "Other",
];

export const ENTITY_TYPES = ["Sole Proprietorship", "Partnership", "Private Limited", "LLP", "Other"];

export const IDENTITY_DOC_TYPES = [
  { value: "aadhaar", label: "Aadhaar" },
  { value: "passport", label: "Passport (File No)" },
  { value: "driving_licence", label: "Driving Licence" },
  { value: "voter_id", label: "Voter ID" },
];

export const REGISTRATION_STEPS = [
  { path: "account", label: "Account" },
  { path: "business", label: "Business" },
  { path: "kyc", label: "KYC & Bank" },
];

export const PAN_REGEX = /^[A-Z]{5}[0-9]{4}[A-Z]$/;
export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// ---------- Step validators (used by the route guard and the Continue buttons) ----------
export function isAccountStepValid(form) {
  return (
    !!form.businessName?.trim() &&
    !!form.ownerName?.trim() &&
    EMAIL_REGEX.test(form.email || "") &&
    (form.phone || "").length === 10 &&
    !!form.phoneVerified &&
    (form.password || "").length >= 6 &&
    form.password === form.confirmPassword &&
    !!form.agreedToTerms
  );
}

export function isBusinessStepValid(form) {
  return (
    !!form.businessCategory &&
    !!form.entityType &&
    !!form.addressLine1?.trim() &&
    (form.pincode || "").length === 6 &&
    !!form.city?.trim() &&
    !!form.state?.trim()
  );
}

// ---------- File helper ----------
// Compresses images; guards non-image files (PDF/ZIP) against a size cap.
// Everything is stored as a data URL because the demo keeps data in localStorage.
export async function readFile(file, { maxSizeMB = 2 } = {}) {
  if (file.type.startsWith("image/")) {
    const compressed = await compressImage(file, { maxWidth: 1000, quality: 0.65 });
    return { fileName: file.name, fileData: compressed };
  }
  if (file.size > maxSizeMB * 1024 * 1024) {
    throw new Error(`File must be under ${maxSizeMB}MB. Please upload a smaller file.`);
  }
  const fileData = await new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error("Could not read file."));
    reader.readAsDataURL(file);
  });
  return { fileName: file.name, fileData };
}
