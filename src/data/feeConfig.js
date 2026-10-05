// Mock MDR (Merchant Discount Rate) config.
// Backend integrate aana odane, idha replace pannama real fee value transaction data-la
// direct-a varum (txn.fee). Athuvarai idhu than mock calculation.
//
// The rate is editable from Super Admin's System Settings page and persisted
// to localStorage, so changing it there actually changes every fee
// calculation across the app (Insights, Transactions, receipts, Commission
// Dashboard) — not just a display number.

const MDR_KEY = "tp_mdr_percent";
const DEFAULT_MDR_PERCENT = 2; // 2% flat, illustrative only

export function getMdrPercent() {
  const raw = localStorage.getItem(MDR_KEY);
  const parsed = raw !== null ? Number(raw) : NaN;
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : DEFAULT_MDR_PERCENT;
}

export function setMdrPercent(value) {
  const n = Number(value);
  if (!Number.isFinite(n) || n < 0) return;
  localStorage.setItem(MDR_KEY, String(n));
}

export function computeFee(amount) {
  const mdrPercent = getMdrPercent();
  const fee = Math.round(amount * (mdrPercent / 100) * 100) / 100;
  const net = Math.round((amount - fee) * 100) / 100;
  return { fee, net };
}
