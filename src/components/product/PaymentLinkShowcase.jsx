import { useState } from "react";
import { motion } from "framer-motion";
import {
  Link2,
  CheckCircle2,
  Copy,
  Clock,
  MessageCircle,
  Smartphone,
  ShieldCheck,
  Check,
  Sparkles,
  ArrowRight,
} from "lucide-react";

export default function PaymentLinkShowcase() {
  const [activeTab, setActiveTab] = useState("merchant"); // "merchant" | "customer"
  const [amount, setAmount] = useState("1850");
  const [customerName, setCustomerName] = useState("Karthik Raja");
  const [purpose, setPurpose] = useState("Kanchipuram Silk Saree (Order #204)");
  const [copied, setCopied] = useState(false);
  const [paid, setPaid] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePay = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setPaid(true);
    }, 1200);
  };

  return (
    <div className="relative mx-auto w-full max-w-[420px] lg:max-w-[440px]">
      {/* Background ambient lighting */}
      <div className="absolute inset-0 bg-gradient-to-tr from-orange-400/20 via-sky-400/15 to-transparent blur-3xl -z-10 pointer-events-none rounded-3xl" />

      {/* Mode Switcher */}
      <div className="flex items-center justify-between bg-white/90 backdrop-blur-md p-1.5 rounded-2xl border border-slate-200/90 shadow-sm mb-4">
        <button
          onClick={() => setActiveTab("merchant")}
          className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
            activeTab === "merchant"
              ? "bg-[#0B2A4A] text-white shadow-sm"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <Link2 size={12} /> 1. Merchant Creates Link
        </button>
        <button
          onClick={() => setActiveTab("customer")}
          className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
            activeTab === "customer"
              ? "bg-[#0B2A4A] text-white shadow-sm"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <Smartphone size={12} /> 2. Customer Pays
        </button>
      </div>

      {/* Main Container Card */}
      <motion.div
        className="relative bg-white rounded-3xl p-5 border border-slate-200/90 shadow-2xl overflow-hidden min-h-[460px] flex flex-col justify-between"
        whileHover={{ y: -3, transition: { duration: 0.3 } }}
      >
        {activeTab === "merchant" ? (
          /* Merchant Generation View */
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center font-bold">
                  <Link2 size={16} />
                </div>
                <div>
                  <h4 className="font-display font-bold text-slate-900 text-sm">
                    Create Instant Payment Link
                  </h4>
                  <p className="text-[10px] text-slate-400">Share via WhatsApp, SMS or Email</p>
                </div>
              </div>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                0% MDR
              </span>
            </div>

            {/* Inputs Form */}
            <div className="space-y-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Bill Amount (₹)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400">
                    ₹
                  </span>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full pl-7 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0B2A4A]"
                    placeholder="Enter amount"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Customer Name / Phone
                </label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0B2A4A]"
                  placeholder="e.g. Karthik (+91 98401 23456)"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Order Note / Description
                </label>
                <input
                  type="text"
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                  className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0B2A4A]"
                  placeholder="e.g. 2 Sarees Delivery"
                />
              </div>

              {/* Expiry Pill */}
              <div className="flex items-center justify-between text-[11px] bg-slate-50 p-2 rounded-xl border border-slate-200">
                <span className="text-slate-600 flex items-center gap-1">
                  <Clock size={12} className="text-slate-400" /> Link Expiry:
                </span>
                <span className="font-semibold text-slate-800">24 Hours (Configurable)</span>
              </div>
            </div>

            {/* Generated Link Box */}
            <div className="bg-[#0B2A4A] text-white p-3 rounded-2xl shadow-md space-y-2">
              <div className="flex items-center justify-between text-[10px] text-slate-300">
                <span>Shareable Link:</span>
                <span className="text-orange-400 font-semibold flex items-center gap-1">
                  <Sparkles size={10} /> Ready to send
                </span>
              </div>
              <div className="bg-white/10 px-2.5 py-1.5 rounded-lg flex items-center justify-between text-xs font-mono text-emerald-300 truncate">
                <span className="truncate">thirupay.com/pay/lnk_8942k</span>
                <button
                  onClick={handleCopy}
                  className="ml-2 text-white hover:text-orange-400 transition-colors p-1"
                  title="Copy link"
                >
                  {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                </button>
              </div>
              <div className="flex items-center gap-2 pt-1">
                <button
                  onClick={() => setActiveTab("customer")}
                  className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold py-1.5 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <MessageCircle size={13} /> Share on WhatsApp
                </button>
                <button
                  onClick={() => setActiveTab("customer")}
                  className="bg-white/15 hover:bg-white/20 text-white font-bold px-3 py-1.5 rounded-xl text-xs flex items-center justify-center gap-1"
                >
                  Test <ArrowRight size={12} />
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* Customer WhatsApp & Checkout Simulation */
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold text-xs shadow-sm">
                  <MessageCircle size={16} />
                </div>
                <div>
                  <h4 className="font-display font-bold text-slate-900 text-xs">
                    WhatsApp Message Received
                  </h4>
                  <p className="text-[10px] text-slate-400">Customer view on phone</p>
                </div>
              </div>
              <span className="text-[9px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                Encrypted
              </span>
            </div>

            {/* Chat Bubble Message */}
            <div className="bg-[#E7F8E8] border border-emerald-200 rounded-2xl rounded-tl-sm p-3 space-y-2 text-xs text-slate-800">
              <div className="flex items-center justify-between">
                <span className="font-bold text-[#0B2A4A] text-[11px]">Selvi Groceries</span>
                <span className="text-[9px] text-slate-400">10:42 AM</span>
              </div>
              <p className="text-[11px] leading-relaxed">
                Vanakkam <strong>{customerName || "Customer"}</strong>, here is your payment link for:
                <br />
                <span className="italic text-slate-600">"{purpose || "Order"}"</span>
              </p>
              <div className="bg-white rounded-xl p-2.5 border border-emerald-300/80 shadow-xs flex items-center justify-between">
                <div>
                  <p className="text-[10px] text-slate-400">Total Due:</p>
                  <p className="text-base font-extrabold text-[#0B2A4A]">₹{amount || "0"}.00</p>
                </div>
                <div className="text-right">
                  <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-md">
                    Tap to Pay
                  </span>
                </div>
              </div>
            </div>

            {/* Simulated Checkout Drawer */}
            <div className="bg-slate-50 rounded-2xl p-3 border border-slate-200 space-y-2.5">
              <div className="flex items-center justify-between text-[11px]">
                <span className="font-bold text-slate-800">ThiruPay Instant Checkout</span>
                <span className="flex items-center gap-1 text-[9px] font-semibold text-emerald-600">
                  <ShieldCheck size={11} /> 100% Safe
                </span>
              </div>

              {paid ? (
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="bg-emerald-500 text-white rounded-xl p-3 text-center space-y-1"
                >
                  <CheckCircle2 size={24} className="mx-auto" />
                  <p className="font-bold text-sm">Payment Successful! ₹{amount}</p>
                  <p className="text-[10px] text-emerald-100">
                    Receipt sent to customer &amp; T+1 settled to merchant
                  </p>
                </motion.div>
              ) : (
                <div className="space-y-1.5">
                  <button
                    onClick={handlePay}
                    disabled={isProcessing}
                    className="w-full bg-[#0B2A4A] hover:bg-[#123761] text-white py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-all"
                  >
                    {isProcessing ? "Processing UPI..." : `Pay ₹${amount} with Google Pay / PhonePe`}
                  </button>
                  <div className="flex items-center justify-center gap-3 text-[9px] text-slate-400 pt-1">
                    <span>Paytm</span> • <span>BHIM</span> • <span>Any UPI App</span> • <span>Cards</span>
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={() => {
                setActiveTab("merchant");
                setPaid(false);
              }}
              className="text-center w-full text-[11px] font-semibold text-slate-500 hover:text-slate-800"
            >
              ← Back to Merchant Link Creator
            </button>
          </div>
        )}

        {/* Bottom Trust Guarantee Strip */}
        <div className="mt-4 pt-2 flex items-center justify-around text-[9px] font-medium text-slate-400 border-t border-slate-100">
          <span className="flex items-center gap-1">
            <CheckCircle2 size={11} className="text-emerald-500" /> WhatsApp &amp; SMS
          </span>
          <span className="flex items-center gap-1">
            <Clock size={11} className="text-orange-500" /> Custom Expiry
          </span>
          <span className="flex items-center gap-1">
            <ShieldCheck size={11} className="text-sky-500" /> T+1 Payout
          </span>
        </div>
      </motion.div>
    </div>
  );
}
