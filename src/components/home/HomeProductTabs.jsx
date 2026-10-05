import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  QrCode,
  Link2,
  Volume2,
  Wallet,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Zap,
  Building2,
  Smartphone,
  ShieldCheck,
} from "lucide-react";

export default function HomeProductTabs() {
  const [activeTab, setActiveTab] = useState("qr");

  const TABS = [
    {
      id: "qr",
      label: "Counter QR Standee",
      icon: QrCode,
      tag: "0% MDR on UPI",
      title: "One QR for every customer payment",
      desc: "Place an all-in-one high resolution acrylic QR standee at your counter. Accept instant payments from Google Pay, PhonePe, Paytm, BHIM, Cred, and 100+ UPI apps with zero transaction fees.",
      benefits: [
        "Permanent static counter QR — print once, use forever",
        "Supports dynamic bill-specific QR codes on screen",
        "Instant SoundBox audio announcement integration",
      ],
      link: "/product/qr-collection",
      linkText: "Explore QR Collection",
      preview: {
        type: "qr",
        badge: "Selvi Groceries",
        amount: "₹450.00",
        mode: "GPay • PhonePe • Paytm",
      },
    },
    {
      id: "links",
      label: "Payment Links",
      icon: Link2,
      tag: "WhatsApp & SMS",
      title: "Collect remotely before dispatching orders",
      desc: "Generate custom payment links in under 10 seconds and share directly over WhatsApp, SMS, or Instagram. Perfect for phone orders, catering, and home deliveries.",
      benefits: [
        "1-Tap WhatsApp share with pre-formatted invoice text",
        "Configurable link expiration (15m to 24h) avoids stock mismatch",
        "Automated digital tax receipts sent directly to customers",
      ],
      link: "/product/payment-links",
      linkText: "Explore Payment Links",
      preview: {
        type: "link",
        customer: "Karthik Raja",
        order: "2 Kanchipuram Sarees (#104)",
        amount: "₹1,850.00",
      },
    },
    {
      id: "soundbox",
      label: "Smart SoundBox",
      icon: Volume2,
      tag: "Tamil & English Alerts",
      title: "Hear every payment without touching your phone",
      desc: "A high-decibel 4G smart speaker that announces successful payments loudly in Tamil or English. Eliminates fake screenshot fraud and keeps your hands free during rush hours.",
      benefits: [
        "Bilingual crystal-clear voice announcements at 100dB",
        "Standalone 4G data SIM included — no phone pairing needed",
        "7-day heavy-duty battery standby with fast Type-C charging",
      ],
      link: "/product/soundbox",
      linkText: "Explore Smart SoundBox",
      preview: {
        type: "soundbox",
        tamilText: '"திருபே-ல் ₹500 பெறப்பட்டது"',
        englishText: '"₹500 received on ThiruPay"',
        amount: "₹500.00",
      },
    },
    {
      id: "settlements",
      label: "T+1 Bank Settlements",
      icon: Wallet,
      tag: "Direct Bank Deposit",
      title: "Daily morning bank payouts with zero deductions",
      desc: "All daily counter collections are reconciled automatically and deposited directly into your registered bank account every morning by 06:00 AM with official bank UTR tracking.",
      benefits: [
        "Predictable T+1 daily settlement schedule, 365 days a year",
        "Official Bank UTR number for every transaction on passbook",
        "1-click downloadable settlement advice PDF for GST & CA",
      ],
      link: "/product/settlement-tracking",
      linkText: "Explore Settlement Tracking",
      preview: {
        type: "settlement",
        bank: "HDFC Bank A/c •••• 4129",
        amount: "₹48,250.00",
        utr: "HDFCR5202609230489",
      },
    },
  ];

  const current = TABS.find((t) => t.id === activeTab) || TABS[0];

  return (
    <div className="w-full">
      {/* Tab Navigation Pill Bar */}
      <div className="flex flex-wrap items-center justify-center gap-2 p-1.5 bg-slate-100/80 backdrop-blur rounded-2xl max-w-3xl mx-auto mb-10 border border-slate-200/80">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`flex items-center gap-2 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeTab === id
                ? "bg-[#0B2A4A] text-white shadow-md shadow-[#0B2A4A]/20"
                : "text-slate-600 hover:text-slate-900 hover:bg-white/60"
            }`}
          >
            <Icon size={16} />
            <span>{label}</span>
          </button>
        ))}
      </div>

      {/* Tab Content Display Card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={current.id}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-3xl border border-slate-200/90 shadow-xl overflow-hidden p-6 sm:p-10 lg:p-12 grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] gap-8 lg:gap-12 items-center"
        >
          {/* Left Details */}
          <div>
            <div className="inline-flex items-center gap-1.5 bg-orange-50 text-orange-700 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-4 border border-orange-200">
              <Sparkles size={12} /> {current.tag}
            </div>
            <h3 className="font-display font-extrabold text-2xl sm:text-3xl text-slate-900 mb-3 leading-tight">
              {current.title}
            </h3>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed mb-6">
              {current.desc}
            </p>

            <div className="space-y-3 mb-8">
              {current.benefits.map((b, i) => (
                <div key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700 font-medium">
                  <CheckCircle2 size={16} className="text-emerald-500 shrink-0 mt-0.5" />
                  <span>{b}</span>
                </div>
              ))}
            </div>

            <Link
              to={current.link}
              className="inline-flex items-center gap-2 bg-[#0B2A4A] hover:bg-[#123761] text-white font-bold px-6 py-3 rounded-xl text-xs sm:text-sm shadow-md transition-all"
            >
              {current.linkText} <ArrowRight size={15} />
            </Link>
          </div>

          {/* Right Preview Card */}
          <div className="flex justify-center">
            {current.preview.type === "qr" && (
              <div className="w-full max-w-[340px] bg-slate-50 border border-slate-200 rounded-3xl p-6 shadow-md text-center">
                <div className="inline-block bg-[#0B2A4A] text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-2">
                  ThiruPay QR Standee
                </div>
                <h4 className="font-bold text-slate-900 text-sm mb-1">{current.preview.badge}</h4>
                <p className="text-[10px] text-slate-500 mb-4">UPI: selvi@thirupay</p>
                <div className="w-36 h-36 bg-white mx-auto rounded-2xl border border-slate-200 p-2.5 shadow-sm flex items-center justify-center relative">
                  <QrCode size={110} className="text-slate-900" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-7 h-7 rounded-full bg-[#0B2A4A] text-white text-[8px] font-bold flex items-center justify-center border-2 border-white shadow">
                      ₹
                    </div>
                  </div>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-200/80 flex items-center justify-center gap-2 text-[10px] font-bold text-slate-600">
                  <span>Google Pay</span> • <span>PhonePe</span> • <span>Paytm</span> • <span>BHIM</span>
                </div>
              </div>
            )}

            {current.preview.type === "link" && (
              <div className="w-full max-w-[340px] bg-white border border-emerald-200 rounded-3xl p-6 shadow-md space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs">
                      <Link2 size={15} />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900">Instant WhatsApp Link</p>
                      <p className="text-[10px] text-slate-400">Order: {current.preview.order}</p>
                    </div>
                  </div>
                  <span className="text-[9px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    Active
                  </span>
                </div>
                <div className="bg-[#E7F8E8] border border-emerald-200 rounded-2xl p-3 text-xs text-slate-800 space-y-2">
                  <p className="text-[11px] leading-relaxed">
                    Vanakkam <strong>{current.preview.customer}</strong>, please complete payment for your order:
                  </p>
                  <div className="bg-white p-2.5 rounded-xl border border-emerald-200 flex items-center justify-between">
                    <div>
                      <p className="text-[10px] text-slate-400">Total Amount:</p>
                      <p className="text-base font-extrabold text-[#0B2A4A]">{current.preview.amount}</p>
                    </div>
                    <span className="bg-emerald-600 text-white text-[10px] font-bold px-2.5 py-1 rounded-md">
                      Tap to Pay
                    </span>
                  </div>
                </div>
                <p className="text-center text-[10px] text-slate-400">
                  Works with GPay, PhonePe, Paytm, and all Cards.
                </p>
              </div>
            )}

            {current.preview.type === "soundbox" && (
              <div className="w-full max-w-[340px] bg-gradient-to-b from-orange-500 to-[#D94E00] rounded-3xl p-6 text-white shadow-xl border border-orange-400 text-center space-y-4">
                <div className="flex items-center justify-between text-[10px] text-orange-100">
                  <span className="font-bold tracking-wider uppercase">ThiruPay 4G SoundBox</span>
                  <span className="bg-black/20 px-2 py-0.5 rounded-full font-bold">4G LTE Active</span>
                </div>
                <div className="bg-black/60 rounded-2xl p-4 border border-orange-300/20">
                  <p className="text-[10px] text-orange-300 font-mono">LIVE ANNOUNCEMENT</p>
                  <p className="text-2xl font-extrabold text-emerald-400 font-display mt-0.5">
                    {current.preview.amount}
                  </p>
                  <p className="text-[10px] text-slate-300 mt-1 font-semibold">
                    {current.preview.tamilText}
                  </p>
                </div>
                <div className="flex gap-1 items-end justify-center h-6 pt-1">
                  {[6, 16, 10, 24, 14, 20, 8, 18, 12].map((h, i) => (
                    <motion.span
                      key={i}
                      className="w-1.5 rounded-full bg-amber-300"
                      animate={{ height: [h * 0.4, h * 1.1, h * 0.4] }}
                      transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.08 }}
                      style={{ height: h * 0.6 }}
                    />
                  ))}
                </div>
              </div>
            )}

            {current.preview.type === "settlement" && (
              <div className="w-full max-w-[340px] bg-gradient-to-br from-[#0B2A4A] via-[#071D34] to-[#123761] rounded-3xl p-6 text-white shadow-xl border border-white/10 space-y-4">
                <div className="flex items-center justify-between text-[11px] text-slate-300">
                  <span className="font-bold">T+1 Direct Payout</span>
                  <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-[9px] font-bold px-2 py-0.5 rounded-full">
                    Completed 06:15 AM
                  </span>
                </div>
                <div>
                  <p className="text-xs text-slate-300">Amount Credited:</p>
                  <p className="text-3xl font-extrabold font-display text-white mt-0.5">
                    {current.preview.amount}
                  </p>
                </div>
                <div className="bg-white/10 rounded-2xl p-3 space-y-1.5 text-xs border border-white/5">
                  <div className="flex justify-between text-slate-300">
                    <span>Deposited to:</span>
                    <span className="font-semibold text-white">{current.preview.bank}</span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>Platform Fee:</span>
                    <span className="font-bold text-emerald-400">₹0.00 (0% Fee)</span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>Bank UTR:</span>
                    <span className="font-mono text-orange-300 text-[10px]">{current.preview.utr}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
