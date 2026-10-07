import { motion } from "framer-motion";
import { CheckCircle2, ShieldCheck, Signal, Truck, Headphones } from "lucide-react";
import ProductEnquiryForm from "./ProductEnquiryForm";

const BANNER_POINTS = [
  "Free Delivery",
  "4G SIM Included",
  "7 Days Battery",
  "QR Stand Included",
];

const FOOTER_POINTS = [
  { icon: ShieldCheck, label: "100% Secure", color: "text-sky-500" },
  { icon: Truck, label: "PAN India Delivery", color: "text-orange-500" },
  { icon: Headphones, label: "Dedicated Support", color: "text-emerald-500" },
];

export default function SoundboxShowcase() {
  return (
    <div className="relative mx-auto w-full max-w-[400px] lg:max-w-[420px]">
      {/* Background ambient lighting */}
      <div className="absolute inset-0 bg-gradient-to-tr from-orange-400/20 via-amber-400/15 to-transparent blur-3xl -z-10 pointer-events-none rounded-3xl" />

      {/* Main Container Card */}
      <motion.div
        className="relative bg-white rounded-3xl p-4 border border-slate-200/90 shadow-2xl overflow-hidden flex flex-col justify-between"
        whileHover={{ y: -3, transition: { duration: 0.3 } }}
      >
        <div className="space-y-3">
          {/* Header */}
          <div className="flex items-center justify-between gap-3 pb-2 border-b border-slate-100">
            <div className="flex items-center gap-3 min-w-0">
              <img
                src="/brand/logo-full.png"
                alt="ThiruPay"
                className="h-8 w-auto object-contain shrink-0"
              />
              <div className="min-w-0">
                <h4 className="font-display font-bold text-slate-900 text-sm leading-tight">
                  ThiruPay Smart 4G SoundBox
                </h4>
                <p className="text-[10px] text-slate-500">
                  Instant UPI Alerts in Tamil &amp; English
                </p>
              </div>
            </div>
            <span className="shrink-0 inline-flex items-center gap-1 text-[9px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              <Signal size={10} /> 4G Enabled
            </span>
          </div>

          {/* Product banner: compact, square tile */}
          <div className="flex items-stretch h-24 rounded-2xl overflow-hidden border border-slate-100 bg-gradient-to-br from-sky-50 via-white to-orange-50">
            <div className="w-24 shrink-0">
              <img
                src="/products/soundbox.png"
                alt="ThiruPay 4G Smart SoundBox"
                className="h-full w-full object-cover object-center"
                loading="lazy"
              />
            </div>

            <div className="flex-1 min-w-0 px-3 py-2 flex flex-col justify-center">
              <h5 className="font-display font-extrabold text-slate-900 text-sm leading-tight">
                Smart. Secure. Simple.
              </h5>

              <ul className="mt-1.5 grid grid-cols-2 gap-x-2 gap-y-1">
                {BANNER_POINTS.map((point) => (
                  <li
                    key={point}
                    className="flex items-center gap-1 text-[10px] font-medium text-slate-600"
                  >
                    <CheckCircle2 size={12} className="text-emerald-500 shrink-0" />
                    <span className="truncate">{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <ProductEnquiryForm
            productName="SoundBox"
            extraLabel="Number of Devices Needed"
            extraOptions={["1", "2", "3 - 5", "6 or more"]}
          />
        </div>

        {/* Footer Guarantee Strip */}
        <div className="mt-3 pt-2 grid grid-cols-3 text-[9px] font-semibold text-slate-500 border-t border-slate-100">
          {FOOTER_POINTS.map(({ icon: Icon, label, color }, i) => (
            <span
              key={label}
              className={`flex items-center justify-center gap-1 ${
                i !== 0 ? "border-l border-slate-100" : ""
              }`}
            >
              <Icon size={12} className={color} /> {label}
            </span>
          ))}
        </div>
      </motion.div>
    </div>
  );
}