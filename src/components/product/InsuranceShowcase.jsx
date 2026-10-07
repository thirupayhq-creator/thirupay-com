import { useState } from "react";
import { motion } from "framer-motion";
import {
  CheckCircle2,
  ShieldCheck,
  Store,
  Smartphone,
  HeartPulse,
  Clock,
} from "lucide-react";
import ProductEnquiryForm from "./ProductEnquiryForm";

const PLANS = {
  shop: { name: "Shop & Inventory Fire/Theft", badge: "Most Popular" },
  device: { name: "SoundBox & POS Hardware Care", badge: "Essential" },
  health: { name: "Merchant Health & Hospital Cash", badge: "Family Shield" },
};

export default function InsuranceShowcase() {
  const [selectedPlan, setSelectedPlan] = useState("shop"); // "shop" | "device" | "health"

  const current = PLANS[selectedPlan];

  return (
    <div className="relative mx-auto w-full max-w-[400px] lg:max-w-[420px]">
      {/* Background ambient lighting */}
      <div className="absolute inset-0 bg-gradient-to-tr from-sky-400/20 via-emerald-400/15 to-transparent blur-3xl -z-10 pointer-events-none rounded-3xl" />

      {/* Plan Selector Buttons */}
      <div className="grid grid-cols-3 gap-1.5 bg-white/90 backdrop-blur-md p-1.5 rounded-2xl border border-slate-200/90 shadow-sm mb-3">
        {[
          { id: "shop", label: "Shop Cover", icon: Store },
          { id: "device", label: "Device Care", icon: Smartphone },
          { id: "health", label: "Health Cash", icon: HeartPulse },
        ].map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setSelectedPlan(id)}
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
        className="relative bg-white rounded-3xl p-4 border border-slate-200/90 shadow-2xl overflow-hidden flex flex-col justify-between"
        whileHover={{ y: -3, transition: { duration: 0.3 } }}
      >
        <div className="space-y-3">
          {/* Header */}
          <div className="flex items-center justify-between gap-3 pb-2 border-b border-slate-100">
            <div className="flex items-center gap-3 min-w-0">
              {/* Full ThiruPay logo */}
              <img
                src="/brand/logo-full.png"
                alt="ThiruPay"
                className="h-8 w-auto object-contain shrink-0"
              />
              <div className="min-w-0">
                <h4 className="font-display font-bold text-slate-900 text-sm leading-tight">
                  {current.name}
                </h4>
                <p className="text-[10px] text-slate-400">Paperless Activation</p>
              </div>
            </div>
            <span className="shrink-0 whitespace-nowrap text-[9px] font-bold text-orange-700 bg-orange-50 px-2 py-0.5 rounded-full border border-orange-200">
              {current.badge}
            </span>
          </div>

          <ProductEnquiryForm
            key={selectedPlan}
            productName={`Insurance - ${current.name}`}
            extraLabel="Plan Interested In"
            extraOptions={Object.values(PLANS).map((p) => p.name)}
            defaultExtra={current.name}
          />
        </div>

        {/* Footer Guarantee Strip */}
        <div className="mt-3 pt-2 flex items-center justify-around text-[9px] font-semibold text-slate-400 border-t border-slate-100">
          <span className="flex items-center gap-1">
            <ShieldCheck size={11} className="text-emerald-500" /> Partner Insurers
          </span>
          <span className="flex items-center gap-1">
            <Clock size={11} className="text-orange-500" /> Quick Claim Support
          </span>
          <span className="flex items-center gap-1">
            <CheckCircle2 size={11} className="text-sky-500" /> Zero Paperwork
          </span>
        </div>
      </motion.div>
    </div>
  );
}