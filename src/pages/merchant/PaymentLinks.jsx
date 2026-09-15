import { useState, useRef } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { Link2, IndianRupee, Copy, CheckCircle2, Share2, QrCode, Download, ChevronDown, ChevronUp } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useLanguage } from "../../context/LanguageContext";
import { db, genId } from "../../data/mockData";
import { PAYMENT_MODES } from "../../data/paymentModes";
import StatusBadge from "../../components/StatusBadge";
import { useToast } from "../../context/ToastContext";

function fmtDate(iso) {
  return new Date(iso).toLocaleString("en-IN", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" });
}

// Builds the shareable URL for a payment link — window.location.origin (not a
// hardcoded domain) so this also works correctly on localhost/dev and on
// whatever production domain it's eventually deployed to.
function linkUrl(link) {
  return `${window.location.origin}/pay/${link.link_id}`;
}

// navigator.clipboard requires a secure context (HTTPS or localhost) — on a
// plain http://<network-ip> origin (e.g. testing from a phone on the same
// WiFi) it silently does nothing. This falls back to the older
// textarea+execCommand approach so Copy actually works there too.
async function copyToClipboard(text) {
  if (navigator.clipboard && window.isSecureContext) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      // fall through to fallback
    }
  }
  try {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();
    const ok = document.execCommand("copy");
    document.body.removeChild(textarea);
    return ok;
  } catch {
    return false;
  }
}

export default function PaymentLinks() {
  const { session } = useAuth();
  const { t } = useLanguage();
  const { showToast } = useToast();
  const merchant = db.getMerchantById(session.merchantId);
  const [links, setLinks] = useState(db.getLinksByMerchant(session.merchantId));
  const [form, setForm] = useState({ amount: "", note: "", expiryHours: "24" });
  const [copiedId, setCopiedId] = useState(null);
  const [modePickerFor, setModePickerFor] = useState(null);
  const [qrOpenFor, setQrOpenFor] = useState(null);
  const qrRefs = useRef({});

  const refresh = () => setLinks(db.getLinksByMerchant(session.merchantId));

  const handleCreate = (e) => {
    e.preventDefault();
    if (!form.amount || Number(form.amount) <= 0) return;
    const link = {
      link_id: genId("pl"),
      merchant_id: merchant.merchant_id,
      amount: Number(form.amount),
      expiry: new Date(Date.now() + Number(form.expiryHours) * 3600000).toISOString(),
      status: "pending",
      note: form.note || "Payment request",
      created_at: new Date().toISOString(),
    };
    db.addLink(link);
    setForm({ amount: "", note: "", expiryHours: "24" });
    refresh();
  };

  const handleCopy = async (link) => {
    const ok = await copyToClipboard(linkUrl(link));
    if (ok) {
      setCopiedId(link.link_id);
      setTimeout(() => setCopiedId(null), 1800);
    } else {
      showToast({ title: "Couldn't copy automatically", subtitle: linkUrl(link), type: "error", duration: 5000 });
    }
  };

  const handleShare = async (link) => {
    const url = linkUrl(link);
    const text = `Pay ₹${link.amount.toLocaleString("en-IN")} to ${merchant.business_name} via ThiruPay: ${url}`;
    if (navigator.share) {
      try {
        await navigator.share({ title: "ThiruPay Payment Link", text, url });
        return;
      } catch (err) {
        if (err?.name === "AbortError") return;
      }
    }
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank", "noopener,noreferrer");
  };

  const downloadLinkQR = (link) => {
    const qrCanvas = qrRefs.current[link.link_id];
    if (!qrCanvas) return;

    const W = 360;
    const H = 460;
    const out = document.createElement("canvas");
    out.width = W;
    out.height = H;
    const ctx = out.getContext("2d");

    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = "#0B2A4A";
    ctx.fillRect(0, 0, W, 90);

    ctx.textAlign = "center";
    ctx.font = "700 22px Sora, sans-serif";
    ctx.fillStyle = "#FFFFFF";
    ctx.fillText("ThiruPay Payment Link", W / 2, 42);
    ctx.font = "500 12px Inter, sans-serif";
    ctx.fillStyle = "#9DB9DA";
    ctx.fillText("Scan to pay", W / 2, 64);

    ctx.fillStyle = "#0B2A4A";
    ctx.font = "700 20px Sora, sans-serif";
    ctx.fillText(`₹${link.amount.toLocaleString("en-IN")}`, W / 2, 130);
    ctx.font = "500 12px Inter, sans-serif";
    ctx.fillStyle = "#3D6EA0";
    ctx.fillText(link.note, W / 2, 150);

    const qrSize = 200;
    ctx.strokeStyle = "#EAF1F8";
    ctx.lineWidth = 2;
    ctx.strokeRect(W / 2 - qrSize / 2 - 10, 168, qrSize + 20, qrSize + 20);
    ctx.drawImage(qrCanvas, W / 2 - qrSize / 2, 178, qrSize, qrSize);

    ctx.fillStyle = "#69D3A2";
    ctx.font = "500 12px Inter, sans-serif";
    ctx.fillText("Powered by ThiruPay", W / 2, H - 20);

    const a = document.createElement("a");
    a.download = `ThiruPay_Link_${link.link_id}.png`;
    a.href = out.toDataURL("image/png");
    a.click();
  };

  const simulatePaid = (link, payMode) => {
    db.updateLinkStatus(link.link_id, "paid");
    db.addTxn({
      transaction_id: genId("txn"),
      merchant_id: merchant.merchant_id,
      amount: link.amount,
      payment_method: "Payment Link",
      payment_mode: payMode,
      status: "success",
      created_at: new Date().toISOString(),
    });
    db.addSettlement({
      settlement_id: genId("st"),
      merchant_id: merchant.merchant_id,
      amount: link.amount,
      settlement_date: new Date(Date.now() + 86400000).toISOString(),
      status: "pending",
    });
    setModePickerFor(null);
    refresh();
    showToast({
      title: `₹${link.amount.toLocaleString("en-IN")} received!`,
      subtitle: `${link.note} · via ${payMode}`,
      type: "success",
    });
  };

  return (
    <div className="max-w-3xl">
      <h1 className="font-display font-bold text-2xl text-green-700 mb-1">{t("paymentLinksTitle")}</h1>
      <p className="text-sm text-green-300 mb-6">{t("paymentLinksSubtitle")}</p>

      <form onSubmit={handleCreate} className="card p-5 mb-8 grid grid-cols-1 sm:grid-cols-3 gap-3 items-end">
        <div>
          <label className="block text-xs font-semibold text-green-500 mb-1.5">{t("amountLabel")}</label>
          <div className="relative">
            <IndianRupee size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-green-300" />
            <input
              type="number"
              min="1"
              required
              value={form.amount}
              onChange={(e) => setForm({ ...form, amount: e.target.value })}
              placeholder="1500"
              className="w-full pl-8 pr-3 py-2.5 rounded-lg border border-green-100 focus:border-green-500 focus:ring-2 focus:ring-green-100 outline-none text-sm"
            />
          </div>
        </div>
        <div>
          <label className="block text-xs font-semibold text-green-500 mb-1.5">{t("noteLabel")}</label>
          <input
            value={form.note}
            onChange={(e) => setForm({ ...form, note: e.target.value })}
            placeholder="Order #221"
            className="w-full px-3 py-2.5 rounded-lg border border-green-100 focus:border-green-500 focus:ring-2 focus:ring-green-100 outline-none text-sm"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-green-500 mb-1.5">{t("expiresIn")}</label>
          <select
            value={form.expiryHours}
            onChange={(e) => setForm({ ...form, expiryHours: e.target.value })}
            className="w-full px-3 py-2.5 rounded-lg border border-green-100 focus:border-green-500 outline-none text-sm bg-white"
          >
            <option value="24">24 hours</option>
            <option value="72">3 days</option>
            <option value="168">7 days</option>
          </select>
        </div>
        <button type="submit" className="sm:col-span-3 bg-green-500 hover:bg-green-600 text-white font-semibold py-2.5 rounded-lg text-sm transition-colors flex items-center justify-center gap-2">
          <Link2 size={16} /> {t("createPaymentLink")}
        </button>
      </form>

      <div className="card divide-y divide-green-50">
        {links.length === 0 ? (
          <p className="text-sm text-green-300 text-center py-10">{t("noPaymentLinksYet")}</p>
        ) : (
          links.map((l) => {
            const qrOpen = qrOpenFor === l.link_id;
            return (
              <div key={l.link_id} className="p-4">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div>
                    <p className="font-semibold text-green-700 text-sm">₹{l.amount.toLocaleString("en-IN")} · {l.note}</p>
                    <p className="text-xs text-green-300 mt-0.5">Created {fmtDate(l.created_at)} · Expires {fmtDate(l.expiry)}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <StatusBadge status={l.status} />
                    {l.status === "pending" && (
                      <>
                        <button
                          onClick={() => setQrOpenFor(qrOpen ? null : l.link_id)}
                          className={`text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1.5 border transition-colors ${
                            qrOpen ? "bg-green-700 text-white border-green-700" : "text-green-500 border-green-100 hover:bg-green-50"
                          }`}
                        >
                          <QrCode size={13} /> QR {qrOpen ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                        </button>
                        <button
                          onClick={() => handleCopy(l)}
                          className="text-xs font-semibold text-green-500 border border-green-100 px-3 py-1.5 rounded-lg hover:bg-green-50 flex items-center gap-1.5"
                        >
                          {copiedId === l.link_id ? <CheckCircle2 size={13} className="text-emerald-600" /> : <Copy size={13} />}
                          {copiedId === l.link_id ? t("copied") : t("copyLink")}
                        </button>
                        <button
                          onClick={() => handleShare(l)}
                          className="text-xs font-semibold text-white bg-green-500 hover:bg-green-600 px-3 py-1.5 rounded-lg flex items-center gap-1.5"
                        >
                          <Share2 size={13} /> {t("share")}
                        </button>
                        {modePickerFor === l.link_id ? (
                          <div className="flex items-center gap-1 border border-green-100 rounded-lg px-1.5 py-1">
                            {PAYMENT_MODES.map((m) => (
                              <button
                                key={m.key}
                                onClick={() => simulatePaid(l, m.key)}
                                className="text-[11px] font-semibold px-2 py-1 rounded-md text-white transition-opacity hover:opacity-90"
                                style={{ backgroundColor: m.color }}
                              >
                                {m.label}
                              </button>
                            ))}
                            <button onClick={() => setModePickerFor(null)} className="text-green-300 hover:text-green-500 px-1 text-xs">✕</button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setModePickerFor(l.link_id)}
                            className="text-xs font-semibold text-green-600 border border-green-200 px-3 py-1.5 rounded-lg hover:bg-green-50"
                          >
                            {t("simulatePaid")}
                          </button>
                        )}
                      </>
                    )}
                  </div>
                </div>

                {/* Same link, scannable — like Razorpay/PhonePe Payment Links show both a link and a QR for the same payment */}
                {qrOpen && (
                  <div className="mt-4 pt-4 border-t border-green-50 flex flex-col items-center gap-3">
                    <div className="p-3 bg-white rounded-xl border-2 border-green-100">
                      <QRCodeCanvas
                        ref={(el) => (qrRefs.current[l.link_id] = el)}
                        value={linkUrl(l)}
                        size={160}
                        fgColor="#0B2A4A"
                        level="M"
                      />
                    </div>
                    <p className="text-xs text-green-300 text-center max-w-xs break-all">{linkUrl(l)}</p>
                    <button
                      onClick={() => downloadLinkQR(l)}
                      className="flex items-center gap-1.5 text-xs font-semibold text-green-700 border border-green-200 px-3 py-1.5 rounded-lg hover:bg-green-50"
                    >
                      <Download size={13} /> {t("downloadQR")}
                    </button>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}