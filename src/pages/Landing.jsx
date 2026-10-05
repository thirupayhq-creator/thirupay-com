import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Star,
  CheckCircle2,
  XCircle,
  ShieldCheck,
  Lock,
  Building2,
  Zap,
  Banknote,
  Volume2,
  Smartphone,
  ShieldPlus,
} from "lucide-react";
import PublicNavbar from "../components/PublicNavbar";
import PublicFooter from "../components/PublicFooter";
import Hero3D from "../components/Hero3D";
import HomeProductTabs from "../components/home/HomeProductTabs";

const TRUST_POINTS = [
  "0% MDR on UPI Transfers",
  "T+1 Direct Bank Deposit",
  "Instant SoundBox Sync",
  "Tamil & English Support",
];

const ACCEPTED_APPS = [
  "Google Pay",
  "PhonePe",
  "Paytm",
  "BHIM UPI",
  "Cred UPI",
  "Amazon Pay",
  "WhatsApp Pay",
  "RuPay UPI",
  "Visa",
  "Mastercard",
];

const TAMIL_NADU_CITIES = [
  "Chennai",
  "Coimbatore",
  "Madurai",
  "Tiruchirappalli",
  "Salem",
  "Tirunelveli",
  "Tiruvannamalai",
  "Erode",
  "Vellore",
  "Thanjavur",
];

const MERCHANT_TESTIMONIALS = [
  {
    name: "Selvi R.",
    business: "Selvi Groceries & Provision",
    city: "Tiruvannamalai",
    quote:
      "The SoundBox voice alert has completely eliminated fake screenshot fraud during festival rush hours. Money lands in my HDFC account every single morning without fail.",
    rating: 5,
    tag: "Verified Supermarket",
  },
  {
    name: "Murugan K.",
    business: "Murugan Tea Stall & Snacks",
    city: "Madurai",
    quote:
      "No more coin change arguments for ₹10 tea and ₹15 vadai. Customers simply scan the counter QR, the speaker loudly announces '₹25 received in Tamil', and I keep serving.",
    rating: 5,
    tag: "Busy Tea Stall",
  },
  {
    name: "Anand Sundaram",
    business: "Kaveri Silks & Sarees",
    city: "Kanchipuram",
    quote:
      "We generate ThiruPay payment links and send them over WhatsApp for saree deliveries across Tamil Nadu. Customers pay via GPay in 10 seconds before dispatch.",
    rating: 5,
    tag: "Apparel Boutique",
  },
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-white text-slate-900 selection:bg-orange-500 selection:text-white">
      <PublicNavbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-soft border-b border-slate-100">
        <div className="grid-fade absolute inset-0" />

        <div className="relative z-10 max-w-6xl mx-auto px-6 pt-12 sm:pt-16 pb-12 sm:pb-16 grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] gap-8 lg:gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            {/* Live Status Pill */}
            <div className="inline-flex items-center gap-2 bg-green-50 border border-green-200/80 text-green-800 text-[11px] font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-full mb-6 shadow-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>ThiruPay 2.0 • Unified Merchant Platform</span>
            </div>

            <h1 className="font-display font-extrabold text-4xl sm:text-5xl lg:text-[3.25rem] leading-[1.08] text-green-950 mb-5 tracking-tight">
              Show a QR.
              <br />
              <span className="text-gradient">Get paid instantly.</span>
            </h1>

            <p className="text-green-700 text-base sm:text-lg leading-relaxed max-w-lg mb-8 font-medium">
              From busy retail counters to remote orders — collect payments via UPI, announce with SoundBox, and receive automated T+1 bank payouts with <strong>0% MDR</strong>.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3.5 mb-8">
              <Link
                to="/register"
                className="flex items-center gap-2 bg-brand shadow-brand hover:opacity-95 text-white font-bold px-7 py-3.5 rounded-xl text-sm transition-opacity"
              >
                Open Free Merchant Account <ArrowRight size={16} />
              </Link>
              <a
                href="#solutions"
                className="flex items-center gap-2 border-2 border-green-200 hover:bg-green-50 text-green-800 font-bold px-6 py-3.5 rounded-xl text-sm transition-colors"
              >
                Explore Live Demos
              </a>
            </div>

            {/* Trust points */}
            <div className="grid grid-cols-2 gap-2.5 max-w-md pt-3 border-t border-green-100">
              {TRUST_POINTS.map((p) => (
                <span key={p} className="inline-flex items-center gap-1.5 text-xs font-semibold text-green-800">
                  <CheckCircle2 size={15} className="text-emerald-500 shrink-0" /> {p}
                </span>
              ))}
            </div>
          </motion.div>

          {/* Right Hero: Realistic Phone Mockup */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.15 }}
            className="flex justify-center"
          >
            <Hero3D />
          </motion.div>
        </div>

        {/* Accepted Payment Apps & Partner Banks Marquee Bar */}
        <div className="relative z-10 bg-white/95 border-t border-slate-200/80 py-5">
          <div className="max-w-6xl mx-auto px-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Accepted with:
                </span>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-2 text-xs font-bold text-slate-700">
                {ACCEPTED_APPS.map((app) => (
                  <span
                    key={app}
                    className="bg-slate-50 hover:bg-slate-100 border border-slate-200 px-3 py-1 rounded-lg transition-colors shadow-xs"
                  >
                    {app}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* City Footprint Bar */}
        <div className="relative z-10 bg-slate-50 border-t border-slate-200/60 py-3">
          <div className="max-w-6xl mx-auto px-6 flex flex-wrap items-center gap-x-6 gap-y-2 justify-center sm:justify-between text-[11px] text-slate-600 font-medium">
            <span className="font-semibold text-slate-800 shrink-0">
              Active across counters in Tamil Nadu:
            </span>
            <div className="flex flex-wrap items-center gap-2">
              {TAMIL_NADU_CITIES.map((c) => (
                <span key={c} className="bg-white border border-slate-200 px-2.5 py-0.5 rounded-full text-slate-700">
                  {c}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Core Solutions Interactive Tabs */}
      <section id="solutions" className="max-w-6xl mx-auto px-6 py-20 scroll-mt-20">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <p className="text-orange-600 text-xs font-bold uppercase tracking-wider mb-2">
            Core Merchant Suite
          </p>
          <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-green-950">
            Everything your counter needs on one platform
          </h2>
          <p className="text-slate-600 text-sm sm:text-base mt-3">
            Switch between tools below to preview how ThiruPay powers payment collections from your counter to your bank.
          </p>
        </div>

        <HomeProductTabs />
      </section>

      {/* Numbers That Matter (Fintech Statistics) */}
      <section className="bg-brand relative overflow-hidden py-14 shadow-xl">
        <div className="absolute -bottom-24 -left-16 w-80 h-80 bg-white/5 rounded-full blur-3xl" />
        <div className="relative z-10 max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3 }}
              className="p-3"
            >
              <p className="font-display font-extrabold text-3xl sm:text-4xl text-white">0% MDR</p>
              <p className="text-xs sm:text-sm text-orange-200 font-semibold mt-1">Zero fee on UPI transfers</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: 0.08 }}
              className="p-3"
            >
              <p className="font-display font-extrabold text-3xl sm:text-4xl text-white">T+1 Daily</p>
              <p className="text-xs sm:text-sm text-orange-200 font-semibold mt-1">Direct deposit to bank</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: 0.16 }}
              className="p-3"
            >
              <p className="font-display font-extrabold text-3xl sm:text-4xl text-white">100+ Apps</p>
              <p className="text-xs sm:text-sm text-orange-200 font-semibold mt-1">GPay, PhonePe, Paytm &amp; BHIM</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: 0.24 }}
              className="p-3"
            >
              <p className="font-display font-extrabold text-3xl sm:text-4xl text-white">&lt; 5 Mins</p>
              <p className="text-xs sm:text-sm text-orange-200 font-semibold mt-1">100% digital KYC onboarding</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* The Counter Revolution: Old Way vs ThiruPay Way */}
      <section className="bg-slate-50 border-y border-slate-200/80 py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center max-w-xl mx-auto mb-14">
            <p className="text-orange-600 text-xs font-bold uppercase tracking-wider mb-2">
              The Counter Revolution
            </p>
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-green-950">
              Why 10,000+ merchants switched to ThiruPay
            </h2>
            <p className="text-sm text-slate-600 mt-2">
              A transparent look at how modern retail counters operate compared to the past.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* The Old Way */}
            <div className="bg-white rounded-3xl p-7 border border-red-200/80 shadow-sm relative overflow-hidden">
              <div className="flex items-center gap-2.5 mb-6 text-red-600 font-bold text-sm uppercase tracking-wider">
                <XCircle size={18} /> The Old Counter Way
              </div>
              <div className="space-y-4 text-xs sm:text-sm text-slate-600">
                <div className="flex items-start gap-2.5">
                  <XCircle size={15} className="text-red-500 shrink-0 mt-0.5" />
                  <span>Checking personal phone screen every 2 minutes, disrupting customer billing.</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <XCircle size={15} className="text-red-500 shrink-0 mt-0.5" />
                  <span>Falling victim to fake UPI payment screenshot apps during busy rush hours.</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <XCircle size={15} className="text-red-500 shrink-0 mt-0.5" />
                  <span>Paying 1.5% to 2.5% MDR fees on traditional card swiping machines.</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <XCircle size={15} className="text-red-500 shrink-0 mt-0.5" />
                  <span>Visiting bank branches with bulky cash to deposit daily counter collections.</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <XCircle size={15} className="text-red-500 shrink-0 mt-0.5" />
                  <span>Struggling to secure bank business loans due to lack of audited balance sheets.</span>
                </div>
              </div>
            </div>

            {/* The ThiruPay Way */}
            <div className="bg-white rounded-3xl p-7 border-2 border-emerald-500 shadow-xl relative overflow-hidden">
              <div className="flex items-center gap-2.5 mb-6 text-emerald-700 font-bold text-sm uppercase tracking-wider">
                <CheckCircle2 size={18} className="text-emerald-500" /> The Modern ThiruPay Way
              </div>
              <div className="space-y-4 text-xs sm:text-sm text-slate-700 font-medium">
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 size={15} className="text-emerald-500 shrink-0 mt-0.5" />
                  <span>Loud 100dB SoundBox voice announcement in Tamil &amp; English keeps hands free.</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 size={15} className="text-emerald-500 shrink-0 mt-0.5" />
                  <span>100% Anti-Fraud: Voice alerts only trigger after confirmed bank nodal credit.</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 size={15} className="text-emerald-500 shrink-0 mt-0.5" />
                  <span>0% MDR on UPI payments — save thousands of rupees in bank swipe fees every month.</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 size={15} className="text-emerald-500 shrink-0 mt-0.5" />
                  <span>Automated T+1 morning bank transfer with official Bank UTR reconciliation.</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 size={15} className="text-emerald-500 shrink-0 mt-0.5" />
                  <span>Pre-approved business micro-loans up to ₹2 Lakhs based on your daily QR sales.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Beyond Payments: Growth Ecosystem Suite */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="text-center max-w-xl mx-auto mb-14">
          <p className="text-orange-600 text-xs font-bold uppercase tracking-wider mb-2">
            Growth Ecosystem
          </p>
          <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-green-950">
            Grow your business with ThiruPay services
          </h2>
          <p className="text-sm text-slate-600 mt-2">
            Expand with loans, audio devices, card terminals, and shop protection — all requestable from your merchant dashboard.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              icon: Banknote,
              title: "Business Loans",
              tag: "Up to ₹2,00,000",
              desc: "Collateral-free working capital. Repay smoothly via micro-daily deductions from QR sales.",
              link: "/product/business-loans",
              color: "text-emerald-600 bg-emerald-50 border-emerald-200",
            },
            {
              icon: Volume2,
              title: "4G Smart SoundBox",
              tag: "Tamil & English Alerts",
              desc: "Crystal-clear 100dB voice payment confirmations with standalone 4G SIM & 7-day battery.",
              link: "/product/soundbox",
              color: "text-orange-600 bg-orange-50 border-orange-200",
            },
            {
              icon: Smartphone,
              title: "Smart Android POS",
              tag: "Tap, Chip & Print",
              desc: "Accept all cards (Visa/RuPay) with high-speed built-in thermal bill receipt printer.",
              link: "/product/pos-devices",
              color: "text-blue-600 bg-blue-50 border-blue-200",
            },
            {
              icon: ShieldPlus,
              title: "Counter Insurance",
              tag: "From ₹49 / Month",
              desc: "Protect your shop inventory, SoundBox hardware, and family health in 1-tap.",
              link: "/product/insurance",
              color: "text-purple-600 bg-purple-50 border-purple-200",
            },
          ].map((srv, idx) => (
            <Link
              key={idx}
              to={srv.link}
              className="card p-6 border border-slate-200 hover:border-orange-300 transition-all hover:shadow-lg flex flex-col justify-between group"
            >
              <div>
                <div className={`w-12 h-12 rounded-2xl ${srv.color} border flex items-center justify-center mb-4`}>
                  <srv.icon size={22} />
                </div>
                <span className="text-[10px] font-bold text-orange-700 bg-orange-50 px-2 py-0.5 rounded-full border border-orange-200">
                  {srv.tag}
                </span>
                <h3 className="font-display font-bold text-slate-900 text-base mt-2 mb-2">
                  {srv.title}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {srv.desc}
                </p>
              </div>
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-green-900 group-hover:text-orange-600 transition-colors mt-4">
                <span>Learn more</span>
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Verified Merchant Stories */}
      <section className="bg-slate-50 border-y border-slate-200/80 py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center max-w-xl mx-auto mb-14">
            <p className="text-orange-600 text-xs font-bold uppercase tracking-wider mb-2">
              Merchant Stories
            </p>
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-green-950">
              Trusted by counters across Tamil Nadu
            </h2>
            <p className="text-sm text-slate-600 mt-2">
              Hear directly from retail owners who run their daily sales on ThiruPay.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {MERCHANT_TESTIMONIALS.map((t, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: idx * 0.1 }}
                className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex gap-0.5">
                      {Array.from({ length: 5 }).map((_, j) => (
                        <Star key={j} size={14} className="fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      {t.tag}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed italic mb-6">
                    "{t.quote}"
                  </p>
                </div>

                <div className="flex items-center gap-3 pt-3 border-t border-slate-100">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-orange-500 to-amber-400 text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-sm">
                    {t.name[0]}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-slate-900 truncate">{t.name}</p>
                    <p className="text-[11px] text-slate-500 truncate">
                      {t.business} • {t.city}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Bank-Grade Security & RBI Compliance */}
      <section className="bg-[#071D34] text-white py-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center max-w-xl mx-auto mb-12">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-orange-400 uppercase tracking-widest bg-white/10 px-3.5 py-1.5 rounded-full mb-3">
              <ShieldCheck size={14} /> Bank-Grade Security Architecture
            </span>
            <h2 className="font-display font-bold text-2xl sm:text-3xl text-white">
              Every single rupee protected by banking security
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

      {/* High-Impact Closing CTA Banner */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="bg-brand shadow-brand rounded-3xl px-8 py-16 text-center relative overflow-hidden">
          <div className="absolute -bottom-24 -right-24 w-80 h-80 bg-white/5 rounded-full blur-3xl" />
          <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-white mb-3 relative z-10">
            Ready to upgrade your counter to ThiruPay?
          </h2>
          <p className="text-orange-100 text-sm sm:text-base max-w-xl mx-auto mb-8 relative z-10">
            Open your verified merchant account in under 5 minutes with zero paperwork and zero setup fees.
          </p>
          <div className="relative z-10 flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/register"
              className="inline-flex items-center gap-2 bg-white text-green-950 hover:bg-orange-50 font-bold px-7 py-3.5 rounded-xl text-sm shadow-lg transition-colors"
            >
              Get Started Free <ArrowRight size={16} />
            </Link>
            <Link
              to="/download"
              className="inline-flex items-center gap-2 border border-white/30 hover:bg-white/10 text-white font-bold px-7 py-3.5 rounded-xl text-sm transition-colors"
            >
              Get the Mobile App
            </Link>
          </div>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}
