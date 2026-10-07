import { useState, useRef, useEffect } from "react";
import { QRCodeCanvas } from "qrcode.react";
import {
  QrCode,
  Download,
  Share2,
  ExternalLink,
  Copy,
  Check,
  Sparkles,
  Smartphone,
  IndianRupee,
  Settings2,
  Globe,
  RefreshCw,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useLanguage } from "../../context/LanguageContext";
import { db } from "../../data/mockData";
import { merchantApi } from "../../services/api";

export default function QRGenerate() {
  const { session } = useAuth();
  const { t } = useLanguage();

  // 1. Fetch live merchant profile from backend API, with fallback to local mock db
  const [profile, setProfile] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(false);

  useEffect(() => {
    let isMounted = true;
    setLoadingProfile(true);
    merchantApi
      .getProfile()
      .then((res) => {
        if (isMounted && res?.data) {
          const m = res.data.merchant || res.data;
          setProfile(m);
        }
      })
      .catch((err) => {
        console.warn("Could not load backend merchant profile, using local fallback:", err.message);
      })
      .finally(() => {
        if (isMounted) setLoadingProfile(false);
      });
    return () => {
      isMounted = false;
    };
  }, []);

  // Determine active merchant data
  const localMerchant = session?.merchantId ? db.getMerchantById(session.merchantId) : null;
  const merchant = {
    merchant_id: profile?.id || localMerchant?.merchant_id || session?.merchantId || "m_tiru",
    business_name: profile?.businessName || localMerchant?.business_name || session?.name || "ThiruPay Merchant",
    owner_name: profile?.ownerName || profile?.user?.name || localMerchant?.owner_name || session?.name || "Merchant Owner",
    phone: profile?.phone || localMerchant?.phone || "9876543210",
  };

  // 2. Approach 2: Direct UPI QR Code Configuration
  const defaultVpa = merchant.phone ? `${merchant.phone.replace(/\D/g, "")}@upi` : `tirupay.${merchant.merchant_id.slice(-8)}@cashfree`;
  const [customVpa, setCustomVpa] = useState("");
  const activeVpa = customVpa.trim() || defaultVpa;

  // Mode: "upi_direct" (Approach 2 - Scannable directly by GPay, PhonePe, Paytm)
  // vs "web_checkout" (Approach 1 - Opens ThiruPay hosted payment page)
  const [qrType, setQrType] = useState("upi_direct"); // "upi_direct" | "web_checkout"

  // Amount Mode: Static (no amount) or Dynamic (bill-specific amount)
  const [amountMode, setAmountMode] = useState("static"); // "static" | "dynamic"
  const [billAmount, setBillAmount] = useState("");
  const [copiedVpa, setCopiedVpa] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [showVpaEditor, setShowVpaEditor] = useState(false);

  const qrCanvasRef = useRef(null);
  const [shareState, setShareState] = useState("idle"); // idle | sharing | copied | unsupported

  // Build the Standard NPCI UPI URI Scheme (Approach 2)
  const cleanAmount = billAmount && !isNaN(Number(billAmount)) && Number(billAmount) > 0 ? Number(billAmount).toFixed(2) : null;
  const orderRefId = `TR${Date.now().toString(36).toUpperCase()}`;

  const buildUpiUri = () => {
    const params = new URLSearchParams();
    params.set("pa", activeVpa);
    params.set("pn", merchant.business_name);
    params.set("mc", "5411"); // Retail / Merchant Category Code
    params.set("cu", "INR");
    params.set("tn", `Pay to ${merchant.business_name}`);

    if (amountMode === "dynamic" && cleanAmount) {
      params.set("am", cleanAmount);
      params.set("tr", orderRefId);
    }

    return `upi://pay?${params.toString()}`;
  };

  const upiUri = buildUpiUri();

  // Approach 1 fallback: ThiruPay Hosted Web Checkout URL
  const webCheckoutUrl = `${window.location.origin}/pay?merchant=${encodeURIComponent(merchant.merchant_id)}${
    amountMode === "dynamic" && cleanAmount ? `&amount=${cleanAmount}&ref=${orderRefId}` : ""
  }`;

  // Active value encoded in the QR Canvas
  const activeQrValue = qrType === "upi_direct" ? upiUri : webCheckoutUrl;

  // Copy VPA helper
  const handleCopyVpa = () => {
    navigator.clipboard?.writeText(activeVpa);
    setCopiedVpa(true);
    setTimeout(() => setCopiedVpa(false), 2000);
  };

  // Copy QR Link helper
  const handleCopyQrLink = () => {
    navigator.clipboard?.writeText(activeQrValue);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  // 3. High-resolution Printable Standee Card Canvas Generator
  const buildQrCardCanvas = () => {
    const qrCanvas = qrCanvasRef.current;
    if (!qrCanvas) return null;

    const W = 480;
    const H = 690;
    const out = document.createElement("canvas");
    out.width = W;
    out.height = H;
    const ctx = out.getContext("2d");

    // Clean white background
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0, 0, W, H);

    // Premium Navy Brand Header
    ctx.fillStyle = "#0B2A4A";
    ctx.fillRect(0, 0, W, 125);

    // Top ThiruPay Logo
    ctx.font = "700 28px Sora, sans-serif";
    ctx.fillStyle = "#FFFFFF";
    const logoThiru = "Thiru ";
    const logoPay = "Pay";
    const thiruWidth = ctx.measureText(logoThiru).width;
    const payWidth = ctx.measureText(logoPay).width;
    const totalWidth = thiruWidth + payWidth;
    const startX = W / 2 - totalWidth / 2;
    ctx.textAlign = "left";
    ctx.fillText(logoThiru, startX, 48);
    ctx.fillStyle = "#3D6EA0";
    ctx.fillText(logoPay, startX + thiruWidth, 48);

    // Subheader: BHIM UPI & Apps
    ctx.textAlign = "center";
    ctx.font = "600 13px Inter, sans-serif";
    ctx.fillStyle = "#9DB9DA";
    ctx.fillText(
      qrType === "upi_direct"
        ? "Accepted: Google Pay • PhonePe • Paytm • BHIM • Cred"
        : "Scan to open the ThiruPay payment page",
      W / 2,
      76
    );

    // BHIM UPI Pill Badge
    ctx.fillStyle = "#1E4B7A";
    const pillW = 160;
    const pillH = 24;
    ctx.beginPath();
    ctx.roundRect(W / 2 - pillW / 2, 92, pillW, pillH, 12);
    ctx.fill();
    ctx.fillStyle = "#69D3A2";
    ctx.font = "700 11px Inter, sans-serif";
    ctx.fillText("BHIM UPI POWERED", W / 2, 108);

    // Merchant Business Details
    ctx.fillStyle = "#0B2A4A";
    ctx.font = "700 22px Sora, sans-serif";
    ctx.fillText(merchant.business_name, W / 2, 168);

    ctx.font = "500 13px Inter, sans-serif";
    ctx.fillStyle = "#4B6B94";
    ctx.fillText(`UPI ID: ${activeVpa}`, W / 2, 190);

    // Dynamic Amount Banner if enabled
    let qrTopY = 210;
    if (amountMode === "dynamic" && cleanAmount) {
      ctx.fillStyle = "#ECFDF5";
      ctx.fillRect(40, 204, W - 80, 32);
      ctx.strokeStyle = "#A7F3D0";
      ctx.lineWidth = 1;
      ctx.strokeRect(40, 204, W - 80, 32);

      ctx.fillStyle = "#065F46";
      ctx.font = "700 15px Inter, sans-serif";
      ctx.fillText(`Amount to Pay: ₹${Number(cleanAmount).toLocaleString("en-IN")}`, W / 2, 226);
      qrTopY = 248;
    }

    // QR Canvas container box
    const qrSize = 250;
    const qrX = W / 2 - qrSize / 2;
    const qrY = qrTopY;

    ctx.strokeStyle = "#E2E8F0";
    ctx.lineWidth = 2;
    ctx.strokeRect(qrX - 10, qrY - 10, qrSize + 20, qrSize + 20);
    ctx.drawImage(qrCanvas, qrX, qrY, qrSize, qrSize);

    // Bottom Scan Instructions
    const bottomTextY = qrY + qrSize + 32;
    ctx.fillStyle = "#0B2A4A";
    ctx.font = "600 13px Inter, sans-serif";
    ctx.fillText(
      qrType === "upi_direct"
        ? "Scan with any UPI App to Pay"
        : "Scan with any Phone Camera to Pay",
      W / 2,
      bottomTextY
    );

    ctx.font = "500 11px Inter, sans-serif";
    ctx.fillStyle = "#64748B";
    ctx.fillText("Zero MDR • Instant Settlement • Powered by ThiruPay", W / 2, bottomTextY + 20);

    // Decorative footer bar
    ctx.fillStyle = "#69D3A2";
    ctx.fillRect(0, H - 8, W, 8);

    return out;
  };

  const downloadQR = () => {
    const canvas = buildQrCardCanvas();
    if (!canvas) return;
    const link = document.createElement("a");
    const sanitizedName = merchant.business_name.replace(/\s+/g, "_");
    link.download = `ThiruPay_UPI_QR_${sanitizedName}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  const shareQR = async () => {
    const canvas = buildQrCardCanvas();
    if (!canvas) return;

    canvas.toBlob(async (blob) => {
      if (!blob) return;
      const fileName = `ThiruPay_UPI_QR_${merchant.business_name.replace(/\s+/g, "_")}.png`;
      const file = new File([blob], fileName, { type: "image/png" });
      const shareText = `Pay ${merchant.business_name} instantly via UPI (UPI ID: ${activeVpa}): ${activeQrValue}`;

      try {
        if (navigator.canShare && navigator.canShare({ files: [file] })) {
          setShareState("sharing");
          await navigator.share({ files: [file], title: "ThiruPay UPI QR", text: shareText });
          setShareState("idle");
          return;
        }
        if (navigator.share) {
          setShareState("sharing");
          await navigator.share({ title: "ThiruPay UPI QR", text: shareText });
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

  const simulateScan = () => {
    if (qrType === "upi_direct") {
      // On desktop/mobile, opens UPI protocol or shows helpful alert
      window.location.href = upiUri;
    } else {
      window.open(webCheckoutUrl, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <div className="max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="font-display font-bold text-2xl text-green-700">{t("generateQR")}</h1>
          <p className="text-sm text-green-300 mt-0.5">
            Approach 2: Direct NPCI UPI QR code scannable directly by Google Pay, PhonePe, Paytm, and BHIM.
          </p>
        </div>

        {/* Tab Toggle: Direct UPI (Approach 2) vs Web Checkout (Approach 1) */}
        <div className="flex items-center bg-gray-100 p-1 rounded-xl self-start sm:self-auto">
          <button
            onClick={() => setQrType("upi_direct")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              qrType === "upi_direct"
                ? "bg-white text-green-800 shadow-sm"
                : "text-gray-500 hover:text-gray-800"
            }`}
          >
            <Smartphone size={13} /> Direct UPI QR (GPay/PhonePe)
          </button>
          <button
            onClick={() => setQrType("web_checkout")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              qrType === "web_checkout"
                ? "bg-white text-green-800 shadow-sm"
                : "text-gray-500 hover:text-gray-800"
            }`}
          >
            <Globe size={13} /> ThiruPay Web Pay
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: QR Card & Actions */}
        <div className="lg:col-span-7 flex flex-col items-center">
          <div className="w-full card p-7 flex flex-col items-center relative overflow-hidden bg-white shadow-card border border-green-100">
            {/* Top Standee Badge */}
            <div className="w-full flex items-center justify-between pb-4 border-b border-gray-100 mb-5">
              <div className="flex items-center gap-2">
                <span className="font-display font-bold text-base text-gray-900 tracking-tight">ThiruPay</span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                  {qrType === "upi_direct" ? "BHIM UPI" : "Hosted Checkout"}
                </span>
              </div>
              <div className="flex items-center gap-1 text-[11px] font-semibold text-gray-400">
                <Sparkles size={12} className="text-emerald-500" /> 0% MDR
              </div>
            </div>

            {/* Merchant Identity */}
            <div className="text-center mb-4">
              <h2 className="font-display font-bold text-xl text-gray-900">{merchant.business_name}</h2>
              <div className="flex items-center justify-center gap-2 mt-1">
                <span className="text-xs font-mono text-gray-500 bg-gray-50 px-2.5 py-1 rounded-md border border-gray-200">
                  UPI ID: <strong className="text-gray-800 font-semibold">{activeVpa}</strong>
                </span>
                <button
                  onClick={handleCopyVpa}
                  title="Copy UPI ID"
                  className="p-1 text-gray-400 hover:text-green-700 transition-colors"
                >
                  {copiedVpa ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
                </button>
              </div>
            </div>

            {/* Dynamic Amount Badge */}
            {amountMode === "dynamic" && cleanAmount && (
              <div className="mb-4 bg-emerald-50 text-emerald-800 border border-emerald-200 px-4 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5">
                <IndianRupee size={13} />
                <span>Amount: ₹{Number(cleanAmount).toLocaleString("en-IN")}</span>
              </div>
            )}

            {/* High-Resolution QR Canvas */}
            <div className="p-4 bg-white rounded-2xl border-2 border-emerald-100 shadow-sm relative group mb-4">
              <QRCodeCanvas
                ref={qrCanvasRef}
                value={activeQrValue}
                size={230}
                fgColor="#0B2A4A"
                level="H"
                includeMargin={true}
              />
            </div>

            {/* Accepted UPI Apps Banner */}
            <div className="w-full bg-slate-50 rounded-xl p-3 text-center border border-slate-100 mb-6">
              <p className="text-[11px] font-semibold text-gray-600 mb-1.5">Scan & Pay using any UPI Application</p>
              <div className="flex items-center justify-center flex-wrap gap-1.5">
                {["Google Pay", "PhonePe", "Paytm", "BHIM UPI", "Cred"].map((app) => (
                  <span
                    key={app}
                    className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-white border border-gray-200 text-gray-700 shadow-2xs"
                  >
                    {app}
                  </span>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="w-full flex flex-wrap items-center justify-center gap-2.5">
              <button
                onClick={downloadQR}
                className="flex-1 min-w-[140px] flex items-center justify-center gap-1.5 text-xs font-bold bg-green-700 hover:bg-green-800 text-white px-4 py-2.5 rounded-xl shadow-sm transition-all"
              >
                <Download size={14} /> Download Standee (PNG)
              </button>

              <button
                onClick={shareQR}
                disabled={shareState === "sharing"}
                className="flex items-center justify-center gap-1.5 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-xl transition-all disabled:opacity-60"
              >
                <Share2 size={14} />
                {shareState === "copied" ? t("copied") : shareState === "unsupported" ? "Saved" : t("shareQR")}
              </button>

              <button
                onClick={handleCopyQrLink}
                className="flex items-center justify-center gap-1.5 text-xs font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 px-3.5 py-2.5 rounded-xl transition-all"
                title="Copy UPI Deep Link String"
              >
                {copiedLink ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
                {copiedLink ? "Copied Link" : "Copy String"}
              </button>

              <button
                onClick={simulateScan}
                className="flex items-center justify-center gap-1.5 text-xs font-semibold text-green-700 border border-green-200 px-3.5 py-2.5 rounded-xl hover:bg-green-50 transition-all"
                title="Simulate scanning on device"
              >
                <ExternalLink size={14} /> {qrType === "upi_direct" ? "Open UPI Link" : t("simulateScanPay")}
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Customization Controls & Bill Amount */}
        <div className="lg:col-span-5 space-y-4">
          {/* Amount Mode Box */}
          <div className="card p-5 bg-white border border-gray-100">
            <div className="flex items-center gap-2 mb-3">
              <IndianRupee size={16} className="text-green-700" />
              <h3 className="text-sm font-bold text-gray-900">QR Amount Configuration</h3>
            </div>

            <div className="grid grid-cols-2 gap-2 p-1 bg-gray-100 rounded-xl mb-4">
              <button
                type="button"
                onClick={() => {
                  setAmountMode("static");
                  setBillAmount("");
                }}
                className={`py-2 text-xs font-semibold rounded-lg transition-all ${
                  amountMode === "static"
                    ? "bg-white text-green-800 shadow-sm"
                    : "text-gray-500 hover:text-gray-800"
                }`}
              >
                Static Counter QR
              </button>
              <button
                type="button"
                onClick={() => setAmountMode("dynamic")}
                className={`py-2 text-xs font-semibold rounded-lg transition-all ${
                  amountMode === "dynamic"
                    ? "bg-white text-green-800 shadow-sm"
                    : "text-gray-500 hover:text-gray-800"
                }`}
              >
                Dynamic Bill QR
              </button>
            </div>

            {amountMode === "static" ? (
              <p className="text-xs text-gray-500 leading-relaxed">
                <strong>Permanent Standee Mode:</strong> Customer scans and types the amount on their phone. Ideal
                for counter stands, acrylic table tops, and shop entrance boards.
              </p>
            ) : (
              <div className="space-y-3">
                <p className="text-xs text-gray-500 leading-relaxed">
                  <strong>Locked Bill Mode:</strong> Specify the exact invoice amount. When scanned, Google Pay or
                  PhonePe will pre-fill this amount without cashier dispute.
                </p>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Enter Bill Amount (₹)</label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-sm font-bold text-gray-400">₹</span>
                    <input
                      type="number"
                      step="1"
                      min="1"
                      value={billAmount}
                      onChange={(e) => setBillAmount(e.target.value)}
                      placeholder="e.g. 250"
                      className="w-full pl-8 pr-4 py-2 text-sm font-semibold rounded-lg border border-gray-200 focus:border-green-600 focus:ring-2 focus:ring-green-100 outline-none"
                    />
                  </div>
                </div>

                {/* Quick Add Chips */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {[50, 100, 200, 500, 1000].map((chip) => (
                    <button
                      key={chip}
                      type="button"
                      onClick={() => setBillAmount(chip.toString())}
                      className="text-xs font-semibold px-2.5 py-1 rounded-md bg-gray-100 hover:bg-green-100 hover:text-green-800 text-gray-600 transition-colors"
                    >
                      +₹{chip}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* VPA / UPI ID Configuration Card */}
          <div className="card p-5 bg-white border border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Settings2 size={16} className="text-green-700" />
                <h3 className="text-sm font-bold text-gray-900">Payee UPI VPA Details</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowVpaEditor(!showVpaEditor)}
                className="text-xs font-semibold text-green-700 hover:underline"
              >
                {showVpaEditor ? "Cancel" : "Change VPA"}
              </button>
            </div>

            <p className="text-xs text-gray-500 mb-3">
              UPI payments will settle to the bank account linked to this VPA.
            </p>

            {showVpaEditor ? (
              <div className="space-y-2">
                <input
                  type="text"
                  value={customVpa}
                  onChange={(e) => setCustomVpa(e.target.value)}
                  placeholder={defaultVpa}
                  className="w-full px-3 py-2 text-xs font-mono rounded-lg border border-gray-200 focus:border-green-600 focus:ring-2 focus:ring-green-100 outline-none"
                />
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-gray-400">e.g. yourshop@hdfcbank or phone@upi</span>
                  <button
                    type="button"
                    onClick={() => setShowVpaEditor(false)}
                    className="text-xs font-bold text-green-700 bg-green-50 px-2.5 py-1 rounded-md hover:bg-green-100"
                  >
                    Save
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-gray-800 truncate">{activeVpa}</span>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full shrink-0">
                  Active VPA
                </span>
              </div>
            )}
          </div>

          {/* Technical UPI Payload Inspector */}
          <div className="card p-5 bg-slate-50 border border-slate-200 text-xs">
            <p className="font-bold text-slate-800 mb-1 flex items-center gap-1.5">
              <QrCode size={13} className="text-slate-500" /> Encoded NPCI UPI String
            </p>
            <p className="text-[11px] text-slate-500 mb-2">
              This exact string is encoded into the QR code according to NPCI Bharat QR / UPI specs:
            </p>
            <div className="p-2.5 bg-white rounded-lg border border-slate-200 font-mono text-[11px] text-slate-700 break-all select-all">
              {activeQrValue}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}