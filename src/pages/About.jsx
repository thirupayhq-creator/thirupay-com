import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, MapPin } from "lucide-react";
import PublicNavbar from "../components/PublicNavbar";
import PublicFooter from "../components/PublicFooter";
import { STATS, CITIES, TRUST_BADGES } from "../data/landingContent";

export default function About() {
  return (
    <div className="min-h-screen bg-white">
      <PublicNavbar />

      {/* Header */}
      <section className="bg-soft relative overflow-hidden">
        <div className="grid-fade absolute inset-0" />
        <div className="relative z-10 max-w-3xl mx-auto px-6 pt-20 pb-16 text-center">
          <p className="inline-block bg-green-50 text-green-700 text-xs font-semibold uppercase tracking-wide mb-4 px-3 py-1.5 rounded-full">About us</p>
          <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-green-900 mb-4 tracking-tight">
            Built for <span className="text-gradient">Tamil Nadu's small businesses</span>
          </h1>
          <p className="text-green-600 text-sm sm:text-base leading-relaxed">
            ThiruPay started with a simple question: why should a tea stall or a fancy store need complicated hardware just to stop counting cash at the end of the day?
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="max-w-3xl mx-auto px-6 py-20">
        <motion.div initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.3 }}>
          <p className="text-green-600 text-xs font-semibold uppercase tracking-wide mb-2">Our story</p>
          <h2 className="font-display font-bold text-2xl text-green-700 mb-4">Why we exist</h2>
          <div className="space-y-4 text-sm text-green-500 leading-relaxed">
            <p>
              Most digital payment tools in India are built for large retail chains — heavy setup, sales calls, hardware contracts.
              Meanwhile the tea stall around the corner and the fancy store on the main road are still counting notes by hand every evening.
            </p>
            <p>
              ThiruPay flips that: a merchant can register, get verified, and generate their first QR code in under five minutes — no
              hardware required to get started. Every rupee collected is tracked from the moment a customer scans, right through to the day it
              settles in the merchant's bank account.
            </p>
            <p>
              As merchants grow, the same dashboard opens the door to more — business loans, insurance, SoundBox devices, and POS terminals —
              all requested with a tap, and reviewed by a real admin team, not a call center.
            </p>
          </div>
        </motion.div>
      </section>

      {/* Stats + cities */}
      <section className="bg-white border-y border-green-100">
        <div className="max-w-6xl mx-auto px-6 py-16">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-14">
            {STATS.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.3, delay: i * 0.08 }}
                className="text-center card py-8"
              >
                <p className="font-display font-extrabold text-3xl text-green-700">{s.value}</p>
                <p className="text-xs text-green-600 mt-1.5">{s.label}</p>
              </motion.div>
            ))}
          </div>

          <div className="text-center">
            <p className="inline-flex items-center gap-1.5 text-green-600 text-xs font-semibold uppercase tracking-wide mb-4">
              <MapPin size={13} /> Where we operate
            </p>
            <div className="flex flex-wrap items-center justify-center gap-2 max-w-2xl mx-auto">
              {CITIES.map((c) => (
                <span key={c} className="text-xs font-medium text-green-700 bg-green-50 px-3.5 py-1.5 rounded-full">
                  {c}
                </span>
              ))}
              <span className="text-xs font-medium text-green-600 px-3.5 py-1.5">and growing across Tamil Nadu</span>
            </div>
          </div>
        </div>
      </section>

      {/* Trust */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="text-center max-w-xl mx-auto mb-12">
          <p className="text-green-600 text-xs font-semibold uppercase tracking-wide mb-2">Why merchants trust us</p>
          <h2 className="font-display font-bold text-3xl text-green-700">Built to be trustworthy, not just fast</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {TRUST_BADGES.map((b, i) => (
            <motion.div
              key={b.title}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.3, delay: i * 0.08 }}
              className="card p-7 text-center"
            >
              <div className="w-12 h-12 rounded-xl bg-green-50 text-green-600 flex items-center justify-center mx-auto mb-4">
                <b.icon size={22} />
              </div>
              <p className="font-semibold text-green-700 text-sm mb-1.5">{b.title}</p>
              <p className="text-xs text-green-600 leading-relaxed">{b.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-6xl mx-auto px-6 pb-20">
        <div className="bg-brand shadow-brand rounded-3xl px-8 py-14 text-center relative overflow-hidden">
          <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-white/5 rounded-full blur-3xl" />
          <h2 className="font-display font-bold text-2xl sm:text-3xl text-white mb-3 relative z-10">Join merchants across Tamil Nadu</h2>
          <p className="text-green-100 text-sm mb-8 relative z-10">Set up your merchant account in under 5 minutes.</p>
          <Link
            to="/register"
            className="relative z-10 inline-flex items-center gap-2 bg-white text-green-700 hover:bg-green-50 font-semibold px-7 py-3 rounded-xl text-sm transition-colors"
          >
            Get Started <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}
