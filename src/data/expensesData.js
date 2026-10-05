// Expenses & Profit (Business Tools).
//
// Profit is worked out on a cash basis for a calendar month:
//   Collections = money that actually came in
//                 · ThiruPay payments (QR / payment links / UPI bills)
//                 · cash sales from Billing
//                 · Khata repayments received
//   Net profit  = Collections − Expenses
// Credit sales put on Khata are NOT collections until the customer pays them back.

import { db } from "./mockData";
import { getBills } from "./billingData";
import { getKhata, round2, MAX_AMOUNT } from "./khataData";

const STORAGE_KEY = "tp_expenses";
export const EXPENSE_CATEGORIES = ["Stock purchase", "Rent", "Salary", "Electricity", "Transport", "Marketing", "Repairs", "Other"];

const newId = () => `ex_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;

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

export const toDateKey = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
export const monthKeyOf = (d) => toDateKey(d).slice(0, 7);
export const monthLabel = (key) => new Date(Number(key.slice(0, 4)), Number(key.slice(5, 7)) - 1, 1).toLocaleDateString("en-IN", { month: "long", year: "numeric" });

export function shiftMonth(key, delta) {
  const d = new Date(Number(key.slice(0, 4)), Number(key.slice(5, 7)) - 1 + delta, 1);
  return monthKeyOf(d);
}

export function getExpenses(merchantId) {
  return (readAll()[merchantId] || []).slice().sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : b.created_at.localeCompare(a.created_at)));
}

export function validateExpense(input, today = new Date()) {
  const errors = {};
  const amountText = String(input.amount ?? "").trim();
  const amount = Number(amountText);
  if (!amountText || Number.isNaN(amount) || amount <= 0) errors.amount = "Enter an amount greater than ₹0.";
  else if (!/^\d+(\.\d{1,2})?$/.test(amountText)) errors.amount = "Amount can have at most 2 decimal places.";
  else if (amount > MAX_AMOUNT) errors.amount = "Amount is too large.";

  const category = (input.category || "").trim();
  if (!category) errors.category = "Choose a category.";
  else if (category.length > 30) errors.category = "Category must be 30 characters or fewer.";

  const date = (input.date || "").trim();
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || Number.isNaN(new Date(`${date}T00:00:00`).getTime())) errors.date = "Pick a valid date.";
  else if (date > toDateKey(today)) errors.date = "The date can't be in the future.";

  const note = (input.note || "").trim();
  if (note.length > 100) errors.note = "Note must be 100 characters or fewer.";

  return { errors, clean: { amount: round2(amount), category, date, note } };
}

// Adds (editingId = null) or updates an expense. Returns { ok, expense } or { ok:false, errors }.
export function saveExpense(merchantId, input, editingId = null) {
  const { errors, clean } = validateExpense(input);
  if (Object.keys(errors).length) return { ok: false, errors };
  const all = readAll();
  const list = all[merchantId] || [];
  let saved;
  let next;
  if (editingId) {
    next = list.map((e) => (e.id === editingId ? (saved = { ...e, ...clean, updated_at: new Date().toISOString() }) : e));
    if (!saved) return { ok: false, errors: { form: "Expense not found." } };
  } else {
    saved = { id: newId(), ...clean, created_at: new Date().toISOString() };
    next = [...list, saved];
  }
  all[merchantId] = next;
  if (!writeAll(all)) return { ok: false, errors: { form: "Could not save — browser storage is full or blocked." } };
  return { ok: true, expense: saved };
}

export function deleteExpense(merchantId, expenseId) {
  const all = readAll();
  all[merchantId] = (all[merchantId] || []).filter((e) => e.id !== expenseId);
  writeAll(all);
}

// Everything for one month ("YYYY-MM").
export function getMonthSummary(merchantId, monthKey) {
  const inMonth = (iso) => monthKeyOf(new Date(iso)) === monthKey;

  const thiruPay = round2(db.getTxnsByMerchant(merchantId).filter((t) => t.status === "success" && inMonth(t.created_at)).reduce((s, t) => s + t.amount, 0));
  const cashSales = round2(getBills(merchantId).filter((b) => b.payment_mode === "cash" && inMonth(b.created_at)).reduce((s, b) => s + b.total, 0));
  const khataRepayments = round2(getKhata(merchantId).entries.filter((e) => e.type === "payment" && inMonth(e.created_at)).reduce((s, e) => s + e.amount, 0));
  const collections = round2(thiruPay + cashSales + khataRepayments);

  const expenses = getExpenses(merchantId).filter((e) => e.date.slice(0, 7) === monthKey);
  const expenseTotal = round2(expenses.reduce((s, e) => s + e.amount, 0));

  const byCategory = Object.entries(
    expenses.reduce((acc, e) => {
      acc[e.category] = round2((acc[e.category] || 0) + e.amount);
      return acc;
    }, {})
  )
    .map(([category, amount]) => ({ category, amount }))
    .sort((a, b) => b.amount - a.amount);

  return { collections, breakdown: { thiruPay, cashSales, khataRepayments }, expenses, expenseTotal, byCategory, netProfit: round2(collections - expenseTotal) };
}
