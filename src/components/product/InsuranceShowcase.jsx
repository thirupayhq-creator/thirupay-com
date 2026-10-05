import { useState } from "react";
import { motion } from "framer-motion";
import {
  ShieldPlus,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  Store,
  Smartphone,
  HeartPulse,
  Clock,
} from "lucide-react";

export default function InsuranceShowcase() {
  const [selectedPlan, setSelectedPlan] = useState("shop"); // "shop" | "device" | "health"
  const [requested, setRequested] = useState(false);

  const PLANS = {
    shop: {
      name: "Shop & Inventory Fire/Theft",
      icon: Store,
      coverage: "₹5,00,000",
      premium: "₹149",
      features: [
        "Fire, short circuit & lightning protection",
        "Burglary & counter cash theft cover",
        "Monsoon rainwater & flood stock damage",
      ],
      badge: "Most Popular",
    },
    device: {
      name: "SoundBox & POS Hardware Care",
      icon: Smartphone,
      coverage: "₹15,000",
      premium: "₹49",
      features: [
        "Accidental drops, counter spills & liquid damage",
        "Power surge & battery failure replacement",
        "Doorstep replacement within 48 hours",
      ],
      badge: "Essential",
    },
    health: {
      name: "Merchant Health & Hospital Cash",
      icon: HeartPulse,
      coverage: "₹2,000 / day",
      premium: "₹99",
      features: [
        "Daily cash benefit during hospital stay",
        "No loss of counter income during illness",
        "Covers merchant and immediate family",
      ],
      badge: "Family Shield",
    },
  };

  const current = PLANS[selectedPlan];

  return (
    <div className="relative mx-auto w-full max-w-[420px] lg:max-w-[440px]">
      {/* Background ambient lighting */}
      <div className="absolute inset-0 bg-gradient-to-tr from-sky-400/20 via-emerald-400/15 to-transparent blur-3xl -z-10 pointer-events-none rounded-3xl" />

      {/* Plan Selector Buttons */}
      <div className="grid grid-cols-3 gap-1.5 bg-white/90 backdrop-blur-md p-1.5 rounded-2xl border border-slate-200/90 shadow-sm mb-4">
        {[
          { id: "shop", label: "Shop Cover", icon: Store },
          { id: "device", label: "Device Care", icon: Smartphone },
          { id: "health", label: "Health Cash", icon: HeartPulse },
        ].map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => {
              setSelectedPlan(id);
              setRequested(false);
            }}
            className={`py-1.5 px-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 ${
              selectedPlan === id
                ? "bg-[#0B2A4A] text-white shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Icon size={12} /> {label}
          </button>
        ))}
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
              <div className="w-8 h-8 rounded-xl bg-sky-50 text-sky-700 flex items-center justify-center font-bold">
                <ShieldPlus size={16} />
              </div>
              <div>
                <h4 className="font-display font-bold text-slate-900 text-sm">
                  {current.name}
                </h4>
                <p className="text-[10px] text-slate-400">1-Tap Paperless Activation</p>
              </div>
            </div>
            <span className="text-[9px] font-bold text-orange-700 bg-orange-50 px-2 py-0.5 rounded-full border border-orange-200">
              {current.badge}
            </span>
          </div>

          {/* Pricing Banner */}
          <div className="bg-gradient-to-br from-[#0B2A4A] via-[#071D34] to-[#123761] text-white p-4 rounded-2xl shadow-md border border-white/10 space-y-1">
            <div className="flex items-center justify-between text-[11px] text-slate-300">
              <span>Maximum Sum Insured:</span>
              <span className="text-emerald-400 font-bold">100% Cashless</span>
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold font-display text-white">
              {current.coverage}
            </div>
            <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs">
              <span className="text-slate-300">Affordable Premium:</span>
              <span className="text-base font-bold text-orange-400">
                {current.premium}
                <span className="text-xs font-normal text-slate-300"> / month</span>
              </span>
            </div>
          </div>

          {/* Feature Bullets */}
          <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200/80 space-y-2">
            <p className="text-[10px] font-bold text-slate-700 uppercase tracking-wide">
              Key Policy Inclusions
            </p>
            <div className="space-y-1.5">
              {current.features.map((feat, i) => (
                <div key={i} className="flex items-center gap-2 text-xs text-slate-700">
                  <CheckCircle2 size={13} className="text-emerald-500 shrink-0" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Action Button */}
          {requested ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-emerald-50 border border-emerald-300 rounded-2xl p-3 text-center space-y-1"
            >
              <div className="flex items-center justify-center gap-1.5 text-emerald-800 font-bold text-xs">
                <CheckCircle2 size={16} className="text-emerald-600" /> Protection Request Sent!
              </div>
              <p className="text-[10px] text-emerald-700">
                Policy certificate will be issued to your merchant dashboard within 24 hours.
              </p>
            </motion.div>
          ) : (
            <button
              onClick={() => setRequested(true)}
              className="w-full bg-[#0B2A4A] hover:bg-[#123761] text-white font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 shadow-md transition-all"
            >
              <Sparkles size={13} className="text-orange-400" /> Request 1-Tap Policy Activation
            </button>
          )}
        </div>

        {/* Footer Guarantee Strip */}
        <div className="mt-4 pt-2 flex items-center justify-around text-[9px] font-semibold text-slate-400 border-t border-slate-100">
          <span className="flex items-center gap-1">
            <ShieldCheck size={11} className="text-emerald-500" /> IRDAI Approved
          </span>
          <span className="flex items-center gap-1">
            <Clock size={11} className="text-orange-500" /> 48h Claim SLA
          </span>
          <span className="flex items-center gap-1">
            <CheckCircle2 size={11} className="text-sky-500" /> Zero Paperwork
          </span>
        </div>
      </motion.div>
    </div>
  );
}
