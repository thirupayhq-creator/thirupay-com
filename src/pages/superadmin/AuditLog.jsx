import { ScrollText } from "lucide-react";
import { getAuditLog } from "../../data/auditLog";

export default function AuditLog() {
  const entries = getAuditLog();

  return (
    <div className="max-w-3xl">
      <div className="flex items-center gap-3 mb-1">
        <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center shrink-0">
          <ScrollText size={20} />
        </div>
        <div>
          <h1 className="font-display font-bold text-xl text-slate-800">Audit Log</h1>
          <p className="text-sm text-slate-400">Who changed role permissions or the MDR rate, and when.</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-card mt-6 overflow-hidden">
        {entries.length === 0 ? (
          <p className="text-sm text-slate-400 text-center py-12">No changes logged yet.</p>
        ) : (
          <div className="divide-y divide-slate-50">
            {entries.map((e) => (
              <div key={e.id} className="px-5 py-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-semibold text-slate-800">{e.action}</p>
                  <p className="text-[11px] text-slate-400 shrink-0">
                    {new Date(e.at).toLocaleString("en-IN", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                  </p>
                </div>
                <p className="text-xs text-slate-400 mt-1">by {e.actor}</p>
                {e.details && <p className="text-xs text-slate-500 mt-1">{e.details}</p>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
