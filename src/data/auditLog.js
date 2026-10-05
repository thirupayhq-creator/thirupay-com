// Lightweight audit trail for sensitive Super Admin actions. Not a full
// action-level audit system (that would log every click) — just the things
// that matter for accountability: who changed a role's access, and who
// changed the platform's commission rate, and when.

const KEY = "tp_audit_log";
const MAX_ENTRIES = 200; // keep localStorage bounded

export function getAuditLog() {
  try {
    return JSON.parse(localStorage.getItem(KEY)) || [];
  } catch {
    return [];
  }
}

export function logAuditEvent({ actor, action, details }) {
  const entries = getAuditLog();
  entries.unshift({
    id: `audit_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
    actor,
    action,
    details,
    at: new Date().toISOString(),
  });
  localStorage.setItem(KEY, JSON.stringify(entries.slice(0, MAX_ENTRIES)));
}
