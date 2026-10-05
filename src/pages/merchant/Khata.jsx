import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { BookOpen, Users, IndianRupee, UserPlus, Search, ArrowLeft, Plus, HandCoins, MessageCircle, Trash2, ChevronRight } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useLanguage } from "../../context/LanguageContext";
import { useToast } from "../../context/ToastContext";
import { db } from "../../data/mockData";
import { addCustomer, addEntry, deleteCustomer, getCustomersWithBalance, getLedger, khataTotals, reminderLink } from "../../data/khataData";
import StatCard from "../../components/StatCard";
import Modal from "../../components/Modal";

const inr = (n) => `₹${Number(n).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
const fmtDate = (iso) => new Date(iso).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
const inputCls = "w-full px-4 py-2.5 rounded-lg border border-green-100 focus:border-green-500 focus:ring-2 focus:ring-green-100 outline-none text-sm";

function BalanceText({ balance }) {
  if (balance > 0) return <span className="font-semibold text-rose-600">{inr(balance)} due</span>;
  return <span className="font-semibold text-emerald-600">Settled</span>;
}

function TextField({ id, label, error, ...props }) {
  return (
    <div>
      <label htmlFor={id} className="block text-xs font-semibold text-green-500 mb-1.5">
        {label}
      </label>
      <input id={id} aria-invalid={!!error} aria-describedby={error ? `${id}-err` : undefined} className={`${inputCls} ${error ? "border-rose-300" : ""}`} {...props} />
      {error && (
        <p id={`${id}-err`} className="text-rose-600 text-xs font-medium mt-1.5">
          {error}
        </p>
      )}
    </div>
  );
}

function AddCustomerModal({ merchantId, onClose, onSaved }) {
  const [form, setForm] = useState({ name: "", phone: "" });
  const [errors, setErrors] = useState({});
  const submit = (e) => {
    e.preventDefault();
    const res = addCustomer(merchantId, form);
    if (!res.ok) return setErrors(res.errors);
    onSaved(res.customer);
  };
  return (
    <Modal title="Add customer" onClose={onClose}>
      <form onSubmit={submit} noValidate className="space-y-4">
        <TextField id="cust-name" label="Customer name *" value={form.name} maxLength={60} placeholder="e.g. Ramesh Kumar" error={errors.name} onChange={(e) => { setForm({ ...form, name: e.target.value }); setErrors({}); }} />
        <TextField id="cust-phone" label="Mobile number (optional)" value={form.phone} inputMode="numeric" maxLength={10} placeholder="98400xxxxx" error={errors.phone} onChange={(e) => { setForm({ ...form, phone: e.target.value.replace(/\D/g, "") }); setErrors({}); }} />
        <p className="text-[11px] text-green-300 -mt-2">With a mobile number you can send WhatsApp payment reminders.</p>
        {errors.form && <p className="text-rose-600 text-xs font-medium">{errors.form}</p>}
        <div className="flex gap-3 pt-2">
          <button type="button" onClick={onClose} className="px-5 py-2.5 rounded-lg border border-green-200 text-green-700 hover:bg-green-50 font-semibold text-sm transition-colors">
            Cancel
          </button>
          <button type="submit" className="flex-1 bg-green-500 hover:bg-green-600 text-white font-semibold py-2.5 rounded-lg transition-colors text-sm">
            Add customer
          </button>
        </div>
      </form>
    </Modal>
  );
}

// type: "credit" (customer takes on credit) | "payment" (customer pays back)
function EntryModal({ merchantId, customer, type, onClose, onSaved }) {
  const isPayment = type === "payment";
  const [form, setForm] = useState({ amount: "", note: "" });
  const [errors, setErrors] = useState({});
  const submit = (e) => {
    e.preventDefault();
    const res = addEntry(merchantId, { customer_id: customer.id, type, amount: form.amount, note: form.note });
    if (!res.ok) return setErrors(res.errors);
    onSaved(res.entry);
  };
  return (
    <Modal title={isPayment ? "Record payment received" : "Give credit"} onClose={onClose}>
      <p className="text-sm text-green-400 mb-4">
        {customer.name} · currently <BalanceText balance={customer.balance} />
      </p>
      <form onSubmit={submit} noValidate className="space-y-4">
        <TextField id="entry-amount" label="Amount (₹) *" value={form.amount} inputMode="decimal" placeholder="0.00" error={errors.amount} onChange={(e) => { setForm({ ...form, amount: e.target.value }); setErrors({}); }} />
        {isPayment && customer.balance > 0 && (
          <button type="button" onClick={() => setForm({ ...form, amount: String(customer.balance) })} className="text-xs font-semibold text-green-600 hover:underline -mt-2">
            Full balance ({inr(customer.balance)})
          </button>
        )}
        <TextField id="entry-note" label="Note (optional)" value={form.note} maxLength={80} placeholder={isPayment ? "e.g. Paid in cash" : "e.g. Groceries"} error={errors.note} onChange={(e) => { setForm({ ...form, note: e.target.value }); setErrors({}); }} />
        {errors.form && <p className="text-rose-600 text-xs font-medium">{errors.form}</p>}
        <div className="flex gap-3 pt-2">
          <button type="button" onClick={onClose} className="px-5 py-2.5 rounded-lg border border-green-200 text-green-700 hover:bg-green-50 font-semibold text-sm transition-colors">
            Cancel
          </button>
          <button type="submit" className="flex-1 bg-green-500 hover:bg-green-600 text-white font-semibold py-2.5 rounded-lg transition-colors text-sm">
            {isPayment ? "Save payment" : "Save credit"}
          </button>
        </div>
      </form>
    </Modal>
  );
}

export default function Khata() {
  const { session } = useAuth();
  const { t } = useLanguage();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const { customerId } = useParams();
  const merchantId = session.merchantId;
  const merchant = db.getMerchantById(merchantId);

  const [customers, setCustomers] = useState(() => getCustomersWithBalance(merchantId));
  const [query, setQuery] = useState("");
  const [modal, setModal] = useState(null); // "add" | "credit" | "payment" | "delete"
  const [deleteError, setDeleteError] = useState("");

  const refresh = () => setCustomers(getCustomersWithBalance(merchantId));
  const totals = khataTotals(customers);

  // ================= Customer ledger =================
  if (customerId) {
    const customer = customers.find((c) => c.id === customerId);
    if (!customer) {
      return (
        <div className="max-w-3xl">
          <Link to="/merchant/khata" className="inline-flex items-center gap-1.5 text-sm font-semibold text-green-600 hover:underline mb-4">
            <ArrowLeft size={15} /> All customers
          </Link>
          <div className="card text-center py-12 px-4">
            <p className="font-display font-semibold text-green-700">Customer not found</p>
            <p className="text-sm text-green-300 mt-1">They may have been deleted.</p>
          </div>
        </div>
      );
    }
    const ledger = getLedger(merchantId, customer.id);
    const wa = reminderLink(customer, customer.balance, merchant?.business_name);

    const handleDelete = () => {
      const res = deleteCustomer(merchantId, customer.id);
      if (!res.ok) return setDeleteError(res.error);
      showToast({ title: "Customer deleted", subtitle: customer.name, type: "success" });
      navigate("/merchant/khata", { replace: true });
    };

    return (
      <div className="max-w-3xl">
        <Link to="/merchant/khata" className="inline-flex items-center gap-1.5 text-sm font-semibold text-green-600 hover:underline mb-4">
          <ArrowLeft size={15} /> All customers
        </Link>

        <div className="card p-5 mb-5">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="font-display font-bold text-2xl text-green-700">{customer.name}</h1>
              <p className="text-sm text-green-300">{customer.phone ? `+91 ${customer.phone}` : "No mobile number"}</p>
            </div>
            <div className="text-right">
              <p className="text-xs font-semibold text-green-400 uppercase tracking-wide">{customer.balance > 0 ? "To collect" : "Balance"}</p>
              <p className={`font-display font-bold text-2xl ${customer.balance > 0 ? "text-rose-600" : "text-emerald-600"}`}>{customer.balance > 0 ? inr(customer.balance) : "Settled"}</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-3 mt-5">
            <button type="button" onClick={() => setModal("credit")} className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white font-semibold px-4 py-2.5 rounded-lg text-sm transition-colors">
              <Plus size={16} /> Give credit
            </button>
            <button type="button" onClick={() => setModal("payment")} disabled={customer.balance <= 0} className="flex items-center gap-2 border border-green-200 text-green-700 hover:bg-green-50 disabled:opacity-40 disabled:cursor-not-allowed font-semibold px-4 py-2.5 rounded-lg text-sm transition-colors">
              <HandCoins size={16} /> Record payment
            </button>
            {wa && (
              <a href={wa} target="_blank" rel="noreferrer" className="flex items-center gap-2 border border-emerald-200 text-emerald-700 hover:bg-emerald-50 font-semibold px-4 py-2.5 rounded-lg text-sm transition-colors">
                <MessageCircle size={16} /> WhatsApp reminder
              </a>
            )}
            <button type="button" onClick={() => { setDeleteError(""); setModal("delete"); }} className="ml-auto flex items-center gap-1.5 text-rose-500 hover:bg-rose-50 font-semibold px-3 py-2.5 rounded-lg text-xs transition-colors">
              <Trash2 size={14} /> Delete customer
            </button>
          </div>
          {!customer.phone && customer.balance > 0 && <p className="text-[11px] text-green-300 mt-3">Add a mobile number to this customer to send WhatsApp reminders.</p>}
        </div>

        <div className="card overflow-hidden">
          <h2 className="font-display font-semibold text-green-700 px-5 py-4 border-b border-green-50">Ledger</h2>
          {ledger.length === 0 ? (
            <p className="text-sm text-green-300 text-center py-10">No entries yet. Use "Give credit" when this customer takes goods on credit.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm min-w-[520px]">
                <thead className="bg-green-50 text-green-500 text-xs uppercase font-semibold">
                  <tr>
                    <th className="text-left px-5 py-3">Date</th>
                    <th className="text-left px-5 py-3">Details</th>
                    <th className="text-right px-5 py-3">Credit given</th>
                    <th className="text-right px-5 py-3">Payment received</th>
                    <th className="text-right px-5 py-3">Balance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-green-50">
                  {ledger.map((e) => (
                    <tr key={e.id}>
                      <td className="px-5 py-3 text-green-400 text-xs whitespace-nowrap">{fmtDate(e.created_at)}</td>
                      <td className="px-5 py-3 text-green-500">{e.note || (e.type === "credit" ? "Credit" : "Payment")}</td>
                      <td className="px-5 py-3 text-right font-semibold text-rose-600">{e.type === "credit" ? inr(e.amount) : ""}</td>
                      <td className="px-5 py-3 text-right font-semibold text-emerald-600">{e.type === "payment" ? inr(e.amount) : ""}</td>
                      <td className="px-5 py-3 text-right font-semibold text-green-700">{inr(e.balance_after)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {(modal === "credit" || modal === "payment") && (
          <EntryModal
            merchantId={merchantId}
            customer={customer}
            type={modal}
            onClose={() => setModal(null)}
            onSaved={(entry) => {
              refresh();
              setModal(null);
              showToast({ title: entry.type === "credit" ? "Credit added" : "Payment recorded", subtitle: `${inr(entry.amount)} · ${customer.name}`, type: "success" });
            }}
          />
        )}

        {modal === "delete" && (
          <Modal title="Delete customer?" onClose={() => setModal(null)}>
            <p className="text-sm text-green-500">
              <span className="font-semibold text-green-700">{customer.name}</span> and their whole ledger will be removed. This can't be undone.
            </p>
            {deleteError && (
              <p role="alert" className="text-rose-600 text-xs font-medium mt-3">
                {deleteError}
              </p>
            )}
            <div className="flex gap-3 pt-5">
              <button type="button" onClick={() => setModal(null)} className="px-5 py-2.5 rounded-lg border border-green-200 text-green-700 hover:bg-green-50 font-semibold text-sm transition-colors">
                Cancel
              </button>
              <button type="button" onClick={handleDelete} className="flex-1 bg-rose-600 hover:bg-rose-700 text-white font-semibold py-2.5 rounded-lg transition-colors text-sm">
                Delete customer
              </button>
            </div>
          </Modal>
        )}
      </div>
    );
  }

  // ================= Customer list =================
  const q = query.trim().toLowerCase();
  const visible = customers.filter((c) => !q || c.name.toLowerCase().includes(q) || c.phone.includes(q));

  return (
    <div className="max-w-5xl">
      <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
        <div>
          <h1 className="font-display font-bold text-2xl text-green-700">{t("khataTitle")}</h1>
          <p className="text-sm text-green-300">{t("khataSubtitle")}</p>
        </div>
        <button type="button" onClick={() => setModal("add")} className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white font-semibold px-5 py-2.5 rounded-lg transition-colors text-sm">
          <UserPlus size={16} /> Add Customer
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <StatCard icon={IndianRupee} label="Total to collect" value={inr(totals.totalToCollect)} sub="Across all customers" />
        <StatCard icon={BookOpen} label="Customers with dues" value={totals.customersWithDues} sub="Have something pending" />
        <StatCard icon={Users} label="Total customers" value={totals.totalCustomers} sub="In your Khata" />
      </div>

      {customers.length === 0 && (
        <div className="card text-center py-14 px-4">
          <div className="w-14 h-14 rounded-2xl bg-green-50 text-green-500 flex items-center justify-center mx-auto mb-4">
            <Users size={26} />
          </div>
          <p className="font-display font-semibold text-green-700">No customers yet</p>
          <p className="text-sm text-green-300 mt-1 mb-5">Add a customer to track credit and repayments.</p>
          <button type="button" onClick={() => setModal("add")} className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white font-semibold px-5 py-2.5 rounded-lg text-sm transition-colors">
            <UserPlus size={16} /> Add your first customer
          </button>
        </div>
      )}

      {customers.length > 0 && (
        <>
          <div className="relative mb-4 max-w-md">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-green-300" aria-hidden="true" />
            <input type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search by name or mobile" aria-label="Search customers" className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-green-100 bg-white focus:border-green-500 focus:ring-2 focus:ring-green-100 outline-none text-sm" />
          </div>

          {visible.length === 0 ? (
            <p className="card text-sm text-green-300 text-center py-8">No customers match your search.</p>
          ) : (
            <ul className="card divide-y divide-green-50 overflow-hidden">
              {visible.map((c) => (
                <li key={c.id}>
                  <Link to={`/merchant/khata/${c.id}`} className="flex items-center gap-4 px-5 py-4 hover:bg-green-50/50 transition-colors">
                    <span className="w-10 h-10 rounded-full bg-green-700 text-white flex items-center justify-center text-sm font-bold shrink-0" aria-hidden="true">
                      {c.name
                        .split(" ")
                        .map((w) => w[0])
                        .slice(0, 2)
                        .join("")
                        .toUpperCase()}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block font-semibold text-green-700 truncate">{c.name}</span>
                      <span className="block text-xs text-green-300">
                        {c.phone || "No mobile"} · last activity {fmtDate(c.last_activity)}
                      </span>
                    </span>
                    <span className="text-sm text-right shrink-0">
                      <BalanceText balance={c.balance} />
                    </span>
                    <ChevronRight size={16} className="text-green-300 shrink-0" aria-hidden="true" />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </>
      )}

      {modal === "add" && (
        <AddCustomerModal
          merchantId={merchantId}
          onClose={() => setModal(null)}
          onSaved={(c) => {
            refresh();
            setModal(null);
            showToast({ title: "Customer added", subtitle: c.name, type: "success" });
          }}
        />
      )}
    </div>
  );
}
