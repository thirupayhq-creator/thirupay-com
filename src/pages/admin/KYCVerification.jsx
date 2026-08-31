import { useState } from "react";
import { FileText, Check, X, Eye, AlertTriangle } from "lucide-react";
import { db } from "../../data/mockData";
import StatusBadge from "../../components/StatusBadge";

const PAN_REGEX = /^[A-Z]{5}[0-9]{4}[A-Z]$/;

export default function KYCVerification() {
  const [tick, setTick] = useState(0);
  const [viewed, setViewed] = useState(new Set());
  const merchants = db.getMerchants();

  const rows = merchants
    .map((m) => ({ merchant: m, kyc: db.getKycByMerchant(m.merchant_id) }))
    .filter((r) => r.kyc);

  const decide = (merchantId, decision) => {
    db.updateKycStatus(merchantId, decision);
    db.updateMerchant(merchantId, { status: decision === "approved" ? "active" : "rejected" });
    setTick((t) => t + 1);
  };

  const markViewed = (merchantId) => {
    setViewed((prev) => new Set(prev).add(merchantId));
  };

  return (
    <div className="max-w-4xl">
      <h1 className="font-display font-bold text-2xl text-green-700 mb-1">KYC Verification</h1>
      <p className="text-sm text-green-300 mb-6">Review submitted PAN & Aadhaar documents before activation.</p>

      <div className="space-y-3">
        {rows.map(({ merchant, kyc }) => {
          const hasDoc = !!kyc.document_url;
          const hasViewedDoc = viewed.has(merchant.merchant_id);
          const mustViewFirst = hasDoc && !hasViewedDoc;
          const panLooksValid = PAN_REGEX.test((kyc.pan || "").toUpperCase());
          const aadhaarLooksValid = (kyc.aadhaar || "").replace(/\D/g, "").length === 12;

          return (
            <div key={merchant.merchant_id} className="card p-5">
              <div className="flex items-center gap-5">
                <div className="w-11 h-11 rounded-xl bg-green-50 text-green-600 flex items-center justify-center shrink-0">
                  <FileText size={20} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-green-700 text-sm">{merchant.business_name}</p>
                  <p className="text-xs text-green-300 mt-0.5">
                    PAN: <span className={`font-mono ${!panLooksValid ? "text-rose-500" : ""}`}>{kyc.pan}</span> · Aadhaar:{" "}
                    <span className={`font-mono ${!aadhaarLooksValid ? "text-rose-500" : ""}`}>{kyc.aadhaar}</span> · Doc:{" "}
                    {kyc.document_name || "document.pdf"}
                  </p>
                </div>
                {hasDoc ? (
                  <a
                    href={kyc.document_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => markViewed(merchant.merchant_id)}
                    className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg shrink-0 ${
                      hasViewedDoc ? "text-emerald-700 border border-emerald-200 bg-emerald-50" : "text-green-600 border border-green-100 hover:bg-green-50"
                    }`}
                  >
                    {hasViewedDoc ? <Check size={13} /> : <Eye size={13} />} {hasViewedDoc ? "Viewed" : "View"}
                  </a>
                ) : (
                  <span className="flex items-center gap-1 text-xs text-amber-600 italic shrink-0">
                    <AlertTriangle size={13} /> No file
                  </span>
                )}
                <StatusBadge status={kyc.verification_status} />
                {kyc.verification_status === "pending" && (
                  <div className="flex gap-2 shrink-0">
                    <button
                      onClick={() => decide(merchant.merchant_id, "approved")}
                      disabled={mustViewFirst}
                      title={mustViewFirst ? "View the document before approving" : ""}
                      className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors ${
                        mustViewFirst
                          ? "text-green-300 border border-green-100 cursor-not-allowed"
                          : "text-emerald-700 border border-emerald-200 hover:bg-emerald-50"
                      }`}
                    >
                      <Check size={13} /> Approve
                    </button>
                    <button
                      onClick={() => decide(merchant.merchant_id, "rejected")}
                      className="flex items-center gap-1.5 text-xs font-semibold text-rose-700 border border-rose-200 px-3 py-1.5 rounded-lg hover:bg-rose-50"
                    >
                      <X size={13} /> Reject
                    </button>
                  </div>
                )}
              </div>

              {kyc.verification_status === "pending" && mustViewFirst && (
                <p className="text-[11px] text-amber-600 bg-amber-50/60 rounded-lg px-3 py-2 mt-3">
                  Open and review the uploaded document before approving this merchant.
                </p>
              )}
              {kyc.verification_status === "pending" && !hasDoc && (
                <p className="text-[11px] text-amber-600 bg-amber-50/60 rounded-lg px-3 py-2 mt-3">
                  No document was uploaded by this merchant — verify carefully before approving, or reject and ask them to resubmit.
                </p>
              )}
              {kyc.verification_status === "pending" && (!panLooksValid || !aadhaarLooksValid) && (
                <p className="text-[11px] text-rose-600 bg-rose-50/60 rounded-lg px-3 py-2 mt-3">
                  {!panLooksValid && "PAN format looks invalid. "}
                  {!aadhaarLooksValid && "Aadhaar format looks invalid."}
                </p>
              )}
            </div>
          );
        })}
        {rows.length === 0 && <p className="text-sm text-green-300 text-center py-10 card">No KYC submissions yet.</p>}
      </div>
    </div>
  );
}
