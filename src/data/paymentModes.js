// Payment modes a customer can use to pay a ThiruPay merchant.
// "payment_method" on a transaction is the collection channel (QR / Payment Link).
// "payment_mode" is how the customer actually paid within that channel.
//
// Which modes are enabled is platform-wide and editable from Super Admin's
// System Settings page. Disabling a mode there actually removes it from the
// customer-facing pay page and the QR/Payment Link badges — not decorative.

export const PAYMENT_MODES = [
  { key: "UPI", label: "UPI", color: "#0B2A4A" },
  { key: "Card", label: "Card", color: "#0B2A4A" },
  { key: "Net Banking", label: "Net Banking", color: "#7C3AED" },
  { key: "Wallet", label: "Wallet", color: "#0F766E" },
];

export const PAYMENT_MODE_COLORS = Object.fromEntries(PAYMENT_MODES.map((m) => [m.key, m.color]));

const ENABLED_KEY = "tp_payment_modes_enabled";

function readEnabledMap() {
  try {
    return JSON.parse(localStorage.getItem(ENABLED_KEY)) || {};
  } catch {
    return {};
  }
}

// Every mode is enabled by default unless explicitly turned off.
export function isPaymentModeEnabled(key) {
  const map = readEnabledMap();
  return map[key] !== false;
}

export function setPaymentModeEnabled(key, enabled) {
  const map = readEnabledMap();
  map[key] = enabled;
  localStorage.setItem(ENABLED_KEY, JSON.stringify(map));
}

// What the customer-facing pages (QR, Payment Links, /pay) should actually offer.
export function getEnabledPaymentModes() {
  return PAYMENT_MODES.filter((m) => isPaymentModeEnabled(m.key));
}
