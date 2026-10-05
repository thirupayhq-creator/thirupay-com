import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, ImagePlus } from "lucide-react";
import { useRegistration } from "../../context/RegistrationContext";
import { lookupPincode } from "../../data/pincodeLookup";
import { compressImage } from "../../utils/imageCompress";
import { BUSINESS_CATEGORIES, ENTITY_TYPES } from "../../data/registrationConfig";
import { Field, inputCls } from "../../components/register/formUI";

// Stage 2 — what the business is and where it operates.
export default function RegisterBusiness() {
  const { form, updateForm, files, setFile } = useRegistration();
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const handlePincodeChange = (value) => {
    const clean = value.replace(/\D/g, "").slice(0, 6);
    const match = clean.length === 6 ? lookupPincode(clean) : null;
    updateForm({
      pincode: clean,
      city: match ? match.city : form.city,
      state: match ? match.state : form.state,
    });
  };

  const handlePhoto = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setError("");
    try {
      const compressed = await compressImage(file, { maxWidth: 900, quality: 0.6 });
      setFile("businessPhoto", compressed);
    } catch {
      setError("Could not upload the photo. Try a different image (JPEG or PNG).");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    if ((form.pincode || "").length !== 6) {
      setError("Pincode must be exactly 6 digits.");
      return;
    }
    navigate("/register/kyc");
  };

  return (
    <>
      <h1 className="font-display font-bold text-xl text-green-700 mb-1">Tell us about your business</h1>
      <p className="text-sm text-green-300 mb-6">This is the business address customers and settlements will be linked to.</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Field label="Business Category" required>
            <select
              value={form.businessCategory}
              onChange={(e) => updateForm({ businessCategory: e.target.value })}
              className={`${inputCls} bg-white`}
            >
              {BUSINESS_CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Business Entity Type" required>
            <select
              value={form.entityType}
              onChange={(e) => updateForm({ entityType: e.target.value })}
              className={`${inputCls} bg-white`}
            >
              {ENTITY_TYPES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </Field>
        </div>

        <Field label="GST Number (optional)">
          <input
            placeholder="33ABCDE1234F1Z5"
            value={form.gst || ""}
            onChange={(e) => updateForm({ gst: e.target.value.toUpperCase() })}
            className={`${inputCls} uppercase`}
          />
        </Field>

        <div className="pt-2 border-t border-green-50">
          <p className="text-sm font-semibold text-green-700 mb-3 mt-4">Business location</p>

          <div className="space-y-4">
            <Field label="Address Line 1" required>
              <input
                required
                placeholder="Shop No. 12, Main Bazaar Street"
                value={form.addressLine1 || ""}
                onChange={(e) => updateForm({ addressLine1: e.target.value })}
                className={inputCls}
              />
            </Field>
            <Field label="Address Line 2 (optional)">
              <input
                placeholder="Near Anna Bus Stand"
                value={form.addressLine2 || ""}
                onChange={(e) => updateForm({ addressLine2: e.target.value })}
                className={inputCls}
              />
            </Field>
            <div className="grid grid-cols-3 gap-4">
              <Field label="Pincode" required>
                <input
                  required
                  inputMode="numeric"
                  maxLength={6}
                  placeholder="625001"
                  value={form.pincode || ""}
                  onChange={(e) => handlePincodeChange(e.target.value)}
                  className={inputCls}
                />
              </Field>
              <Field label="City" required>
                <input
                  required
                  placeholder="Madurai"
                  value={form.city || ""}
                  onChange={(e) => updateForm({ city: e.target.value })}
                  className={inputCls}
                />
              </Field>
              <Field label="State" required>
                <input
                  required
                  placeholder="Tamil Nadu"
                  value={form.state || ""}
                  onChange={(e) => updateForm({ state: e.target.value })}
                  className={inputCls}
                />
              </Field>
            </div>
            <p className="text-[11px] text-green-300 -mt-1">City and State fill in from the pincode. You can edit them.</p>

            <div>
              <label className="block text-xs font-semibold text-green-500 mb-1.5">Business Location Photo (optional)</label>
              <label className="flex items-center gap-3 border border-dashed border-green-200 rounded-lg px-4 py-3 cursor-pointer hover:bg-green-50">
                <ImagePlus size={18} className="text-green-300 shrink-0" />
                <span className="text-xs text-green-400 truncate">
                  {files.businessPhoto ? "Photo selected ✓ (click to replace)" : "Upload storefront or shop photo"}
                </span>
                <input type="file" accept="image/*" onChange={handlePhoto} className="hidden" />
              </label>
              {files.businessPhoto && (
                <img src={files.businessPhoto} alt="Business location preview" className="mt-3 w-full h-32 object-cover rounded-lg border border-green-100" />
              )}
            </div>
          </div>
        </div>

        {error && <p className="text-rose-600 text-xs font-medium">{error}</p>}

        <div className="flex gap-3 pt-2">
          <Link
            to="/register/account"
            className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg border border-green-200 text-green-700 hover:bg-green-50 font-semibold text-sm transition-colors"
          >
            <ArrowLeft size={16} /> Back
          </Link>
          <button
            type="submit"
            className="flex-1 flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white font-semibold py-2.5 rounded-lg transition-colors text-sm"
          >
            Continue to KYC &amp; bank <ArrowRight size={16} />
          </button>
        </div>
      </form>
    </>
  );
}
