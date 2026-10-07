import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import emailjs from "@emailjs/browser";
import {
  CheckCircle2,
  ShieldCheck,
  Zap,
  Clock,
  ArrowRight,
  ArrowLeft,
  Building2,
  User,
  Wallet,
} from "lucide-react";

const STEPS = [
  { id: 0, label: "Business", icon: Building2 },
  { id: 1, label: "Contact", icon: User },
  { id: 2, label: "Loan Need", icon: Wallet },
];

const BUSINESS_TYPES = [
  "Grocery / Supermarket",
  "Textiles / Garments",
  "Restaurant / Tiffin Centre",
  "Medical / Pharmacy",
  "Hardware / Electricals",
  "Jewellery",
  "Salon / Services",
  "Other",
];

const SALES_RANGES = [
  "Below ₹1,00,000",
  "₹1,00,000 - ₹3,00,000",
  "₹3,00,000 - ₹10,00,000",
  "Above ₹10,00,000",
];

const LOAN_AMOUNTS = [
  "₹25,000",
  "₹50,000",
  "₹1,00,000",
  "₹1,50,000",
  "₹2,00,000",
];

const INITIAL_FORM = {
  businessName: "",
  businessType: "",
  monthlySales: "",
  ownerName: "",
  mobile: "",
  city: "",
  loanAmount: "",
  tenure: "6",
  existingMerchant: "yes",
  consent: false,
};

// EmailJS config (set these in your .env file)
const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

// Email is sent only when all 3 values are present in .env.
// Until then the form works in demo mode (saves locally, shows success screen).
const EMAIL_ENABLED = Boolean(
  EMAILJS_SERVICE_ID && EMAILJS_TEMPLATE_ID && EMAILJS_PUBLIC_KEY
);

const inputBase =
  "w-full px-3 py-2 bg-slate-50 border rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0B2A4A] transition-colors";

export default function LoanShowcase() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [refId, setRefId] = useState("");
  const [submitError, setSubmitError] = useState("");

  const update = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const validateStep = (s) => {
    const e = {};
    if (s === 0) {
      if (!form.businessName.trim()) e.businessName = "Enter your business name";
      if (!form.businessType) e.businessType = "Select business type";
      if (!form.monthlySales) e.monthlySales = "Select monthly sales range";
    }
    if (s === 1) {
      if (!form.ownerName.trim()) e.ownerName = "Enter owner name";
      if (!/^[6-9]\d{9}$/.test(form.mobile)) e.mobile = "Enter a valid 10-digit mobile number";
      if (!form.city.trim()) e.city = "Enter your city";
    }
    if (s === 2) {
      if (!form.loanAmount) e.loanAmount = "Select the loan amount you need";
      if (!form.consent) e.consent = "Please accept to continue";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleNext = () => {
    if (validateStep(step)) setStep((s) => s + 1);
  };

  const handleBack = () => {
    setErrors({});
    setStep((s) => s - 1);
  };

  const handleSubmit = async () => {
    if (!validateStep(2)) return;
    setSubmitting(true);
    setSubmitError("");

    const id = `TPL-${Date.now().toString().slice(-6)}`;
    const submittedAt = new Date().toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
      timeZone: "Asia/Kolkata",
    });

    // Local backup copy (until backend is ready)
    try {
      const existing = JSON.parse(localStorage.getItem("thirupay_loan_enquiries") || "[]");
      existing.push({ id, ...form, createdAt: new Date().toISOString() });
      localStorage.setItem("thirupay_loan_enquiries", JSON.stringify(existing));
    } catch (err) {
      // storage unavailable - ignore
    }

    // Variables used inside the EmailJS template
    const templateParams = {
      reference_id: id,
      submitted_at: submittedAt,
      business_name: form.businessName,
      business_type: form.businessType,
      monthly_sales: form.monthlySales,
      owner_name: form.ownerName,
      mobile: `+91 ${form.mobile}`,
      city: form.city,
      loan_amount: form.loanAmount,
      tenure: `${form.tenure} Months`,
      existing_merchant: form.existingMerchant === "yes" ? "Yes" : "No (New)",
    };

    try {
      if (EMAIL_ENABLED) {
        await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams, {
          publicKey: EMAILJS_PUBLIC_KEY,
        });
      } else {
        console.info("EmailJS not configured - enquiry saved locally only:", id);
      }
      setRefId(id);
      setStep(3);
    } catch (err) {
      console.error("EmailJS send failed:", err);
      setSubmitError("Could not submit right now. Please check your connection and try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = () => {
    setForm(INITIAL_FORM);
    setErrors({});
    setRefId("");
    setStep(0);
  };

  const fieldError = (name) =>
    errors[name] ? (
      <p className="text-[10px] text-red-500 mt-1 font-medium">{errors[name]}</p>
    ) : null;

  const borderFor = (name) => (errors[name] ? "border-red-300" : "border-slate-200");

  return (
    <div className="relative mx-auto w-full max-w-[420px] lg:max-w-[440px]">
      {/* Ambient background glow */}
      <div className="absolute inset-0 bg-gradient-to-tr from-orange-400/20 via-emerald-400/15 to-transparent blur-3xl -z-10 pointer-events-none rounded-3xl" />

      {/* Main Container Card */}
      <motion.div
        className="relative bg-white rounded-3xl p-5 border border-slate-200/90 shadow-2xl overflow-hidden min-h-[460px] flex flex-col justify-between"
        whileHover={{ y: -3, transition: { duration: 0.3 } }}
      >
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div className="flex items-center gap-3 min-w-0">
              {/* Full ThiruPay logo */}
              <img
                src="/brand/logo-full.png"
                alt="ThiruPay"
                className="h-10 w-auto object-contain shrink-0"
              />
              <div className="min-w-0">
                <h4 className="font-display font-bold text-slate-900 text-sm leading-tight">
                  Business Loan Enquiry
                </h4>
                <p className="text-[10px] text-slate-400">Zero Collateral • Daily QR Auto-Repay</p>
              </div>
            </div>
            <span className="shrink-0 whitespace-nowrap text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
              <Clock size={10} /> Takes 2 min
            </span>
          </div>

          {step < 3 && (
            /* Progress Steps */
            <div className="flex items-center justify-between">
              {STEPS.map((s, i) => {
                const Icon = s.icon;
                const done = step > s.id;
                const active = step === s.id;
                return (
                  <div key={s.id} className="flex items-center flex-1 last:flex-none">
                    <div className="flex items-center gap-1.5">
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold transition-colors ${
                          done
                            ? "bg-emerald-500 text-white"
                            : active
                            ? "bg-[#0B2A4A] text-white"
                            : "bg-slate-100 text-slate-400"
                        }`}
                      >
                        {done ? <CheckCircle2 size={13} /> : <Icon size={12} />}
                      </div>
                      <span
                        className={`text-[10px] font-semibold ${
                          active ? "text-slate-900" : "text-slate-400"
                        }`}
                      >
                        {s.label}
                      </span>
                    </div>
                    {i < STEPS.length - 1 && (
                      <div
                        className={`flex-1 h-px mx-2 ${done ? "bg-emerald-400" : "bg-slate-200"}`}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          )}

          <AnimatePresence mode="wait">
            {/* STEP 1: Business Details */}
            {step === 0 && (
              <motion.div
                key="step0"
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -12 }}
                transition={{ duration: 0.2 }}
                className="space-y-3"
              >
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Business Name
                  </label>
                  <input
                    type="text"
                    value={form.businessName}
                    onChange={(e) => update("businessName", e.target.value)}
                    placeholder="e.g. Selvi Groceries"
                    className={`${inputBase} ${borderFor("businessName")}`}
                  />
                  {fieldError("businessName")}
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Business Type
                  </label>
                  <select
                    value={form.businessType}
                    onChange={(e) => update("businessType", e.target.value)}
                    className={`${inputBase} ${borderFor("businessType")}`}
                  >
                    <option value="">Select business type</option>
                    {BUSINESS_TYPES.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                  {fieldError("businessType")}
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Monthly Sales
                  </label>
                  <select
                    value={form.monthlySales}
                    onChange={(e) => update("monthlySales", e.target.value)}
                    className={`${inputBase} ${borderFor("monthlySales")}`}
                  >
                    <option value="">Select monthly sales range</option>
                    {SALES_RANGES.map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>
                  {fieldError("monthlySales")}
                </div>
              </motion.div>
            )}

            {/* STEP 2: Contact */}
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -12 }}
                transition={{ duration: 0.2 }}
                className="space-y-3"
              >
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Owner Name
                  </label>
                  <input
                    type="text"
                    value={form.ownerName}
                    onChange={(e) => update("ownerName", e.target.value)}
                    placeholder="Your full name"
                    className={`${inputBase} ${borderFor("ownerName")}`}
                  />
                  {fieldError("ownerName")}
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Mobile Number
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                      +91
                    </span>
                    <input
                      type="tel"
                      inputMode="numeric"
                      maxLength={10}
                      value={form.mobile}
                      onChange={(e) => update("mobile", e.target.value.replace(/\D/g, ""))}
                      placeholder="10-digit mobile number"
                      className={`${inputBase} pl-10 ${borderFor("mobile")}`}
                    />
                  </div>
                  {fieldError("mobile")}
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">City</label>
                  <input
                    type="text"
                    value={form.city}
                    onChange={(e) => update("city", e.target.value)}
                    placeholder="e.g. Tiruvannamalai"
                    className={`${inputBase} ${borderFor("city")}`}
                  />
                  {fieldError("city")}
                </div>
              </motion.div>
            )}

            {/* STEP 3: Loan Need */}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -12 }}
                transition={{ duration: 0.2 }}
                className="space-y-3"
              >
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Loan Amount Needed
                  </label>
                  <select
                    value={form.loanAmount}
                    onChange={(e) => update("loanAmount", e.target.value)}
                    className={`${inputBase} ${borderFor("loanAmount")}`}
                  >
                    <option value="">Select amount</option>
                    {LOAN_AMOUNTS.map((a) => (
                      <option key={a} value={a}>
                        {a}
                      </option>
                    ))}
                  </select>
                  {fieldError("loanAmount")}
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1.5">
                    Preferred Tenure
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {["3", "6", "12"].map((m) => (
                      <button
                        key={m}
                        type="button"
                        onClick={() => update("tenure", m)}
                        className={`py-1.5 rounded-xl text-xs font-bold border transition-all ${
                          form.tenure === m
                            ? "bg-[#0B2A4A] text-white border-[#0B2A4A] shadow-sm"
                            : "bg-white text-slate-700 border-slate-200 hover:border-slate-300"
                        }`}
                      >
                        {m} Mo
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1.5">
                    Existing ThiruPay Merchant?
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { v: "yes", l: "Yes" },
                      { v: "no", l: "No, I'm new" },
                    ].map((o) => (
                      <button
                        key={o.v}
                        type="button"
                        onClick={() => update("existingMerchant", o.v)}
                        className={`py-1.5 rounded-xl text-xs font-bold border transition-all ${
                          form.existingMerchant === o.v
                            ? "bg-[#0B2A4A] text-white border-[#0B2A4A] shadow-sm"
                            : "bg-white text-slate-700 border-slate-200 hover:border-slate-300"
                        }`}
                      >
                        {o.l}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="flex items-start gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.consent}
                      onChange={(e) => update("consent", e.target.checked)}
                      className="mt-0.5 accent-[#0B2A4A]"
                    />
                    <span className="text-[10px] text-slate-500 leading-snug">
                      I agree to be contacted by the ThiruPay team regarding my loan enquiry.
                    </span>
                  </label>
                  {fieldError("consent")}
                </div>
              </motion.div>
            )}

            {/* SUCCESS */}
            {step === 3 && (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-6 space-y-3"
              >
                <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 size={30} />
                </div>
                <h5 className="font-display font-bold text-slate-900 text-base">
                  Enquiry Submitted!
                </h5>
                <p className="text-xs text-slate-500 leading-relaxed max-w-[280px] mx-auto">
                  Thank you, <strong className="text-slate-800">{form.ownerName}</strong>. Our team
                  will contact you shortly on <strong className="text-slate-800">+91 {form.mobile}</strong>.
                </p>
                <div className="inline-block bg-slate-50 border border-slate-200 rounded-xl px-4 py-2">
                  <p className="text-[10px] text-slate-400">Reference ID</p>
                  <p className="font-mono font-bold text-sm text-[#0B2A4A]">{refId}</p>
                </div>
                <div>
                  <button
                    onClick={handleReset}
                    className="text-[11px] font-semibold text-slate-500 hover:text-slate-800 underline underline-offset-2"
                  >
                    Submit another enquiry
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {submitError && step === 2 && (
            <p className="text-[11px] text-red-600 bg-red-50 border border-red-200 rounded-xl px-3 py-2 font-medium">
              {submitError}
            </p>
          )}

          {/* Navigation Buttons */}
          {step < 3 && (
            <div className="flex items-center gap-2 pt-1">
              {step > 0 && (
                <button
                  onClick={handleBack}
                  className="flex items-center justify-center gap-1 px-4 py-2.5 rounded-xl text-xs font-bold border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
                >
                  <ArrowLeft size={13} /> Back
                </button>
              )}
              {step < 2 ? (
                <button
                  onClick={handleNext}
                  className="flex-1 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 shadow-md shadow-orange-500/20 transition-all"
                >
                  Continue <ArrowRight size={13} />
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="flex-1 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 shadow-md shadow-orange-500/20 transition-all disabled:opacity-50"
                >
                  {submitting ? "Submitting..." : (
                    <>
                      Submit Enquiry <ArrowRight size={13} />
                    </>
                  )}
                </button>
              )}
            </div>
          )}
        </div>

        {/* Footer Strip */}
        <div className="mt-4 pt-2 flex items-center justify-around text-[9px] font-semibold text-slate-400 border-t border-slate-100">
          <span className="flex items-center gap-1">
            <ShieldCheck size={11} className="text-emerald-500" /> Zero Collateral
          </span>
          <span className="flex items-center gap-1">
            <Zap size={11} className="text-sky-500" /> Collection-Linked
          </span>
          <span className="flex items-center gap-1">
            <Clock size={11} className="text-orange-500" /> Quick Process
          </span>
        </div>
      </motion.div>
    </div>
  );
}