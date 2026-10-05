import { useState } from "react";
import { Link, useParams, Navigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  ChevronDown,
  ChevronLeft,
  Check,
  Sparkles,
  ShieldCheck,
  Zap,
  Lock,
  Building2,
  CheckCircle2,
  Store,
} from "lucide-react";
import PublicNavbar from "../components/PublicNavbar";
import PublicFooter from "../components/PublicFooter";
import QRProductShowcase from "../components/product/QRProductShowcase";
import PaymentLinkShowcase from "../components/product/PaymentLinkShowcase";
import SettlementShowcase from "../components/product/SettlementShowcase";
import LoanShowcase from "../components/product/LoanShowcase";
import InsuranceShowcase from "../components/product/InsuranceShowcase";
import SoundboxShowcase from "../components/product/SoundboxShowcase";
import POSShowcase from "../components/product/POSShowcase";
import { PRODUCT_DETAILS } from "../data/productDetailContent";

const PRODUCT_TRUST_POINTS = {
  "qr-collection": [
    "0% MDR on UPI Transfers",
    "T+1 Direct Bank Deposit",
    "Real-time SoundBox Sync",
    "NPCI & RBI Compliant",
  ],
  "payment-links": [
    "1-Tap WhatsApp Share",
    "₹0 Setup & Maintenance",
    "Custom Link Expiration",
    "T+1 Bank Settlement",
  ],
  "settlement-tracking": [
    "T+1 Daily Automated",
    "Official Bank UTR Numbers",
    "₹0 Payout Transfer Fee",
    "RBI Compliant Nodal Flow",
  ],
  "business-loans": [
    "Up to ₹2,00,000 Limit",
    "Zero Collateral Required",
    "Disbursal in 24 Hours",
    "Daily Auto-Repay from Sales",
  ],
  insurance: [
    "IRDAI Regulated Partners",
    "Plans Starting ₹49/Month",
    "48-Hour Digital Claims",
    "100% Cashless Settlement",
  ],
  soundbox: [
    "100dB Crystal Loudspeaker",
    "Tamil & English Voice Alerts",
    "Dual SIM 4G + Wi-Fi Ready",
    "7-Day Battery Standby",
  ],
  "pos-devices": [
    "All Cards (Visa, RuPay, Tap)",
    "Built-in Thermal Printer",
    "4G LTE Always-Connected",
    "T+1 Unified Settlement",
  ],
};

export default function ProductDetail() {
  const { slug } = useParams();
  const [openFaq, setOpenFaq] = useState(null);

  const item = PRODUCT_DETAILS[slug];
  if (!item) return <Navigate to="/product" replace />;

  const relatedItems = (item.related || [])
    .map((s) => PRODUCT_DETAILS[s])
    .filter(Boolean);

  const renderShowcase = () => {
    switch (slug) {
      case "qr-collection":
        return <QRProductShowcase />;
      case "payment-links":
        return <PaymentLinkShowcase />;
      case "settlement-tracking":
        return <SettlementShowcase />;
      case "business-loans":
        return <LoanShowcase />;
      case "insurance":
        return <InsuranceShowcase />;
      case "soundbox":
        return <SoundboxShowcase />;
      case "pos-devices":
        return <POSShowcase />;
      default:
        return null;
    }
  };

  const showcaseComponent = renderShowcase();
  const trustPoints = PRODUCT_TRUST_POINTS[slug] || [
    "0% MDR on UPI Transfers",
    "T+1 Direct Bank Deposit",
    "Real-time SoundBox Sync",
    "NPCI & RBI Compliant",
  ];

  return (
    <div className="min-h-screen bg-white">
      <PublicNavbar />

      {/* Hero Section */}
      <section className="bg-soft relative overflow-hidden">
        <div className="grid-fade absolute inset-0" />

        <div className="relative z-10 max-w-6xl mx-auto px-6 pt-12 sm:pt-16 pb-12 sm:pb-20">
          <Link
            to="/product"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-green-600 hover:text-green-800 mb-6 group transition-colors"
          >
            <ChevronLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" /> Back to Products
          </Link>

          {showcaseComponent ? (
            /* Split 2-Column Hero for Interactive Showcase */
            <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] gap-10 lg:gap-12 items-center">
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
                <div className="inline-flex items-center gap-1.5 bg-green-50 text-green-700 text-[11px] font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-full mb-4">
                  <Sparkles size={12} className="text-orange-500" /> {item.category}
                </div>
                <h1 className="font-display font-extrabold text-3xl sm:text-4xl lg:text-[2.75rem] leading-[1.1] text-green-900 mb-4 tracking-tight">
                  {item.title}
                </h1>
                <p className="text-orange-600 font-bold text-base sm:text-lg mb-4">
                  {item.tagline}
                </p>
                <p className="text-green-600 text-sm sm:text-base leading-relaxed max-w-lg mb-8">
                  {item.heroDesc}
                </p>

                <div className="flex flex-wrap items-center gap-3.5 mb-8">
                  <Link
                    to="/register"
                    className="inline-flex items-center gap-2 bg-brand shadow-brand text-white text-sm font-bold px-6 py-3.5 rounded-xl hover:opacity-95 transition-opacity"
                  >
                    Start Collecting Now <ArrowRight size={16} />
                  </Link>
                  <a
                    href="#features"
                    className="inline-flex items-center gap-2 border-2 border-green-200 text-green-700 text-sm font-bold px-6 py-3.5 rounded-xl hover:bg-green-50 transition-colors"
                  >
                    Explore Features
                  </a>
                </div>

                {/* Trust Points */}
                <div className="grid grid-cols-2 gap-2.5 max-w-md pt-2 border-t border-green-100">
                  {trustPoints.map((tp, idx) => (
                    <span key={idx} className="flex items-center gap-1.5 text-xs font-semibold text-green-800">
                      <CheckCircle2 size={15} className="text-emerald-500 shrink-0" /> {tp}
                    </span>
                  ))}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.15 }}
                className="flex justify-center"
              >
                {showcaseComponent}
              </motion.div>
            </div>
          ) : (
            /* Centered Hero for Other Products */
            <div className="max-w-3xl mx-auto text-center">
              <div className="inline-flex items-center gap-1.5 bg-green-50 text-green-700 text-xs font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-full mb-4">
                {item.category}
              </div>
              <div className="w-16 h-16 rounded-2xl bg-green-50 text-green-700 flex items-center justify-center mx-auto mb-5 shadow-sm">
                <item.icon size={30} />
              </div>
              <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-green-900 mb-3 tracking-tight">
                {item.title}
              </h1>
              <p className="text-orange-600 font-bold text-base sm:text-lg mb-4">{item.tagline}</p>
              <p className="text-green-600 text-sm sm:text-base max-w-xl mx-auto leading-relaxed mb-8">
                {item.heroDesc}
              </p>
              <div className="flex items-center justify-center gap-3">
                <Link
                  to="/register"
                  className="inline-flex items-center gap-2 bg-brand shadow-brand text-white text-sm font-semibold px-6 py-3 rounded-xl hover:opacity-95 transition-opacity"
                >
                  Get Started <ArrowRight size={16} />
                </Link>
                <Link
                  to="/product"
                  className="inline-flex items-center gap-2 border border-green-200 text-green-700 text-sm font-semibold px-6 py-3 rounded-xl hover:bg-green-50 transition-colors"
                >
                  See all products
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Key Metrics Strip (If available) */}
      {item.stats && item.stats.length > 0 && (
        <section className="bg-brand relative overflow-hidden py-10">
          <div className="relative z-10 max-w-6xl mx-auto px-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
              {item.stats.map((st, i) => (
                <motion.div
                  key={st.label}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: i * 0.08 }}
                  className="p-3"
                >
                  <p className="font-display font-extrabold text-2xl sm:text-3xl text-white mb-1">
                    {st.value}
                  </p>
                  <p className="text-xs text-orange-200 font-medium">{st.label}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Deep-Dive Features Grid (If available) */}
      {item.features && item.features.length > 0 && (
        <section id="features" className="max-w-6xl mx-auto px-6 py-20 scroll-mt-20">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <p className="text-green-600 text-xs font-bold uppercase tracking-wider mb-2">
              Advanced Capabilities
            </p>
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-green-900">
              Engineered for seamless counter operations
            </h2>
            <p className="text-sm text-green-600 mt-3">
              Everything built into {item.title} to help you collect without failure or confusion.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {item.features.map((feat, i) => (
              <motion.div
                key={feat.title}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.3, delay: i * 0.06 }}
                className="card p-6 border border-slate-100 hover:border-orange-200 transition-all hover:shadow-lg flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center font-bold text-sm">
                      0{i + 1}
                    </span>
                    <span className="text-[10px] font-bold text-green-700 bg-green-50 px-2.5 py-1 rounded-full uppercase tracking-wide">
                      {feat.badge}
                    </span>
                  </div>
                  <h3 className="font-display font-bold text-green-900 text-base mb-2">
                    {feat.title}
                  </h3>
                  <p className="text-xs text-green-600 leading-relaxed">
                    {feat.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* Industry Use Cases Grid (If available) */}
      {item.useCases && item.useCases.length > 0 && (
        <section className="bg-slate-50 border-y border-slate-200/80 py-20">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center max-w-xl mx-auto mb-12">
              <p className="text-green-600 text-xs font-bold uppercase tracking-wider mb-2">
                Industry Solutions
              </p>
              <h2 className="font-display font-bold text-3xl text-green-900">
                Built for every counter in Tamil Nadu
              </h2>
              <p className="text-sm text-green-600 mt-2">
                Tailored for high-speed collections in your exact business setting.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {item.useCases.map((uc, i) => (
                <motion.div
                  key={uc.title}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: i * 0.08 }}
                  className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="w-10 h-10 rounded-xl bg-green-50 text-green-700 flex items-center justify-center mb-4">
                    <Store size={20} />
                  </div>
                  <span className="text-[9px] font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full uppercase tracking-wide">
                    {uc.badge}
                  </span>
                  <h3 className="font-display font-bold text-slate-900 text-sm mt-2 mb-1.5">
                    {uc.title}
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    {uc.desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Comparison Matrix (If available) */}
      {item.comparison && item.comparison.length > 0 && (
        <section className="max-w-6xl mx-auto px-6 py-20">
          <div className="text-center max-w-xl mx-auto mb-12">
            <p className="text-green-600 text-xs font-bold uppercase tracking-wider mb-2">
              The ThiruPay Difference
            </p>
            <h2 className="font-display font-bold text-3xl text-green-900">
              Why merchants choose ThiruPay
            </h2>
            <p className="text-sm text-green-600 mt-2">
              See how our digital collections outperform old POS card swipe machines and cash.
            </p>
          </div>

          <div className="card overflow-hidden border border-slate-200">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse min-w-[620px]">
                <thead>
                  <tr className="bg-green-50 border-b border-green-100">
                    <th className="text-left text-xs font-bold text-green-800 uppercase tracking-wide py-4 px-5 w-[25%]">
                      Feature / Metric
                    </th>
                    <th className="text-left text-xs font-bold text-slate-500 uppercase tracking-wide py-4 px-5">
                      Traditional POS Swiping
                    </th>
                    <th className="text-left text-xs font-bold text-slate-500 uppercase tracking-wide py-4 px-5">
                      Cash / Manual NEFT
                    </th>
                    <th className="text-left text-xs font-bold text-orange-600 uppercase tracking-wide py-4 px-5 bg-orange-50/50">
                      ThiruPay Solution
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {item.comparison.map((row) => (
                    <tr key={row.metric} className="border-t border-slate-100 hover:bg-slate-50/60 transition-colors">
                      <td className="py-3.5 px-5 text-xs font-bold text-green-900">
                        {row.metric}
                      </td>
                      <td className="py-3.5 px-5 text-xs text-slate-500">
                        {row.pos}
                      </td>
                      <td className="py-3.5 px-5 text-xs text-slate-500">
                        {row.cash}
                      </td>
                      <td className="py-3.5 px-5 text-xs font-bold text-green-900 bg-orange-50/30">
                        <span className="inline-flex items-center gap-1.5 text-emerald-700">
                          <Check size={14} className="text-emerald-500 shrink-0" /> {row.thirupay}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      )}

      {/* How it works (Step by Step) */}
      <section className="bg-white border-y border-green-100">
        <div className="max-w-6xl mx-auto px-6 py-20">
          <div className="text-center max-w-xl mx-auto mb-14">
            <p className="text-green-600 text-xs font-bold uppercase tracking-wide mb-2">How it works</p>
            <h2 className="font-display font-bold text-3xl text-green-900">Get set up in three simple steps</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 relative">
            {item.howItWorks.map((s, i) => (
              <motion.div
                key={s.title}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.3, delay: i * 0.1 }}
                className="text-center relative z-10"
              >
                <div className="w-14 h-14 rounded-2xl bg-brand text-white flex items-center justify-center mx-auto mb-4 font-display font-extrabold text-xl shadow-md">
                  {i + 1}
                </div>
                <h3 className="font-display font-bold text-green-900 text-base mb-1.5">{s.title}</h3>
                <p className="text-xs text-green-600 max-w-[240px] mx-auto leading-relaxed">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Security & Bank Grade Trust Strip */}
      <section className="bg-[#071D34] text-white py-14">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center max-w-xl mx-auto mb-10">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-orange-400 uppercase tracking-widest bg-white/10 px-3 py-1 rounded-full mb-3">
              <ShieldCheck size={14} /> Bank-Grade Security
            </span>
            <h2 className="font-display font-bold text-2xl sm:text-3xl text-white">
              Every rupee protected by bank-level encryption
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="bg-white/5 border border-white/10 p-5 rounded-2xl">
              <Lock size={22} className="text-orange-400 mx-auto mb-2" />
              <p className="font-bold text-sm text-white">256-Bit SSL</p>
              <p className="text-[11px] text-slate-400 mt-1">End-to-end encrypted payload</p>
            </div>
            <div className="bg-white/5 border border-white/10 p-5 rounded-2xl">
              <Building2 size={22} className="text-emerald-400 mx-auto mb-2" />
              <p className="font-bold text-sm text-white">NPCI Certified</p>
              <p className="text-[11px] text-slate-400 mt-1">Official UPI 2.0 network standards</p>
            </div>
            <div className="bg-white/5 border border-white/10 p-5 rounded-2xl">
              <ShieldCheck size={22} className="text-sky-400 mx-auto mb-2" />
              <p className="font-bold text-sm text-white">RBI Guidelines</p>
              <p className="text-[11px] text-slate-400 mt-1">Compliant nodal settlement flow</p>
            </div>
            <div className="bg-white/5 border border-white/10 p-5 rounded-2xl">
              <Zap size={22} className="text-amber-400 mx-auto mb-2" />
              <p className="font-bold text-sm text-white">99.98% Gateway Uptime</p>
              <p className="text-[11px] text-slate-400 mt-1">Zero downtime at peak billing hours</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Accordion */}
      {item.faqs?.length > 0 && (
        <section className="max-w-3xl mx-auto px-6 py-20">
          <div className="text-center mb-12">
            <p className="text-green-600 text-xs font-bold uppercase tracking-wider mb-2">FAQ</p>
            <h2 className="font-display font-bold text-3xl text-green-900">
              Frequently asked questions about {item.title}
            </h2>
          </div>
          <div className="space-y-3">
            {item.faqs.map((f, i) => (
              <div key={f.q} className="card overflow-hidden border border-slate-100">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left hover:bg-slate-50/50 transition-colors"
                >
                  <span className="text-sm font-bold text-green-900">{f.q}</span>
                  <ChevronDown
                    size={16}
                    className={`text-green-400 shrink-0 transition-transform ${openFaq === i ? "rotate-180" : ""}`}
                  />
                </button>
                <AnimatePresence>
                  {openFaq === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <p className="text-xs sm:text-sm text-green-600 leading-relaxed px-5 pb-4">
                        {f.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Related Products */}
      {relatedItems.length > 0 && (
        <section className="bg-slate-50 border-y border-slate-200/80">
          <div className="max-w-6xl mx-auto px-6 py-20">
            <div className="text-center max-w-xl mx-auto mb-12">
              <p className="text-green-600 text-xs font-bold uppercase tracking-wider mb-2">Ecosystem</p>
              <h2 className="font-display font-bold text-3xl text-green-900">Complete your merchant toolkit</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedItems.map((r) => (
                <Link
                  key={r.slug}
                  to={`/product/${r.slug}`}
                  className="card p-6 border border-slate-200/90 hover:border-orange-300 transition-all hover:shadow-md flex items-start gap-4"
                >
                  <div className="w-12 h-12 rounded-xl bg-green-50 text-green-700 flex items-center justify-center shrink-0">
                    <r.icon size={22} />
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-display font-bold text-green-900 text-sm mb-1">{r.title}</h4>
                    <p className="text-xs text-green-600 leading-relaxed line-clamp-2">{r.tagline}</p>
                  </div>
                  <ArrowRight size={16} className="text-orange-500 shrink-0 mt-1 ml-auto" />
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* High-Impact CTA */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="bg-brand shadow-brand rounded-3xl px-8 py-16 text-center relative overflow-hidden">
          <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-white/5 rounded-full blur-3xl" />
          <h2 className="font-display font-extrabold text-2xl sm:text-4xl text-white mb-3 relative z-10">
            Start accepting payments with {item.title} today
          </h2>
          <p className="text-orange-100 text-sm sm:text-base max-w-xl mx-auto mb-8 relative z-10">
            Get your merchant account verified in under 5 minutes with zero setup fees.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 relative z-10">
            <Link
              to="/register"
              className="inline-flex items-center gap-2 bg-white text-green-900 hover:bg-orange-50 font-bold px-7 py-3.5 rounded-xl text-sm shadow-lg transition-colors"
            >
              Register Merchant Account <ArrowRight size={16} />
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 border border-white/30 hover:bg-white/10 text-white font-bold px-7 py-3.5 rounded-xl text-sm transition-colors"
            >
              Talk to Sales
            </Link>
          </div>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}
