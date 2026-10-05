import { ShieldAlert, LogIn, LogOut, AlertTriangle } from "lucide-react";
import { getAuditLog } from "../../data/auditLog";

const AUTH_ACTIONS = ["Logged in", "Logged out", "Failed login attempt"];

export default function SecurityCenter() {
  const entries = getAuditLog().filter((e) => AUTH_ACTIONS.includes(e.action));
  const failedAttempts = entries.filter((e) => e.action === "Failed login attempt");
  const logins = entries.filter((e) => e.action !== "Failed login attempt");

  return (
    <div className="max-w-3xl">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center shrink-0">
          <ShieldAlert size={20} />
        </div>
        <div>
          <h1 className="font-display font-bold text-xl text-slate-800">Security Center</h1>
          <p className="text-sm text-slate-400">Recent login activity and failed login attempts across the platform.</p>
        </div>
      </div>

      <h2 className="text-sm font-semibold text-rose-700 mb-3 flex items-center gap-2">
        <AlertTriangle size={15} /> Failed Login Attempts ({failedAttempts.length})
      </h2>
      {failedAttempts.length === 0 ? (
        <p className="text-sm text-slate-400 mb-6">No failed attempts logged.</p>
      ) : (
        <div className="bg-white rounded-2xl shadow-card overflow-hidden mb-8 divide-y divide-slate-50">
          {failedAttempts.slice(0, 30).map((e) => (
            <div key={e.id} className="px-5 py-3 flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="text-sm font-medium text-slate-700 truncate">{e.actor}</p>
                <p className="text-xs text-rose-600">{e.details}</p>
              </div>
              <p className="text-[11px] text-slate-400 shrink-0">
                {new Date(e.at).toLocaleString("en-IN", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
              </p>
            </div>
          ))}
        </div>
      )}

      <h2 className="text-sm font-semibold text-emerald-700 mb-3 flex items-center gap-2">
        <LogIn size={15} /> Recent Logins / Logouts
      </h2>
      {logins.length === 0 ? (
        <p className="text-sm text-slate-400">No login activity logged yet.</p>
      ) : (
        <div className="bg-white rounded-2xl shadow-card overflow-hidden divide-y divide-slate-50">
          {logins.slice(0, 30).map((e) => (
            <div key={e.id} className="px-5 py-3 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 min-w-0">
                {e.action === "Logged in" ? <LogIn size={14} className="text-emerald-600 shrink-0" /> : <LogOut size={14} className="text-slate-400 shrink-0" />}
                <div className="min-w-0">
                  <p className="text-sm font-medium text-slate-700 truncate">{e.actor}</p>
                  <p className="text-xs text-slate-400">{e.details}</p>
                </div>
              </div>
              <p className="text-[11px] text-slate-400 shrink-0">
                {new Date(e.at).toLocaleString("en-IN", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
