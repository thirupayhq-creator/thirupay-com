import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ShieldCheck, Upload, Clock } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { db } from "../../data/mockData";
import { compressImage } from "../../utils/imageCompress";

const PAN_REGEX = /^[A-Z]{5}[0-9]{4}[A-Z]$/;

export default function KYCUpload() {
  const { session } = useAuth();
  const navigate = useNavigate();
  const existing = db.getKycByMerchant(session.merchantId);
  const [submitted, setSubmitted] = useState(!!existing);
  const [form, setForm] = useState({
    pan: existing?.pan || "",
    aadhaar: existing?.aadhaar || "",
    fileName: existing?.document_name || "",
    fileData: existing?.document_url || "",
  });

  const [uploadError, setUploadError] = useState("");

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadError("");

    if (file.type.startsWith("image/")) {
      try {
        const compressed = await compressImage(file, { maxWidth: 1000, quality: 0.65 });
        setForm((f) => ({ ...f, fileName: file.name, fileData: compressed }));
      } catch {
        setUploadError("Could not upload photo, please try a different file.");
      }
      return;
    }

    // Non-image (e.g. PDF) — keep as-is but guard against huge files that would blow the localStorage quota
    if (file.size > 2 * 1024 * 1024) {
      setUploadError("File must be under 2MB. Please upload a smaller file.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setForm((f) => ({ ...f, fileName: file.name, fileData: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const [submitError, setSubmitError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitError("");

    const pan = (form.pan || "").trim().toUpperCase();
    if (!PAN_REGEX.test(pan)) {
      setSubmitError("Enter a valid PAN number, e.g. ABCDE1234F (5 letters, 4 digits, 1 letter).");
      return;
    }
    const aadhaarDigits = (form.aadhaar || "").replace(/\D/g, "");
    if (aadhaarDigits.length !== 12) {
      setSubmitError("Aadhaar number must be exactly 12 digits.");
      return;
    }

    try {
      db.addKyc({
        merchant_id: session.merchantId,
        pan,
        aadhaar: form.aadhaar,
        document_name: form.fileName || "document.pdf",
        document_url: form.fileData || "",
        verification_status: "pending",
      });
      setSubmitted(true);
    } catch {
      setSubmitError("Could not save — storage is full. Please try a smaller file.");
    }
  };

  if (submitted) {
    return (
      <div className="max-w-lg mx-auto mt-10">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="card p-8 text-center">
          <div className="w-14 h-14 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-4">
            <Clock size={26} />
          </div>
          <h2 className="font-display font-bold text-lg text-green-700 mb-1">KYC submitted — waiting for approval</h2>
          <p className="text-sm text-green-300 mb-6">
            Admin will verify your PAN and Aadhaar details. You can track the status from your dashboard.
          </p>
          <button
            onClick={() => navigate("/merchant")}
            className="bg-green-700 hover:bg-green-800 text-white font-semibold px-5 py-2.5 rounded-lg text-sm transition-colors"
          >
            Go to Dashboard
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto mt-6">
      <div className="text-center mb-6">
        <div className="w-12 h-12 rounded-xl bg-green-50 text-green-700 flex items-center justify-center mx-auto mb-3">
          <ShieldCheck size={22} />
        </div>
        <h1 className="font-display font-bold text-xl text-green-700">Upload KYC Documents</h1>
        <p className="text-sm text-green-300 mt-1">Step 2 of 2 — PAN & Aadhaar required for verification</p>
      </div>

      <form onSubmit={handleSubmit} className="card p-8 space-y-4">
        <div>
          <label className="block text-xs font-semibold text-green-500 mb-1.5">PAN Number</label>
          <input
            required
            value={form.pan}
            onChange={(e) => setForm({ ...form, pan: e.target.value.toUpperCase() })}
            placeholder="ABCDE1234F"
            maxLength={10}
            className="w-full px-4 py-2.5 rounded-lg border border-green-100 focus:border-green-500 focus:ring-2 focus:ring-green-100 outline-none text-sm uppercase"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-green-500 mb-1.5">Aadhaar Number</label>
          <input
            required
            value={form.aadhaar}
            onChange={(e) => setForm({ ...form, aadhaar: e.target.value })}
            placeholder="XXXX-XXXX-XXXX"
            className="w-full px-4 py-2.5 rounded-lg border border-green-100 focus:border-green-500 focus:ring-2 focus:ring-green-100 outline-none text-sm"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-green-500 mb-1.5">Upload Document (PAN / Aadhaar copy)</label>
          <label className="flex items-center gap-3 px-4 py-3 rounded-lg border border-dashed border-green-200 cursor-pointer hover:bg-green-50 transition-colors">
            <Upload size={18} className="text-green-400" />
            <span className="text-sm text-green-400">{form.fileName || "Choose file to upload"}</span>
            <input type="file" onChange={handleFile} className="hidden" />
          </label>
          {uploadError && <p className="text-rose-600 text-xs font-medium mt-1.5">{uploadError}</p>}
        </div>

        {submitError && <p className="text-rose-600 text-xs font-medium">{submitError}</p>}

        <button
          type="submit"
          className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2.5 rounded-lg transition-colors text-sm mt-2"
        >
          Submit for Verification
        </button>
      </form>
    </div>
  );
}
