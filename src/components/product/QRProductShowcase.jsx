import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { QRCodeCanvas } from "qrcode.react";
import {
  CheckCircle2,
  Volume2,
  RefreshCw,
  Sparkles,
  Smartphone,
  ShieldCheck,
  Zap,
} from "lucide-react";

export default function QRProductShowcase() {
  const [mode, setMode] = useState("static"); // "static" | "dynamic"
  const [amount, setAmount] = useState("450");
  const [simulating, setSimulating] = useState(false);
  const [paid, setPaid] = useState(false);

  const qrValue =
    mode === "static"
      ? "upi://pay?pa=thirupay.selvi@hdfcbank&pn=Selvi%20Groceries&cu=INR"
      : `upi://pay?pa=thirupay.selvi@hdfcbank&pn=Selvi%20Groceries&am=${amount || 0}&cu=INR&tn=Invoice%20Bill`;

  const handleSimulatePayment = () => {
    setSimulating(true);
    setPaid(false);
    setTimeout(() => {
      setSimulating(false);
      setPaid(true);
      setTimeout(() => setPaid(false), 5000);
    }, 1200);
  };

  return (
    <div className="relative mx-auto w-full max-w-[420px] lg:max-w-[440px]">
      {/* Ambient background glow */}
      <div className="absolute inset-0 bg-gradient-to-tr from-orange-400/20 via-sky-400/15 to-transparent blur-3xl -z-10 pointer-events-none rounded-3xl" />

      {/* Control Switcher Bar */}
      <div className="flex items-center justify-between bg-white/90 backdrop-blur-md p-1.5 rounded-2xl border border-slate-200/90 shadow-sm mb-4">
        <button
          onClick={() => {
            setMode("static");
            setPaid(false);
          }}
          className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-bold transition-all ${
            mode === "static"
              ? "bg-[#0B2A4A] text-white shadow-sm"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          Static Counter QR
        </button>
        <button
          onClick={() => {
            setMode("dynamic");
            setPaid(false);
          }}
          className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-bold transition-all ${
            mode === "dynamic"
              ? "bg-[#0B2A4A] text-white shadow-sm"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          Dynamic Bill QR
        </button>
      </div>

      {/* Dynamic Amount Input (Only when Dynamic mode active) */}
      <AnimatePresence>
        {mode === "dynamic" && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden mb-3"
          >
            <div className="bg-orange-50/90 border border-orange-200 rounded-xl p-2.5 flex items-center justify-between gap-3">
              <span className="text-[11px] font-semibold text-orange-900 shrink-0">
                Bill Amount (₹):
              </span>
              <div className="relative flex-1">
                <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-500">
                  ₹
                </span>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Enter amount"
                  className="w-full pl-6 pr-3 py-1 bg-white border border-orange-200 rounded-lg text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
              <span className="text-[10px] text-orange-700 font-medium shrink-0">
                Live QR Sync
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Realistic Acrylic QR Standee Mockup */}
      <motion.div
        className="relative bg-white rounded-3xl p-5 border border-slate-200/90 shadow-2xl overflow-hidden"
        whileHover={{ y: -4, transition: { duration: 0.3 } }}
      >
        {/* Acrylic Top Glass Reflection */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-white/40 z-20" />

        {/* Standee Header */}
        <div className="text-center pb-4 border-b border-slate-100 relative z-10">
          <div className="inline-flex items-center gap-1.5 bg-[#0B2A4A] text-white px-3 py-1 rounded-full text-[10px] font-bold tracking-wide uppercase shadow-xs mb-2">
            <Sparkles size={11} className="text-orange-400" /> ThiruPay Merchant
          </div>
          <h3 className="font-display font-bold text-slate-900 text-sm sm:text-base leading-tight">
            Selvi Groceries &amp; Supermarket
          </h3>
          <p className="text-[10px] text-slate-500 mt-0.5">
            UPI ID: <span className="font-mono text-slate-700">selvi@thirupay</span> • Tiruvannamalai
          </p>
        </div>

        {/* QR Code Presentation Box */}
        <div className="relative my-4 flex flex-col items-center justify-center p-4 bg-slate-50/80 rounded-2xl border border-slate-100">
          {/* Scan Corner Markers */}
          <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-orange-500 rounded-tl" />
          <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-orange-500 rounded-tr" />
          <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-orange-500 rounded-bl" />
          <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-orange-500 rounded-br" />

          {/* QR Code Canvas */}
          <div className="bg-white p-2.5 rounded-xl shadow-md border border-slate-100 relative">
            <QRCodeCanvas
              value={qrValue}
              size={168}
              level="H"
              fgColor="#0B2A4A"
              bgColor="#ffffff"
            />
            {/* Center ThiruPay Logo Emblem */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-8 h-8 rounded-full bg-[#0B2A4A] border-2 border-white flex items-center justify-center text-white text-[9px] font-extrabold shadow-md">
                ₹
              </div>
            </div>
          </div>

          {/* Dynamic Amount Badge */}
          {mode === "dynamic" && (
            <div className="mt-3 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full text-emerald-800 text-[11px] font-bold flex items-center gap-1 shadow-xs">
              <Zap size={11} className="text-emerald-600 fill-emerald-600" />
              Pay Exact Amount: ₹{amount || "0"}
            </div>
          )}

          {mode === "static" && (
            <p className="mt-2.5 text-[10px] text-slate-500 font-medium">
              Scan &amp; Enter Any Amount
            </p>
          )}
        </div>

        {/* Accepted UPI Apps Strip */}
        <div className="pt-3 border-t border-slate-100 text-center relative z-10">
          <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
            Accepted with any UPI App (0% MDR)
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2 text-[10px] font-bold text-slate-700">
            <span className="bg-slate-100 hover:bg-slate-200 px-2 py-0.5 rounded-md transition-colors">
              Google Pay
            </span>
            <span className="bg-purple-50 text-purple-700 px-2 py-0.5 rounded-md">
              PhonePe
            </span>
            <span className="bg-sky-50 text-sky-700 px-2 py-0.5 rounded-md">
              Paytm
            </span>
            <span className="bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-md">
              BHIM UPI
            </span>
            <span className="bg-amber-50 text-amber-800 px-2 py-0.5 rounded-md">
              Cred UPI
            </span>
          </div>
        </div>

        {/* Acrylic Base Stand Illusion */}
        <div className="mt-4 pt-2 flex items-center justify-center gap-6 text-[9px] text-slate-400 border-t border-dashed border-slate-200">
          <span className="flex items-center gap-1">
            <ShieldCheck size={11} className="text-emerald-500" /> NPCI Certified
          </span>
          <span className="flex items-center gap-1">
            <Zap size={11} className="text-orange-500" /> Instant SoundBox Chime
          </span>
        </div>
      </motion.div>

      {/* Simulation Action Bar */}
      <div className="mt-3 flex items-center justify-between gap-3">
        <button
          onClick={handleSimulatePayment}
          disabled={simulating}
          className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold py-2.5 px-4 rounded-xl text-xs shadow-md shadow-orange-500/25 transition-all disabled:opacity-50"
        >
          {simulating ? (
            <>
              <RefreshCw size={13} className="animate-spin" />
              Scanning with UPI...
            </>
          ) : (
            <>
              <Smartphone size={13} />
              Simulate Customer Scan (₹{mode === "dynamic" ? amount || "0" : "500"})
            </>
          )}
        </button>
      </div>

      {/* Instant Payment Pop-Up Banner */}
      <AnimatePresence>
        {paid && (
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            className="absolute -bottom-16 left-2 right-2 bg-[#0B2A4A] text-white p-3 rounded-2xl shadow-2xl border border-emerald-400/40 z-40 flex items-center justify-between"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-md">
                <CheckCircle2 size={18} />
              </div>
              <div>
                <p className="text-xs font-bold leading-tight text-white">
                  Payment Received! +₹{mode === "dynamic" ? amount || "0" : "500"}.00
                </p>
                <div className="flex items-center gap-1.5 text-[10px] text-emerald-300 mt-0.5">
                  <Volume2 size={11} className="animate-pulse" />
                  <span>SoundBox: "₹{mode === "dynamic" ? amount || "0" : "500"} பெறப்பட்டது"</span>
                </div>
              </div>
            </div>
            <span className="text-[10px] font-bold bg-white/15 px-2 py-0.5 rounded-full text-slate-200">
              T+1 Settled
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
