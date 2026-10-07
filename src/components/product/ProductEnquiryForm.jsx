import { useState } from "react";
import { motion } from "framer-motion";
import emailjs from "@emailjs/browser";
import { CheckCircle2, ArrowRight, ArrowLeft } from "lucide-react";

// EmailJS config (set these in your .env file)
const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const EMAILJS_ENQUIRY_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_ENQUIRY_TEMPLATE_ID;
const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

// Email is sent only when all 3 values are present in .env.
// Until then the form works in demo mode (saves locally, shows success screen).
const EMAIL_ENABLED = Boolean(
  EMAILJS_SERVICE_ID && EMAILJS_ENQUIRY_TEMPLATE_ID && EMAILJS_PUBLIC_KEY
);

const inputBase =
  "w-full px-3 py-2 bg-slate-50 border rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0B2A4A] transition-colors";

/**
 * Reusable enquiry form used inside product showcase cards.
 * Props:
 *  - productName: string (shown in title + sent in the email)
 *  - extraLabel: string (label for the product-specific dropdown)
 *  - extraOptions: string[] (dropdown options)
 *  - defaultExtra: string (optional preselected option)
 *  - onBack: () => void (go back to the showcase view)
 */
export default function ProductEnquiryForm({
  productName,
  extraLabel,
  extraOptions = [],
  defaultExtra = "",
  onBack,
}) {
  const [form, setForm] = useState({
    businessName: "",
    ownerName: "",
    mobile: "",
    city: "",
    extra: defaultExtra,
    consent: false,
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [refId, setRefId] = useState("");

  const update = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const validate = () => {
    const e = {};
    if (!form.businessName.trim()) e.businessName = "Enter your business name";
    if (!form.ownerName.trim()) e.ownerName = "Enter your name";
    if (!/^[6-9]\d{9}$/.test(form.mobile)) e.mobile = "Enter a valid 10-digit mobile number";
    if (!form.city.trim()) e.city = "Enter your city";
    if (extraOptions.length > 0 && !form.extra) e.extra = "Please select an option";
    if (!form.consent) e.consent = "Please accept to continue";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setSubmitting(true);
    setSubmitError("");

    const id = `TPE-${Date.now().toString().slice(-6)}`;
    const submittedAt = new Date().toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
      timeZone: "Asia/Kolkata",
    });

    // Local backup copy (until backend is ready)
    try {
      const existing = JSON.parse(localStorage.getItem("thirupay_product_enquiries") || "[]");
      existing.push({ id, product: productName, ...form, createdAt: new Date().toISOString() });
      localStorage.setItem("thirupay_product_enquiries", JSON.stringify(existing));
    } catch (err) {
      // storage unavailable - ignore
    }

    const templateParams = {
      product_name: productName,
      reference_id: id,
      submitted_at: submittedAt,
      business_name: form.businessName,
      owner_name: form.ownerName,
      mobile: `+91 ${form.mobile}`,
      city: form.city,
      extra_label: extraLabel || "Details",
      extra_value: form.extra || "-",
    };

    try {
      if (EMAIL_ENABLED) {
        await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_ENQUIRY_TEMPLATE_ID, templateParams, {
          publicKey: EMAILJS_PUBLIC_KEY,
        });
      } else {
        console.info("EmailJS not configured - enquiry saved locally only:", id);
      }
      setRefId(id);
    } catch (err) {
      console.error("EmailJS send failed:", err);
      setSubmitError("Could not submit right now. Please check your connection and try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = () => {
    setForm({
      businessName: "",
      ownerName: "",
      mobile: "",
      city: "",
      extra: defaultExtra,
      consent: false,
    });
    setErrors({});
    setSubmitError("");
    setRefId("");
    if (onBack) onBack();
  };

  const fieldError = (name) =>
    errors[name] ? (
      <p className="text-[10px] text-red-500 mt-1 font-medium">{errors[name]}</p>
    ) : null;

  const borderFor = (name) => (errors[name] ? "border-red-300" : "border-slate-200");

  /* Success view */
  if (refId) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-8 space-y-3"
      >
        <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
          <CheckCircle2 size={30} />
        </div>
        <h5 className="font-display font-bold text-slate-900 text-base">Enquiry Submitted!</h5>
        <p className="text-xs text-slate-500 leading-relaxed max-w-[280px] mx-auto">
          Thank you, <strong className="text-slate-800">{form.ownerName}</strong>. Our team will
          contact you shortly on <strong className="text-slate-800">+91 {form.mobile}</strong>.
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
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.2 }}
      className="space-y-3"
    >
      <div className="flex items-center justify-between">
        <p className="text-[11px] font-bold text-slate-800">Enquiry Form</p>
        {onBack && (
          <button
            onClick={onBack}
            className="flex items-center gap-1 text-[11px] font-semibold text-slate-500 hover:text-slate-800"
          >
            <ArrowLeft size={12} /> Back
          </button>
        )}
      </div>

      <div>
        <label className="block text-[11px] font-semibold text-slate-600 mb-1">Business Name</label>
        <input
          type="text"
          value={form.businessName}
          onChange={(e) => update("businessName", e.target.value)}
          placeholder="e.g. Selvi Groceries"
          className={`${inputBase} ${borderFor("businessName")}`}
        />
        {fieldError("businessName")}
      </div>

      <div className="grid grid-cols-2 gap-2.5">
        <div>
          <label className="block text-[11px] font-semibold text-slate-600 mb-1">Your Name</label>
          <input
            type="text"
            value={form.ownerName}
            onChange={(e) => update("ownerName", e.target.value)}
            placeholder="Full name"
            className={`${inputBase} ${borderFor("ownerName")}`}
          />
          {fieldError("ownerName")}
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
      </div>

      <div>
        <label className="block text-[11px] font-semibold text-slate-600 mb-1">Mobile Number</label>
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

      {extraOptions.length > 0 && (
        <div>
          <label className="block text-[11px] font-semibold text-slate-600 mb-1">{extraLabel}</label>
          <select
            value={form.extra}
            onChange={(e) => update("extra", e.target.value)}
            className={`${inputBase} ${borderFor("extra")}`}
          >
            <option value="">Select</option>
            {extraOptions.map((o) => (
              <option key={o} value={o}>
                {o}
              </option>
            ))}
          </select>
          {fieldError("extra")}
        </div>
      )}

      <div>
        <label className="flex items-start gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={form.consent}
            onChange={(e) => update("consent", e.target.checked)}
            className="mt-0.5 accent-[#0B2A4A]"
          />
          <span className="text-[10px] text-slate-500 leading-snug">
            I agree to be contacted by the ThiruPay team regarding my enquiry.
          </span>
        </label>
        {fieldError("consent")}
      </div>

      {submitError && (
        <p className="text-[11px] text-red-600 bg-red-50 border border-red-200 rounded-xl px-3 py-2 font-medium">
          {submitError}
        </p>
      )}

      <button
        onClick={handleSubmit}
        disabled={submitting}
        className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 shadow-md shadow-orange-500/20 transition-all disabled:opacity-50"
      >
        {submitting ? (
          "Submitting..."
        ) : (
          <>
            Submit Enquiry <ArrowRight size={13} />
          </>
        )}
      </button>
    </motion.div>
  );
}