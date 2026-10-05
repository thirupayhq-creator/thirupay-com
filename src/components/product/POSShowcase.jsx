import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Smartphone,
  CreditCard,
  Wifi,
  Receipt,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  Zap,
  Printer,
} from "lucide-react";

export default function POSShowcase() {
  const [payMode, setPayMode] = useState("tap"); // "tap" | "chip"
  const [isProcessing, setIsProcessing] = useState(false);
  const [paid, setPaid] = useState(false);
  const [printed, setPrinted] = useState(false);

  const handleSimulatePayment = (mode) => {
    setPayMode(mode);
    setIsProcessing(true);
    setPaid(false);
    setPrinted(false);
    setTimeout(() => {
      setIsProcessing(false);
      setPaid(true);
    }, 1100);
  };

  const handlePrintReceipt = () => {
    setPrinted(true);
  };

  return (
    <div className="relative mx-auto w-full max-w-[420px] lg:max-w-[440px]">
      {/* Background ambient lighting */}
      <div className="absolute inset-0 bg-gradient-to-tr from-sky-400/20 via-orange-400/15 to-transparent blur-3xl -z-10 pointer-events-none rounded-3xl" />

      {/* Main Container Card */}
      <motion.div
        className="relative bg-white rounded-3xl p-5 border border-slate-200/90 shadow-2xl overflow-hidden min-h-[460px] flex flex-col justify-between"
        whileHover={{ y: -3, transition: { duration: 0.3 } }}
      >
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold">
                <Smartphone size={16} />
              </div>
              <div>
                <h4 className="font-display font-bold text-slate-900 text-sm">
                  Smart Android POS Terminal
                </h4>
                <p className="text-[10px] text-slate-400">Tap, Chip, Swipe &amp; Built-In Printer</p>
              </div>
            </div>
            <span className="text-[9px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              4G LTE + Wi-Fi
            </span>
          </div>

          {/* Animated Thermal Paper Printer Slot Output */}
          <div className="relative flex justify-center">
            <AnimatePresence>
              {printed && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="w-48 bg-white border-2 border-dashed border-slate-300 rounded-t-lg p-2.5 shadow-lg text-[9px] font-mono text-slate-800 space-y-1 z-30"
                >
                  <div className="text-center pb-1 border-b border-dashed border-slate-200">
                    <p className="font-bold text-[10px]">SELVI GROCERIES</p>
                    <p className="text-[8px] text-slate-500">Tiruvannamalai • GSTIN33AAB</p>
                  </div>
                  <div className="flex justify-between">
                    <span>Card:</span>
                    <span>•••• 8042 (RuPay)</span>
                  </div>
                  <div className="flex justify-between font-bold text-slate-900 text-[10px]">
                    <span>AMOUNT:</span>
                    <span>₹1,250.00</span>
                  </div>
                  <div className="text-center pt-1 border-t border-dashed border-slate-200 text-[8px] text-emerald-600 font-bold">
                    *** APPROVED &amp; SETTLED ***
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* POS Machine Screen Simulation */}
          <div className="rounded-2xl bg-slate-900 p-4 text-white shadow-xl border border-slate-800 space-y-3">
            {/* Top Bar */}
            <div className="flex items-center justify-between text-[10px] text-slate-400 border-b border-slate-800 pb-2">
              <span className="font-bold tracking-wider text-slate-300">THIRUPAY POS PRO</span>
              <div className="flex items-center gap-1.5">
                <Wifi size={11} className="text-emerald-400" />
                <span className="text-[9px]">4G</span>
              </div>
            </div>

            {/* Screen Bill Total */}
            <div className="bg-slate-950 rounded-xl p-3 border border-slate-800 text-center">
              <p className="text-[10px] text-slate-400">Total Invoice Amount</p>
              <div className="text-2xl font-extrabold text-white font-display mt-0.5">
                ₹1,250.00
              </div>
              <p className="text-[9px] text-orange-400 mt-0.5 flex items-center justify-center gap-1">
                <Zap size={10} /> Ready for Card Tap / Chip Insert
              </p>
            </div>

            {/* Status Message */}
            <div className="text-center py-1">
              {isProcessing ? (
                <p className="text-xs font-bold text-amber-400 animate-pulse">
                  Authorizing Payment via Bank Gateway...
                </p>
              ) : paid ? (
                <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-emerald-400">
                  <CheckCircle2 size={15} /> Card Payment Approved (₹1,250)
                </div>
              ) : (
                <p className="text-[10px] text-slate-400">
                  Choose an action below to simulate card payment:
                </p>
              )}
            </div>
          </div>

          {/* Interactive Simulation Buttons */}
          <div className="space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => handleSimulatePayment("tap")}
                disabled={isProcessing}
                className="bg-[#0B2A4A] hover:bg-[#123761] text-white py-2 px-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm transition-all disabled:opacity-50"
              >
                <CreditCard size={12} className="text-emerald-400" />
                Simulate Tap (NFC)
              </button>
              <button
                onClick={() => handleSimulatePayment("chip")}
                disabled={isProcessing}
                className="bg-slate-800 hover:bg-slate-700 text-white py-2 px-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm transition-all disabled:opacity-50"
              >
                <CreditCard size={12} className="text-orange-400" />
                Simulate Chip Card
              </button>
            </div>

            {paid && (
              <button
                onClick={handlePrintReceipt}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm transition-all"
              >
                <Printer size={13} /> Print Thermal Customer Bill Receipt
              </button>
            )}
          </div>
        </div>

        {/* Accepted Cards Ribbon */}
        <div className="mt-4 pt-2 border-t border-slate-100 text-center">
          <div className="flex items-center justify-around text-[10px] font-bold text-slate-600">
            <span>Visa</span> • <span>Mastercard</span> • <span>RuPay</span> • <span>Contactless NFC</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
