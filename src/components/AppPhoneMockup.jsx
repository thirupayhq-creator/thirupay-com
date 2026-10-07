import { motion } from "framer-motion";
import { Bell, QrCode, Wallet, CheckCircle2, Wifi, BatteryFull } from "lucide-react";

export default function AppPhoneMockup() {
  return (
    <div className="relative mx-auto w-[300px] sm:w-[320px]">
      {/* soft glow behind phone */}
      <div className="absolute -inset-10 -z-10 rounded-full bg-gradient-to-br from-[#c2531b]/20 via-[#0b2a4a]/10 to-transparent blur-3xl" />

      {/* floating chip: top-left */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0, y: [0, -6, 0] }}
        transition={{ opacity: { delay: 0.6 }, x: { delay: 0.6 }, y: { duration: 4, repeat: Infinity, ease: "easeInOut" } }}
        className="absolute -left-10 top-24 z-20 hidden items-center gap-2 rounded-2xl bg-white px-3 py-2 shadow-xl ring-1 ring-slate-100 sm:flex"
      >
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
          <CheckCircle2 size={18} />
        </span>
        <div className="leading-tight">
          <p className="text-[11px] text-slate-500">Settlement</p>
          <p className="text-xs font-semibold text-[#0b2a4a]">Credited to bank</p>
        </div>
      </motion.div>

      {/* floating chip: bottom-right */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0, y: [0, 6, 0] }}
        transition={{ opacity: { delay: 0.8 }, x: { delay: 0.8 }, y: { duration: 5, repeat: Infinity, ease: "easeInOut" } }}
        className="absolute -right-8 bottom-24 z-20 hidden items-center gap-2 rounded-2xl bg-white px-3 py-2 shadow-xl ring-1 ring-slate-100 sm:flex"
      >
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-100 text-[#c2531b]">
          <Bell size={18} />
        </span>
        <div className="leading-tight">
          <p className="text-[11px] text-slate-500">Instant alert</p>
          <p className="text-xs font-semibold text-[#0b2a4a]">₹1,250 received</p>
        </div>
      </motion.div>

      {/* phone frame */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="relative rounded-[44px] bg-[#0b2a4a] p-[10px] shadow-[0_30px_80px_-20px_rgba(11,42,74,0.55)]"
      >
        {/* side buttons */}
        <span className="absolute -left-[3px] top-24 h-10 w-[3px] rounded-l bg-[#0b2a4a]" />
        <span className="absolute -right-[3px] top-32 h-16 w-[3px] rounded-r bg-[#0b2a4a]" />

        <div className="relative overflow-hidden rounded-[36px] bg-slate-50">
          {/* notch */}
          <div className="absolute left-1/2 top-2 z-10 h-5 w-24 -translate-x-1/2 rounded-full bg-[#0b2a4a]" />

          {/* status bar */}
          <div className="flex items-center justify-between px-6 pt-3 text-[10px] font-medium text-slate-600">
            <span>9:41</span>
            <span className="flex items-center gap-1">
              <Wifi size={11} />
              <BatteryFull size={13} />
            </span>
          </div>

          {/* header */}
          <div className="px-5 pb-3 pt-6">
            <p className="text-[11px] text-slate-500">Today's collection</p>
            <p className="text-3xl font-bold tracking-tight text-[#0b2a4a]">₹18,450</p>
            <p className="mt-0.5 text-[11px] font-medium text-emerald-600">▲ 12% vs yesterday</p>
          </div>

          {/* QR card */}
          <div className="mx-4 rounded-2xl bg-[#0b2a4a] p-4 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] text-white/70">Your shop QR</p>
                <p className="text-sm font-semibold">Tap to collect</p>
              </div>
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-white text-[#0b2a4a]">
                <QrCode size={30} />
              </span>
            </div>
          </div>

          {/* recent payments */}
          <div className="px-4 pb-4 pt-4">
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-slate-400">Recent</p>
            <div className="space-y-2">
              {[
                { name: "Ravi K", time: "2 min ago", amt: "+₹1,250" },
                { name: "Meena S", time: "14 min ago", amt: "+₹480" },
                { name: "Walk-in", time: "32 min ago", amt: "+₹2,100" },
              ].map((p, i) => (
                <motion.div
                  key={p.name}
                  initial={{ opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + i * 0.15 }}
                  className="flex items-center justify-between rounded-xl bg-white px-3 py-2 shadow-sm ring-1 ring-slate-100"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-50 text-[#c2531b]">
                      <Wallet size={15} />
                    </span>
                    <div className="leading-tight">
                      <p className="text-xs font-semibold text-[#0b2a4a]">{p.name}</p>
                      <p className="text-[10px] text-slate-400">{p.time}</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-emerald-600">{p.amt}</span>
                </motion.div>
              ))}
            </div>
          </div>

          {/* bottom bar */}
          <div className="mx-auto mb-2 h-1 w-24 rounded-full bg-slate-300" />
        </div>
      </motion.div>
    </div>
  );
}