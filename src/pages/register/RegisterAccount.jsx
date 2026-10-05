import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Check, ShieldCheck } from "lucide-react";
import { useRegistration } from "../../context/RegistrationContext";
import { useToast } from "../../context/ToastContext";
import { db } from "../../data/mockData";
import { EMAIL_REGEX } from "../../data/registrationConfig";
import { Field, inputCls } from "../../components/register/formUI";

// Stage 1 — who is opening the account: names, email, verified mobile, password.
export default function RegisterAccount() {
  const { form, updateForm } = useRegistration();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [error, setError] = useState("");
  const [emailTaken, setEmailTaken] = useState(false);

  // ---------- Mobile OTP (mocked — no real SMS gateway in this demo) ----------
  const [otpSent, setOtpSent] = useState(false);
  const [otpValue, setOtpValue] = useState("");
  const [generatedOtp, setGeneratedOtp] = useState(null);
  const [otpError, setOtpError] = useState("");

  const handlePhoneChange = (value) => {
    updateForm({ phone: value.replace(/\D/g, "").slice(0, 10), phoneVerified: false });
    setOtpSent(false);
    setOtpValue("");
    setOtpError("");
  };

  const changeNumber = () => {
    updateForm({ phoneVerified: false });
    setOtpSent(false);
    setOtpValue("");
  };

  const sendOtp = () => {
    if ((form.phone || "").length !== 10) {
      setOtpError("Enter a valid 10-digit mobile number first.");
      return;
    }
    setOtpError("");
    const code = String(Math.floor(1000 + Math.random() * 9000));
    setGeneratedOtp(code);
    setOtpSent(true);
    setOtpValue("");
    // No real SMS gateway wired up yet in this demo — surfaced via toast so it's testable.
    showToast({ title: "OTP sent (demo)", subtitle: `Your OTP is ${code} — real SMS gateway to be added by backend`, type: "info", duration: 6000 });
  };

  const verifyOtp = () => {
    if (otpValue !== generatedOtp) {
      setOtpError("Incorrect OTP. Check the code and try again.");
      return;
    }
    setOtpError("");
    updateForm({ phoneVerified: true });
    showToast({ title: "Mobile number verified", type: "success" });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    setEmailTaken(false);

    if (!EMAIL_REGEX.test(form.email || "")) {
      setError("Enter a valid email address, e.g. you@business.com.");
      return;
    }
    if (!form.phoneVerified) {
      setError("Verify your mobile number with the OTP before continuing.");
      return;
    }
    if ((form.password || "").length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError("Password and Confirm Password do not match.");
      return;
    }
    if (!form.agreedToTerms) {
      setError("Accept the Terms of Service & Privacy Policy to continue.");
      return;
    }
    // Catch a duplicate email now, not after the merchant has filled in three pages.
    if (db.isEmailTaken(form.email)) {
      setEmailTaken(true);
      setError("This email is already registered.");
      return;
    }
    navigate("/register/business");
  };

  return (
    <>
      <h1 className="font-display font-bold text-xl text-green-700 mb-1">Create your merchant account</h1>
      <p className="text-sm text-green-300 mb-6">Start with your contact details. You'll add business and KYC details next.</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Field label="Business Name" required>
          <input
            required
            placeholder="Selvi Fancy Store"
            value={form.businessName || ""}
            onChange={(e) => updateForm({ businessName: e.target.value })}
            className={inputCls}
          />
        </Field>

        <Field label="Owner Name" required>
          <input
            required
            placeholder="Selvi Kumar"
            value={form.ownerName || ""}
            onChange={(e) => updateForm({ ownerName: e.target.value })}
            className={inputCls}
          />
        </Field>

        <Field label="Email" required>
          <input
            required
            type="email"
            placeholder="you@business.com"
            value={form.email || ""}
            onChange={(e) => updateForm({ email: e.target.value })}
            className={inputCls}
          />
        </Field>

        {/* Mobile number + OTP verification */}
        <div>
          <label className="block text-xs font-semibold text-green-500 mb-1.5">
            Phone Number <span className="text-rose-500">*</span>
          </label>
          <div className="flex gap-2">
            <input
              required
              inputMode="numeric"
              disabled={form.phoneVerified}
              placeholder="98400xxxxx"
              value={form.phone || ""}
              onChange={(e) => handlePhoneChange(e.target.value)}
              className="flex-1 px-4 py-2.5 rounded-lg border border-green-100 focus:border-green-500 focus:ring-2 focus:ring-green-100 outline-none text-sm disabled:bg-green-50 disabled:text-green-600"
            />
            {form.phoneVerified ? (
              <>
                <span className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 rounded-lg shrink-0">
                  <Check size={14} /> Verified
                </span>
                <button
                  type="button"
                  onClick={changeNumber}
                  className="text-xs font-semibold text-green-700 border border-green-200 px-3 rounded-lg hover:bg-green-50 shrink-0"
                >
                  Change
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={sendOtp}
                className="text-xs font-semibold text-green-700 border border-green-200 px-3 rounded-lg hover:bg-green-50 shrink-0"
              >
                {otpSent ? "Resend OTP" : "Send OTP"}
              </button>
            )}
          </div>

          {otpSent && !form.phoneVerified && (
            <div className="mt-2.5 flex gap-2">
              <input
                inputMode="numeric"
                maxLength={4}
                placeholder="Enter 4-digit OTP"
                value={otpValue}
                onChange={(e) => setOtpValue(e.target.value.replace(/\D/g, "").slice(0, 4))}
                className="flex-1 px-4 py-2.5 rounded-lg border border-green-100 focus:border-green-500 outline-none text-sm"
              />
              <button
                type="button"
                onClick={verifyOtp}
                className="text-xs font-semibold text-white bg-green-600 hover:bg-green-700 px-4 rounded-lg shrink-0"
              >
                Verify
              </button>
            </div>
          )}
          {otpError && <p className="text-rose-600 text-xs font-medium mt-1.5">{otpError}</p>}
          {!form.phoneVerified && (
            <p className="text-[11px] text-green-300 mt-1.5 flex items-center gap-1">
              <ShieldCheck size={12} /> We'll verify this number with an OTP before your account is created.
            </p>
          )}
        </div>

        <div className="pt-2 border-t border-green-50 space-y-4">
          <div className="mt-4">
            <Field label="Password" required hint="At least 6 characters.">
              <input
                type="password"
                required
                placeholder="••••••••"
                value={form.password || ""}
                onChange={(e) => updateForm({ password: e.target.value })}
                className={inputCls}
              />
            </Field>
          </div>
          <Field label="Confirm Password" required>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={form.confirmPassword || ""}
              onChange={(e) => updateForm({ confirmPassword: e.target.value })}
              className={inputCls}
            />
          </Field>
        </div>

        <label className="flex items-start gap-2.5 pt-1 cursor-pointer">
          <input
            type="checkbox"
            checked={!!form.agreedToTerms}
            onChange={(e) => updateForm({ agreedToTerms: e.target.checked })}
            className="mt-0.5 w-4 h-4 rounded border-green-200 text-green-600 focus:ring-green-300 shrink-0"
          />
          <span className="text-xs text-green-500">
            I agree to ThiruPay's{" "}
            <Link to="/terms-and-conditions" target="_blank" className="text-green-700 font-semibold hover:underline">
              Terms of Service
            </Link>{" "}
            and <span className="text-green-700 font-semibold">Privacy Policy</span>.
          </span>
        </label>

        {error && (
          <p className="text-rose-600 text-xs font-medium">
            {error}
            {emailTaken && (
              <>
                {" "}
                <Link to="/login" className="underline font-semibold">
                  Log in instead
                </Link>
                , or use a different email.
              </>
            )}
          </p>
        )}

        <button
          type="submit"
          className="w-full flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white font-semibold py-2.5 rounded-lg transition-colors text-sm mt-2"
        >
          Continue to business details <ArrowRight size={16} />
        </button>
      </form>
    </>
  );
}
