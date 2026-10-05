import { useReducer, useState } from "react";
import { motion } from "framer-motion";
import { ArrowDownLeft, ArrowUpRight, TrendingUp, TrendingDown, Plus, ChevronLeft, ChevronRight, Pencil, Trash2, Wallet } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useLanguage } from "../../context/LanguageContext";
import { useToast } from "../../context/ToastContext";
import { EXPENSE_CATEGORIES, deleteExpense, getMonthSummary, monthKeyOf, monthLabel, saveExpense, shiftMonth, toDateKey } from "../../data/expensesData";
import Modal from "../../components/Modal";

const inr = (n) => `₹${Number(n).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
const fmtDate = (key) => new Date(`${key}T00:00:00`).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
const inputCls = "w-full px-4 py-2.5 rounded-lg border border-green-100 focus:border-green-500 focus:ring-2 focus:ring-green-100 outline-none text-sm";

function ExpenseModal({ merchantId, expense, defaultDate, onClose, onSaved }) {
  const editing = !!expense;
  const [form, setForm] = useState({
    amount: expense ? String(expense.amount) : "",
    category: expense?.category || EXPENSE_CATEGORIES[0],
    date: expense?.date || defaultDate,
    note: expense?.note || "",
  });
  const [errors, setErrors] = useState({});
  const set = (k, v) => {
    setForm((f) => ({ ...f, [k]: v }));
    setErrors((e) => ({ ...e, [k]: undefined }));
  };
  const submit = (e) => {
    e.preventDefault();
    const res = saveExpense(merchantId, form, expense?.id || null);
    if (!res.ok) return setErrors(res.errors);
    onSaved(res.expense, editing);
  };
  const err = (k) => errors[k] && <p id={`exp-${k}-err`} className="text-rose-600 text-xs font-medium mt-1.5">{errors[k]}</p>;
  const a11y = (k) => ({ "aria-invalid": !!errors[k], "aria-describedby": errors[k] ? `exp-${k}-err` : undefined });

  return (
    <Modal title={editing ? "Edit expense" : "Add expense"} onClose={onClose}>
      <form onSubmit={submit} noValidate className="space-y-4">
        <div>
          <label htmlFor="exp-amount" className="block text-xs font-semibold text-green-500 mb-1.5">Amount (₹) *</label>
          <input id="exp-amount" inputMode="decimal" placeholder="0.00" value={form.amount} onChange={(e) => set("amount", e.target.value)} className={`${inputCls} ${errors.amount ? "border-rose-300" : ""}`} {...a11y("amount")} />
          {err("amount")}
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="exp-category" className="block text-xs font-semibold text-green-500 mb-1.5">Category *</label>
            <select id="exp-category" value={form.category} onChange={(e) => set("category", e.target.value)} className={`${inputCls} bg-white`} {...a11y("category")}>
              {EXPENSE_CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            {err("category")}
          </div>
          <div>
            <label htmlFor="exp-date" className="block text-xs font-semibold text-green-500 mb-1.5">Date *</label>
            <input id="exp-date" type="date" max={toDateKey(new Date())} value={form.date} onChange={(e) => set("date", e.target.value)} className={`${inputCls} ${errors.date ? "border-rose-300" : ""}`} {...a11y("date")} />
            {err("date")}
          </div>
        </div>
        <div>
          <label htmlFor="exp-note" className="block text-xs font-semibold text-green-500 mb-1.5">Note (optional)</label>
          <input id="exp-note" maxLength={100} placeholder="e.g. Shop rent for September" value={form.note} onChange={(e) => set("note", e.target.value)} className={inputCls} {...a11y("note")} />
          {err("note")}
        </div>
        {errors.form && <p className="text-rose-600 text-xs font-medium">{errors.form}</p>}
        <div className="flex gap-3 pt-2">
          <button type="button" onClick={onClose} className="px-5 py-2.5 rounded-lg border border-green-200 text-green-700 hover:bg-green-50 font-semibold text-sm transition-colors">Cancel</button>
          <button type="submit" className="flex-1 bg-green-500 hover:bg-green-600 text-white font-semibold py-2.5 rounded-lg transition-colors text-sm">{editing ? "Save changes" : "Add expense"}</button>
        </div>
      </form>
    </Modal>
  );
}

export default function Expenses() {
  const { session } = useAuth();
  const { t } = useLanguage();
  const { showToast } = useToast();
  const merchantId = session.merchantId;

  const thisMonth = monthKeyOf(new Date());
  const [month, setMonth] = useState(thisMonth);
  const [, refresh] = useReducer((n) => n + 1, 0); // re-render after a change so the summary is re-read from storage
  const [modal, setModal] = useState(null); // { type: "form", expense? } | { type: "delete", expense }

  const s = getMonthSummary(merchantId, month);
  const isCurrent = month === thisMonth;
  const loss = s.netProfit < 0;
  const maxCat = s.byCategory[0]?.amount || 1;
  const defaultDate = isCurrent ? toDateKey(new Date()) : `${month}-01`;

  return (
    <div className="max-w-5xl">
      <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
        <div>
          <h1 className="font-display font-bold text-2xl text-green-700">{t("expensesTitle")}</h1>
          <p className="text-sm text-green-300">{t("expensesSubtitle")}</p>
        </div>
        <button type="button" onClick={() => setModal({ type: "form" })} className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white font-semibold px-5 py-2.5 rounded-lg transition-colors text-sm">
          <Plus size={16} /> Add Expense
        </button>
      </div>

      <div className="flex items-center gap-2 mb-4">
        <button type="button" onClick={() => setMonth(shiftMonth(month, -1))} aria-label="Previous month" className="w-9 h-9 rounded-lg border border-green-100 bg-white text-green-500 hover:bg-green-50 flex items-center justify-center">
          <ChevronLeft size={16} />
        </button>
        <h2 className="font-display font-semibold text-green-700 min-w-[9rem] text-center" aria-live="polite">{isCurrent ? "This month" : monthLabel(month)}</h2>
        <button type="button" onClick={() => setMonth(shiftMonth(month, 1))} disabled={isCurrent} aria-label="Next month" className="w-9 h-9 rounded-lg border border-green-100 bg-white text-green-500 hover:bg-green-50 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center">
          <ChevronRight size={16} />
        </button>
        {isCurrent && <span className="text-xs text-green-300">{monthLabel(month)}</span>}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-3">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="card p-5">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3"><ArrowDownLeft size={20} /></div>
          <p className="font-display font-bold text-2xl text-green-700">{inr(s.collections)}</p>
          <p className="text-xs font-semibold text-green-400 uppercase tracking-wide mt-1">Collections</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="card p-5">
          <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center mb-3"><ArrowUpRight size={20} /></div>
          <p className="font-display font-bold text-2xl text-green-700">{inr(s.expenseTotal)}</p>
          <p className="text-xs font-semibold text-green-400 uppercase tracking-wide mt-1">Expenses</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="card p-5 bg-green-700 text-white">
          <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center mb-3">{loss ? <TrendingDown size={20} /> : <TrendingUp size={20} />}</div>
          <p className="font-display font-bold text-2xl">{loss ? `-${inr(Math.abs(s.netProfit))}` : inr(s.netProfit)}</p>
          <p className="text-xs font-semibold text-green-100 uppercase tracking-wide mt-1">{loss ? "Net loss" : "Net profit"}</p>
        </motion.div>
      </div>
      <p className="text-xs text-green-300 mb-6">
        Collections = ThiruPay payments {inr(s.breakdown.thiruPay)} + cash sales {inr(s.breakdown.cashSales)} + Khata repayments {inr(s.breakdown.khataRepayments)}. Credit sales on Khata count only once the customer pays.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 items-start">
        <div className="lg:col-span-2">
          <h2 className="font-display font-semibold text-green-700 mb-3">All expenses</h2>
          {s.expenses.length === 0 ? (
            <div className="card text-center py-12 px-4">
              <div className="w-14 h-14 rounded-2xl bg-green-50 text-green-500 flex items-center justify-center mx-auto mb-4"><Wallet size={26} /></div>
              <p className="font-display font-semibold text-green-700">No expenses {isCurrent ? "yet" : "this month"}</p>
              <p className="text-sm text-green-300 mt-1 mb-5">Log your spending to see your monthly profit.</p>
              <button type="button" onClick={() => setModal({ type: "form" })} className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white font-semibold px-5 py-2.5 rounded-lg text-sm transition-colors">
                <Plus size={16} /> Add expense
              </button>
            </div>
          ) : (
            <div className="card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm min-w-[520px]">
                  <thead className="bg-green-50 text-green-500 text-xs uppercase font-semibold">
                    <tr>
                      <th className="text-left px-5 py-3">Date</th>
                      <th className="text-left px-5 py-3">Category</th>
                      <th className="text-left px-5 py-3">Note</th>
                      <th className="text-right px-5 py-3">Amount</th>
                      <th className="px-5 py-3"><span className="sr-only">Actions</span></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-green-50">
                    {s.expenses.map((e) => (
                      <tr key={e.id} className="hover:bg-green-50/50">
                        <td className="px-5 py-3 text-green-400 text-xs whitespace-nowrap">{fmtDate(e.date)}</td>
                        <td className="px-5 py-3"><span className="inline-block text-xs font-semibold px-2.5 py-1 rounded-full bg-green-50 text-green-600 whitespace-nowrap">{e.category}</span></td>
                        <td className="px-5 py-3 text-green-400 text-xs">{e.note || "—"}</td>
                        <td className="px-5 py-3 text-right font-semibold text-rose-600 whitespace-nowrap">{inr(e.amount)}</td>
                        <td className="px-5 py-3 text-right whitespace-nowrap">
                          <button type="button" onClick={() => setModal({ type: "form", expense: e })} aria-label={`Edit expense ${e.category} ${inr(e.amount)}`} title="Edit" className="w-8 h-8 rounded-lg text-green-500 hover:bg-green-50 inline-flex items-center justify-center"><Pencil size={15} /></button>
                          <button type="button" onClick={() => setModal({ type: "delete", expense: e })} aria-label={`Delete expense ${e.category} ${inr(e.amount)}`} title="Delete" className="w-8 h-8 rounded-lg text-rose-500 hover:bg-rose-50 inline-flex items-center justify-center"><Trash2 size={15} /></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        <div className="card p-5">
          <h2 className="font-display font-semibold text-green-700 mb-4">By category</h2>
          {s.byCategory.length === 0 ? (
            <p className="text-sm text-green-300">Nothing spent yet.</p>
          ) : (
            <ul className="space-y-3.5">
              {s.byCategory.map((c) => (
                <li key={c.category}>
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="font-semibold text-green-600">{c.category}</span>
                    <span className="text-green-500">{inr(c.amount)}</span>
                  </div>
                  <div className="h-2 rounded-full bg-green-50 overflow-hidden" role="presentation">
                    <div className="h-full rounded-full bg-green-500" style={{ width: `${Math.max(4, Math.round((c.amount / maxCat) * 100))}%` }} />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {modal?.type === "form" && (
        <ExpenseModal
          merchantId={merchantId}
          expense={modal.expense}
          defaultDate={defaultDate}
          onClose={() => setModal(null)}
          onSaved={(saved, editing) => {
            // Jump to the month the expense belongs to so it's visible straight away.
            setMonth(saved.date.slice(0, 7));
            refresh();
            setModal(null);
            showToast({ title: editing ? "Expense updated" : "Expense added", subtitle: `${saved.category} · ${inr(saved.amount)}`, type: "success" });
          }}
        />
      )}

      {modal?.type === "delete" && (
        <Modal title="Delete expense?" onClose={() => setModal(null)}>
          <p className="text-sm text-green-500">
            <span className="font-semibold text-green-700">{modal.expense.category}</span> · {inr(modal.expense.amount)} on {fmtDate(modal.expense.date)} will be removed and your profit will be recalculated.
          </p>
          <div className="flex gap-3 pt-5">
            <button type="button" onClick={() => setModal(null)} className="px-5 py-2.5 rounded-lg border border-green-200 text-green-700 hover:bg-green-50 font-semibold text-sm transition-colors">Cancel</button>
            <button
              type="button"
              onClick={() => {
                deleteExpense(merchantId, modal.expense.id);
                refresh();
                setModal(null);
                showToast({ title: "Expense deleted", type: "success" });
              }}
              className="flex-1 bg-rose-600 hover:bg-rose-700 text-white font-semibold py-2.5 rounded-lg transition-colors text-sm"
            >
              Delete expense
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}
