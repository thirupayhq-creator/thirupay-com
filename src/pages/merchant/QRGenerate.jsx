import { useState, useRef } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { QrCode, Download, Share2, ExternalLink } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useLanguage } from "../../context/LanguageContext";
import { db } from "../../data/mockData";
import { PAYMENT_MODES } from "../../data/paymentModes";

export default function QRGenerate() {
  const { session } = useAuth();
  const { t } = useLanguage();
  const merchant = db.getMerchantById(session.merchantId);

  // STATIC QR — identifies the merchant only. No amount is ever encoded here;
  // the customer enters the amount on the /pay page after scanning.
  // window.location.origin (not a hardcoded localhost/IP) so this also works
  // when opened from a phone on the same network as the dev server.
  const paymentUrl = `${window.location.origin}/pay?merchant=${merchant.merchant_id}`;

  const qrCanvasRef = useRef(null);
  const [shareState, setShareState] = useState("idle"); // idle | sharing | copied | unsupported

  const buildQrCardCanvas = () => {
    const qrCanvas = qrCanvasRef.current;
    if (!qrCanvas) return null;

    const W = 440;
    const H = 620;
    const out = document.createElement("canvas");
    out.width = W;
    out.height = H;
    const ctx = out.getContext("2d");

    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0, 0, W, H);

    ctx.fillStyle = "#0B2A4A";
    ctx.fillRect(0, 0, W, 110);

    ctx.textAlign = "center";
    ctx.font = "700 28px Sora, sans-serif";
    ctx.fillStyle = "#FFFFFF";
    const logoThiru = "Thiru ";
    const logoPay = "Pay";
    const thiruWidth = ctx.measureText(logoThiru).width;
    const payWidth = ctx.measureText(logoPay).width;
    const totalWidth = thiruWidth + payWidth;
    const startX = W / 2 - totalWidth / 2;
    ctx.textAlign = "left";
    ctx.fillStyle = "#FFFFFF";
    ctx.fillText(logoThiru, startX, 50);
    ctx.fillStyle = "#3D6EA0";
    ctx.fillText(logoPay, startX + thiruWidth, 50);

    ctx.textAlign = "center";
    ctx.font = "500 13px Inter, sans-serif";
    ctx.fillStyle = "#9DB9DA";
    ctx.fillText("Scan to open the ThiruPay payment page", W / 2, 76);

    ctx.fillStyle = "#0B2A4A";
    ctx.font = "700 20px Sora, sans-serif";
    ctx.fillText(merchant.business_name, W / 2, 150);
    ctx.font = "500 12px Inter, sans-serif";
    ctx.fillStyle = "#3D6EA0";
    ctx.fillText(merchant.owner_name, W / 2, 170);

    const qrSize = 260;
    const qrX = W / 2 - qrSize / 2;
    const qrY = 195;
    ctx.strokeStyle = "#EAF1F8";
    ctx.lineWidth = 2;
    ctx.strokeRect(qrX - 12, qrY - 12, qrSize + 24, qrSize + 24);
    ctx.drawImage(qrCanvas, qrX, qrY, qrSize, qrSize);

    ctx.fillStyle = "#69D3A2";
    ctx.font = "500 12px Inter, sans-serif";
    ctx.fillText("Powered by ThiruPay", W / 2, H - 24);

    return out;
  };

  const downloadQR = () => {
    const canvas = buildQrCardCanvas();
    if (!canvas) return;
    const link = document.createElement("a");
    link.download = `ThiruPay_QR_${merchant.business_name.replace(/\s+/g, "")}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  const shareQR = async () => {
    const canvas = buildQrCardCanvas();
    if (!canvas) return;

    canvas.toBlob(async (blob) => {
      if (!blob) return;
      const fileName = `ThiruPay_QR_${merchant.business_name.replace(/\s+/g, "")}.png`;
      const file = new File([blob], fileName, { type: "image/png" });
      const shareText = `Scan this QR to pay ${merchant.business_name} via ThiruPay: ${paymentUrl}`;

      try {
        if (navigator.canShare && navigator.canShare({ files: [file] })) {
          setShareState("sharing");
          await navigator.share({ files: [file], title: "ThiruPay QR", text: shareText });
          setShareState("idle");
          return;
        }
        if (navigator.share) {
          setShareState("sharing");
          await navigator.share({ title: "ThiruPay QR", text: shareText });
          setShareState("idle");
          return;
        }
        throw new Error("no share api");
      } catch (err) {
        if (err?.name === "AbortError") {
          setShareState("idle");
          return;
        }
        try {
          await navigator.clipboard?.writeText(shareText);
          setShareState("copied");
        } catch {
          setShareState("unsupported");
        }
        const link = document.createElement("a");
        link.download = fileName;
        link.href = canvas.toDataURL("image/png");
        link.click();
        setTimeout(() => setShareState("idle"), 2200);
      }
    }, "image/png");
  };

  // Opens the SAME public /pay page a real customer would land on after
  // scanning — no separate fake flow, so this is exactly what real scanning
  // will do once phones actually reach this dev server.
  const simulateScan = () => {
    window.open(paymentUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="max-w-2xl">
      <h1 className="font-display font-bold text-2xl text-green-700 mb-1">{t("generateQR")}</h1>
      <p className="text-sm text-green-300 mb-6">{t("qrSubtitle")}</p>

      <div className="card p-8 flex flex-col items-center relative overflow-hidden">
        <div className="p-4 bg-white rounded-2xl border-2 border-green-100 mb-4">
          <QRCodeCanvas ref={qrCanvasRef} value={paymentUrl} size={220} fgColor="#0B2A4A" level="M" />
        </div>
        <p className="font-semibold text-green-700 text-sm">{merchant.business_name}</p>
        <p className="text-xs text-green-300 mt-2 flex items-center gap-1.5">
          <QrCode size={13} /> Customer scans this QR to open the ThiruPay payment page
        </p>
        <div className="flex items-center justify-center gap-1.5 mt-2">
          {PAYMENT_MODES.map((m) => (
            <span
              key={m.key}
              className="text-[10px] font-semibold px-2 py-0.5 rounded-full border"
              style={{ color: m.color, borderColor: m.color + "40", backgroundColor: m.color + "0D" }}
            >
              {m.label}
            </span>
          ))}
        </div>

        <div className="flex flex-wrap justify-center gap-2 mt-6">
          <button
            onClick={downloadQR}
            className="flex items-center gap-1.5 text-xs font-semibold bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <Download size={13} /> {t("downloadQR")}
          </button>
          <button
            onClick={shareQR}
            disabled={shareState === "sharing"}
            className="flex items-center gap-1.5 text-xs font-semibold bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-60"
          >
            <Share2 size={13} />
            {shareState === "copied" ? t("copied") : shareState === "unsupported" ? t("downloadQR") : t("shareQR")}
          </button>
          <button
            onClick={simulateScan}
            className="flex items-center gap-1.5 text-xs font-semibold text-green-400 border border-green-100 px-4 py-2 rounded-lg hover:bg-green-50 transition-colors"
          >
            <ExternalLink size={13} /> {t("simulateScanPay")}
          </button>
        </div>
      </div>
    </div>
  );
}