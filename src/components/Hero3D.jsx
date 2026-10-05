import { motion } from "framer-motion";
import {
  QrCode,
  Link2,
  Wallet,
  Volume2,
  CheckCircle2,
  Bell,
  Wifi,
  TrendingUp,
  ShieldCheck,
  Building2,
  Check,
  Sparkles,
} from "lucide-react";

export default function Hero3D() {
  return (
    <div
      className="relative mx-auto flex items-center justify-center w-full max-w-[340px] sm:max-w-[380px] lg:max-w-[420px] py-2"
      style={{ perspective: "1200px", transformStyle: "preserve-3d" }}
    >
      {/* Background ambient lighting */}
      <div className="absolute inset-2 rounded-full bg-gradient-to-tr from-orange-400/20 via-sky-400/15 to-transparent blur-3xl -z-10 pointer-events-none" />
      <div className="absolute inset-0 rounded-full border border-dashed border-orange-300/30 animate-spin-slow -z-10 pointer-events-none" />

      {/* Flagship Realistic Smartphone Container */}
      <motion.div
        className="relative w-[230px] sm:w-[252px] lg:w-[268px] rounded-[38px] sm:rounded-[42px] bg-slate-900 p-2 sm:p-2.5 shadow-[0_20px_50px_-12px_rgba(11,42,74,0.35),0_0_0_1px_rgba(255,255,255,0.12)] ring-1 ring-slate-800"
        initial={{ opacity: 0, y: 25, rotateY: -8, rotateX: 4 }}
        animate={{ opacity: 1, y: 0, rotateY: -4, rotateX: 2 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        whileHover={{ rotateY: 0, rotateX: 0, scale: 1.02, transition: { duration: 0.3 } }}
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Hardware Side Buttons */}
        <div className="absolute -left-[7px] top-20 w-[2px] h-6 bg-slate-700 rounded-l" />
        <div className="absolute -left-[7px] top-28 w-[2px] h-9 bg-slate-700 rounded-l" />
        <div className="absolute -left-[7px] top-40 w-[2px] h-9 bg-slate-700 rounded-l" />
        <div className="absolute -right-[7px] top-24 w-[2px] h-12 bg-slate-700 rounded-r" />

        {/* Screen Display Bezel */}
        <div className="relative rounded-[32px] sm:rounded-[35px] overflow-hidden bg-[#F6F8FB] border border-slate-800/80 shadow-inner flex flex-col h-[460px] sm:h-[485px]">
          {/* Glass Glare Reflection Overlay */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-white/20 z-30" />

          {/* Dynamic Island / Status Bar Area */}
          <div className="relative z-20 bg-[#071D34] pt-1.5 px-3.5 pb-1 text-white">
            {/* Dynamic Island */}
            <div className="w-20 sm:w-22 h-4 bg-black rounded-full mx-auto flex items-center justify-between px-2 shadow-sm">
              <div className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[8px] font-medium tracking-tight text-white/90">UPI Live</span>
              </div>
              <div className="w-2 h-2 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center">
                <span className="w-0.5 h-0.5 rounded-full bg-blue-900/60" />
              </div>
            </div>

            {/* Status Icons Bar */}
            <div className="flex items-center justify-between text-[10px] font-semibold text-slate-300 mt-1 px-0.5">
              <span>9:41</span>
              <div className="flex items-center gap-1">
                <span className="text-[9px] tracking-tighter text-slate-400">5G</span>
                <Wifi size={11} className="text-slate-300" />
                <div className="w-4 h-2 border border-slate-400 rounded-sm p-0.5 flex items-center">
                  <div className="w-full h-full bg-emerald-400 rounded-[1px]" />
                </div>
              </div>
            </div>
          </div>

          {/* App Header (Merchant Shop Profile) */}
          <div className="bg-[#071D34] px-3 pb-2.5 pt-1 text-white border-b border-white/10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-orange-500 to-amber-400 flex items-center justify-center text-white font-bold text-[10px] shadow-sm">
                  S
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    <p className="text-[11px] font-bold leading-tight">Selvi Groceries</p>
                    <CheckCircle2 size={10} className="text-emerald-400 fill-emerald-400/20" />
                  </div>
                  <p className="text-[9px] text-slate-400 leading-tight">ID: TP-84920 • Active</p>
                </div>
              </div>
              <div className="relative w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-slate-300">
                <Bell size={11} />
                <span className="absolute top-1 right-1 w-1 h-1 bg-orange-500 rounded-full" />
              </div>
            </div>
          </div>

          {/* Main App Content Scroll Area */}
          <div className="flex-1 p-2.5 sm:p-3 space-y-2 overflow-y-auto no-scrollbar">
            {/* Primary Collection Card */}
            <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-[#0B2A4A] via-[#071D34] to-[#123761] p-2.5 text-white shadow-md border border-white/10">
              <div className="absolute -right-3 -bottom-3 w-16 h-16 bg-orange-500/15 rounded-full blur-lg pointer-events-none" />

              <div className="flex items-center justify-between mb-0.5">
                <span className="text-[10px] font-medium text-slate-300 flex items-center gap-1">
                  Today's Collection
                  <span className="w-1 h-1 rounded-full bg-emerald-400 animate-ping" />
                </span>
                <span className="inline-flex items-center gap-0.5 text-[9px] font-semibold text-emerald-400 bg-emerald-500/15 px-1 py-0.5 rounded-full">
                  <TrendingUp size={9} /> +18.4%
                </span>
              </div>

              <div className="text-xl sm:text-[22px] font-extrabold tracking-tight text-white mb-1.5 font-display">
                ₹48,250<span className="text-sm font-normal text-slate-300">.00</span>
              </div>

              <div className="pt-1.5 border-t border-white/10 flex items-center justify-between text-[9px] text-slate-300">
                <span>38 UPI Payments</span>
                <span className="text-orange-400 font-semibold flex items-center gap-0.5">
                  Auto T+1 active <Check size={9} />
                </span>
              </div>
            </div>

            {/* Quick Action Tiles */}
            <div className="grid grid-cols-4 gap-1.5">
              {[
                { icon: QrCode, label: "My QR", color: "bg-orange-50 text-orange-600 border-orange-200/80" },
                { icon: Link2, label: "Pay Link", color: "bg-blue-50 text-blue-700 border-blue-200/80" },
                { icon: Wallet, label: "Settle", color: "bg-emerald-50 text-emerald-700 border-emerald-200/80" },
                { icon: Volume2, label: "SoundBox", color: "bg-purple-50 text-purple-700 border-purple-200/80" },
              ].map(({ icon: Icon, label, color }) => (
                <div
                  key={label}
                  className={`flex flex-col items-center justify-center p-1.5 rounded-lg border ${color} shadow-sm text-center`}
                >
                  <Icon size={13} className="mb-0.5" />
                  <span className="text-[8px] font-semibold leading-tight">{label}</span>
                </div>
              ))}
            </div>

            {/* Simulated Live Payment Alert Banner */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.4 }}
              className="bg-white rounded-lg p-2 border border-emerald-200 shadow-sm flex items-center justify-between gap-1.5"
            >
              <div className="flex items-center gap-1.5 min-w-0">
                <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                  <CheckCircle2 size={12} />
                </div>
                <div className="min-w-0">
                  <p className="text-[9px] font-bold text-slate-900 leading-tight truncate">
                    UPI Received: +₹500.00
                  </p>
                  <p className="text-[8px] text-slate-500 leading-tight truncate">
                    Karthik R. • GPay UPI
                  </p>
                </div>
              </div>
              <span className="shrink-0 text-[8px] font-bold text-emerald-700 bg-emerald-50 px-1 py-0.5 rounded border border-emerald-200">
                Just now
              </span>
            </motion.div>

            {/* Recent Collections Feed */}
            <div className="bg-white rounded-xl p-2.5 border border-slate-200/80 shadow-sm space-y-1.5">
              <div className="flex items-center justify-between text-[10px] font-bold text-slate-800">
                <span>Recent Activity</span>
                <span className="text-[9px] font-semibold text-orange-600">Live</span>
              </div>

              <div className="space-y-1.5">
                {[
                  { name: "Ramesh Kumar", mode: "QR UPI", time: "3m ago", amount: "₹1,250" },
                  { name: "Kaveri Fabrics", mode: "Pay Link", time: "11m ago", amount: "₹3,400" },
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between text-[10px] pb-1 border-b border-slate-100 last:border-0 last:pb-0">
                    <div className="min-w-0">
                      <p className="font-semibold text-slate-800 text-[10px] leading-tight truncate">{item.name}</p>
                      <p className="text-[8px] text-slate-400 leading-tight">{item.mode} • {item.time}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="font-bold text-slate-900 text-[10px] leading-tight text-emerald-600">+{item.amount}</p>
                      <span className="text-[7px] font-medium text-slate-400">Success</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom App Navigation Bar */}
          <div className="bg-white border-t border-slate-200/90 px-2 py-1.5 flex items-center justify-around text-slate-400">
            <div className="flex flex-col items-center">
              <span className="w-1 h-1 rounded-full bg-orange-600 mb-0.5" />
              <span className="text-[8px] font-bold text-orange-600">Home</span>
            </div>
            <div className="flex flex-col items-center">
              <QrCode size={11} />
              <span className="text-[8px] font-medium text-slate-500 mt-0.5">QR Code</span>
            </div>
            <div className="flex flex-col items-center">
              <Wallet size={11} />
              <span className="text-[8px] font-medium text-slate-500 mt-0.5">Settle</span>
            </div>
            <div className="flex flex-col items-center">
              <Building2 size={11} />
              <span className="text-[8px] font-medium text-slate-500 mt-0.5">Bank</span>
            </div>
          </div>

          {/* Bottom Home Indicator Bar */}
          <div className="bg-white pb-1 pt-0.5 flex justify-center">
            <div className="w-20 h-0.5 bg-slate-300 rounded-full" />
          </div>
        </div>
      </motion.div>

      {/* Floating Widget 1: ThiruPay SoundBox Alert (Bottom Right) */}
      <motion.div
        className="hidden sm:block absolute -right-4 sm:-right-8 lg:-right-10 bottom-8 sm:bottom-12 w-36 sm:w-40 rounded-xl border border-orange-200 bg-white/95 backdrop-blur-md p-2.5 shadow-xl z-30"
        initial={{ opacity: 0, x: 20, y: 10 }}
        animate={{ opacity: 1, x: 0, y: 0 }}
        transition={{ duration: 0.7, delay: 0.3 }}
        whileHover={{ y: -3, scale: 1.03 }}
        style={{ transform: "perspective(800px) rotateY(-6deg)" }}
      >
        <div className="flex items-center gap-1.5 mb-1">
          <div className="w-5 h-5 rounded-md bg-orange-500 text-white flex items-center justify-center shadow-xs">
            <Volume2 size={11} />
          </div>
          <div>
            <p className="text-[9px] font-bold text-slate-900 leading-tight">ThiruPay SoundBox</p>
            <p className="text-[7px] text-orange-600 font-medium">Voice Alert</p>
          </div>
        </div>

        <div className="bg-orange-50/80 rounded-lg p-1.5 border border-orange-100">
          <p className="text-[9px] font-bold text-orange-950 leading-tight">
            "₹500 received"
          </p>
          <p className="text-[7px] text-orange-700">₹500 பெறப்பட்டது</p>

          {/* Live Audio Equalizer Wave */}
          <div className="mt-1 flex gap-0.5 items-end h-3">
            {[4, 10, 7, 14, 9, 12, 6].map((h, i) => (
              <motion.span
                key={i}
                className="w-0.5 rounded-full bg-orange-500"
                animate={{ height: [h * 0.3, h * 0.9, h * 0.3] }}
                transition={{ duration: 1.1, repeat: Infinity, delay: i * 0.08 }}
                style={{ height: h * 0.4 }}
              />
            ))}
          </div>
        </div>
      </motion.div>

      {/* Floating Widget 2: Bank Settlement Verification (Top Left) */}
      <motion.div
        className="hidden sm:block absolute -left-4 sm:-left-8 lg:-left-12 -top-2 sm:top-2 w-36 sm:w-40 rounded-xl border border-sky-100 bg-white/95 backdrop-blur-md p-2.5 shadow-xl z-30"
        initial={{ opacity: 0, x: -20, y: -10 }}
        animate={{ opacity: 1, x: 0, y: 0 }}
        transition={{ duration: 0.7, delay: 0.2 }}
        whileHover={{ y: -3, scale: 1.03 }}
        style={{ transform: "perspective(800px) rotateY(6deg)" }}
      >
        <div className="flex items-center gap-1.5">
          <div className="w-5 h-5 rounded-md bg-[#0B2A4A] text-white flex items-center justify-center shadow-xs">
            <ShieldCheck size={12} className="text-emerald-400" />
          </div>
          <div>
            <p className="text-[9px] font-bold text-slate-900 leading-tight">T+1 Auto Settle</p>
            <p className="text-[7px] text-emerald-600 font-semibold">Bank Verified</p>
          </div>
        </div>
        <div className="mt-1.5 pt-1 border-t border-slate-100 flex items-center justify-between">
          <div>
            <p className="text-[8px] text-slate-500 leading-none">HDFC Bank ••4129</p>
            <p className="text-[10px] font-bold text-slate-800 leading-tight mt-0.5">₹48,250</p>
          </div>
          <span className="text-[8px] font-bold text-emerald-600 bg-emerald-50 px-1 py-0.5 rounded border border-emerald-200">
            Settled
          </span>
        </div>
      </motion.div>

      {/* Floating Badge (Top Right) */}
      <motion.div
        className="absolute -top-3.5 right-1 sm:right-4 rounded-full border border-orange-200 bg-gradient-to-r from-orange-500 to-amber-500 px-2.5 py-0.5 text-[9px] font-bold text-white shadow-md flex items-center gap-1 z-30"
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <Sparkles size={10} /> Instant SoundBox &amp; QR
      </motion.div>
    </div>
  );
}