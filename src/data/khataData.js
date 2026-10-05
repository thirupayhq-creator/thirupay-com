// Khata (customer credit ledger) — per-merchant customers and their credit/payment entries,
// kept in localStorage for this frontend demo.
//
//   credit  = customer took goods/services on credit ("udhaar") → balance goes UP
//   payment = customer paid some of it back                     → balance goes DOWN
//
// Billing calls addEntry(..., type: "credit") when a bill is put on Khata. When the real
// backend is ready, swap the bodies of these functions for API calls.

const STORAGE_KEY = "tp_khata";
export const MAX_AMOUNT = 9999999.99;

const newId = (p) => `${p}_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;
export const round2 = (n) => Math.round((Number(n) + Number.EPSILON) * 100) / 100;

function readAll() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
  } catch {
    return {};
  }
}

function writeAll(all) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
    return true;
  } catch {
    return false;
  }
}

export function getKhata(merchantId) {
  const k = readAll()[merchantId] || {};
  return { customers: k.customers || [], entries: k.entries || [] };
}

export function balanceOf(entries, customerId) {
  return round2(entries.filter((e) => e.customer_id === customerId).reduce((sum, e) => sum + (e.type === "credit" ? e.amount : -e.amount), 0));
}

// Customers with their balance + last activity. Biggest dues first, then A–Z.
export function getCustomersWithBalance(merchantId) {
  const { customers, entries } = getKhata(merchantId);
  return customers
    .map((c) => {
      const mine = entries.filter((e) => e.customer_id === c.id);
      const last = mine.reduce((max, e) => (e.created_at > max ? e.created_at : max), c.created_at);
      return { ...c, balance: balanceOf(entries, c.id), last_activity: last, entry_count: mine.length };
    })
    .sort((a, b) => b.balance - a.balance || a.name.localeCompare(b.name, "en", { sensitivity: "base" }));
}

export function khataTotals(customers) {
  const withDues = customers.filter((c) => c.balance > 0);
  return { totalToCollect: round2(withDues.reduce((s, c) => s + c.balance, 0)), customersWithDues: withDues.length, totalCustomers: customers.length };
}

// ---------- Customers ----------
export function validateCustomer(existing, input) {
  const errors = {};
  const name = (input.name || "").trim().replace(/\s+/g, " ");
  const phone = (input.phone || "").trim();
  if (name.length < 2) errors.name = "Enter the customer's name (at least 2 characters).";
  else if (name.length > 60) errors.name = "Name must be 60 characters or fewer.";
  else if (existing.some((c) => c.name.toLowerCase() === name.toLowerCase())) errors.name = "You already have a customer with this name. Add a place or surname to tell them apart.";
  if (phone && !/^[6-9]\d{9}$/.test(phone)) errors.phone = "Enter a valid 10-digit mobile number, or leave it empty.";
  else if (phone && existing.some((c) => c.phone === phone)) errors.phone = "Another customer already has this mobile number.";
  return { errors, clean: { name, phone } };
}

export function addCustomer(merchantId, input) {
  const all = readAll();
  const k = all[merchantId] || { customers: [], entries: [] };
  const { errors, clean } = validateCustomer(k.customers, input);
  if (Object.keys(errors).length) return { ok: false, errors };
  const customer = { id: newId("c"), ...clean, created_at: new Date().toISOString() };
  all[merchantId] = { ...k, customers: [...k.customers, customer] };
  if (!writeAll(all)) return { ok: false, errors: { form: "Could not save — browser storage is full or blocked." } };
  return { ok: true, customer };
}

// A customer can only be deleted once they owe nothing.
export function deleteCustomer(merchantId, customerId) {
  const all = readAll();
  const k = all[merchantId] || { customers: [], entries: [] };
  if (balanceOf(k.entries, customerId) > 0) return { ok: false, error: "This customer still owes money. Record their payment first, then delete." };
  all[merchantId] = { customers: k.customers.filter((c) => c.id !== customerId), entries: k.entries.filter((e) => e.customer_id !== customerId) };
  if (!writeAll(all)) return { ok: false, error: "Could not save — browser storage is full or blocked." };
  return { ok: true };
}

// ---------- Entries ----------
export function validateEntry(balance, input) {
  const errors = {};
  const amountText = String(input.amount ?? "").trim();
  const amount = Number(amountText);
  if (!amountText || Number.isNaN(amount) || amount <= 0) errors.amount = "Enter an amount greater than ₹0.";
  else if (!/^\d+(\.\d{1,2})?$/.test(amountText)) errors.amount = "Amount can have at most 2 decimal places.";
  else if (amount > MAX_AMOUNT) errors.amount = "Amount is too large.";
  else if (input.type === "payment" && round2(amount) > balance) errors.amount = `This customer owes only ₹${balance.toLocaleString("en-IN")}. Enter that amount or less.`;
  const note = (input.note || "").trim();
  if (note.length > 80) errors.note = "Note must be 80 characters or fewer.";
  return { errors, clean: { amount: round2(amount), note } };
}

// input: { customer_id, type: "credit" | "payment", amount, note?, bill_id? }
export function addEntry(merchantId, input) {
  const all = readAll();
  const k = all[merchantId] || { customers: [], entries: [] };
  if (!k.customers.some((c) => c.id === input.customer_id)) return { ok: false, errors: { form: "Customer not found." } };
  if (input.type !== "credit" && input.type !== "payment") return { ok: false, errors: { form: "Invalid entry type." } };

  const { errors, clean } = validateEntry(balanceOf(k.entries, input.customer_id), input);
  if (Object.keys(errors).length) return { ok: false, errors };

  const entry = {
    id: newId("ke"),
    customer_id: input.customer_id,
    type: input.type,
    amount: clean.amount,
    note: clean.note,
    ...(input.bill_id ? { bill_id: input.bill_id } : {}),
    created_at: new Date().toISOString(),
  };
  all[merchantId] = { ...k, entries: [...k.entries, entry] };
  if (!writeAll(all)) return { ok: false, errors: { form: "Could not save — browser storage is full or blocked." } };
  return { ok: true, entry };
}

// Ledger for one customer, newest first, each row carrying the running balance after it.
export function getLedger(merchantId, customerId) {
  const { entries } = getKhata(merchantId);
  let running = 0;
  const rows = entries
    .filter((e) => e.customer_id === customerId)
    .sort((a, b) => new Date(a.created_at) - new Date(b.created_at))
    .map((e) => {
      running = round2(running + (e.type === "credit" ? e.amount : -e.amount));
      return { ...e, balance_after: running };
    });
  return rows.reverse();
}

// WhatsApp reminder link (needs a phone number and something owed). India +91 assumed.
export function reminderLink(customer, balance, shopName) {
  if (!customer.phone || balance <= 0) return null;
  const amount = balance.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const text = `Hello ${customer.name}, this is a friendly reminder from ${shopName || "our shop"}. You have ₹${amount} pending on your account. Please pay when convenient. Thank you!`;
  return `https://wa.me/91${customer.phone}?text=${encodeURIComponent(text)}`;
}
