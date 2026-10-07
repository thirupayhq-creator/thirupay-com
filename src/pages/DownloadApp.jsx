import { motion } from "framer-motion";
import { Bell, Zap, WifiOff, Fingerprint, Apple, Play } from "lucide-react";
import PublicNavbar from "../components/PublicNavbar";
import PublicFooter from "../components/PublicFooter";
import AppPhoneMockup from "../components/AppPhoneMockup";

const APP_HIGHLIGHTS = [
  { icon: Bell, title: "Instant alerts", desc: "A sound and notification the moment a payment lands, even with the screen off." },
  { icon: Zap, title: "Faster QR access", desc: "Your static QR is one tap away from the home screen — no login delay at the counter." },
  { icon: WifiOff, title: "Works on patchy networks", desc: "Built for real shop-floor conditions, not just office Wi-Fi." },
  { icon: Fingerprint, title: "App lock", desc: "PIN or fingerprint lock keeps your collections private, even if a customer picks up the phone." },
];

export default function DownloadApp() {
  return (
    <div className="min-h-screen bg-white">
      <PublicNavbar />

      {/* Hero */}
      <section className="bg-soft relative overflow-hidden">
        <div className="grid-fade absolute inset-0" />
        <div className="relative z-10 max-w-6xl mx-auto px-6 pt-20 pb-16 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            <p className="inline-block bg-green-50 text-green-700 text-xs font-semibold uppercase tracking-wide mb-4 px-3 py-1.5 rounded-full">Get the app</p>
            <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-green-900 mb-5 tracking-tight leading-tight">
              Run your counter <span className="text-gradient">from your pocket</span>
            </h1>
            <p className="text-green-600 text-sm sm:text-base leading-relaxed mb-8 max-w-md">
              The ThiruPay app puts QR collection, instant alerts, and settlement tracking on your phone — built for the shop floor, not the office.
            </p>

            <div className="flex flex-wrap gap-3">
              <button
                disabled
                className="flex items-center gap-2.5 bg-white text-green-400 px-5 py-3 rounded-xl text-sm cursor-not-allowed border-2 border-green-100"
                title="Coming soon"
              >
                <Apple size={20} />
                <span className="text-left leading-tight">
                  <span className="block text-[10px] text-green-400">Coming soon on</span>
                  <span className="block font-semibold">App Store</span>
                </span>
              </button>
              <button
                disabled
                className="flex items-center gap-2.5 bg-white text-green-400 px-5 py-3 rounded-xl text-sm cursor-not-allowed border-2 border-green-100"
                title="Coming soon"
              >
                <Play size={18} />
                <span className="text-left leading-tight">
                  <span className="block text-[10px] text-green-400">Coming soon on</span>
                  <span className="block font-semibold">Google Play</span>
                </span>
              </button>
            </div>
            <p className="text-green-600 text-xs mt-4">The app is in final testing — meanwhile, the web dashboard works great on mobile browsers too.</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.15 }}
            className="flex justify-center lg:justify-end lg:pr-8"
          >
            <AppPhoneMockup />
          </motion.div>
        </div>
      </section>

      {/* Highlights */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <p className="text-green-600 text-xs font-semibold uppercase tracking-wide mb-2">Why the app</p>
        <h2 className="font-display font-bold text-3xl text-green-700 mb-10">Built for the counter, not the office</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {APP_HIGHLIGHTS.map((h, i) => (
            <motion.div
              key={h.title}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.3, delay: i * 0.08 }}
            >
              <div className="w-10 h-10 rounded-lg bg-green-50 text-green-700 flex items-center justify-center mb-3">
                <h.icon size={18} />
              </div>
              <p className="font-semibold text-green-700 text-sm mb-1">{h.title}</p>
              <p className="text-xs text-green-600 leading-relaxed">{h.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}