// ThiruPay's own internal team (Admin Panel side) — separate from a merchant's
// own shop staff. These roles decide who on Sir's team can see/do what
// inside the Admin console.
//
// Three tiers:
//   Super Admin — full platform control. Everything, including Staff Management
//                 (deciding who else gets admin access) and platform-level pages
//                 like the Commission Dashboard. Sir's own login (adminRole: null)
//                 has always worked this way; "Super Admin" is the same tier as an
//                 assignable role, for when Sir wants to give someone ELSE the same
//                 full access via Staff Management.
//   Admin        — operations control. Runs day-to-day platform operations (merchants,
//                  KYC, transactions, settlements, requests, tickets, banners) and can
//                  view the Commission Dashboard, but can NOT open Staff Management —
//                  granting admin access to people is a platform-level decision, not
//                  an operations one.
//   Manager / Support Executive / Sales Executive / Verification Officer —
//                  narrower operational slices of the Admin tier, unchanged.
//
// (Merchant accounts are a separate tier entirely — see AuthContext/session.role.
// A merchant only ever sees their own business: every merchant data query is scoped
// to session.merchantId, so this file has nothing to do with that isolation.)

export const ADMIN_ROLES = ["Super Admin", "Admin", "Manager", "Support Executive", "Sales Executive", "Verification Officer"];

// Which admin nav sections each internal role can access.
// Enforced in AdminLayout: nav items are filtered and direct-URL access is
// blocked for sections outside a staff member's role.
export const ADMIN_ROLE_ACCESS = {
  "Super Admin": ["dashboard", "merchants", "kyc", "transactions", "settlements", "commission", "service-requests", "support-tickets", "banners", "staff"],
  Admin: ["dashboard", "merchants", "kyc", "transactions", "settlements", "commission", "service-requests", "support-tickets", "banners"],
  Manager: ["dashboard", "merchants", "kyc", "transactions", "settlements", "service-requests", "support-tickets", "banners"],
  "Support Executive": ["dashboard", "merchants", "transactions", "support-tickets"],
  "Sales Executive": ["dashboard", "merchants", "service-requests"],
  "Verification Officer": ["dashboard", "merchants", "kyc"],
};

export const ADMIN_NAV_LABELS = {
  dashboard: "Dashboard",
  merchants: "Merchants",
  kyc: "KYC Verification",
  transactions: "Transactions",
  settlements: "Settlements",
  commission: "Commission Dashboard",
  "service-requests": "Service Requests",
  "support-tickets": "Support Tickets",
  staff: "Staff Management",
  banners: "Promo Banners",
};

// `adminRole` is null for Sir's own built-in Super Admin account — always full access.
// An assigned "Super Admin" staff role gets exactly the same access.
export function canAccessAdmin(adminRole, navKey) {
  if (!adminRole || adminRole === "Super Admin") return true;
  return (ADMIN_ROLE_ACCESS[adminRole] || []).includes(navKey);
}
