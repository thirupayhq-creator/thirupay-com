// ThiruPay's own internal team (Admin Panel side) — separate from a merchant's
// own shop staff. These roles decide who on Sir's team can see/do what
// inside the Admin console.
//
// Three tiers:
//   Super Admin — full platform control. Everything, including Staff Management
//                 (deciding who else gets admin access) and platform-level pages
//                 like the Commission Dashboard. This is a fixed, built-in account
//                 (see FIXED_ADMIN_ROLES in mockData.js) — not something Staff
//                 Management can create.
//   Admin        — operations control. Runs day-to-day platform operations (merchants,
//                  KYC, transactions, settlements, requests, tickets, banners) and can
//                  view the Commission Dashboard, but can NOT open Staff Management —
//                  granting admin access to people is a platform-level decision, not
//                  an operations one. Also a fixed, built-in account, not assignable
//                  via Staff Management.
//   Manager / Support Executive / Sales Executive / Verification Officer —
//                  narrower operational slices of the Admin tier, unchanged.
//
// (Merchant accounts are a separate tier entirely — see AuthContext/session.role.
// A merchant only ever sees their own business: every merchant data query is scoped
// to session.merchantId, so this file has nothing to do with that isolation.)

export const ADMIN_ROLES = ["Super Admin", "Admin", "Manager", "Support Executive", "Sales Executive", "Verification Officer"];

// Roles Staff Management is actually allowed to hand out. "Super Admin" and
// "Admin" are fixed, platform-level identities (see FIXED_ADMIN_ROLES in
// mockData.js) — granting either is not a form field, so they're deliberately
// excluded here even though ADMIN_ROLE_ACCESS below still needs to know their
// permissions.
export const STAFF_ASSIGNABLE_ROLES = ["Manager", "Support Executive", "Sales Executive", "Verification Officer"];

// Which admin nav sections each internal role can access, by default.
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

// Super Admin edits this from Roles & Permissions (module-level only — not
// action-level yet). Every role except Super Admin is editable — including
// Admin: Admin is still a fixed, built-in account (not assignable via Staff
// Management), but Super Admin can restrict/expand exactly what it can see.
const ACCESS_OVERRIDE_KEY = "tp_admin_role_access_overrides";
export const EDITABLE_PERMISSION_ROLES = ["Admin", "Manager", "Support Executive", "Sales Executive", "Verification Officer"];

function readAccessOverrides() {
  try {
    return JSON.parse(localStorage.getItem(ACCESS_OVERRIDE_KEY)) || {};
  } catch {
    return {};
  }
}

// The access list actually in effect for a role right now — an override if
// Super Admin has saved one from Roles & Permissions, else the default above.
export function getEffectiveAccess(role) {
  const overrides = readAccessOverrides();
  return overrides[role] || ADMIN_ROLE_ACCESS[role] || [];
}

export function setEffectiveAccess(role, navKeys) {
  if (!EDITABLE_PERMISSION_ROLES.includes(role)) return; // Super Admin is not editable here
  const overrides = readAccessOverrides();
  overrides[role] = navKeys.filter((k) => k !== "staff"); // "staff" is Super Admin-only, always
  localStorage.setItem(ACCESS_OVERRIDE_KEY, JSON.stringify(overrides));
}

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

// `adminRole` is always an explicit string now — "Super Admin" for Sir's fixed
// account, "Admin" for the second fixed account, or one of the
// STAFF_ASSIGNABLE_ROLES for a Staff Management record. No more implicit
// `null` = Super Admin sentinel.
export function canAccessAdmin(adminRole, navKey) {
  if (adminRole === "Super Admin") return true;
  return getEffectiveAccess(adminRole).includes(navKey);
}
