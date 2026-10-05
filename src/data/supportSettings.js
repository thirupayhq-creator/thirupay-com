// Merchant-facing support contact details. Editable from Super Admin's System
// Settings page; read by the merchant Help & Support page (Help.jsx) so a
// change there actually changes what merchants see — not decorative.

const KEY = "tp_support_contact";

const DEFAULTS = {
  helpline: "1800-266-4787",
  email: "merchants@thirupay.in",
  hours: "24×7, every day",
};

export function getSupportContact() {
  try {
    const stored = JSON.parse(localStorage.getItem(KEY));
    return { ...DEFAULTS, ...stored };
  } catch {
    return { ...DEFAULTS };
  }
}

export function setSupportContact(contact) {
  localStorage.setItem(KEY, JSON.stringify(contact));
}
