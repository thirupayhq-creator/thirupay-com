import { useState } from "react";
import { KeyRound, Lock, Save, RotateCcw } from "lucide-react";
import { ADMIN_ROLES, EDITABLE_PERMISSION_ROLES, ADMIN_ROLE_ACCESS, ADMIN_NAV_LABELS, getEffectiveAccess, setEffectiveAccess } from "../../data/adminRoles";
import { useToast } from "../../context/ToastContext";
import { useAuth } from "../../context/AuthContext";
import { logAuditEvent } from "../../data/auditLog";

// Modules shown as rows. "staff" (Staff Management) is deliberately excluded —
// it's Super Admin-only forever, not something this matrix can grant to anyone.
const MODULES = Object.keys(ADMIN_NAV_LABELS).filter((k) => k !== "staff");

function buildInitialState() {
  const state = {};
  for (const role of EDITABLE_PERMISSION_ROLES) {
    state[role] = new Set(getEffectiveAccess(role));
  }
  return state;
}

export default function RolesPermissions() {
  const { session } = useAuth();
  const { showToast } = useToast();
  const [access, setAccess] = useState(buildInitialState);
  const [committed, setCommitted] = useState(buildInitialState); // last-saved state, for audit diffing
  const [dirty, setDirty] = useState(false);

  const toggle = (role, moduleKey) => {
    setAccess((prev) => {
      const next = { ...prev, [role]: new Set(prev[role]) };
      if (next[role].has(moduleKey)) next[role].delete(moduleKey);
      else next[role].add(moduleKey);
      return next;
    });
    setDirty(true);
  };

  const save = () => {
    for (const role of EDITABLE_PERMISSION_ROLES) {
      setEffectiveAccess(role, [...access[role]]);

      const before = committed[role];
      const after = access[role];
      const added = [...after].filter((k) => !before.has(k)).map((k) => ADMIN_NAV_LABELS[k]);
      const removed = [...before].filter((k) => !after.has(k)).map((k) => ADMIN_NAV_LABELS[k]);
      if (added.length || removed.length) {
        const parts = [];
        if (added.length) parts.push(`added ${added.join(", ")}`);
        if (removed.length) parts.push(`removed ${removed.join(", ")}`);
        logAuditEvent({ actor: session?.name || "Super Admin", action: `Changed ${role} permissions`, details: parts.join(" · ") });
      }
    }
    setCommitted(access);
    setDirty(false);
    showToast({ title: "Permissions saved", subtitle: "Staff will see the updated access on their next page load.", type: "success" });
  };

  const resetToDefaults = () => {
    const state = {};
    for (const role of EDITABLE_PERMISSION_ROLES) state[role] = new Set(ADMIN_ROLE_ACCESS[role]);
    setAccess(state);
    setDirty(true);
  };

  return (
    <div className="max-w-5xl">
      <div className="flex items-center gap-3 mb-1">
        <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center shrink-0">
          <KeyRound size={20} />
        </div>
        <div>
          <h1 className="font-display font-bold text-xl text-slate-800">Roles & Permissions</h1>
          <p className="text-sm text-slate-400">Control which admin sections each staff role can access.</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-card mt-6 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="text-left font-semibold text-slate-500 px-5 py-3 whitespace-nowrap">Module</th>
                {ADMIN_ROLES.map((role) => (
                  <th key={role} className="text-center font-semibold text-slate-500 px-4 py-3 whitespace-nowrap">
                    <div className="flex items-center justify-center gap-1.5">
                      {role}
                      {role === "Super Admin" && <Lock size={11} className="text-slate-300" />}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {MODULES.map((moduleKey) => (
                <tr key={moduleKey} className="border-b border-slate-50 last:border-0">
                  <td className="px-5 py-3 font-medium text-slate-700 whitespace-nowrap">{ADMIN_NAV_LABELS[moduleKey]}</td>
                  {ADMIN_ROLES.map((role) => {
                    const editable = EDITABLE_PERMISSION_ROLES.includes(role);
                    const checked = editable ? access[role]?.has(moduleKey) : true; // Super Admin only, always full access
                    return (
                      <td key={role} className="text-center px-4 py-3">
                        <input
                          type="checkbox"
                          checked={checked}
                          disabled={!editable}
                          onChange={() => toggle(role, moduleKey)}
                          className={editable ? "w-4 h-4 accent-amber-500 cursor-pointer" : "w-4 h-4 accent-slate-300 cursor-not-allowed opacity-60"}
                        />
                      </td>
                    );
                  })}
                </tr>
              ))}
              <tr>
                <td className="px-5 py-3 font-medium text-slate-700">Staff Management</td>
                {ADMIN_ROLES.map((role) => (
                  <td key={role} className="text-center px-4 py-3">
                    <input type="checkbox" checked={role === "Super Admin"} disabled className="w-4 h-4 accent-slate-300 cursor-not-allowed opacity-60" />
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between px-5 py-4 bg-slate-50 border-t border-slate-100">
          <p className="text-xs text-slate-400">
            <Lock size={11} className="inline -mt-0.5 mr-1" />
            Super Admin always has full access and can't be edited here.
          </p>
          <div className="flex items-center gap-2">
            <button onClick={resetToDefaults} className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-700 px-3 py-2 rounded-lg hover:bg-slate-100">
              <RotateCcw size={13} /> Reset to defaults
            </button>
            <button
              onClick={save}
              disabled={!dirty}
              className="flex items-center gap-1.5 text-sm font-semibold text-white bg-[#0B1220] hover:bg-black disabled:opacity-40 disabled:cursor-not-allowed px-4 py-2 rounded-lg"
            >
              <Save size={14} /> Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
