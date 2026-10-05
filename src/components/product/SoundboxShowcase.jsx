import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Volume2,
  Radio,
  BatteryCharging,
  ShieldCheck,
  Play,
} from "lucide-react";

export default function SoundboxShowcase() {
  const [lang, setLang] = useState("ta"); // "ta" | "en"
  const [isPlaying, setIsPlaying] = useState(false);
  const [lastAmount, setLastAmount] = useState(500);

  const playVoiceAlert = (selectedLang, amount) => {
    setLang(selectedLang);
    setLastAmount(amount);
    setIsPlaying(true);
    setTimeout(() => {
      setIsPlaying(false);
    }, 2800);
  };

  return (
    <div className="relative mx-auto w-full max-w-[420px] lg:max-w-[440px]">
      {/* Background ambient lighting */}
      <div className="absolute inset-0 bg-gradient-to-tr from-orange-400/20 via-amber-400/15 to-transparent blur-3xl -z-10 pointer-events-none rounded-3xl" />

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
                <Volume2 size={16} />
              </div>
              <div>
                <h4 className="font-display font-bold text-slate-900 text-sm">
                  ThiruPay Smart 4G SoundBox
                </h4>
                <p className="text-[10px] text-slate-400">Instant Voice Audio Alert in Tamil &amp; English</p>
              </div>
            </div>
            <span className="text-[9px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              100dB Speaker
            </span>
          </div>

          {/* 3D Realistic SoundBox Device Visual */}
          <div className="relative rounded-2xl bg-gradient-to-b from-orange-500 via-orange-600 to-[#D94E00] p-4 text-white shadow-xl border border-orange-400">
            {/* Top Bar on Device */}
            <div className="flex items-center justify-between text-[10px] text-orange-100 pb-2 border-b border-orange-400/40">
              <span className="font-bold tracking-widest uppercase">ThiruPay Voice</span>
              <div className="flex items-center gap-2">
                <span className="flex items-center gap-0.5 font-bold">
                  <Radio size={10} className="animate-pulse text-emerald-300" /> 4G LTE
                </span>
                <span className="flex items-center gap-0.5">
                  <BatteryCharging size={11} className="text-emerald-300" /> 98%
                </span>
              </div>
            </div>

            {/* LED Display Screen on Device */}
            <div className="my-3 bg-black/70 rounded-xl p-3 border border-orange-400/30 text-center font-mono">
              <p className="text-[9px] text-orange-300 tracking-wider">PAYMENT RECEIVED</p>
              <div className="text-2xl font-extrabold text-emerald-400 tracking-tight mt-0.5 font-display">
                ₹{lastAmount}.00
              </div>
              <p className="text-[9px] text-slate-400 mt-0.5">UPI • Success</p>
            </div>

            {/* Speaker Mesh & Audio Equalizer */}
            <div className="bg-black/30 rounded-xl p-2.5 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Volume2 size={16} className={isPlaying ? "text-amber-300 animate-pulse" : "text-orange-200"} />
                <span className="text-[10px] font-semibold text-orange-100">
                  {isPlaying ? "Playing voice alert..." : "Ready at counter"}
                </span>
              </div>

              {/* Dynamic Sound Equalizer Wave */}
              <div className="flex gap-1 items-end h-5">
                {[6, 16, 10, 20, 14, 18, 8, 16, 12, 18].map((h, i) => (
                  <motion.span
                    key={i}
                    className={`w-1 rounded-full ${isPlaying ? "bg-amber-300" : "bg-orange-300/40"}`}
                    animate={
                      isPlaying
                        ? { height: [h * 0.3, h * 1.1, h * 0.4] }
                        : { height: 4 }
                    }
                    transition={{
                      duration: 0.5,
                      repeat: isPlaying ? Infinity : 0,
                      delay: i * 0.05,
                    }}
                    style={{ height: isPlaying ? h * 0.7 : 4 }}
                  />
                ))}
              </div>
            </div>

            {/* Live Voice Text Announcement Banner */}
            <AnimatePresence>
              {isPlaying && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="mt-3 bg-white text-slate-900 rounded-xl p-2 text-center shadow-lg"
                >
                  <p className="text-xs font-extrabold text-[#0B2A4A]">
                    {lang === "ta"
                      ? `"திருபே-ல் ₹${lastAmount} பெறப்பட்டது!"`
                      : `"₹${lastAmount} received on ThiruPay!"`}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Interactive Voice Test Buttons */}
          <div className="space-y-2">
            <p className="text-[11px] font-bold text-slate-700">
              Interactive Audio Simulation:
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => playVoiceAlert("ta", 500)}
                disabled={isPlaying}
                className="bg-[#0B2A4A] hover:bg-[#123761] text-white py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm transition-all disabled:opacity-50"
              >
                <Play size={12} className="fill-white" />
                Play Tamil (தமிழ்)
              </button>
              <button
                onClick={() => playVoiceAlert("en", 500)}
                disabled={isPlaying}
                className="bg-orange-500 hover:bg-orange-600 text-white py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm transition-all disabled:opacity-50"
              >
                <Play size={12} className="fill-white" />
                Play English Alert
              </button>
            </div>
            <div className="grid grid-cols-3 gap-1.5 pt-1 text-[10px] text-slate-600 font-semibold">
              <button
                onClick={() => playVoiceAlert(lang, 120)}
                className="bg-slate-50 hover:bg-slate-100 p-1.5 rounded-lg border border-slate-200 text-center"
              >
                Test ₹120 Alert
              </button>
              <button
                onClick={() => playVoiceAlert(lang, 850)}
                className="bg-slate-50 hover:bg-slate-100 p-1.5 rounded-lg border border-slate-200 text-center"
              >
                Test ₹850 Alert
              </button>
              <button
                onClick={() => playVoiceAlert(lang, 2400)}
                className="bg-slate-50 hover:bg-slate-100 p-1.5 rounded-lg border border-slate-200 text-center"
              >
                Test ₹2,400 Alert
              </button>
            </div>
          </div>
        </div>

        {/* Footer Guarantee Strip */}
        <div className="mt-4 pt-2 flex items-center justify-around text-[9px] font-semibold text-slate-400 border-t border-slate-100">
          <span className="flex items-center gap-1">
            <Radio size={11} className="text-orange-500" /> Dual SIM 4G + Wi-Fi
          </span>
          <span className="flex items-center gap-1">
            <BatteryCharging size={11} className="text-emerald-500" /> 7-Day Battery Standby
          </span>
          <span className="flex items-center gap-1">
            <ShieldCheck size={11} className="text-sky-500" /> Anti-Fraud Shield
          </span>
        </div>
      </motion.div>
    </div>
  );
}
