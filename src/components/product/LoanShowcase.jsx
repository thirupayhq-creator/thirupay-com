import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Banknote,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  Zap,
  Clock,
  ArrowRight,
} from "lucide-react";

export default function LoanShowcase() {
  const [loanAmount, setLoanAmount] = useState(100000);
  const [tenureMonths, setTenureMonths] = useState(6);
  const [approved, setApproved] = useState(false);
  const [checking, setChecking] = useState(false);

  // Approximate merchant loan calculations (collection-linked daily deduction)
  const totalDays = tenureMonths * 30;
  const interestRate = tenureMonths === 3 ? 0.05 : tenureMonths === 6 ? 0.09 : 0.15;
  const totalRepayable = Math.round(loanAmount * (1 + interestRate));
  const dailyDeduction = Math.round(totalRepayable / totalDays);

  const handleCheckEligibility = () => {
    setChecking(true);
    setTimeout(() => {
      setChecking(false);
      setApproved(true);
    }, 1000);
  };

  return (
    <div className="relative mx-auto w-full max-w-[420px] lg:max-w-[440px]">
      {/* Ambient background glow */}
      <div className="absolute inset-0 bg-gradient-to-tr from-orange-400/20 via-emerald-400/15 to-transparent blur-3xl -z-10 pointer-events-none rounded-3xl" />

      {/* Main Container Card */}
      <motion.div
        className="relative bg-white rounded-3xl p-5 border border-slate-200/90 shadow-2xl overflow-hidden min-h-[460px] flex flex-col justify-between"
        whileHover={{ y: -3, transition: { duration: 0.3 } }}
      >
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center font-bold">
                <Banknote size={16} />
              </div>
              <div>
                <h4 className="font-display font-bold text-slate-900 text-sm">
                  Business Loan Calculator
                </h4>
                <p className="text-[10px] text-slate-400">Zero Collateral • Daily QR Auto-Repay</p>
              </div>
            </div>
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              ₹0 Processing Fee
            </span>
          </div>

          {/* Amount Slider */}
          <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-600">Loan Amount:</span>
              <span className="text-lg font-extrabold font-display text-green-900">
                ₹{loanAmount.toLocaleString("en-IN")}
              </span>
            </div>
            <input
              type="range"
              min="25000"
              max="200000"
              step="5000"
              value={loanAmount}
              onChange={(e) => {
                setLoanAmount(Number(e.target.value));
                setApproved(false);
              }}
              className="w-full accent-[#0B2A4A] cursor-pointer"
            />
            <div className="flex justify-between text-[9px] text-slate-400 font-medium">
              <span>₹25,000</span>
              <span>₹1,00,000</span>
              <span>₹2,00,000 (Max)</span>
            </div>
          </div>

          {/* Tenure Buttons */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1.5">
              Repayment Tenure:
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { months: 3, label: "3 Months (90 Days)" },
                { months: 6, label: "6 Months (180 Days)" },
                { months: 12, label: "12 Months (365 Days)" },
              ].map(({ months, label }) => (
                <button
                  key={months}
                  onClick={() => {
                    setTenureMonths(months);
                    setApproved(false);
                  }}
                  className={`py-1.5 px-2 rounded-xl text-xs font-bold border transition-all ${
                    tenureMonths === months
                      ? "bg-[#0B2A4A] text-white border-[#0B2A4A] shadow-sm"
                      : "bg-white text-slate-700 border-slate-200 hover:border-slate-300"
                  }`}
                >
                  {months} Mo
                </button>
              ))}
            </div>
          </div>

          {/* Daily Auto-Repayment Output Box */}
          <div className="bg-gradient-to-br from-[#0B2A4A] via-[#071D34] to-[#123761] text-white p-3.5 rounded-2xl shadow-md space-y-2 border border-white/10">
            <div className="flex items-center justify-between text-[10px] text-slate-300">
              <span>Daily Auto-Deduction from QR Sales:</span>
              <span className="text-emerald-400 font-bold flex items-center gap-1">
                <Zap size={10} /> Stress-Free
              </span>
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-extrabold font-display text-white">
                ₹{dailyDeduction}
                <span className="text-xs font-normal text-slate-300"> / day</span>
              </span>
              <span className="text-[11px] font-mono text-emerald-300">
                Total: ₹{totalRepayable.toLocaleString("en-IN")}
              </span>
            </div>
            <p className="text-[9px] text-slate-300 leading-tight">
              Automatically deducted from your daily QR settlement. No manual EMI cheque or bank bounce penalty!
            </p>
          </div>

          {/* Pre-Approved Status or Action Button */}
          {approved ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-emerald-50 border border-emerald-300 rounded-2xl p-3 text-center space-y-1"
            >
              <div className="flex items-center justify-center gap-1.5 text-emerald-800 font-bold text-xs">
                <CheckCircle2 size={16} className="text-emerald-600" /> Pre-Approval Confirmed!
              </div>
              <p className="text-[10px] text-emerald-700">
                Based on your counter sales, you are eligible for <strong>₹{loanAmount.toLocaleString("en-IN")}</strong>.
                Disbursal in 24 hours.
              </p>
            </motion.div>
          ) : (
            <button
              onClick={handleCheckEligibility}
              disabled={checking}
              className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 shadow-md shadow-orange-500/20 transition-all disabled:opacity-50"
            >
              {checking ? (
                "Verifying Daily QR Volume..."
              ) : (
                <>
                  <Sparkles size={13} /> Check Pre-Approved Loan Limit <ArrowRight size={13} />
                </>
              )}
            </button>
          )}
        </div>

        {/* Footer Guarantee Strip */}
        <div className="mt-4 pt-2 flex items-center justify-around text-[9px] font-semibold text-slate-400 border-t border-slate-100">
          <span className="flex items-center gap-1">
            <ShieldCheck size={11} className="text-emerald-500" /> Zero Collateral
          </span>
          <span className="flex items-center gap-1">
            <Clock size={11} className="text-orange-500" /> Disbursal in 24h
          </span>
          <span className="flex items-center gap-1">
            <Zap size={11} className="text-sky-500" /> Collection-Linked
          </span>
        </div>
      </motion.div>
    </div>
  );
}
