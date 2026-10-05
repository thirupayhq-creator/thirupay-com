// Billing (Business Tools) — shop-counter bills. Reads the Products list, and on checkout:
//   1. reduces stock,
//   2. saves the bill,
//   3. cash  → nothing else,
//      upi   → records a ThiruPay transaction + pending settlement (like a /pay payment),
//      khata → adds a credit entry to the customer's Khata.
// If any step fails, everything is restored so stock/khata never end up half-updated.

import { db, genId } from "./mockData";
import { getProducts, adjustStock } from "./productsData";
import { addEntry, getKhata, round2 } from "./khataData";

const STORAGE_KEY = "tp_bills";
export const PAYMENT_MODES = [
  { key: "cash", label: "Cash" },
  { key: "upi", label: "UPI" },
  { key: "khata", label: "Khata (credit)" },
];

// Every localStorage key a checkout can touch — snapshotted so a failure can be undone.
const TOUCHED_KEYS = ["tp_products", "tp_bills", "tp_khata", "tp_transactions", "tp_settlements"];

function readAll() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
  } catch {
    return {};
  }
}

export function getBills(merchantId) {
  return (readAll()[merchantId] || []).slice().sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
}

function nextBillNo(list) {
  const max = list.reduce((m, b) => Math.max(m, parseInt(String(b.bill_no).replace(/\D/g, ""), 10) || 0), 0);
  return `B-${String(max + 1).padStart(4, "0")}`;
}

export function billTotals(bills, now = new Date()) {
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const today = bills.filter((b) => new Date(b.created_at).getTime() >= startOfDay);
  return { todayCount: today.length, todayTotal: round2(today.reduce((s, b) => s + b.total, 0)) };
}

// The customer's payment made on the /pay page for a Billing checkout carries the checkout's
// payment_ref. Returns that successful transaction (or null if it hasn't happened yet).
export function findPaymentByRef(merchantId, ref) {
  if (!ref) return null;
  return db.getTxnsByMerchant(merchantId).find((t) => t.payment_ref === ref && t.status === "success") || null;
}

// input: { lines: [{ product_id, qty }], payment_mode, customer_id?, cash_received?, payment_txn_id? }
//   payment_txn_id (UPI only): the customer already paid on the /pay page → link that transaction
//   to the bill instead of creating a new one.
// Returns { ok: true, bill } or { ok: false, error }.
export function createBill(merchantId, input) {
  const products = getProducts(merchantId);
  const lines = (input.lines || []).filter((l) => l.qty > 0);
  if (lines.length === 0) return { ok: false, error: "Add at least one item to the bill." };

  const items = [];
  for (const l of lines) {
    const p = products.find((x) => x.id === l.product_id);
    if (!p) return { ok: false, error: "One of the items is no longer in your product list. Refresh and try again." };
    if (!Number.isInteger(l.qty) || l.qty < 1) return { ok: false, error: `Invalid quantity for ${p.name}.` };
    if (l.qty > p.stock) return { ok: false, error: p.stock === 0 ? `${p.name} is out of stock.` : `Only ${p.stock} of ${p.name} left in stock.` };
    items.push({ product_id: p.id, name: p.name, price: p.price, qty: l.qty, line_total: round2(p.price * l.qty) });
  }
  const total = round2(items.reduce((s, i) => s + i.line_total, 0));

  const mode = input.payment_mode;
  if (!PAYMENT_MODES.some((m) => m.key === mode)) return { ok: false, error: "Choose how the customer is paying." };

  let customer = null;
  if (mode === "khata") {
    customer = getKhata(merchantId).customers.find((c) => c.id === input.customer_id);
    if (!customer) return { ok: false, error: "Choose the customer whose Khata this bill goes to." };
  }

  let cashReceived = null;
  if (mode === "cash" && String(input.cash_received ?? "").trim() !== "") {
    cashReceived = Number(input.cash_received);
    if (Number.isNaN(cashReceived) || cashReceived < total) return { ok: false, error: "Cash received is less than the bill total." };
  }

  let paidTxn = null;
  if (mode === "upi" && input.payment_txn_id) {
    paidTxn = db.getTxnsByMerchant(merchantId).find((t) => t.transaction_id === input.payment_txn_id && t.status === "success");
    if (!paidTxn) return { ok: false, error: "We couldn't find that payment. Use \"Mark as received manually\" if the customer paid another way." };
    if (round2(paidTxn.amount) !== total) return { ok: false, error: `The customer paid ₹${paidTxn.amount.toLocaleString("en-IN")} but the bill is ₹${total.toLocaleString("en-IN")}. Check the payment in Transactions.` };
    const alreadyUsed = Object.values(readAll()).some((list) => list.some((b) => b.txn_id === paidTxn.transaction_id));
    if (alreadyUsed) return { ok: false, error: "That payment is already linked to another bill." };
  }

  const snapshot = TOUCHED_KEYS.map((k) => [k, localStorage.getItem(k)]);
  const undo = () => snapshot.forEach(([k, v]) => (v === null ? localStorage.removeItem(k) : localStorage.setItem(k, v)));

  try {
    const all = readAll();
    const existing = all[merchantId] || [];
    const bill = {
      id: genId("bill"),
      bill_no: nextBillNo(existing),
      created_at: new Date().toISOString(),
      items,
      item_count: items.reduce((s, i) => s + i.qty, 0),
      total,
      payment_mode: mode,
      ...(customer ? { customer_id: customer.id, customer_name: customer.name } : {}),
      ...(cashReceived != null ? { cash_received: round2(cashReceived), change: round2(cashReceived - total) } : {}),
    };

    items.forEach((i) => adjustStock(merchantId, i.product_id, -i.qty));

    if (mode === "khata") {
      const res = addEntry(merchantId, { customer_id: customer.id, type: "credit", amount: total, note: `Bill ${bill.bill_no}`, bill_id: bill.id });
      if (!res.ok) throw new Error("khata");
    }

    if (mode === "upi" && paidTxn) {
      bill.txn_id = paidTxn.transaction_id; // paid on the /pay page — transaction + settlement already exist
    } else if (mode === "upi") {
      const txn = { transaction_id: genId("txn"), merchant_id: merchantId, amount: total, payment_method: "QR", payment_mode: "UPI", status: "success", created_at: bill.created_at, source: "billing", bill_no: bill.bill_no };
      db.addTxn(txn);
      db.addSettlement({ settlement_id: genId("st"), merchant_id: merchantId, amount: total, settlement_date: new Date(Date.now() + 86400000).toISOString(), status: "pending" });
      bill.txn_id = txn.transaction_id;
    }

    all[merchantId] = [...existing, bill];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
    return { ok: true, bill };
  } catch {
    undo();
    return { ok: false, error: "Could not save the bill — browser storage may be full. Nothing was changed, please try again." };
  }
}
