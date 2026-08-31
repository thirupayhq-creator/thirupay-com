import { TrendingUp, Clock, CalendarDays, Receipt, Undo2 } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from "recharts";
import { useAuth } from "../../context/AuthContext";
import { useLanguage } from "../../context/LanguageContext";
import { db } from "../../data/mockData";
import { PAYMENT_MODE_COLORS } from "../../data/paymentModes";
import StatCard from "../../components/StatCard";

const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function fmtMoney(n) {
  return `₹${Math.round(n).toLocaleString("en-IN")}`;
}

function hourLabel(h) {
  const hr = h % 12 === 0 ? 12 : h % 12;
  const suffix = h < 12 ? "AM" : "PM";
  return `${hr}${suffix}`;
}

export default function Insights() {
  const { session } = useAuth();
  const { t } = useLanguage();
  const txns = db.getTxnsByMerchant(session.merchantId).filter((tx) => tx.status === "success");
  const refunds = db.getRefundsByMerchant(session.merchantId);

  const now = Date.now();
  const last14 = txns.filter((tx) => now - new Date(tx.created_at).getTime() <= 14 * 86400000);
  const currentWeek = last14.filter((tx) => now - new Date(tx.created_at).getTime() <= 7 * 86400000);
  const previousWeek = last14.filter((tx) => {
    const age = now - new Date(tx.created_at).getTime();
    return age > 7 * 86400000 && age <= 14 * 86400000;
  });

  const currentWeekTotal = currentWeek.reduce((s, tx) => s + tx.amount, 0);
  const previousWeekTotal = previousWeek.reduce((s, tx) => s + tx.amount, 0);
  const weekGrowth = previousWeekTotal > 0 ? Math.round(((currentWeekTotal - previousWeekTotal) / previousWeekTotal) * 100) : null;

  const avgTicket = txns.length > 0 ? txns.reduce((s, tx) => s + tx.amount, 0) / txns.length : 0;

  // Peak hour — bucket every successful txn by hour of day (0-23)
  const hourBuckets = Array.from({ length: 24 }).map((_, h) => ({ hour: h, volume: 0, count: 0 }));
  txns.forEach((tx) => {
    const h = new Date(tx.created_at).getHours();
    hourBuckets[h].volume += tx.amount;
    hourBuckets[h].count += 1;
  });
  const peakHourBucket = hourBuckets.reduce((max, b) => (b.volume > max.volume ? b : max), hourBuckets[0]);
  const hourChartData = hourBuckets
    .filter((b) => b.count > 0)
    .map((b) => ({ label: hourLabel(b.hour), volume: b.volume, hour: b.hour }));

  // Best day of week
  const dayBuckets = Array.from({ length: 7 }).map((_, d) => ({ day: d, volume: 0 }));
  txns.forEach((tx) => {
    const d = new Date(tx.created_at).getDay();
    dayBuckets[d].volume += tx.amount;
  });
  const bestDay = dayBuckets.reduce((max, b) => (b.volume > max.volume ? b : max), dayBuckets[0]);

  // Payment mode breakdown with % share + avg ticket per mode
  const modeMap = {};
  txns.forEach((tx) => {
    const mode = tx.payment_mode || "Other";
    if (!modeMap[mode]) modeMap[mode] = { mode, volume: 0, count: 0 };
    modeMap[mode].volume += tx.amount;
    modeMap[mode].count += 1;
  });
  const totalVolume = txns.reduce((s, tx) => s + tx.amount, 0);
  const modeBreakdown = Object.values(modeMap)
    .map((m) => ({ ...m, pct: totalVolume > 0 ? Math.round((m.volume / totalVolume) * 100) : 0, avg: m.volume / m.count }))
    .sort((a, b) => b.volume - a.volume);
  const topMode = modeBreakdown[0];

  // Refund rate
  const refundedAmount = refunds.filter((r) => r.status === "refunded").reduce((s, r) => s + r.amount, 0);
  const refundRate = totalVolume > 0 ? ((refundedAmount / totalVolume) * 100).toFixed(1) : "0.0";

  return (
    <div className="max-w-6xl">
      <div className="mb-6">
        <h1 className="font-display font-bold text-2xl text-green-700">{t("insightsTitle")}</h1>
        <p className="text-sm text-green-300 mt-1">{t("insightsSubtitle")}</p>
      </div>

      {txns.length === 0 ? (
        <div className="card p-10 text-center">
          <p className="text-sm text-green-300">{t("noInsightsYet")}</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <StatCard
              icon={TrendingUp}
              label={t("weekOnWeek")}
              value={weekGrowth === null ? "—" : `${weekGrowth >= 0 ? "+" : ""}${weekGrowth}%`}
              sub={`${fmtMoney(currentWeekTotal)} ${t("thisWeek")}`}
              trend={weekGrowth ?? undefined}
            />
            <StatCard icon={Receipt} label={t("avgTicketSize")} value={fmtMoney(avgTicket)} sub={`${txns.length} ${t("transactionsTitle").toLowerCase()}`} />
            <StatCard icon={Clock} label={t("peakHour")} value={peakHourBucket.count > 0 ? hourLabel(peakHourBucket.hour) : "—"} sub={peakHourBucket.count > 0 ? `${fmtMoney(peakHourBucket.volume)} ${t("collected")}` : "—"} />
            <StatCard icon={CalendarDays} label={t("bestDay")} value={bestDay.volume > 0 ? DAY_NAMES[bestDay.day] : "—"} sub={bestDay.volume > 0 ? fmtMoney(bestDay.volume) : "—"} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
            <div className="card p-5 lg:col-span-2">
              <h2 className="font-display font-semibold text-green-700 mb-1">{t("collectionsByHour")}</h2>
              <p className="text-xs text-green-300 mb-4">{t("collectionsByHourSub")}</p>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={hourChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#EAF1F8" vertical={false} />
                  <XAxis dataKey="label" tick={{ fontSize: 11, fill: "#3D6EA0" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: "#3D6EA0" }} axisLine={false} tickLine={false} />
                  <Tooltip formatter={(v) => [`₹${v.toLocaleString("en-IN")}`, "Collected"]} contentStyle={{ borderRadius: 8, border: "1px solid #EAF1F8", fontSize: 12 }} />
                  <Bar dataKey="volume" radius={[6, 6, 0, 0]}>
                    {hourChartData.map((d) => (
                      <Cell key={d.hour} fill={d.hour === peakHourBucket.hour ? "#0B2A4A" : "#8FBFDD"} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="card p-5">
              <h2 className="font-display font-semibold text-green-700 mb-4">{t("paymentModeBreakdown")}</h2>
              <div className="space-y-4">
                {modeBreakdown.map((m) => (
                  <div key={m.mode}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-semibold text-green-700 flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: PAYMENT_MODE_COLORS[m.mode] || "#8FBFDD" }} />
                        {m.mode}
                      </span>
                      <span className="text-xs text-green-400">{m.pct}%</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-green-50 overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${m.pct}%`, backgroundColor: PAYMENT_MODE_COLORS[m.mode] || "#8FBFDD" }} />
                    </div>
                    <p className="text-[11px] text-green-300 mt-1">{t("avgTicket")}: {fmtMoney(m.avg)}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="card p-5 flex items-center gap-4">
              <div className="w-11 h-11 rounded-xl bg-green-50 text-green-700 flex items-center justify-center shrink-0">
                <TrendingUp size={20} />
              </div>
              <div>
                <p className="font-semibold text-green-700 text-sm">{topMode ? `${topMode.mode} ${t("isYourTopMode")}` : t("noDataYet")}</p>
                <p className="text-xs text-green-300">{topMode ? `${topMode.pct}% ${t("ofYourCollections")}` : "—"}</p>
              </div>
            </div>
            <div className="card p-5 flex items-center gap-4">
              <div className="w-11 h-11 rounded-xl bg-violet-50 text-violet-700 flex items-center justify-center shrink-0">
                <Undo2 size={20} />
              </div>
              <div>
                <p className="font-semibold text-green-700 text-sm">{t("refundRate")}: {refundRate}%</p>
                <p className="text-xs text-green-300">{fmtMoney(refundedAmount)} {t("refundedAllTime")}</p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
