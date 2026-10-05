import { useState } from "react";
import { ShieldAlert, Ban, Flag, ShieldCheck, FlagOff } from "lucide-react";
import { db } from "../../data/mockData";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import { logAuditEvent } from "../../data/auditLog";

export default function RiskMonitoring() {
  const { session } = useAuth();
  const { showToast } = useToast();
  const [, setTick] = useState(0);

  const merchants = db.getMerchants();
  const blocked = merchants.filter((m) => m.status === "suspended");
  const flagged = merchants.filter((m) => m.review_flag);

  const reactivate = (merchant) => {
    if (!window.confirm(`Reactivate ${merchant.business_name}?`)) return;
    db.updateMerchant(merchant.merchant_id, { status: "active", block_reason: null });
    logAuditEvent({ actor: session?.name || "Super Admin", action: "Reactivated merchant", details: merchant.business_name });
    showToast({ title: "Merchant reactivated", type: "success" });
    setTick((t) => t + 1);
  };

  const clearFlag = (merchant) => {
    db.setMerchantReviewFlag(merchant.merchant_id, null, null);
    logAuditEvent({ actor: session?.name || "Super Admin", action: "Cleared review flag", details: merchant.business_name });
    showToast({ title: "Review flag cleared", type: "success" });
    setTick((t) => t + 1);
  };


  return (
    <div className="max-w-3xl">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center shrink-0">
          <ShieldAlert size={20} />
        </div>
        <div>
          <h1 className="font-display font-bold text-xl text-slate-800">Risk Monitoring</h1>
          <p className="text-sm text-slate-400">Blocked and under-review merchant accounts, in one place.</p>
        </div>
      </div>

      <h2 className="text-sm font-semibold text-rose-700 mb-3 flex items-center gap-2">
        <Ban size={15} /> Blocked ({blocked.length})
      </h2>
      {blocked.length === 0 ? (
        <p className="text-sm text-slate-400 mb-6">No blocked merchants.</p>
      ) : (
        <div className="space-y-2.5 mb-8">
          {blocked.map((m) => (
            <div key={m.merchant_id} className="bg-white rounded-xl shadow-card p-4 flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="font-semibold text-slate-800 text-sm truncate">{m.business_name}</p>
                <p className="text-xs text-rose-600 mt-0.5">{m.block_reason || "No reason given"}</p>
                {m.blocked_at && (
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Blocked {new Date(m.blocked_at).toLocaleString("en-IN", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                  </p>
                )}
              </div>
              <button
                onClick={() => reactivate(m)}
                className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700 border border-emerald-200 px-3 py-1.5 rounded-lg hover:bg-emerald-50 shrink-0"
              >
                <ShieldCheck size={13} /> Reactivate
              </button>
            </div>
          ))}
        </div>
      )}

      <h2 className="text-sm font-semibold text-amber-700 mb-3 flex items-center gap-2">
        <Flag size={15} /> Under Review ({flagged.length})
      </h2>
      {flagged.length === 0 ? (
        <p className="text-sm text-slate-400">No merchants under review.</p>
      ) : (
        <div className="space-y-2.5">
          {flagged.map((m) => (
            <div key={m.merchant_id} className="bg-white rounded-xl shadow-card p-4 flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="font-semibold text-slate-800 text-sm truncate">{m.business_name}</p>
                <p className="text-xs text-amber-700 mt-0.5">{m.review_flag.note}</p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Flagged by {m.review_flag.flaggedBy} · {new Date(m.review_flag.flaggedAt).toLocaleString("en-IN", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                </p>
              </div>
              <button
                onClick={() => clearFlag(m)}
                className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 border border-slate-200 px-3 py-1.5 rounded-lg hover:bg-slate-50 shrink-0"
              >
                <FlagOff size={13} /> Clear
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
