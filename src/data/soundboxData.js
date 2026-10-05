// Soundbox (merchant device) — built on the existing hardware Service Requests:
//   requested → approved → dispatched (Device ID assigned) → delivered → active
// (or requested → rejected). Once ACTIVE the merchant's Soundbox page shows the device,
// its status and recent payment alerts, and every new payment is announced.
//
// Battery / connection are SIMULATED (no real device yet). Volume and the voice switch are
// merchant settings. When a real device + backend exist, replace deviceStatus() with live data.

import { db } from "./mockData";
import { SOUNDBOX_STAGES } from "./devicePricing";

const SETTINGS_KEY = "tp_soundbox_settings";
const ID_PREFIX = "TP-SB-";
const FIRST_ID_NUMBER = 10245;

const RANK = { active: 5, delivered: 4, dispatched: 3, approved: 2, requested: 1, rejected: 0 };

// ---------- State derived from the merchant's soundbox requests ----------
// The most advanced request wins (so an old rejected request never hides a newer one).
export function soundboxFromRequests(requests) {
  const list = requests.filter((r) => r.type === "soundbox");
  if (list.length === 0) return { state: "none", request: null, deviceId: null, activatedAt: null };
  const best = list.slice().sort((a, b) => (RANK[b.status] ?? 1) - (RANK[a.status] ?? 1) || new Date(b.created_at) - new Date(a.created_at))[0];
  return {
    state: best.status in RANK ? best.status : "requested",
    request: best,
    deviceId: best.details?.device_id || null,
    activatedAt: best.details?.activated_at || null,
  };
}

export const getSoundbox = (merchantId) => soundboxFromRequests(db.getRequestsByMerchant(merchantId));

// A merchant can (re)request only when they have none or the last one was rejected.
export const canRequestSoundbox = (sb) => sb.state === "none" || sb.state === "rejected";

// ---------- Admin actions ----------
export function suggestDeviceId(requests = db.getAllRequests()) {
  const used = requests
    .map((r) => parseInt(String(r.details?.device_id || "").replace(/\D/g, ""), 10))
    .filter(Number.isFinite);
  return `${ID_PREFIX}${Math.max(FIRST_ID_NUMBER - 1, ...used) + 1}`;
}

export function validateDeviceId(input, requests, requestId) {
  const id = String(input || "").trim().toUpperCase();
  if (!id) return { error: "Enter a Device ID, e.g. TP-SB-10245." };
  if (!/^[A-Z0-9][A-Z0-9-]{3,19}$/.test(id)) return { error: "Use 4–20 letters, numbers or hyphens, e.g. TP-SB-10245." };
  if (requests.some((r) => r.request_id !== requestId && String(r.details?.device_id || "").toUpperCase() === id)) return { error: "This Device ID is already assigned to another request." };
  return { id };
}

// approved → dispatched, with the device assigned.
// If a request somehow reached "dispatched" or "delivered" without a device (e.g. it was
// advanced before this feature existed), this also lets admin assign one there without
// pushing the status backwards.
export function assignDeviceAndDispatch(requestId, deviceIdInput) {
  const requests = db.getAllRequests();
  const req = requests.find((r) => r.request_id === requestId);
  if (!req || req.type !== "soundbox") return { ok: false, error: "Request not found." };
  if (!["approved", "dispatched", "delivered"].includes(req.status)) return { ok: false, error: "Approve the request first, then assign a device." };
  const { id, error } = validateDeviceId(deviceIdInput, requests, requestId);
  if (error) return { ok: false, error };
  const patch = { details: { device_id: id } };
  if (req.status === "approved") {
    patch.status = "dispatched";
    patch.details.dispatched_at = new Date().toISOString();
  }
  db.updateRequest(requestId, patch);
  return { ok: true, deviceId: id };
}

// delivered → active
export function activateSoundbox(requestId) {
  const req = db.getAllRequests().find((r) => r.request_id === requestId);
  if (!req || req.type !== "soundbox") return { ok: false, error: "Request not found." };
  if (req.status !== "delivered") return { ok: false, error: "Mark the device as delivered before activating it." };
  if (!req.details?.device_id) return { ok: false, error: "Assign a Device ID before activating." };
  db.updateRequest(requestId, { status: "active", details: { activated_at: new Date().toISOString() } });
  return { ok: true };
}

// ---------- Merchant settings ----------
export function getSoundboxSettings(merchantId) {
  let all = {};
  try {
    all = JSON.parse(localStorage.getItem(SETTINGS_KEY) || "{}");
  } catch {
    all = {};
  }
  return { volume: 70, voice: true, ...all[merchantId] };
}

export function saveSoundboxSettings(merchantId, patch) {
  let all = {};
  try {
    all = JSON.parse(localStorage.getItem(SETTINGS_KEY) || "{}");
  } catch {
    all = {};
  }
  const next = { ...getSoundboxSettings(merchantId), ...patch };
  next.volume = Math.min(100, Math.max(0, Math.round(Number(next.volume) || 0)));
  all[merchantId] = next;
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(all));
  } catch {
    // storage full/unavailable — the setting just won't persist
  }
  return next;
}

// ---------- Device status (simulated) ----------
export function deviceStatus(deviceId) {
  const n = parseInt(String(deviceId || "").replace(/\D/g, ""), 10) || 0;
  return { battery: 60 + (n % 36), online: true };
}

// ---------- Alerts ----------
// Latest successful payments = what the Soundbox announced.
export function recentAlerts(merchantId, limit = 8) {
  return db
    .getTxnsByMerchant(merchantId)
    .filter((t) => t.status === "success")
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, limit)
    .map((t) => ({ id: t.transaction_id, amount: t.amount, created_at: t.created_at, mode: t.payment_mode }));
}

export function formatAlertTime(iso, now = new Date()) {
  const d = new Date(iso);
  const time = d.toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit", hour12: true }).toUpperCase();
  const sameDay = d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth() && d.getDate() === now.getDate();
  return sameDay ? time : `${d.toLocaleDateString("en-IN", { day: "2-digit", month: "short" })}, ${time}`;
}

export { SOUNDBOX_STAGES };
