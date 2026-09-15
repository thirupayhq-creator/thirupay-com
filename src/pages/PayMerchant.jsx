import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, ShieldCheck, XCircle, Loader2 } from "lucide-react";
import { db, genId } from "../data/mockData";
import { PAYMENT_MODES } from "../data/paymentModes";
import { useToast } from "../context/ToastContext";

// Public customer checkout page reached by scanning a merchant's STATIC QR:
//   /pay?merchant=<merchant_id>
// No merchant login required, no dashboard sidebar/navbar — this is a
// standalone fintech-style checkout screen. The amount is entered here by
// the customer; it is never encoded in the QR itself.
export default function PayMerchant() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const merchantId = searchParams.get("merchant");
  const merchant = merchantId ? db.getMerchantById(merchantId) : null;

  const [amount, setAmount] = useState("");
  const [amountError, setAmountError] = useState("");
  const [selectedMode, setSelectedMode] = useState(null);
  const [status, setStatus] = useState("form"); // form | processing | success
  const [paidTxn, setPaidTxn] = useState(null);

  const numericAmount = Number(amount);
  const displayAmount = amount && numericAmount > 0 ? numericAmount.toLocaleString("en-IN") : "0";

  const validate = () => {
    if (!amount.trim()) {
      setAmountError("Please enter an amount.");
      return false;
    }
    if (!/^\d+(\.\d{1,2})?$/.test(amount.trim())) {
      setAmountError("Enter a valid amount (numbers only).");
      return false;
    }
    if (numericAmount <= 0) {
      setAmountError("Amount must be greater than ₹0.");
      return false;
    }
    setAmountError("");
    return true;
  };

  const handlePay = (mode) => {
    if (!validate()) return;
    setSelectedMode(mode);
    setStatus("processing");

    // Mock gateway delay — this is the seam a real payment gateway call
    // (Cashfree/Razorpay/UPI) would replace later. Frontend-only for now.
    setTimeout(() => {
      const txn = {
        transaction_id: genId("txn"),
        merchant_id: merchant.merchant_id,
        amount: numericAmount,
        payment_method: "QR",
        payment_mode: mode,
        status: "success",
        created_at: new Date().toISOString(),
      };
      db.addTxn(txn);
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
        title: `₹${txn.amount.toLocaleString("en-IN")} paid successfully!`,
        subtitle: `to ${merchant.business_name}`,
        type: "success",
      });
    }, 1400);
  };

  // ---------- Merchant not found (bad/missing ?merchant= param) ----------
  if (!merchant) {
    return (
      <div className="min-h-screen bg-[#F6F7FB] flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-card p-8 max-w-sm w-full text-center">
          <XCircle size={40} className="text-rose-400 mx-auto mb-3" />
          <h1 className="font-display font-bold text-lg text-green-700">Merchant not found</h1>
          <p className="text-sm text-green-300 mt-1">This QR code is invalid or the merchant is unavailable.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F6F7FB] flex items-center justify-center px-4 py-10">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }} className="bg-white rounded-2xl shadow-card w-full max-w-sm overflow-hidden">
        {/* Header */}
        <div className="bg-green-700 px-6 py-6 text-center">
          <img src="/brand/logo-icon-white.png" alt="" className="h-8 w-auto mx-auto mb-2" />
          <p className="text-green-100 text-xs">Pay securely with ThiruPay</p>
          <p className="text-white font-display font-bold text-lg">{merchant.business_name}</p>
        </div>

        <div className="p-6">
          <AnimatePresence mode="wait">
            {status === "success" && paidTxn ? (
              <motion.div key="success" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
                <CheckCircle2 size={48} className="text-emerald-500 mx-auto mb-3" />
                <p className="font-semibold text-emerald-600 text-sm mb-3">Payment Successful</p>

                <div className="bg-green-50/60 rounded-xl p-4 text-left space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-green-400">Amount Paid</span>
                    <span className="font-bold text-green-700">₹{paidTxn.amount.toLocaleString("en-IN")}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-green-400">Paid To</span>
                    <span className="font-semibold text-green-700">{merchant.business_name}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-green-400">Transaction ID</span>
                    <span className="font-mono text-green-600">{paidTxn.transaction_id}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-green-400">Date &amp; Time</span>
                    <span className="text-green-600">
                      {new Date(paidTxn.created_at).toLocaleString("en-IN", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => navigate("/")}
                  className="mt-5 w-full text-sm font-semibold text-white bg-green-600 hover:bg-green-700 py-2.5 rounded-lg transition-colors"
                >
                  Done
                </button>
              </motion.div>
            ) : status === "processing" ? (
              <motion.div key="processing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-10">
                <Loader2 size={36} className="text-green-500 mx-auto mb-4 animate-spin" />
                <p className="text-sm font-semibold text-green-700">Processing Payment…</p>
                <p className="text-xs text-green-300 mt-1">Please don't close this page.</p>
              </motion.div>
            ) : (
              <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <label className="block text-xs font-semibold text-green-500 mb-1.5 text-center">Enter Amount</label>
                <div className="flex items-center justify-center gap-1 mb-1">
                  <span className="text-2xl font-display font-bold text-green-700">₹</span>
                  <input
                    autoFocus
                    inputMode="decimal"
                    value={amount}
                    onChange={(e) => {
                      setAmount(e.target.value.replace(/[^\d.]/g, ""));
                      if (amountError) setAmountError("");
                    }}
                    placeholder="0"
                    className="text-3xl font-display font-bold text-green-700 text-center w-40 outline-none border-b-2 border-green-100 focus:border-green-500 bg-transparent"
                  />
                </div>
                {amountError && <p className="text-rose-600 text-xs font-medium text-center mb-3">{amountError}</p>}
                {!amountError && <div className="mb-3" />}

                <p className="text-xs text-green-300 mb-4 flex items-center justify-center gap-1.5">
                  <ShieldCheck size={13} /> Secured by ThiruPay
                </p>

                <div className="space-y-2">
                  {PAYMENT_MODES.map((m) => (
                    <button
                      key={m.key}
                      onClick={() => handlePay(m.key)}
                      className="w-full text-sm font-semibold text-white py-2.5 rounded-lg transition-opacity hover:opacity-90"
                      style={{ backgroundColor: m.color }}
                    >
                      Pay ₹{displayAmount} via {m.label}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}