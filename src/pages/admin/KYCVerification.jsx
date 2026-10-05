import { useState } from "react";
import { FileText, Check, X, Eye, AlertTriangle, ChevronDown, ChevronUp, Ban, Flag, FlagOff, ShieldCheck } from "lucide-react";
import { db } from "../../data/mockData";
import { useAuth } from "../../context/AuthContext";
import { logAuditEvent } from "../../data/auditLog";
import StatusBadge from "../../components/StatusBadge";

const PAN_REGEX = /^[A-Z]{5}[0-9]{4}[A-Z]$/;

const IDENTITY_DOC_LABELS = {
  aadhaar: "Aadhaar",
  passport: "Passport",
  driving_licence: "Driving Licence",
  voter_id: "Voter ID",
};

// A single doc row inside an expanded section: label, value, and a View link that must be
// clicked before this document counts as "reviewed" for the approve gate.
function DocRow({ label, value, fileName, fileUrl, viewKey, viewedSet, onView }) {
  const hasFile = !!fileUrl;
  const isViewed = viewedSet.has(viewKey);

  return (
    <div className="flex items-center justify-between gap-3 py-1.5">
      <div className="min-w-0">
        <p className="text-xs text-green-300">{label}</p>
        <p className="text-sm font-mono text-green-700 truncate">{value || "—"}</p>
        {fileName && <p className="text-[11px] text-green-300 truncate">{fileName}</p>}
      </div>
      {hasFile ? (
        <a
          href={fileUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => onView(viewKey)}
          className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg shrink-0 ${
            isViewed
              ? "text-emerald-700 border border-emerald-200 bg-emerald-50"
              : "text-green-600 border border-green-100 hover:bg-green-50"
          }`}
        >
          {isViewed ? <Check size={13} /> : <Eye size={13} />} {isViewed ? "Viewed" : "View"}
        </a>
      ) : (
        <span className="flex items-center gap-1 text-xs text-amber-600 italic shrink-0">
          <AlertTriangle size={13} /> No file
        </span>
      )}
    </div>
  );
}

export default function KYCVerification() {
  const { session } = useAuth();
  // Super Admin oversees KYC (can open every document) but does not approve or
  // reject — that is the Admin's job.
  const isSuperAdmin = session?.adminRole === "Super Admin";
  const [, setTick] = useState(0);
  const [viewed, setViewed] = useState(new Set());
  const [expanded, setExpanded] = useState(new Set());
  const merchants = db.getMerchants();

  const rows = merchants
    .map((m) => ({ merchant: m, kyc: db.getKycByMerchant(m.merchant_id) }))
    .filter((r) => r.kyc);

  const decide = (merchantId, decision) => {
    if (isSuperAdmin) return;
    db.updateKycStatus(merchantId, decision, session);
    db.updateMerchant(merchantId, { status: decision === "approved" ? "active" : "rejected" });
    setTick((t) => t + 1);
  };

  const markViewed = (viewKey) => {
    setViewed((prev) => new Set(prev).add(viewKey));
  };

  const toggleExpanded = (merchantId) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(merchantId)) next.delete(merchantId);
      else next.add(merchantId);
      return next;
    });
  };

  // Risk/fraud actions — Super Admin only. These sit outside the normal Admin
  // KYC approve/reject flow: blocking is an urgent platform-level risk call,
  // and flagging for review doesn't touch the merchant's operational status.
  const handleBlock = (merchant) => {
    if (merchant.status === "suspended") {
      if (!window.confirm(`Reactivate ${merchant.business_name}? They'll be able to accept payments again.`)) return;
      db.updateMerchant(merchant.merchant_id, { status: "active", block_reason: null });
      logAuditEvent({ actor: session?.name || "Super Admin", action: "Reactivated merchant", details: merchant.business_name });
    } else {
      const reason = window.prompt(`Block ${merchant.business_name} for fraud/risk? This immediately stops them accepting payments.\n\nReason (shown in the audit log):`);
      if (reason === null) return; // cancelled
      db.blockMerchant(merchant.merchant_id, reason || "No reason given");
      logAuditEvent({ actor: session?.name || "Super Admin", action: "Blocked merchant (fraud/risk)", details: `${merchant.business_name}${reason ? ` — ${reason}` : ""}` });
    }
    setTick((t) => t + 1);
  };

  const handleReviewFlag = (merchant) => {
    if (merchant.review_flag) {
      db.setMerchantReviewFlag(merchant.merchant_id, null, null);
      logAuditEvent({ actor: session?.name || "Super Admin", action: "Cleared review flag", details: merchant.business_name });
    } else {
      const note = window.prompt(`Flag ${merchant.business_name} for review? They'll see "Your account is under review" — they can keep transacting.\n\nNote (internal, shown in the audit log):`);
      if (!note) return; // cancelled or empty
      db.setMerchantReviewFlag(merchant.merchant_id, note, session?.name || "Super Admin");
      logAuditEvent({ actor: session?.name || "Super Admin", action: "Flagged merchant for review", details: `${merchant.business_name} — ${note}` });
    }
    setTick((t) => t + 1);
  };

  return (
    <div className="max-w-4xl">
      <h1 className="font-display font-bold text-2xl text-green-700 mb-1">KYC Verification</h1>
      <p className="text-sm text-green-300 mb-6">
        Review Company Identity, Identity Verification &amp; Company Documents before activation.
      </p>

      <div className="space-y-3">
        {rows.map(({ merchant, kyc }) => {
          const mId = merchant.merchant_id;
          const isOpen = expanded.has(mId);
          const identityLabel = IDENTITY_DOC_LABELS[kyc.identity_doc_type] || kyc.identity_doc_type || "Identity Document";
          const panLooksValid = PAN_REGEX.test((kyc.pan || "").toUpperCase());

          // Every uploaded file this merchant submitted, each with its own view-gate key.
          const fileChecks = [
            { key: `${mId}-pan`, url: kyc.pan_document_url },
            { key: `${mId}-identity`, url: kyc.identity_document_url },
            { key: `${mId}-directors`, url: kyc.directors_zip_url },
            { key: `${mId}-incorporation`, url: kyc.incorporation_document_url },
          ].filter((f) => f.url);

          const allFilesViewed = fileChecks.every((f) => viewed.has(f.key));
          const mustViewFirst = fileChecks.length > 0 && !allFilesViewed;
          const noFilesAtAll = fileChecks.length === 0;

          return (
            <div key={mId} className="card p-5">
              <div className="flex items-center gap-5 flex-wrap gap-y-2">
                <div className="w-11 h-11 rounded-xl bg-green-50 text-green-600 flex items-center justify-center shrink-0">
                  <FileText size={20} />
                </div>
                <button
                  type="button"
                  onClick={() => toggleExpanded(mId)}
                  className="flex-1 min-w-0 text-left flex items-center gap-2"
                >
                  <div className="min-w-0">
                    <p className="font-semibold text-green-700 text-sm">{merchant.business_name}</p>
                    <p className="text-xs text-green-300 mt-0.5">
                      PAN: <span className={`font-mono ${!panLooksValid ? "text-rose-500" : ""}`}>{kyc.pan}</span> ·{" "}
                      {identityLabel}: <span className="font-mono">{kyc.identity_doc_number || "—"}</span> · Directors:{" "}
                      {kyc.number_of_directors || "—"}
                    </p>
                    {kyc.verification_status !== "pending" && kyc.reviewed_by && (
                      <p className="text-[11px] text-green-300 mt-0.5">
                        {kyc.verification_status === "approved" ? "Approved" : "Rejected"} by {kyc.reviewed_by}
                        {kyc.reviewed_at ? ` · ${new Date(kyc.reviewed_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}` : ""}
                      </p>
                    )}
                  </div>
                  {isOpen ? <ChevronUp size={16} className="text-green-300" /> : <ChevronDown size={16} className="text-green-300" />}
                </button>
                <StatusBadge status={kyc.verification_status} />
                {merchant.status === "suspended" && (
                  <span className="text-[11px] font-semibold text-rose-700 bg-rose-50 border border-rose-200 px-2.5 py-1 rounded-lg shrink-0">
                    Blocked
                  </span>
                )}
                {merchant.review_flag && (
                  <span
                    title={merchant.review_flag.note}
                    className="text-[11px] font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-lg shrink-0"
                  >
                    🚩 Under review
                  </span>
                )}
                {kyc.verification_status === "pending" && isSuperAdmin && (
                  <span className="text-[11px] font-semibold text-amber-600 bg-amber-50 border border-amber-100 px-2.5 py-1 rounded-lg shrink-0">
                    View only · Admin approves
                  </span>
                )}
                {kyc.verification_status === "pending" && !isSuperAdmin && (
                  <div className="flex gap-2 shrink-0">
                    <button
                      onClick={() => decide(mId, "approved")}
                      disabled={mustViewFirst}
                      title={mustViewFirst ? "View all submitted documents before approving" : ""}
                      className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors ${
                        mustViewFirst
                          ? "text-green-300 border border-green-100 cursor-not-allowed"
                          : "text-emerald-700 border border-emerald-200 hover:bg-emerald-50"
                      }`}
                    >
                      <Check size={13} /> Approve
                    </button>
                    <button
                      onClick={() => decide(mId, "rejected")}
                      className="flex items-center gap-1.5 text-xs font-semibold text-rose-700 border border-rose-200 px-3 py-1.5 rounded-lg hover:bg-rose-50"
                    >
                      <X size={13} /> Reject
                    </button>
                  </div>
                )}
                {isSuperAdmin && (
                  <div className="flex gap-2 shrink-0">
                    <button
                      onClick={() => handleReviewFlag(merchant)}
                      title={merchant.review_flag ? "Clear review flag" : "Flag for review"}
                      className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors ${
                        merchant.review_flag
                          ? "text-slate-600 border border-slate-200 hover:bg-slate-50"
                          : "text-amber-700 border border-amber-200 hover:bg-amber-50"
                      }`}
                    >
                      {merchant.review_flag ? <FlagOff size={13} /> : <Flag size={13} />}
                      {merchant.review_flag ? "Clear Flag" : "Flag for Review"}
                    </button>
                    <button
                      onClick={() => handleBlock(merchant)}
                      title={merchant.status === "suspended" ? "Reactivate merchant" : "Block for fraud/risk"}
                      className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors ${
                        merchant.status === "suspended"
                          ? "text-emerald-700 border border-emerald-200 hover:bg-emerald-50"
                          : "text-rose-700 border border-rose-200 hover:bg-rose-50"
                      }`}
                    >
                      {merchant.status === "suspended" ? <ShieldCheck size={13} /> : <Ban size={13} />}
                      {merchant.status === "suspended" ? "Reactivate" : "Block"}
                    </button>
                  </div>
                )}
              </div>

              {isOpen && (
                <div className="mt-4 pt-4 border-t border-green-50 grid sm:grid-cols-2 gap-x-6 gap-y-4">
                  <div>
                    <p className="text-xs font-semibold text-green-700 mb-1.5">Company Identity</p>
                    <DocRow
                      label="PAN Number"
                      value={kyc.pan}
                      fileName={kyc.pan_document_name}
                      fileUrl={kyc.pan_document_url}
                      viewKey={`${mId}-pan`}
                      viewedSet={viewed}
                      onView={markViewed}
                    />
                  </div>

                  <div>
                    <p className="text-xs font-semibold text-green-700 mb-1.5">Identity Verification ({identityLabel})</p>
                    <DocRow
                      label={`${identityLabel} Number`}
                      value={kyc.identity_doc_number}
                      fileName={kyc.identity_document_name}
                      fileUrl={kyc.identity_document_url}
                      viewKey={`${mId}-identity`}
                      viewedSet={viewed}
                      onView={markViewed}
                    />
                  </div>

                  <div>
                    <p className="text-xs font-semibold text-green-700 mb-1.5">Company Documents</p>
                    <DocRow
                      label="Directors List (ZIP)"
                      value={`${kyc.number_of_directors || "—"} directors`}
                      fileName={kyc.directors_zip_name}
                      fileUrl={kyc.directors_zip_url}
                      viewKey={`${mId}-directors`}
                      viewedSet={viewed}
                      onView={markViewed}
                    />
                  </div>

                  <div>
                    <p className="text-xs font-semibold text-green-700 mb-1.5 opacity-0 select-none">.</p>
                    <DocRow
                      label="Certificate of Incorporation"
                      value="CIN / MOA / AOA"
                      fileName={kyc.incorporation_document_name}
                      fileUrl={kyc.incorporation_document_url}
                      viewKey={`${mId}-incorporation`}
                      viewedSet={viewed}
                      onView={markViewed}
                    />
                  </div>
                </div>
              )}

              {kyc.verification_status === "pending" && mustViewFirst && (
                <p className="text-[11px] text-amber-600 bg-amber-50/60 rounded-lg px-3 py-2 mt-3">
                  Expand and view every submitted document before approving this merchant.
                </p>
              )}
              {kyc.verification_status === "pending" && noFilesAtAll && (
                <p className="text-[11px] text-amber-600 bg-amber-50/60 rounded-lg px-3 py-2 mt-3">
                  No documents were uploaded by this merchant — verify carefully before approving, or reject and ask them to resubmit.
                </p>
              )}
              {kyc.verification_status === "pending" && !panLooksValid && (
                <p className="text-[11px] text-rose-600 bg-rose-50/60 rounded-lg px-3 py-2 mt-3">PAN format looks invalid.</p>
              )}
            </div>
          );
        })}
        {rows.length === 0 && <p className="text-sm text-green-300 text-center py-10 card">No KYC submissions yet.</p>}
      </div>
    </div>
  );
}