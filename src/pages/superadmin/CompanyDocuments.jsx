import { useRef, useState } from "react";
import { FileStack, Upload, Eye, Trash2, CheckCircle2, AlertTriangle } from "lucide-react";
import { DOCUMENT_TYPES, getCompanyDocuments, saveCompanyDocument, removeCompanyDocument } from "../../data/companyDocuments";
import { useToast } from "../../context/ToastContext";

const MAX_SIZE_MB = 4;

function daysUntil(dateStr) {
  if (!dateStr) return null;
  const diff = new Date(dateStr) - new Date();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

export default function CompanyDocuments() {
  const { showToast } = useToast();
  const [docs, setDocs] = useState(getCompanyDocuments());
  const [expiryDraft, setExpiryDraft] = useState({});
  const fileInputs = useRef({});

  const handleUpload = (docKey, file) => {
    if (!file) return;
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      showToast({ title: `File too large`, subtitle: `Keep it under ${MAX_SIZE_MB}MB.`, type: "error" });
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const record = {
        fileName: file.name,
        dataUrl: reader.result,
        uploadedAt: new Date().toISOString(),
        expiry: expiryDraft[docKey] || docs[docKey]?.expiry || null,
      };
      saveCompanyDocument(docKey, record);
      setDocs((prev) => ({ ...prev, [docKey]: record }));
      showToast({ title: "Document uploaded", subtitle: file.name, type: "success" });
    };
    reader.onerror = () => showToast({ title: "Couldn't read that file", type: "error" });
    reader.readAsDataURL(file);
  };

  const handleExpiryChange = (docKey, value) => {
    setExpiryDraft((prev) => ({ ...prev, [docKey]: value }));
    if (docs[docKey]) {
      const record = { ...docs[docKey], expiry: value };
      saveCompanyDocument(docKey, record);
      setDocs((prev) => ({ ...prev, [docKey]: record }));
    }
  };

  const handleRemove = (docKey) => {
    removeCompanyDocument(docKey);
    setDocs((prev) => {
      const next = { ...prev };
      delete next[docKey];
      return next;
    });
    showToast({ title: "Document removed", type: "info" });
  };

  const uploadedCount = DOCUMENT_TYPES.filter((d) => docs[d.key]).length;

  return (
    <div className="max-w-3xl">
      <div className="flex items-center gap-3 mb-1">
        <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center shrink-0">
          <FileStack size={20} />
        </div>
        <div>
          <h1 className="font-display font-bold text-xl text-slate-800">Company Documents</h1>
          <p className="text-sm text-slate-400">ThiruPay's own compliance documents — {uploadedCount} of {DOCUMENT_TYPES.length} uploaded.</p>
        </div>
      </div>

      <div className="space-y-3 mt-6">
        {DOCUMENT_TYPES.map((d) => {
          const rec = docs[d.key];
          const remaining = d.hasExpiry ? daysUntil(rec?.expiry) : null;
          const expiringSoon = remaining !== null && remaining <= 30;

          return (
            <div key={d.key} className="bg-white rounded-2xl shadow-card p-5">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div className="flex items-start gap-3 min-w-[220px]">
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${rec ? "bg-emerald-50 text-emerald-600" : "bg-slate-100 text-slate-400"}`}>
                    {rec ? <CheckCircle2 size={17} /> : <AlertTriangle size={17} />}
                  </div>
                  <div>
                    <p className="font-semibold text-slate-800 text-sm">{d.label}</p>
                    {rec ? (
                      <p className="text-xs text-slate-400 mt-0.5">
                        {rec.fileName} · uploaded {new Date(rec.uploadedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                      </p>
                    ) : (
                      <p className="text-xs text-slate-400 mt-0.5">Not uploaded yet</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  {d.hasExpiry && (
                    <div>
                      <input
                        type="date"
                        value={expiryDraft[d.key] ?? rec?.expiry ?? ""}
                        onChange={(e) => handleExpiryChange(d.key, e.target.value)}
                        className="px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs outline-none focus:border-amber-500"
                      />
                    </div>
                  )}
                  {rec && (
                    <a
                      href={rec.dataUrl}
                      download={rec.fileName}
                      className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 border border-slate-200 px-3 py-1.5 rounded-lg hover:bg-slate-50"
                    >
                      <Eye size={13} /> View
                    </a>
                  )}
                  {rec && (
                    <button onClick={() => handleRemove(d.key)} className="flex items-center gap-1.5 text-xs font-semibold text-rose-600 border border-rose-200 px-3 py-1.5 rounded-lg hover:bg-rose-50">
                      <Trash2 size={13} />
                    </button>
                  )}
                  <button
                    onClick={() => fileInputs.current[d.key]?.click()}
                    className="flex items-center gap-1.5 text-xs font-semibold text-white bg-[#0B1220] hover:bg-black px-3 py-1.5 rounded-lg"
                  >
                    <Upload size={13} /> {rec ? "Replace" : "Upload"}
                  </button>
                  <input
                    ref={(el) => (fileInputs.current[d.key] = el)}
                    type="file"
                    accept="application/pdf,image/*"
                    className="hidden"
                    onChange={(e) => handleUpload(d.key, e.target.files?.[0])}
                  />
                </div>
              </div>

              {expiringSoon && (
                <p className="text-[11px] text-amber-600 font-semibold mt-3 flex items-center gap-1">
                  <AlertTriangle size={12} /> {remaining <= 0 ? "Expired" : `Expires in ${remaining} days`} — renew soon.
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
