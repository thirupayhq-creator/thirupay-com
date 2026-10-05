import { useEffect, useReducer, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Volume2, BatteryMedium, Wifi, Play, Truck, Clock, PackageCheck, CheckCircle2, XCircle } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useLanguage } from "../../context/LanguageContext";
import { db } from "../../data/mockData";
import { DEVICE_PRICING } from "../../data/devicePricing";
import { SOUNDBOX_STAGES, deviceStatus, formatAlertTime, getSoundbox, getSoundboxSettings, recentAlerts, saveSoundboxSettings } from "../../data/soundboxData";
import { announcementText, isSpeechSupported, speak } from "../../utils/voiceAlert";
import StatusBadge from "../../components/StatusBadge";
import OrderTracker from "../../components/OrderTracker";

const inr = (n) => `₹${Number(n).toLocaleString("en-IN")}`;
const fmtDate = (iso) => new Date(iso).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });

// What the merchant should understand at each step before the device is Active.
const PROGRESS_COPY = {
  requested: { icon: Clock, title: "Request sent", text: "Waiting for admin approval. We usually review requests within 24–48 hours." },
  approved: { icon: CheckCircle2, title: "Request approved", text: "Your Soundbox is approved. A Device ID will be assigned and the device dispatched next." },
  dispatched: { icon: Truck, title: "Device dispatched", text: "Your Soundbox is on its way." },
  delivered: { icon: PackageCheck, title: "Device delivered", text: "Your Soundbox has arrived. Activation is pending — we'll switch it on shortly." },
};

function Field({ label, children }) {
  return (
    <div>
      <dt className="text-xs font-semibold text-green-400 uppercase tracking-wide">{label}</dt>
      <dd className="text-sm font-semibold text-green-700 mt-1">{children}</dd>
    </div>
  );
}

function StatusTile({ icon: Icon, label, value }) {
  return (
    <div className="rounded-xl bg-green-50/70 p-4 flex items-center gap-3">
      <span className="w-10 h-10 rounded-xl bg-white text-green-600 flex items-center justify-center shrink-0">
        <Icon size={18} />
      </span>
      <div>
        <p className="text-xs text-green-400">{label}</p>
        <p className="font-display font-bold text-lg text-green-700">{value}</p>
      </div>
    </div>
  );
}

function RequestSummary({ request }) {
  const d = request.details || {};
  return (
    <dl className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-5 pt-5 border-t border-green-50">
      <Field label="Requested on">{fmtDate(request.created_at)}</Field>
      <Field label="Quantity">{d.quantity ?? 1}</Field>
      <Field label="Plan">{d.pricingOption === "rental" ? "Rental" : "One-time purchase"}</Field>
      <Field label="Device ID">{d.device_id || "Not assigned yet"}</Field>
      {d.address && (
        <div className="col-span-2 sm:col-span-4">
          <dt className="text-xs font-semibold text-green-400 uppercase tracking-wide">Delivery address</dt>
          <dd className="text-sm text-green-600 mt-1">{d.address}</dd>
        </div>
      )}
    </dl>
  );
}

export default function Soundbox() {
  const { session } = useAuth();
  const { t } = useLanguage();
  const merchantId = session.merchantId;
  const merchant = db.getMerchantById(merchantId);

  // Re-read every couple of seconds (and on cross-tab changes) so admin actions and new payments show up.
  const [, refresh] = useReducer((n) => n + 1, 0);
  useEffect(() => {
    const timer = setInterval(refresh, 2000);
    window.addEventListener("storage", refresh);
    return () => {
      clearInterval(timer);
      window.removeEventListener("storage", refresh);
    };
  }, []);

  const [settings, setSettings] = useState(() => getSoundboxSettings(merchantId));
  const [voiceNote, setVoiceNote] = useState("");
  const updateSettings = (patch) => setSettings(saveSoundboxSettings(merchantId, patch));

  const sb = getSoundbox(merchantId);
  const price = DEVICE_PRICING.soundbox;
  const speechOk = isSpeechSupported();

  const testVoice = () => {
    const ok = speak(announcementText(500), settings.volume);
    setVoiceNote(ok ? "" : "This browser can't play voice. Payment alerts will still show on screen.");
  };

  let body;

  // ---------- No request (or rejected) ----------
  if (sb.state === "none" || sb.state === "rejected") {
    body = (
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="card text-center py-12 px-4">
        <div className="w-14 h-14 rounded-2xl bg-green-50 text-green-500 flex items-center justify-center mx-auto mb-4">
          {sb.state === "rejected" ? <XCircle size={26} /> : <Volume2 size={26} />}
        </div>
        <p className="font-display font-semibold text-green-700">{sb.state === "rejected" ? "Your last Soundbox request was rejected" : "Get a ThiruPay Soundbox"}</p>
        <p className="text-sm text-green-300 mt-1 max-w-md mx-auto">
          {sb.state === "rejected" ? "You can send a new request whenever you're ready." : "Hear every payment the moment it arrives — no need to keep checking your phone."}
        </p>
        <p className="text-xs text-green-400 mt-3">
          From {inr(price.rental)}/month or {inr(price.onetime)} one-time
        </p>
        <Link to="/merchant/services?request=soundbox" className="inline-flex items-center gap-2 mt-5 bg-green-500 hover:bg-green-600 text-white font-semibold px-5 py-2.5 rounded-lg text-sm transition-colors">
          <Volume2 size={16} /> Request Soundbox
        </Link>
      </motion.div>
    );
  }

  // ---------- Requested → delivered ----------
  else if (sb.state !== "active") {
    const copy = PROGRESS_COPY[sb.state];
    const Icon = copy.icon;
    body = (
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="card p-6">
        <div className="flex items-start justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <span className="w-11 h-11 rounded-xl bg-green-50 text-green-600 flex items-center justify-center shrink-0">
              <Icon size={20} />
            </span>
            <div>
              <h2 className="font-display font-semibold text-green-700">{copy.title}</h2>
              <p className="text-sm text-green-400">{sb.state === "dispatched" && sb.deviceId ? `Device ID ${sb.deviceId} has been assigned. ${copy.text}` : copy.text}</p>
            </div>
          </div>
          <StatusBadge status={sb.state === "requested" ? "pending" : sb.state} />
        </div>
        <OrderTracker status={sb.state} stages={SOUNDBOX_STAGES} />
        <RequestSummary request={sb.request} />
      </motion.div>
    );
  }

  // ---------- Active ----------
  else {
    const status = deviceStatus(sb.deviceId);
    const alerts = recentAlerts(merchantId);
    body = (
      <div className="space-y-5">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="card p-6">
          <div className="flex items-start justify-between gap-4 mb-5">
            <div className="flex items-center gap-3">
              <span className="w-11 h-11 rounded-xl bg-green-50 text-green-600 flex items-center justify-center shrink-0">
                <Volume2 size={20} />
              </span>
              <div>
                <h2 className="font-display font-semibold text-green-700">My Soundbox</h2>
                <p className="text-sm text-green-400">Your Soundbox has been approved and activated.</p>
              </div>
            </div>
            <StatusBadge status="active" />
          </div>
          <dl className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <Field label="Device">ThiruPay Soundbox</Field>
            <Field label="Device ID">{sb.deviceId}</Field>
            <Field label="Merchant">{merchant?.business_name}</Field>
            <Field label="Activated on">{sb.activatedAt ? fmtDate(sb.activatedAt) : "—"}</Field>
          </dl>
        </motion.div>

        <div className="card p-6">
          <h2 className="font-display font-semibold text-green-700 mb-4">Today's status</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <StatusTile icon={BatteryMedium} label="Battery" value={`${status.battery}%`} />
            <StatusTile icon={Wifi} label="Connection" value={status.online ? "Online" : "Offline"} />
            <StatusTile icon={Volume2} label="Volume" value={`${settings.volume}%`} />
          </div>
          <p className="text-[11px] text-green-300 mt-3">Battery and connection are simulated until a real device is connected.</p>
        </div>

        <div className="card p-6">
          <h2 className="font-display font-semibold text-green-700 mb-4">Voice alerts</h2>
          <div className="flex items-center justify-between gap-4 mb-5">
            <div>
              <p id="voice-label" className="text-sm font-semibold text-green-700">Announce payments in this browser</p>
              <p className="text-xs text-green-300">Plays a voice message on any merchant page when a payment arrives.</p>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={settings.voice}
              aria-labelledby="voice-label"
              onClick={() => updateSettings({ voice: !settings.voice })}
              className={`relative w-11 h-6 rounded-full transition-colors shrink-0 ${settings.voice ? "bg-green-500" : "bg-green-100"}`}
            >
              <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${settings.voice ? "translate-x-5" : ""}`} />
            </button>
          </div>

          <label htmlFor="sb-volume" className="flex items-center justify-between text-xs font-semibold text-green-500 mb-2">
            <span>Volume</span>
            <span>{settings.volume}%</span>
          </label>
          <input id="sb-volume" type="range" min={0} max={100} step={5} value={settings.volume} onChange={(e) => updateSettings({ volume: Number(e.target.value) })} className="w-full accent-green-600" />

          <div className="flex flex-wrap items-center gap-3 mt-5">
            <button type="button" onClick={testVoice} className="flex items-center gap-2 border border-green-200 text-green-700 hover:bg-green-50 font-semibold px-4 py-2 rounded-lg text-sm transition-colors">
              <Play size={15} /> Test voice
            </button>
            <p className="text-xs text-green-400">Preview: “{announcementText(500)}”</p>
          </div>
          {(!speechOk || voiceNote) && <p role="status" className="text-xs text-amber-700 mt-3">{voiceNote || "This browser can't play voice. Payment alerts will still show on screen."}</p>}
        </div>

        <div className="card overflow-hidden">
          <h2 className="font-display font-semibold text-green-700 px-6 py-4 border-b border-green-50">Recent payment alerts</h2>
          {alerts.length === 0 ? (
            <p className="text-sm text-green-300 text-center py-10 px-4">No payments yet. When a customer pays you, the alert appears here.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm min-w-[420px]">
                <thead className="bg-green-50 text-green-500 text-xs uppercase font-semibold">
                  <tr>
                    <th className="text-left px-6 py-3">Time</th>
                    <th className="text-right px-6 py-3">Amount</th>
                    <th className="text-left px-6 py-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-green-50">
                  {alerts.map((a) => (
                    <tr key={a.id}>
                      <td className="px-6 py-3 text-green-400 text-xs whitespace-nowrap">{formatAlertTime(a.created_at)}</td>
                      <td className="px-6 py-3 text-right font-semibold text-green-700">{inr(a.amount)}</td>
                      <td className="px-6 py-3">
                        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700">
                          <Volume2 size={13} aria-hidden="true" /> Payment received
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl">
      <h1 className="font-display font-bold text-2xl text-green-700">{t("soundboxPageTitle")}</h1>
      <p className="text-sm text-green-300 mb-6">{t("soundboxPageSubtitle")}</p>
      {body}
    </div>
  );
}
