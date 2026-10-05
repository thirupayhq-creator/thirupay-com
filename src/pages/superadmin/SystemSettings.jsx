import { useState } from "react";
import { Settings, Save, Percent, CreditCard, LifeBuoy } from "lucide-react";
import { getMdrPercent, setMdrPercent } from "../../data/feeConfig";
import { PAYMENT_MODES, isPaymentModeEnabled, setPaymentModeEnabled } from "../../data/paymentModes";
import { getSupportContact, setSupportContact } from "../../data/supportSettings";
import { useToast } from "../../context/ToastContext";
import { useAuth } from "../../context/AuthContext";
import { logAuditEvent } from "../../data/auditLog";

function SettingsCard({ icon: Icon, title, subtitle, children }) {
  return (
    <div className="bg-white rounded-2xl shadow-card p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-9 h-9 rounded-lg bg-amber-50 text-amber-500 flex items-center justify-center shrink-0">
          <Icon size={17} />
        </div>
        <div>
          <p className="font-semibold text-slate-800 text-sm">{title}</p>
          {subtitle && <p className="text-xs text-slate-400">{subtitle}</p>}
        </div>
      </div>
      {children}
    </div>
  );
}

export default function SystemSettings() {
  const { session } = useAuth();
  const { showToast } = useToast();

  const [mdr, setMdr] = useState(getMdrPercent());
  const [modes, setModes] = useState(() => Object.fromEntries(PAYMENT_MODES.map((m) => [m.key, isPaymentModeEnabled(m.key)])));
  const [contact, setContact] = useState(getSupportContact());

  const saveMdr = () => {
    const previous = getMdrPercent();
    setMdrPercent(mdr);
    if (Number(mdr) !== previous) {
      logAuditEvent({ actor: session?.name || "Super Admin", action: "Changed MDR rate", details: `${previous}% → ${mdr}%` });
    }
    showToast({ title: "MDR rate updated", subtitle: `Now ${mdr}% on every successful payment.`, type: "success" });
  };

  const toggleMode = (key) => {
    const next = !modes[key];
    const enabledCount = Object.values({ ...modes, [key]: next }).filter(Boolean).length;
    if (enabledCount === 0) {
      showToast({ title: "At least one payment mode must stay enabled", type: "error" });
      return;
    }
    setModes((prev) => ({ ...prev, [key]: next }));
    setPaymentModeEnabled(key, next);
    showToast({ title: `${key} ${next ? "enabled" : "disabled"}`, subtitle: "Reflects immediately on QR, Payment Links and the pay page.", type: "success" });
  };

  const saveContact = () => {
    setSupportContact(contact);
    showToast({ title: "Support contact updated", subtitle: "Merchants will see this on the Help & Support page.", type: "success" });
  };

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center shrink-0">
          <Settings size={20} />
        </div>
        <div>
          <h1 className="font-display font-bold text-xl text-slate-800">System Settings</h1>
          <p className="text-sm text-slate-400">Platform-wide configuration — changes apply everywhere immediately.</p>
        </div>
      </div>

      <SettingsCard icon={Percent} title="Commission / MDR Rate" subtitle="Flat rate charged on every successful payment, across all merchants.">
        <div className="flex items-end gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1.5">MDR %</label>
            <input
              type="number"
              min="0"
              step="0.1"
              value={mdr}
              onChange={(e) => setMdr(e.target.value)}
              className="w-28 px-3 py-2 rounded-lg border border-slate-200 focus:border-amber-500 outline-none text-sm"
            />
          </div>
          <button onClick={saveMdr} className="flex items-center gap-1.5 text-sm font-semibold text-white bg-[#0B1220] hover:bg-black px-4 py-2 rounded-lg">
            <Save size={14} /> Save
          </button>
        </div>
        <p className="text-[11px] text-slate-400 mt-2">
          Feeds the Commission Dashboard and every fee/net calculation in Transactions, Insights and receipts.
        </p>
      </SettingsCard>

      <SettingsCard icon={CreditCard} title="Payment Modes" subtitle="Turn a mode off to remove it from QR, Payment Links and the customer pay page.">
        <div className="space-y-2.5">
          {PAYMENT_MODES.map((m) => (
            <label key={m.key} className="flex items-center justify-between px-3 py-2.5 rounded-lg border border-slate-100 cursor-pointer">
              <span className="text-sm font-medium text-slate-700">{m.label}</span>
              <input type="checkbox" checked={modes[m.key]} onChange={() => toggleMode(m.key)} className="w-4 h-4 accent-amber-500 cursor-pointer" />
            </label>
          ))}
        </div>
      </SettingsCard>

      <SettingsCard icon={LifeBuoy} title="Support Contact Info" subtitle="Shown to every merchant on the Help & Support page.">
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1.5">Merchant Helpline</label>
            <input
              value={contact.helpline}
              onChange={(e) => setContact({ ...contact, helpline: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:border-amber-500 outline-none text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1.5">Email Support</label>
            <input
              value={contact.email}
              onChange={(e) => setContact({ ...contact, email: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:border-amber-500 outline-none text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1.5">Support Hours</label>
            <input
              value={contact.hours}
              onChange={(e) => setContact({ ...contact, hours: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:border-amber-500 outline-none text-sm"
            />
          </div>
          <button onClick={saveContact} className="flex items-center gap-1.5 text-sm font-semibold text-white bg-[#0B1220] hover:bg-black px-4 py-2 rounded-lg">
            <Save size={14} /> Save
          </button>
        </div>
      </SettingsCard>
    </div>
  );
}
