import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { QRCodeCanvas } from "qrcode.react";
import {
  CheckCircle2,
  Volume2,
  RefreshCw,
  Smartphone,
  BadgeCheck,
  MapPin,
  Copy,
  Check,
  Zap,
} from "lucide-react";

const UPI_ID = "selvi@thirupay";

const UPI_APPS = [
  { name: "GPay", short: "G", bg: "bg-white", text: "text-sky-600", logo: "/payment-logos/google-pay-logo.png" },
  { name: "PhonePe", short: "Pe", bg: "bg-white", text: "text-purple-700", logo: "/payment-logos/phonepe-logo.png" },
  { name: "Paytm", short: "Pt", bg: "bg-white", text: "text-sky-700", logo: "/payment-logos/paytm-logo.png" },
  { name: "BHIM", short: "B", bg: "bg-white", text: "text-emerald-700", logo: "/payment-logos/bhim-logo.png" },
];

export default function QRProductShowcase() {
  const [mode, setMode] = useState("static"); // "static" | "dynamic"
  const [amount, setAmount] = useState("450");
  const [simulating, setSimulating] = useState(false);
  const [paid, setPaid] = useState(false);
  const [copied, setCopied] = useState(false);

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

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(UPI_ID);
    } catch {
      // clipboard blocked (http / old browser) - still show feedback
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div className="relative mx-auto w-full max-w-[360px] lg:max-w-[380px]">
      {/* Ambient background glow */}
      <div className="absolute inset-0 bg-gradient-to-tr from-orange-400/20 via-sky-400/15 to-transparent blur-3xl -z-10 pointer-events-none rounded-3xl" />

      {/* Control Switcher Bar */}
      <div className="flex items-center justify-between bg-white/90 backdrop-blur-md p-1 rounded-xl border border-slate-200/90 shadow-sm mb-3">
        <button
          onClick={() => {
            setMode("static");
            setPaid(false);
          }}
          className={`flex-1 py-1.5 px-3 rounded-lg text-[11px] font-bold transition-all ${
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
          className={`flex-1 py-1.5 px-3 rounded-lg text-[11px] font-bold transition-all ${
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
            className="overflow-hidden mb-2"
          >
            <div className="bg-orange-50/90 border border-orange-200 rounded-xl p-2 flex items-center justify-between gap-2.5">
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

      {/* QR Standee */}
      <motion.div
        className="relative bg-white rounded-3xl border border-slate-200/90 shadow-2xl overflow-hidden"
        whileHover={{ y: -3, transition: { duration: 0.3 } }}
      >
        {/* Acrylic glass reflection */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-white/40 z-20" />

        <div className="relative z-10 px-4 pt-3 pb-3">
          {/* Header: logo + verified + merchant */}
          <div className="text-center pb-2 border-b border-slate-100">
            <img
              src="/brand/logo-full.png"
              alt="ThiruPay"
              className="h-7 w-auto mx-auto mb-1.5 object-contain"
            />
            <div className="inline-flex items-center gap-1 bg-emerald-500 text-white px-2 py-0.5 rounded-full text-[9px] font-bold tracking-wide uppercase shadow-sm mb-1.5">
              <BadgeCheck size={11} />
              Verified Merchant
            </div>
            <h3 className="font-display font-bold text-slate-900 text-sm leading-tight">
              Selvi Groceries &amp; Supermarket
            </h3>
            <p className="text-[10px] text-slate-500 mt-0.5 flex items-center justify-center gap-1">
              <MapPin size={10} className="text-orange-500" />
              Tiruvannamalai
            </p>
          </div>

          {/* QR box */}
          <div className="relative mt-3 flex flex-col items-center">
            <div className="relative bg-white p-2 rounded-xl shadow-md border border-slate-100">
              <QRCodeCanvas
                value={qrValue}
                size={136}
                level="H"
                fgColor="#0B2A4A"
                bgColor="#ffffff"
              />
              {/* Center ThiruPay logo badge */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-9 h-9 rounded-lg bg-white flex items-center justify-center shadow-md ring-[3px] ring-white">
                  <img
                    src="/brand/logo-icon.png"
                    alt="ThiruPay"
                    className="w-6 h-6 object-contain"
                  />
                </div>
              </div>
            </div>

            {/* QR type pill */}
            <span className="-mt-2 relative z-10 bg-sky-50 border border-sky-100 text-sky-700 text-[9px] font-bold tracking-wide uppercase px-2.5 py-0.5 rounded-full">
              {mode === "static" ? "Static UPI QR" : "Dynamic Bill QR"}
            </span>

            {/* Scan & Pay */}
            <h4 className="mt-1.5 font-display font-extrabold text-[#0B2A4A] text-base leading-tight">
              Scan &amp; Pay
            </h4>

            {mode === "static" ? (
              <p className="text-[10px] text-slate-500 text-center">
                Enter the amount in your UPI app
              </p>
            ) : (
              <div className="mt-0.5 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full text-emerald-800 text-[10px] font-bold flex items-center gap-1">
                <Zap size={10} className="text-emerald-600 fill-emerald-600" />
                Pay Exact Amount: ₹{amount || "0"}
              </div>
            )}
          </div>

          {/* UPI apps strip */}
          <div className="mt-2.5 flex items-start justify-center gap-2">
            {UPI_APPS.map((app) => (
              <div key={app.name} className="flex flex-col items-center gap-0.5 w-14">
                <div
                  className={`w-14 h-9 rounded-lg ${app.bg} shadow-sm border border-slate-100 flex items-center justify-center overflow-hidden px-1.5 py-1`}
                >
                  {app.logo ? (
                    <img
                      src={app.logo}
                      alt={app.name}
                      className="w-full h-full object-contain"
                      loading="lazy"
                    />
                  ) : (
                    <span className={`text-[10px] font-extrabold ${app.text}`}>
                      {app.short}
                    </span>
                  )}
                </div>
                <span className="text-[8.5px] font-medium text-slate-600 text-center leading-tight">
                  {app.name}
                </span>
              </div>
            ))}

            <div className="flex flex-col items-center gap-0.5 w-14">
              <div className="w-14 h-9 rounded-lg bg-sky-50 border border-sky-100 flex items-center justify-center">
                <span className="text-[10px] font-extrabold text-[#0B2A4A]">+150</span>
              </div>
              <span className="text-[8.5px] font-medium text-slate-600 text-center leading-tight">
                more
              </span>
            </div>
          </div>

          {/* UPI ID row (label + pill in one line) */}
          <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-center gap-2">
            <span className="text-[10px] text-slate-400 font-medium">UPI ID</span>
            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-2 bg-slate-100 hover:bg-slate-200 transition-colors rounded-full px-3 py-1"
              aria-label="Copy UPI ID"
            >
              <span className="font-semibold text-xs text-[#0B2A4A]">{UPI_ID}</span>
              {copied ? (
                <Check size={13} className="text-emerald-600" />
              ) : (
                <Copy size={13} className="text-sky-700" />
              )}
            </button>
          </div>
          {copied && (
            <p className="text-[9px] text-emerald-600 font-medium text-center mt-0.5">
              Copied!
            </p>
          )}
        </div>

        {/* Bottom navy bar */}
        <div className="relative z-10 bg-[#0B2A4A] px-4 py-2 flex items-center justify-between">
          <span className="text-[10px] font-medium text-white">
            Accept payments from 150+ UPI apps
          </span>
          <span className="text-white font-extrabold italic tracking-tight text-sm">
            UPI
          </span>
        </div>
      </motion.div>

      {/* Simulation Action Bar */}
      <div className="mt-2.5 flex items-center justify-between gap-3">
        <button
          onClick={handleSimulatePayment}
          disabled={simulating}
          className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold py-2 px-4 rounded-xl text-[11px] shadow-md shadow-orange-500/25 transition-all disabled:opacity-50"
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