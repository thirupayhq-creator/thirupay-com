import { ReceiptText, Package, BookOpen, TrendingUp } from "lucide-react";

// Single list of the merchant "Business Tools" — used by the sidebar group and the
// Dashboard quick-access tiles, so a new tool only has to be added here.
// `key` is the translation key for the label.
export const BUSINESS_TOOLS = [
  { to: "/merchant/billing", key: "billing", icon: ReceiptText },
  { to: "/merchant/products", key: "products", icon: Package },
  { to: "/merchant/khata", key: "khata", icon: BookOpen },
  { to: "/merchant/expenses", key: "expenses", icon: TrendingUp },
];
