import { useState } from "react";
import { Banknote, ShieldPlus, Volume2, Smartphone, Check, X, Truck, PackageCheck, Receipt, Power } from "lucide-react";
import { db } from "../../data/mockData";
import { useToast } from "../../context/ToastContext";
import { SOUNDBOX_STAGES } from "../../data/devicePricing";
import { activateSoundbox, assignDeviceAndDispatch, suggestDeviceId } from "../../data/soundboxData";
import Modal from "../../components/Modal";
import StatusBadge from "../../components/StatusBadge";
import OrderTracker from "../../components/OrderTracker";

const ICONS = {
  loan: Banknote,
  insurance: ShieldPlus,
  soundbox: Volume2,
  pos_device: Smartphone,
};

const HARDWARE_TYPES = ["soundbox", "pos_device"];

function fmtDate(iso) {
  return new Date(iso).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

function fmtMoney(n) {
  return `₹${Number(n).toLocaleString("en-IN")}`;
}

function detailsSummary(req) {
  switch (req.type) {
    case "loan":
      return `${fmtMoney(req.details.amount)} · ${req.details.purpose} · Turnover ${fmtMoney(req.details.turnover)}/mo`;
    case "insurance":
      return `${req.details.insuranceType} · Coverage ${fmtMoney(req.details.coverage)}`;
    case "soundbox":
    case "pos_device": {
      const plan = req.details.pricingOption === "rental" ? "Rental" : "One-time";
      const device = req.details.deviceType || (req.type === "soundbox" ? "SoundBox" : "POS Device");
      return `${device} · Qty ${req.details.quantity} · ${plan}${req.details.device_id ? ` · ${req.details.device_id}` : ""}`;
    }
    default:
      return "";
  }
}

// Admin picks the Device ID that goes out with the Soundbox; approved → dispatched.
function AssignDeviceModal({ request, onClose, onDone }) {
  const [deviceId, setDeviceId] = useState(() => suggestDeviceId());
  const [error, setError] = useState("");
  const submit = (e) => {
    e.preventDefault();
    const res = assignDeviceAndDispatch(request.request_id, deviceId);
    if (!res.ok) return setError(res.error);
    onDone();
  };
  return (
    <Modal title="Assign device & dispatch" onClose={onClose}>
      <form onSubmit={submit} noValidate className="space-y-4">
        <p className="text-sm text-green-400">
          Give this Soundbox a Device ID and mark it as dispatched. The merchant will see the ID on their Soundbox page.
        </p>
        <div>
          <label htmlFor="device-id" className="block text-xs font-semibold text-green-500 mb-1.5">Device ID *</label>
          <input
            id="device-id"
            value={deviceId}
            onChange={(e) => {
              setDeviceId(e.target.value.toUpperCase());
              setError("");
            }}
            aria-invalid={!!error}
            aria-describedby={error ? "device-id-err" : undefined}
            className={`w-full px-4 py-2.5 rounded-lg border focus:border-green-500 focus:ring-2 focus:ring-green-100 outline-none text-sm font-mono ${error ? "border-rose-300" : "border-green-100"}`}
          />
          {error && <p id="device-id-err" className="text-rose-600 text-xs font-medium mt-1.5">{error}</p>}
          <p className="text-[11px] text-green-300 mt-1.5">Next free ID is filled in for you. You can type a different one.</p>
        </div>
        <div className="flex gap-3 pt-2">
          <button type="button" onClick={onClose} className="px-5 py-2.5 rounded-lg border border-green-200 text-green-700 hover:bg-green-50 font-semibold text-sm transition-colors">Cancel</button>
          <button type="submit" className="flex-1 bg-green-500 hover:bg-green-600 text-white font-semibold py-2.5 rounded-lg transition-colors text-sm">Assign &amp; dispatch</button>
        </div>
      </form>
    </Modal>
  );
}

export default function ServiceRequests() {
  const [, setTick] = useState(0);
  const [assignFor, setAssignFor] = useState(null);
  const { showToast } = useToast();
  const requests = db.getAllRequests();
  const merchants = db.getMerchants();
  const merchantName = (id) => merchants.find((m) => m.merchant_id === id)?.business_name || id;

  const decide = (requestId, status) => {
    db.updateRequestStatus(requestId, status);
    setTick((t) => t + 1);
  };

  return (
    <div className="max-w-4xl">
      <h1 className="font-display font-bold text-2xl text-green-700 mb-1">Service Requests</h1>
      <p className="text-sm text-green-300 mb-6">Loan, Insurance, SoundBox, and POS Device requests from merchants.</p>

      <div className="space-y-3">
        {requests.map((r) => {
          const Icon = ICONS[r.type];
          const isHardware = HARDWARE_TYPES.includes(r.type);
          return (
            <div key={r.request_id} className="card p-5">
              <div className="flex items-center gap-5">
                <div className="w-11 h-11 rounded-xl bg-green-50 text-green-700 flex items-center justify-center shrink-0">
                  <Icon size={20} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-green-700 text-sm capitalize">
                    {merchantName(r.merchant_id)} · <span className="text-green-400 font-normal">{r.type.replace("_", " ")}</span>
                  </p>
                  <p className="text-xs text-green-300 mt-0.5">{detailsSummary(r)} · {fmtDate(r.created_at)}</p>
                </div>
                {!isHardware && <StatusBadge status={r.status === "requested" ? "pending" : r.status} />}
                {isHardware && r.status === "requested" && <StatusBadge status="pending" />}

                {r.status === "requested" && (
                  <div className="flex gap-2 shrink-0">
                    <button
                      onClick={() => decide(r.request_id, "approved")}
                      className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700 border border-emerald-200 px-3 py-1.5 rounded-lg hover:bg-emerald-50"
                    >
                      <Check size={13} /> Approve
                    </button>
                    <button
                      onClick={() => decide(r.request_id, "rejected")}
                      className="flex items-center gap-1.5 text-xs font-semibold text-rose-700 border border-rose-200 px-3 py-1.5 rounded-lg hover:bg-rose-50"
                    >
                      <X size={13} /> Reject
                    </button>
                  </div>
                )}

                {isHardware && r.status === "approved" && (
                  <button
                    onClick={() => (r.type === "soundbox" ? setAssignFor(r) : decide(r.request_id, "dispatched"))}
                    className="flex items-center gap-1.5 text-xs font-semibold text-sky-700 border border-sky-200 px-3 py-1.5 rounded-lg hover:bg-sky-50 shrink-0"
                  >
                    <Truck size={13} /> {r.type === "soundbox" ? "Assign Device & Dispatch" : "Mark Dispatched"}
                  </button>
                )}
                {isHardware && r.status === "dispatched" && (
                  <button
                    onClick={() => decide(r.request_id, "delivered")}
                    className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700 border border-emerald-200 px-3 py-1.5 rounded-lg hover:bg-emerald-50 shrink-0"
                  >
                    <PackageCheck size={13} /> Mark Delivered
                  </button>
                )}
                {isHardware && r.status === "delivered" && <StatusBadge status="delivered" />}
                {/* Normally every soundbox gets its Device ID at the "approved → dispatched" step.
                    This covers a request that reached delivered without one (e.g. from before this
                    feature existed), so admin isn't stuck unable to activate it. */}
                {r.type === "soundbox" && r.status === "delivered" && !r.details?.device_id && (
                  <button
                    onClick={() => setAssignFor(r)}
                    className="flex items-center gap-1.5 text-xs font-semibold text-sky-700 border border-sky-200 px-3 py-1.5 rounded-lg hover:bg-sky-50 shrink-0"
                  >
                    <Truck size={13} /> Assign Device ID
                  </button>
                )}
                {r.type === "soundbox" && r.status === "delivered" && r.details?.device_id && (
                  <button
                    onClick={() => {
                      const res = activateSoundbox(r.request_id);
                      if (!res.ok) {
                        showToast({ title: "Could not activate", subtitle: res.error, type: "error" });
                        return;
                      }
                      setTick((t) => t + 1);
                      showToast({ title: "Soundbox activated", subtitle: `${merchantName(r.merchant_id)} · ${r.details.device_id}`, type: "success" });
                    }}
                    className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700 border border-emerald-200 px-3 py-1.5 rounded-lg hover:bg-emerald-50 shrink-0"
                  >
                    <Power size={13} /> Activate Soundbox
                  </button>
                )}
                {r.type === "soundbox" && r.status === "active" && <StatusBadge status="active" />}
              </div>

              {isHardware && r.status !== "requested" && (
                <div className="mt-4 pl-16 space-y-3">
                  <OrderTracker status={r.status} stages={r.type === "soundbox" ? SOUNDBOX_STAGES : undefined} />
                  {r.status !== "rejected" && r.details.unitPrice != null && (
                    <div className="bg-green-50/60 rounded-lg p-3 text-xs text-green-500 space-y-1 max-w-sm">
                      <div className="flex items-center gap-1.5 font-semibold text-green-700 mb-1">
                        <Receipt size={13} /> Invoice
                      </div>
                      <div className="flex justify-between"><span>Unit price × {r.details.quantity}</span><span>{fmtMoney(r.details.unitPrice * r.details.quantity)}</span></div>
                      <div className="flex justify-between"><span>GST (18%)</span><span>{fmtMoney(r.details.gst)}</span></div>
                      <div className="flex justify-between font-semibold text-green-700 pt-1 border-t border-green-100">
                        <span>Total{r.details.pricingOption === "rental" ? " / month" : ""}</span>
                        <span>{fmtMoney(r.details.invoiceTotal)}</span>
                      </div>
                      <p className="text-[11px] text-green-400 pt-1">Deliver to: {r.details.address}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
        {requests.length === 0 && <p className="text-sm text-green-300 text-center py-10 card">No service requests yet.</p>}
      </div>

      {assignFor && (
        <AssignDeviceModal
          request={assignFor}
          onClose={() => setAssignFor(null)}
          onDone={() => {
            setAssignFor(null);
            setTick((t) => t + 1);
          }}
        />
      )}
    </div>
  );
}
