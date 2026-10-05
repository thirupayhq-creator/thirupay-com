import { useState } from "react";
import { motion } from "framer-motion";
import {
  Building2,
  CheckCircle2,
  Download,
  Clock,
  ShieldCheck,
  RefreshCw,
  Receipt,
} from "lucide-react";

export default function SettlementShowcase() {
  const [tab, setTab] = useState("settled"); // "settled" | "pending"
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 900);
  };

  const handleDownload = () => {
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 2500);
  };

  return (
    <div className="relative mx-auto w-full max-w-[420px] lg:max-w-[440px]">
      {/* Background ambient lighting */}
      <div className="absolute inset-0 bg-gradient-to-tr from-emerald-400/20 via-sky-400/15 to-transparent blur-3xl -z-10 pointer-events-none rounded-3xl" />

      {/* Switcher Tab */}
      <div className="flex items-center justify-between bg-white/90 backdrop-blur-md p-1.5 rounded-2xl border border-slate-200/90 shadow-sm mb-4">
        <button
          onClick={() => setTab("settled")}
          className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
            tab === "settled"
              ? "bg-[#0B2A4A] text-white shadow-sm"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <CheckCircle2 size={12} className="text-emerald-400" /> Settled to Bank (₹48,250)
        </button>
        <button
          onClick={() => setTab("pending")}
          className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
            tab === "pending"
              ? "bg-[#0B2A4A] text-white shadow-sm"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <Clock size={12} className="text-amber-400" /> In-Transit (₹14,200)
        </button>
      </div>

      {/* Main Card */}
      <motion.div
        className="relative bg-white rounded-3xl p-5 border border-slate-200/90 shadow-2xl overflow-hidden min-h-[460px] flex flex-col justify-between"
        whileHover={{ y: -3, transition: { duration: 0.3 } }}
      >
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                <Building2 size={16} />
              </div>
              <div>
                <h4 className="font-display font-bold text-slate-900 text-sm">
                  Automated Bank Settlement
                </h4>
                <p className="text-[10px] text-slate-400">Direct Deposit • T+1 Cycle</p>
              </div>
            </div>
            <button
              onClick={handleRefresh}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              title="Refresh status"
            >
              <RefreshCw size={14} className={isRefreshing ? "animate-spin text-emerald-600" : ""} />
            </button>
          </div>

          {/* Primary Amount Card */}
          <div
            className={`p-4 rounded-2xl border text-white transition-all shadow-md ${
              tab === "settled"
                ? "bg-gradient-to-br from-[#0B2A4A] via-[#071D34] to-[#123761] border-emerald-500/20"
                : "bg-gradient-to-br from-amber-900 via-slate-900 to-slate-800 border-amber-500/20"
            }`}
          >
            <div className="flex items-center justify-between text-[11px] text-slate-300 mb-1">
              <span>{tab === "settled" ? "Total Payout Credited" : "Pending Next Clearance"}</span>
              <span
                className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                  tab === "settled"
                    ? "bg-emerald-500/20 text-emerald-300 border border-emerald-400/30"
                    : "bg-amber-500/20 text-amber-300 border border-amber-400/30"
                }`}
              >
                {tab === "settled" ? "T+1 Completed" : "Clears Tomorrow 06:00 AM"}
              </span>
            </div>

            <div className="text-2xl sm:text-3xl font-extrabold font-display tracking-tight text-white mb-2">
              {tab === "settled" ? "₹48,250.00" : "₹14,200.00"}
            </div>

            <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[10px] text-slate-300">
              <span className="flex items-center gap-1">
                <Building2 size={12} className="text-slate-400" /> HDFC Bank A/c •••• 4129
              </span>
              <span className="font-mono text-emerald-400 text-[9px]">
                {tab === "settled" ? "UTR: HDFC8940294" : "Reconciliation Ready"}
              </span>
            </div>
          </div>

          {/* Detailed Transaction Source Breakdown */}
          <div className="bg-slate-50 rounded-2xl p-3 border border-slate-200/80 space-y-2 text-xs">
            <p className="text-[10px] font-bold text-slate-700 uppercase tracking-wide">
              Settlement Breakdown
            </p>

            <div className="flex items-center justify-between text-slate-600 pb-1.5 border-b border-slate-200/60">
              <span>UPI QR Collections (31 sales)</span>
              <span className="font-bold text-slate-900">₹36,100.00</span>
            </div>
            <div className="flex items-center justify-between text-slate-600 pb-1.5 border-b border-slate-200/60">
              <span>Payment Links (7 sales)</span>
              <span className="font-bold text-slate-900">₹12,150.00</span>
            </div>
            <div className="flex items-center justify-between text-emerald-700 font-semibold pb-1.5 border-b border-slate-200/60">
              <span>Platform MDR Deduction</span>
              <span className="font-bold">₹0.00 (0% Fee)</span>
            </div>
            <div className="flex items-center justify-between font-bold text-slate-900 pt-0.5">
              <span>Net Bank Credit Amount</span>
              <span className="text-emerald-700 font-extrabold">
                {tab === "settled" ? "₹48,250.00" : "₹14,200.00"}
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-2">
            <button
              onClick={handleDownload}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-2 rounded-xl text-xs flex items-center justify-center gap-2 shadow-sm transition-all"
            >
              <Download size={13} />
              {downloadSuccess ? "Downloaded Advice PDF!" : "Download Settlement Advice (PDF)"}
            </button>
          </div>
        </div>

        {/* Footer Guarantee Strip */}
        <div className="mt-4 pt-2 flex items-center justify-around text-[9px] font-semibold text-slate-400 border-t border-slate-100">
          <span className="flex items-center gap-1">
            <ShieldCheck size={11} className="text-emerald-500" /> RBI Nodal Flow
          </span>
          <span className="flex items-center gap-1">
            <Clock size={11} className="text-orange-500" /> T+1 Daily Automated
          </span>
          <span className="flex items-center gap-1">
            <Receipt size={11} className="text-sky-500" /> 100% Tax Compliant
          </span>
        </div>
      </motion.div>
    </div>
  );
}
