import { useState } from "react";
import { useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, ShieldCheck, Clock, XCircle, Loader2, RotateCcw, Smartphone, CreditCard, Landmark, Wallet } from "lucide-react";
import { db, genId } from "../data/mockData";
import { PAYMENT_MODES } from "../data/paymentModes";
import { downloadReceiptPDF } from "../utils/receipt";
import { useToast } from "../context/ToastContext";

const MODE_ICONS = { UPI: Smartphone, Card: CreditCard, "Net Banking": Landmark, Wallet: Wallet };

// This is what a CUSTOMER sees when they open a merchant's payment link —
// no login, no merchant sidebar/dashboard. In production the Pay button here
// calls the real payment gateway; for now it's mocked against local data
// (backend API not connected yet — swap the setTimeout block below for that).
export default function PayLink() {
  const { linkId } = useParams();
  const { showToast } = useToast();
  const [status, setStatus] = useState("pay"); // pay | processing | success | failed
  const [selectedMode, setSelectedMode] = useState(PAYMENT_MODES[0].key);
  const [paidTxn, setPaidTxn] = useState(null);

  const link = db.getLinkById(linkId);
  const merchant = link ? db.getMerchantById(link.merchant_id) : null;
  const isExpired = link && new Date(link.expiry) < new Date();
  const alreadyPaid = link?.status === "paid";

  const handlePay = () => {
    if (!link || !merchant) return;
    setStatus("processing");

    // Mock gateway delay — this is the seam a real payment gateway call
    // (Cashfree/Razorpay/UPI) would replace later. ~90% success, to also
    // demonstrate the failure state a real gateway can return.
    setTimeout(() => {
      const isSuccess = Math.random() > 0.1;

      if (!isSuccess) {
        setStatus("failed");
        return;
      }

      const txn = {
        transaction_id: genId("txn"),
        merchant_id: merchant.merchant_id,
        amount: link.amount,
        payment_method: "Payment Link",
        payment_mode: selectedMode,
        status: "success",
        created_at: new Date().toISOString(),
      };
      db.addTxn(txn);
      db.updateLinkStatus(link.link_id, "paid");
      db.addSettlement({
        settlement_id: genId("st"),
        merchant_id: merchant.merchant_id,
        amount: txn.amount,
        settlement_date: new Date(Date.now() + 86400000).toISOString(),
        status: "pending",
      });
      setPaidTxn(txn);
      setStatus("success");
      showToast({
        title: `₹${txn.amount.toLocaleString("en-IN")} payment received!`,
        subtitle: `${merchant.business_name} · via ${selectedMode}`,
        type: "success",
      });
    }, 1500);
  };

  if (!link || !merchant) {
    return (
      <div className="min-h-screen bg-[#F6F7FB] flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-card p-8 max-w-sm w-full text-center">
          <XCircle size={40} className="text-rose-400 mx-auto mb-3" />
          <h1 className="font-display font-bold text-lg text-green-700">Link not found</h1>
          <p className="text-sm text-green-300 mt-1">This payment link is invalid or has been removed.</p>
        </div>
      </div>
    );
  }

  const showSuccess = alreadyPaid || status === "success";

  return (
    <div className="min-h-screen bg-[#F6F7FB] flex items-center justify-center px-4 py-10">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }} className="bg-white rounded-2xl shadow-card w-full max-w-sm overflow-hidden">
        {/* Header */}
        <div className="bg-green-700 px-6 py-6 text-center">
          <img src="/brand/logo-icon-white.png" alt="ThiruPay" className="h-8 w-auto mx-auto mb-2" />
          <p className="text-green-100 text-xs">Pay to</p>
          <p className="text-white font-display font-bold text-lg">{merchant.business_name}</p>
        </div>

        <div className="p-6">
          <AnimatePresence mode="wait">
            {showSuccess ? (
              <motion.div key="success" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
                <CheckCircle2 size={48} className="text-emerald-500 mx-auto mb-3" />
                <p className="font-display font-bold text-2xl text-green-700">₹{link.amount.toLocaleString("en-IN")}</p>
                <p className="text-sm text-emerald-600 font-semibold mt-1">Payment successful</p>
                <p className="text-xs text-green-300 mt-1">{link.note}</p>
                {paidTxn && (
                  <>
                    <div className="bg-green-50/60 rounded-lg p-3 text-left mt-4 space-y-1.5">
                      <div className="flex justify-between text-xs">
                        <span className="text-green-400">Transaction ID</span>
                        <span className="font-mono text-green-600">{paidTxn.transaction_id}</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-green-400">Paid via</span>
                        <span className="text-green-600">{paidTxn.payment_mode}</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-green-400">Date &amp; Time</span>
                        <span className="text-green-600">
                          {new Date(paidTxn.created_at).toLocaleString("en-IN", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => downloadReceiptPDF(paidTxn, merchant)}
                      className="mt-4 w-full text-sm font-semibold text-green-700 border border-green-200 py-2.5 rounded-lg hover:bg-green-50 transition-colors"
                    >
                      Download receipt
                    </button>
                  </>
                )}
              </motion.div>
            ) : status === "failed" ? (
              <motion.div key="failed" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
                <XCircle size={48} className="text-rose-500 mx-auto mb-3" />
                <p className="font-display font-bold text-2xl text-green-700">₹{link.amount.toLocaleString("en-IN")}</p>
                <p className="text-sm text-rose-600 font-semibold mt-1">Payment failed</p>
                <p className="text-xs text-green-300 mt-1">Your bank or payment provider declined this transaction. No amount was deducted.</p>
                <button
                  onClick={() => setStatus("pay")}
                  className="mt-5 w-full flex items-center justify-center gap-2 text-sm font-semibold text-white bg-green-600 hover:bg-green-700 py-2.5 rounded-lg transition-colors"
                >
                  <RotateCcw size={15} /> Try Again
                </button>
              </motion.div>
            ) : status === "processing" ? (
              <motion.div key="processing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-10">
                <Loader2 size={36} className="text-green-500 mx-auto mb-4 animate-spin" />
                <p className="text-sm font-semibold text-green-700">Processing Payment…</p>
                <p className="text-xs text-green-300 mt-1">Please don't close this page.</p>
              </motion.div>
            ) : isExpired ? (
              <motion.div key="expired" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
                <Clock size={40} className="text-amber-400 mx-auto mb-3" />
                <p className="font-semibold text-green-700 text-sm">This payment link has expired</p>
                <p className="text-xs text-green-300 mt-1">Ask {merchant.business_name} to send a new link.</p>
              </motion.div>
            ) : (
              <motion.div key="pay" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div className="text-center mb-5">
                  <p className="font-display font-bold text-3xl text-green-700">₹{link.amount.toLocaleString("en-IN")}</p>
                  <p className="text-xs text-green-300 mt-1">{link.note}</p>
                  <p className="text-[11px] text-amber-500 mt-1.5 flex items-center justify-center gap-1">
                    <Clock size={11} />
                    Expires {new Date(link.expiry).toLocaleString("en-IN", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}
                  </p>
                </div>

                <p className="text-xs font-semibold text-green-500 mb-2">Choose payment method</p>
                <div className="space-y-2 mb-5">
                  {PAYMENT_MODES.map((m) => {
                    const Icon = MODE_ICONS[m.key] || Smartphone;
                    const active = selectedMode === m.key;
                    return (
                      <button
                        key={m.key}
                        type="button"
                        onClick={() => setSelectedMode(m.key)}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border-2 transition-colors text-left ${
                          active ? "border-green-500 bg-green-50" : "border-green-100 hover:bg-green-50/50"
                        }`}
                      >
                        <Icon size={17} style={{ color: m.color }} />
                        <span className="text-sm font-semibold text-green-700 flex-1">{m.label}</span>
                        <span
                          className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${
                            active ? "border-green-600" : "border-green-200"
                          }`}
                        >
                          {active && <span className="w-2 h-2 rounded-full bg-green-600" />}
                        </span>
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={handlePay}
                  className="w-full text-base font-bold text-white py-3.5 rounded-xl shadow-lg transition-transform hover:-translate-y-0.5 bg-green-600 hover:bg-green-700"
                >
                  Pay ₹{link.amount.toLocaleString("en-IN")}
                </button>

                <p className="text-xs text-green-300 mt-4 flex items-center justify-center gap-1.5">
                  <ShieldCheck size={13} /> Secured by ThiruPay
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}