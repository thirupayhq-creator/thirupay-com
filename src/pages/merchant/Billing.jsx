import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { QRCodeCanvas } from "qrcode.react";
import { Plus, Minus, Search, ReceiptText, Download, CheckCircle2, Banknote, QrCode, BookOpen, Package, UserPlus, X, ShoppingBag, Loader2, ExternalLink } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useLanguage } from "../../context/LanguageContext";
import { useToast } from "../../context/ToastContext";
import { db, genId } from "../../data/mockData";
import { getProducts, stockStatus } from "../../data/productsData";
import { addCustomer, getCustomersWithBalance, round2 } from "../../data/khataData";
import { PAYMENT_MODES, billTotals, createBill, findPaymentByRef, getBills } from "../../data/billingData";
import { downloadBillPDF } from "../../utils/billPdf";
import Modal from "../../components/Modal";

const inr = (n) => `₹${Number(n).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
const fmtDateTime = (iso) => new Date(iso).toLocaleString("en-IN", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
const inputCls = "w-full px-4 py-2.5 rounded-lg border border-green-100 focus:border-green-500 focus:ring-2 focus:ring-green-100 outline-none text-sm";

const MODE_STYLE = {
  cash: "bg-emerald-50 text-emerald-700 border-emerald-200",
  upi: "bg-sky-50 text-sky-700 border-sky-200",
  khata: "bg-amber-50 text-amber-700 border-amber-200",
};
const MODE_LABEL = { cash: "Cash", upi: "UPI", khata: "Khata" };
const MODE_ICON = { cash: Banknote, upi: QrCode, khata: BookOpen };

function ModeBadge({ mode }) {
  return <span className={`inline-block text-xs font-semibold px-2.5 py-1 rounded-full border ${MODE_STYLE[mode]}`}>{MODE_LABEL[mode]}</span>;
}

function Qty({ product, qty, onChange }) {
  const out = product.stock <= 0;
  return (
    <div className="inline-flex items-center gap-2 shrink-0">
      <button
        type="button"
        onClick={() => onChange(product, qty - 1)}
        disabled={qty <= 0}
        aria-label={`Remove one ${product.name}`}
        className="w-9 h-9 rounded-full border border-green-100 text-green-500 hover:bg-green-50 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center"
      >
        <Minus size={16} />
      </button>
      <span className="w-7 text-center font-bold text-green-700" aria-label={`${qty} in bill`}>
        {qty}
      </span>
      <button
        type="button"
        onClick={() => onChange(product, qty + 1)}
        disabled={out || qty >= product.stock}
        aria-label={`Add one ${product.name}`}
        className="w-9 h-9 rounded-full bg-green-500 text-white hover:bg-green-600 disabled:bg-green-100 disabled:text-green-300 disabled:cursor-not-allowed flex items-center justify-center"
      >
        <Plus size={16} />
      </button>
    </div>
  );
}

// Checkout dialog: choose how the customer pays, confirm, then show the finished bill.
function CheckoutModal({ merchantId, merchant, lines, total, onClose, onDone }) {
  const { showToast } = useToast();
  const [mode, setMode] = useState("cash");
  const [cashReceived, setCashReceived] = useState("");
  const [customers, setCustomers] = useState(() => getCustomersWithBalance(merchantId));
  const [customerId, setCustomerId] = useState("");
  const [newCust, setNewCust] = useState(null); // { name, phone, errors }
  const [error, setError] = useState("");
  const [bill, setBill] = useState(null);

  // One reference per checkout. It rides in the QR/link, the /pay page stores it on the transaction,
  // and this dialog uses it to spot the customer's payment and finish the bill by itself.
  const [payRef] = useState(() => genId("pr"));
  const payUrl = `${window.location.origin}/pay?merchant=${merchantId}&amount=${total.toFixed(2)}&ref=${payRef}`;
  const change = cashReceived !== "" && Number(cashReceived) >= total ? round2(Number(cashReceived) - total) : null;
  const selected = customers.find((c) => c.id === customerId);

  const saveNewCustomer = () => {
    const res = addCustomer(merchantId, newCust);
    if (!res.ok) {
      setNewCust((n) => ({ ...n, errors: res.errors }));
      return;
    }
    setCustomers(getCustomersWithBalance(merchantId));
    setCustomerId(res.customer.id);
    setNewCust(null);
  };

  const finish = (res) => {
    if (!res.ok) {
      setError(res.error);
      return false;
    }
    setBill(res.bill);
    showToast({ title: `Bill ${res.bill.bill_no} saved`, subtitle: `${inr(res.bill.total)} · ${MODE_LABEL[res.bill.payment_mode]}`, type: "success" });
    return true;
  };

  const confirm = () => {
    setError("");
    finish(
      createBill(merchantId, {
        lines: lines.map((l) => ({ product_id: l.product.id, qty: l.qty })),
        payment_mode: mode,
        customer_id: customerId,
        cash_received: cashReceived,
      })
    );
  };

  // UPI: wait for the customer's payment on the /pay page (same browser → "storage" event,
  // plus a 1s check as a fallback), then finish the bill with that payment.
  useEffect(() => {
    if (mode !== "upi" || bill) return undefined;
    let settled = false;
    const check = () => {
      if (settled) return;
      const txn = findPaymentByRef(merchantId, payRef);
      if (!txn) return;
      settled = true; // act once — a mismatch shouldn't retry (and re-toast) every second
      finish(
        createBill(merchantId, {
          lines: lines.map((l) => ({ product_id: l.product.id, qty: l.qty })),
          payment_mode: "upi",
          payment_txn_id: txn.transaction_id,
        })
      );
    };
    const timer = setInterval(check, 1000);
    window.addEventListener("storage", check);
    return () => {
      clearInterval(timer);
      window.removeEventListener("storage", check);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, bill, merchantId, payRef]);

  // ----- Finished -----
  if (bill) {
    return (
      <Modal title="Bill created" onClose={() => onDone(bill)}>
        <div className="text-center">
          <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-3">
            <CheckCircle2 size={28} />
          </div>
          <p className="font-display font-bold text-2xl text-green-700">{inr(bill.total)}</p>
          <p className="text-sm text-green-400 mt-1">
            Bill {bill.bill_no} · {MODE_LABEL[bill.payment_mode]}
            {bill.customer_name ? ` · ${bill.customer_name}` : ""}
          </p>
          {bill.change > 0 && <p className="text-sm font-semibold text-green-600 mt-2">Return change: {inr(bill.change)}</p>}
          {bill.payment_mode === "khata" && <p className="text-xs text-green-300 mt-2">Added to {bill.customer_name}'s Khata. Stock has been updated.</p>}
        </div>
        <div className="flex gap-3 pt-6">
          <button type="button" onClick={() => downloadBillPDF(bill, merchant)} className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg border border-green-200 text-green-700 hover:bg-green-50 font-semibold text-sm transition-colors">
            <Download size={16} /> PDF bill
          </button>
          <button type="button" onClick={() => onDone(bill)} className="flex-1 bg-green-500 hover:bg-green-600 text-white font-semibold py-2.5 rounded-lg transition-colors text-sm">
            New bill
          </button>
        </div>
      </Modal>
    );
  }

  const confirmLabel = mode === "cash" ? "Confirm cash payment" : mode === "upi" ? "Mark as received manually" : "Add to Khata";

  return (
    <Modal title="Checkout" onClose={onClose}>
      <div className="flex items-center justify-between rounded-xl bg-green-50 px-4 py-3 mb-4">
        <span className="text-sm text-green-500">
          {lines.reduce((s, l) => s + l.qty, 0)} items
        </span>
        <span className="font-display font-bold text-xl text-green-700">{inr(total)}</span>
      </div>

      <fieldset>
        <legend className="text-xs font-semibold text-green-500 mb-2">How is the customer paying?</legend>
        <div className="grid grid-cols-3 gap-2">
          {PAYMENT_MODES.map((m) => {
            const Icon = MODE_ICON[m.key];
            return (
              <label
                key={m.key}
                className={`cursor-pointer rounded-xl border px-2 py-3 text-center text-xs font-semibold transition-colors ${
                  mode === m.key ? "border-green-500 bg-green-50 text-green-700" : "border-green-100 text-green-400 hover:bg-green-50/60"
                }`}
              >
                <input type="radio" name="pay-mode" value={m.key} checked={mode === m.key} onChange={() => { setMode(m.key); setError(""); }} className="sr-only" />
                <Icon size={18} className="mx-auto mb-1" />
                {m.label}
              </label>
            );
          })}
        </div>
      </fieldset>

      <div className="mt-4">
        {mode === "cash" && (
          <div>
            <label htmlFor="cash-received" className="block text-xs font-semibold text-green-500 mb-1.5">
              Cash received (optional)
            </label>
            <input id="cash-received" inputMode="decimal" placeholder={String(total)} value={cashReceived} onChange={(e) => setCashReceived(e.target.value)} className={inputCls} />
            {change != null && <p className="text-xs font-semibold text-green-600 mt-1.5">Change to return: {inr(change)}</p>}
          </div>
        )}

        {mode === "upi" && (
          <div className="text-center">
            {/* Scanning this QR — or clicking it — opens the payment page with the bill amount filled in. */}
            <a
              href={payUrl}
              target="_blank"
              rel="noreferrer"
              title="Open the payment page"
              aria-label={`Open the payment page for ${inr(total)}`}
              className="inline-block p-3 rounded-xl border border-green-100 bg-white hover:border-green-500 hover:shadow-md transition"
            >
              <QRCodeCanvas value={payUrl} size={160} fgColor="#0B2A4A" level="M" />
            </a>
            <p className="text-xs text-green-400 mt-2">
              Customer scans this QR to pay <span className="font-semibold text-green-700">{inr(total)}</span>. You can also click the QR to open the same payment page.
            </p>
            <a href={payUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-xs font-semibold text-green-600 hover:underline mt-2">
              <ExternalLink size={13} /> Open payment page
            </a>
            <p role="status" className="flex items-center justify-center gap-2 text-xs font-semibold text-green-500 mt-3">
              <Loader2 size={14} className="animate-spin" aria-hidden="true" /> Waiting for the customer's payment… the bill completes automatically.
            </p>
          </div>
        )}

        {mode === "khata" && (
          <div className="space-y-3">
            {!newCust && (
              <>
                <div>
                  <label htmlFor="khata-customer" className="block text-xs font-semibold text-green-500 mb-1.5">
                    Customer *
                  </label>
                  <select id="khata-customer" value={customerId} onChange={(e) => setCustomerId(e.target.value)} className={`${inputCls} bg-white`}>
                    <option value="">-- Select customer --</option>
                    {customers.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                        {c.balance > 0 ? ` (owes ${inr(c.balance)})` : ""}
                      </option>
                    ))}
                  </select>
                </div>
                {selected && (
                  <p className="text-xs text-green-400">
                    Balance after this bill: <span className="font-semibold text-green-700">{inr(round2(selected.balance + total))}</span>
                  </p>
                )}
                <button type="button" onClick={() => setNewCust({ name: "", phone: "", errors: {} })} className="flex items-center gap-1.5 text-xs font-semibold text-green-600 hover:underline">
                  <UserPlus size={14} /> New customer
                </button>
              </>
            )}
            {newCust && (
              <div className="rounded-xl border border-green-100 p-3 space-y-3">
                <div>
                  <label htmlFor="new-cust-name" className="block text-xs font-semibold text-green-500 mb-1.5">
                    Customer name *
                  </label>
                  <input id="new-cust-name" value={newCust.name} onChange={(e) => setNewCust((n) => ({ ...n, name: e.target.value, errors: {} }))} className={inputCls} />
                  {newCust.errors.name && <p className="text-rose-600 text-xs font-medium mt-1.5">{newCust.errors.name}</p>}
                </div>
                <div>
                  <label htmlFor="new-cust-phone" className="block text-xs font-semibold text-green-500 mb-1.5">
                    Mobile (optional)
                  </label>
                  <input id="new-cust-phone" inputMode="numeric" maxLength={10} value={newCust.phone} onChange={(e) => setNewCust((n) => ({ ...n, phone: e.target.value.replace(/\D/g, ""), errors: {} }))} className={inputCls} />
                  {newCust.errors.phone && <p className="text-rose-600 text-xs font-medium mt-1.5">{newCust.errors.phone}</p>}
                  {newCust.errors.form && <p className="text-rose-600 text-xs font-medium mt-1.5">{newCust.errors.form}</p>}
                </div>
                <div className="flex gap-2">
                  <button type="button" onClick={() => setNewCust(null)} className="px-4 py-2 rounded-lg border border-green-200 text-green-700 hover:bg-green-50 font-semibold text-xs">
                    Cancel
                  </button>
                  <button type="button" onClick={saveNewCustomer} className="flex-1 bg-green-500 hover:bg-green-600 text-white font-semibold py-2 rounded-lg text-xs">
                    Save customer
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {error && (
        <p role="alert" className="text-rose-600 text-xs font-medium mt-3">
          {error}
        </p>
      )}

      <div className="flex gap-3 pt-5">
        <button type="button" onClick={onClose} className="px-5 py-2.5 rounded-lg border border-green-200 text-green-700 hover:bg-green-50 font-semibold text-sm transition-colors">
          Cancel
        </button>
        <button
          type="button"
          onClick={confirm}
          disabled={mode === "khata" && !customerId}
          className={`flex-1 disabled:cursor-not-allowed font-semibold py-2.5 rounded-lg transition-colors text-sm ${
            mode === "upi" ? "border border-green-200 text-green-700 hover:bg-green-50" : "bg-green-500 hover:bg-green-600 disabled:bg-green-200 text-white"
          }`}
        >
          {confirmLabel}
        </button>
      </div>
    </Modal>
  );
}

function BillDetailModal({ bill, merchant, onClose }) {
  return (
    <Modal title={`Bill ${bill.bill_no}`} onClose={onClose}>
      <div className="flex items-center justify-between text-xs text-green-400 mb-3">
        <span>{fmtDateTime(bill.created_at)}</span>
        <ModeBadge mode={bill.payment_mode} />
      </div>
      {bill.customer_name && <p className="text-sm text-green-500 mb-3">Customer: <span className="font-semibold text-green-700">{bill.customer_name}</span></p>}
      <table className="w-full text-sm">
        <thead className="text-xs uppercase text-green-400">
          <tr>
            <th className="text-left py-1.5">Item</th>
            <th className="text-right py-1.5">Qty</th>
            <th className="text-right py-1.5">Amount</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-green-50">
          {bill.items.map((i) => (
            <tr key={i.product_id}>
              <td className="py-2 text-green-700">
                {i.name}
                <span className="block text-[11px] text-green-300">{inr(i.price)} each</span>
              </td>
              <td className="py-2 text-right text-green-500">{i.qty}</td>
              <td className="py-2 text-right font-semibold text-green-700">{inr(i.line_total)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex items-center justify-between border-t border-green-100 mt-2 pt-3">
        <span className="font-semibold text-green-500">Total</span>
        <span className="font-display font-bold text-lg text-green-700">{inr(bill.total)}</span>
      </div>
      {bill.cash_received != null && (
        <p className="text-xs text-green-300 mt-1 text-right">
          Cash received {inr(bill.cash_received)} · change {inr(bill.change)}
        </p>
      )}
      <div className="pt-5">
        <button type="button" onClick={() => downloadBillPDF(bill, merchant)} className="w-full flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white font-semibold py-2.5 rounded-lg transition-colors text-sm">
          <Download size={16} /> Download PDF bill
        </button>
      </div>
    </Modal>
  );
}

export default function Billing() {
  const { session } = useAuth();
  const { t } = useLanguage();
  const merchantId = session.merchantId;
  const merchant = db.getMerchantById(merchantId);

  const [tab, setTab] = useState("new");
  const [products, setProducts] = useState(() => getProducts(merchantId));
  const [bills, setBills] = useState(() => getBills(merchantId));
  const [cart, setCart] = useState({}); // productId -> qty
  const [query, setQuery] = useState("");
  const [checkout, setCheckout] = useState(false);
  const [viewBill, setViewBill] = useState(null);
  const [histQuery, setHistQuery] = useState("");
  const [histMode, setHistMode] = useState("all");

  // ----- New bill -----
  const setQty = (product, qty) => {
    const clamped = Math.max(0, Math.min(qty, product.stock));
    setCart((c) => {
      const next = { ...c };
      if (clamped === 0) delete next[product.id];
      else next[product.id] = clamped;
      return next;
    });
  };

  const lines = products.filter((p) => cart[p.id] > 0).map((p) => ({ product: p, qty: cart[p.id], amount: round2(p.price * cart[p.id]) }));
  const itemCount = lines.reduce((s, l) => s + l.qty, 0);
  const total = round2(lines.reduce((s, l) => s + l.amount, 0));

  const q = query.trim().toLowerCase();
  const visibleProducts = products.filter((p) => !q || p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q));

  const handleDone = () => {
    setProducts(getProducts(merchantId));
    setBills(getBills(merchantId));
    setCart({});
    setCheckout(false);
  };

  // ----- History -----
  const totals = billTotals(bills);
  const hq = histQuery.trim().toLowerCase();
  const visibleBills = bills.filter((b) => (histMode === "all" || b.payment_mode === histMode) && (!hq || b.bill_no.toLowerCase().includes(hq) || (b.customer_name || "").toLowerCase().includes(hq)));

  const summary = (
    <div className="card p-5">
      <h2 className="font-display font-semibold text-green-700 mb-3 flex items-center gap-2">
        <ShoppingBag size={17} /> Current bill
      </h2>
      {lines.length === 0 ? (
        <p className="text-sm text-green-300 py-4 text-center">No items yet. Tap + on a product to add it.</p>
      ) : (
        <ul className="divide-y divide-green-50 mb-3">
          {lines.map(({ product, qty, amount }) => (
            <li key={product.id} className="py-2.5 flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="text-sm font-semibold text-green-700 truncate">{product.name}</p>
                <p className="text-xs text-green-300">
                  {qty} × {inr(product.price)}
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-sm font-semibold text-green-700">{inr(amount)}</span>
                <button type="button" onClick={() => setQty(product, 0)} aria-label={`Remove ${product.name} from bill`} className="w-6 h-6 rounded-md text-green-300 hover:text-rose-500 hover:bg-rose-50 flex items-center justify-center">
                  <X size={14} />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
      <div className="flex items-center justify-between border-t border-green-100 pt-3">
        <span className="text-sm text-green-400">{itemCount} items</span>
        <span className="font-display font-bold text-xl text-green-700">{inr(total)}</span>
      </div>
      <div className="flex gap-3 mt-4">
        <button type="button" onClick={() => setCart({})} disabled={lines.length === 0} className="px-4 py-2.5 rounded-lg border border-green-200 text-green-700 hover:bg-green-50 disabled:opacity-40 disabled:cursor-not-allowed font-semibold text-sm">
          Clear
        </button>
        <button type="button" onClick={() => setCheckout(true)} disabled={lines.length === 0} className="flex-1 bg-green-500 hover:bg-green-600 disabled:bg-green-200 disabled:cursor-not-allowed text-white font-semibold py-2.5 rounded-lg transition-colors text-sm">
          Checkout
        </button>
      </div>
    </div>
  );

  return (
    <div className="max-w-6xl">
      <h1 className="font-display font-bold text-2xl text-green-700">{t("billingTitle")}</h1>
      <p className="text-sm text-green-300 mb-6">{t("billingSubtitle")}</p>

      <div role="tablist" aria-label="Billing sections" className="inline-flex rounded-lg border border-green-100 bg-white p-1 mb-5">
        {[
          { key: "new", label: "New Bill" },
          { key: "history", label: `Bill History (${bills.length})` },
        ].map((x) => (
          <button key={x.key} role="tab" aria-selected={tab === x.key} onClick={() => setTab(x.key)} className={`px-4 py-1.5 rounded-md text-sm font-semibold transition-colors ${tab === x.key ? "bg-green-500 text-white" : "text-green-500 hover:bg-green-50"}`}>
            {x.label}
          </button>
        ))}
      </div>

      {/* ---------------- NEW BILL ---------------- */}
      {tab === "new" && products.length === 0 && (
        <div className="card text-center py-14 px-4">
          <div className="w-14 h-14 rounded-2xl bg-green-50 text-green-500 flex items-center justify-center mx-auto mb-4">
            <Package size={26} />
          </div>
          <p className="font-display font-semibold text-green-700">Add products before billing</p>
          <p className="text-sm text-green-300 mt-1 mb-5">Bills are made from your product list, so stock stays correct.</p>
          <Link to="/merchant/products" className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white font-semibold px-5 py-2.5 rounded-lg text-sm transition-colors">
            <Plus size={16} /> Go to Products
          </Link>
        </div>
      )}

      {tab === "new" && products.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 items-start">
          <div className="lg:col-span-2">
            <div className="relative mb-4">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-green-300" aria-hidden="true" />
              <input type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search products" aria-label="Search products" className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-green-100 bg-white focus:border-green-500 focus:ring-2 focus:ring-green-100 outline-none text-sm" />
            </div>
            {visibleProducts.length === 0 && <p className="card text-sm text-green-300 text-center py-8">No products match your search.</p>}
            <ul className="space-y-3">
              {visibleProducts.map((p) => {
                const out = stockStatus(p) === "out";
                return (
                  <li key={p.id} className={`card p-4 flex items-center justify-between gap-3 ${out ? "opacity-60" : ""}`}>
                    <div className="min-w-0">
                      <p className="font-semibold text-green-700 truncate">{p.name}</p>
                      <p className="text-xs text-green-300 mt-0.5">
                        {inr(p.price)} ·{" "}
                        <span className={out ? "text-rose-600 font-semibold" : stockStatus(p) === "low" ? "text-amber-600 font-semibold" : ""}>{out ? "Out of stock" : `Stock: ${p.stock}`}</span>
                      </p>
                    </div>
                    <Qty product={p} qty={cart[p.id] || 0} onChange={setQty} />
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="hidden lg:block lg:sticky lg:top-0">{summary}</div>
        </div>
      )}

      {/* Phone / tablet: sticky checkout bar (the summary card is desktop-only) */}
      {tab === "new" && products.length > 0 && (
        <div className="lg:hidden sticky bottom-16 md:bottom-4 mt-4 z-30">
          <div className="card p-3 flex items-center justify-between gap-3 shadow-lg">
            <div>
              <p className="text-xs text-green-300">{itemCount} items</p>
              <p className="font-display font-bold text-lg text-green-700">{inr(total)}</p>
            </div>
            <button type="button" onClick={() => setCheckout(true)} disabled={lines.length === 0} className="bg-green-500 hover:bg-green-600 disabled:bg-green-200 disabled:cursor-not-allowed text-white font-semibold px-8 py-2.5 rounded-lg text-sm">
              Checkout
            </button>
          </div>
        </div>
      )}

      {/* ---------------- HISTORY ---------------- */}
      {tab === "history" && (
        <>
          <div className="grid grid-cols-2 gap-4 mb-5 max-w-md">
            <div className="card p-4">
              <p className="text-xs font-semibold text-green-400 uppercase tracking-wide">Bills today</p>
              <p className="text-2xl font-display font-bold text-green-700 mt-1">{totals.todayCount}</p>
            </div>
            <div className="card p-4">
              <p className="text-xs font-semibold text-green-400 uppercase tracking-wide">Sales today</p>
              <p className="text-2xl font-display font-bold text-green-700 mt-1">{inr(totals.todayTotal)}</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 mb-4">
            <div className="relative flex-1 min-w-[220px]">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-green-300" aria-hidden="true" />
              <input type="search" value={histQuery} onChange={(e) => setHistQuery(e.target.value)} placeholder="Search bill number or customer" aria-label="Search bills" className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-green-100 bg-white focus:border-green-500 focus:ring-2 focus:ring-green-100 outline-none text-sm" />
            </div>
            <div role="group" aria-label="Filter by payment mode" className="inline-flex rounded-lg border border-green-100 bg-white p-1">
              {[["all", "All"], ["cash", "Cash"], ["upi", "UPI"], ["khata", "Khata"]].map(([k, l]) => (
                <button key={k} type="button" aria-pressed={histMode === k} onClick={() => setHistMode(k)} className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${histMode === k ? "bg-green-500 text-white" : "text-green-500 hover:bg-green-50"}`}>
                  {l}
                </button>
              ))}
            </div>
          </div>

          {bills.length === 0 && (
            <div className="card text-center py-14 px-4">
              <div className="w-14 h-14 rounded-2xl bg-green-50 text-green-500 flex items-center justify-center mx-auto mb-4">
                <ReceiptText size={26} />
              </div>
              <p className="font-display font-semibold text-green-700">No bills yet</p>
              <p className="text-sm text-green-300 mt-1 mb-5">Bills you create will show up here.</p>
              <button type="button" onClick={() => setTab("new")} className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white font-semibold px-5 py-2.5 rounded-lg text-sm transition-colors">
                <Plus size={16} /> Create a bill
              </button>
            </div>
          )}

          {bills.length > 0 && visibleBills.length === 0 && <p className="card text-sm text-green-300 text-center py-8">No bills match your search or filter.</p>}

          {visibleBills.length > 0 && (
            <div className="card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm min-w-[640px]">
                  <thead className="bg-green-50 text-green-500 text-xs uppercase font-semibold">
                    <tr>
                      <th className="text-left px-5 py-3">Bill</th>
                      <th className="text-left px-5 py-3">Date & time</th>
                      <th className="text-left px-5 py-3">Customer</th>
                      <th className="text-right px-5 py-3">Items</th>
                      <th className="text-left px-5 py-3">Paid by</th>
                      <th className="text-right px-5 py-3">Total</th>
                      <th className="px-5 py-3">
                        <span className="sr-only">View</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-green-50">
                    {visibleBills.map((b) => (
                      <tr key={b.id} className="hover:bg-green-50/50">
                        <td className="px-5 py-3 font-semibold text-green-700">{b.bill_no}</td>
                        <td className="px-5 py-3 text-green-400 text-xs whitespace-nowrap">{fmtDateTime(b.created_at)}</td>
                        <td className="px-5 py-3 text-green-500">{b.customer_name || "—"}</td>
                        <td className="px-5 py-3 text-right text-green-500">{b.item_count}</td>
                        <td className="px-5 py-3">
                          <ModeBadge mode={b.payment_mode} />
                        </td>
                        <td className="px-5 py-3 text-right font-semibold text-green-700">{inr(b.total)}</td>
                        <td className="px-5 py-3 text-right">
                          <button type="button" onClick={() => setViewBill(b)} aria-label={`View bill ${b.bill_no}`} className="text-xs font-semibold text-green-600 hover:underline">
                            View
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}

      {checkout && (
        <CheckoutModal
          merchantId={merchantId}
          merchant={merchant}
          lines={lines}
          total={total}
          onClose={() => setCheckout(false)}
          onDone={handleDone}
        />
      )}
      {viewBill && <BillDetailModal bill={viewBill} merchant={merchant} onClose={() => setViewBill(null)} />}
    </div>
  );
}
