import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Phone, MapPin, ChevronDown, Headphones, Briefcase, Landmark, TrendingUp } from "lucide-react";
import PublicNavbar from "../components/PublicNavbar";
import PublicFooter from "../components/PublicFooter";
import { FAQS } from "../data/landingContent";

// Put your illustration paths in `img` (e.g. "/images/support.png").
// If img is empty, a big icon tile is shown instead.
const PHONE = "+91 9360921283";
const INVESTOR_PHONE = "+91 8807880764";

const CONTACT_CARDS = [
  { title: "For Customer Support", icon: Headphones, img: "", rows: [{ icon: Phone, text: PHONE }, { icon: Mail, text: "support@thirupay.com" }] },
  { title: "For Careers", icon: Briefcase, img: "", rows: [{ icon: Mail, text: "careers@thirupay.com" }] },
  { title: "For Lending Support", icon: Landmark, img: "", rows: [{ icon: Phone, text: PHONE }, { icon: Mail, text: "lendingsupport@thirupay.com" }] },
  { title: "For Investors", icon: TrendingUp, img: "", rows: [{ icon: Phone, text: INVESTOR_PHONE }, { icon: Mail, text: "jayakrishnan@thirupay.com" }] },
];

export default function Contact() {
  const [openFaq, setOpenFaq] = useState(null);

  return (
    <div className="min-h-screen bg-white">
      <PublicNavbar />

      {/* Hero + cards on one soft gradient (Ippopay style) */}
      <section className="bg-gradient-to-b from-green-100 via-green-50 to-white">
        <div className="max-w-5xl mx-auto px-6 pt-24 pb-10 text-center">
          <h1 className="font-display font-extrabold text-5xl sm:text-6xl text-green-900 tracking-tight">Contact Us</h1>
          <p className="text-green-700 text-sm sm:text-base mt-4">
            Reach out in Tamil or English, whichever is easier.
          </p>
        </div>

        <div className="max-w-5xl mx-auto px-6 pb-20 grid grid-cols-1 md:grid-cols-2 gap-6">
          {CONTACT_CARDS.map((c) => (
            <div key={c.title} className="bg-white rounded-3xl shadow-sm p-6 flex gap-5 min-h-[230px]">
              {/* Illustration */}
              <div className="w-32 sm:w-40 shrink-0 flex items-center justify-center">
                {c.img ? (
                  <img src={c.img} alt={c.title} className="max-h-44 w-auto object-contain" />
                ) : (
                  <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-green-100 to-green-50 text-green-700 flex items-center justify-center">
                    <c.icon size={44} strokeWidth={1.5} />
                  </div>
                )}
              </div>

              {/* Title + details */}
              <div className="flex flex-col flex-1 min-w-0">
                <h2 className="font-display text-xl sm:text-2xl font-semibold text-green-900 leading-tight">{c.title}</h2>
                <div className="mt-auto pt-6 space-y-2">
                  {c.rows.map((r) => (
                    <div key={r.text} className="flex items-start gap-2.5">
                      <span className="w-5 h-5 rounded-full bg-green-900 text-white flex items-center justify-center shrink-0 mt-0.5">
                        <r.icon size={11} />
                      </span>
                      <span className="text-sm text-green-900 leading-snug break-words">{r.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Map */}
      <section className="max-w-5xl mx-auto px-6 pb-20">
        <p className="flex items-start gap-2 text-sm text-green-700 mb-4 justify-center text-center">
          <MapPin size={16} className="shrink-0 mt-0.5" />
          Thirupay Technologies Private Limited, Annai Parvathi Nagar, opposite to Collectorate Office, Vengikkal, Tiruvannamalai - 606604
        </p>
        <div className="card overflow-hidden rounded-3xl">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d124778.27316702453!2d78.99565857982758!3d12.226528614511835!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4c3d7010778e4289%3A0x4a7c742efcc58bf5!2sThiruPay%20Technologies%20Pvt%20Ltd!5e0!3m2!1sen!2sin!4v1790836397145!5m2!1sen!2sin"
            width="100%"
            height="400"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="strict-origin-when-cross-origin"
            title="ThiruPay Office Location"
          ></iframe>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="bg-white border-t border-green-100">
        <div className="max-w-3xl mx-auto px-6 py-20">
          <div className="text-center mb-12">
            <p className="text-green-600 text-xs font-semibold uppercase tracking-wide mb-2">FAQ</p>
            <h2 className="font-display font-bold text-3xl text-green-700">Frequently asked questions</h2>
          </div>
          <div className="space-y-3">
            {FAQS.map((f, i) => (
              <div key={f.q} className="card overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left"
                >
                  <span className="text-sm font-semibold text-green-700">{f.q}</span>
                  <ChevronDown size={16} className={`text-green-400 shrink-0 transition-transform ${openFaq === i ? "rotate-180" : ""}`} />
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
                      <p className="text-sm text-green-600 leading-relaxed px-5 pb-4">{f.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}