import { motion } from "framer-motion";
import { CheckCircle2, CreditCard, Wifi } from "lucide-react";
import ProductEnquiryForm from "./ProductEnquiryForm";

const BANNER_POINTS = [
  "All Cards Accepted",
  "Contactless NFC Tap",
  "Built-in Printer",
  "T+1 Settlement",
];

const CARD_NETWORKS = ["Visa", "Mastercard", "RuPay", "Contactless NFC"];

export default function POSShowcase() {
  return (
    <div className="relative mx-auto w-full max-w-[400px] lg:max-w-[420px]">
      {/* Background ambient lighting */}
      <div className="absolute inset-0 bg-gradient-to-tr from-sky-400/20 via-orange-400/15 to-transparent blur-3xl -z-10 pointer-events-none rounded-3xl" />

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
                  Smart Android POS Terminal
                </h4>
                <p className="text-[10px] text-slate-500">
                  Tap, Chip, Swipe &amp; Built-In Printer
                </p>
              </div>
            </div>
            <span className="shrink-0 inline-flex items-center gap-1 text-[9px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              <Wifi size={10} /> 4G LTE + Wi-Fi
            </span>
          </div>

          {/* Product banner: full device visible, no crop */}
          <div className="flex items-stretch h-28 rounded-2xl overflow-hidden border border-slate-100 bg-gradient-to-br from-sky-50 via-white to-orange-50">
            <div className="w-24 shrink-0 bg-gradient-to-br from-slate-100 to-orange-100 flex items-center justify-center">
              <img
                src="/products/pos.png"
                alt="ThiruPay Smart Android POS Terminal"
                className="h-full w-full object-contain object-center"
                loading="lazy"
              />
            </div>

            <div className="flex-1 min-w-0 px-3 py-2 flex flex-col justify-center">
              <h5 className="font-display font-extrabold text-slate-900 text-sm leading-tight">
                One Terminal. Every Payment.
              </h5>

              <ul className="mt-2 grid grid-cols-2 gap-x-2 gap-y-1.5">
                {BANNER_POINTS.map((point) => (
                  <li
                    key={point}
                    className="flex items-center gap-1 text-[10px] font-medium text-slate-600"
                  >
                    <CheckCircle2
                      size={12}
                      className="text-emerald-500 shrink-0"
                    />
                    <span className="truncate">{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <ProductEnquiryForm
            productName="POS Device"
            extraLabel="Number of Devices Needed"
            extraOptions={["1", "2", "3 - 5", "6 or more"]}
          />
        </div>

        {/* Accepted Cards Ribbon */}
        <div className="mt-3 pt-2 border-t border-slate-100">
          <div className="flex items-center justify-center gap-1.5">
            {CARD_NETWORKS.map((name) => (
              <span
                key={name}
                className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-[9px] font-bold text-slate-600"
              >
                <CreditCard size={10} className="text-sky-500" /> {name}
              </span>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}