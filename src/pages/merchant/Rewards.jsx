import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Gift, Clock, CheckCircle2, BadgeCheck, CalendarClock, ChevronDown, Info, PartyPopper } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useLanguage } from "../../context/LanguageContext";
import { useToast } from "../../context/ToastContext";
import { db } from "../../data/mockData";
import { REWARD_OFFERS, activateOffer, buildRewards, getActivations, getProgress, goalText, remainingText, rewardTotals, validityText } from "../../data/rewardsData";
import StatCard from "../../components/StatCard";
import StatusBadge from "../../components/StatusBadge";

const inr = (n) => `₹${Number(n).toLocaleString("en-IN")}`;
const fmtDate = (iso) => new Date(iso).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });

function OfferCard({ offer, progress, onActivate }) {
  const [showTerms, setShowTerms] = useState(false);
  const activated = !!progress;

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="card p-5 flex flex-col">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="font-display font-semibold text-green-700">{offer.title}</h3>
          <p className="text-xs text-green-300 mt-0.5">{offer.description}</p>
        </div>
        <span className="shrink-0 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold px-3 py-1">
          {inr(offer.reward)} cashback
        </span>
      </div>

      <p className="text-sm font-semibold text-green-600 mt-4">{goalText(offer)}</p>

      <ul className="mt-2.5 space-y-1.5 text-xs text-green-400">
        <li className="flex items-center gap-2">
          <BadgeCheck size={14} className="text-green-300 shrink-0" /> Eligibility: {offer.eligibility}
        </li>
        <li className="flex items-center gap-2">
          <CalendarClock size={14} className="text-green-300 shrink-0" /> {validityText(offer)}
        </li>
      </ul>

      <button
        type="button"
        onClick={() => setShowTerms((v) => !v)}
        aria-expanded={showTerms}
        className="mt-3 flex items-center gap-1 text-xs font-semibold text-green-600 hover:underline self-start"
      >
        Terms &amp; conditions <ChevronDown size={13} className={`transition-transform ${showTerms ? "rotate-180" : ""}`} />
      </button>
      {showTerms && (
        <ul className="mt-2 space-y-1 text-[11px] text-green-400 list-disc pl-4">
          {offer.conditions.map((c) => (
            <li key={c}>{c}</li>
          ))}
        </ul>
      )}

      <div className="mt-auto pt-4">
        {!activated && (
          <button
            type="button"
            onClick={() => onActivate(offer)}
            className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2.5 rounded-lg transition-colors text-sm"
          >
            Activate offer
          </button>
        )}

        {activated && !progress.done && (
          <div>
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="font-semibold text-emerald-700 flex items-center gap-1">
                <CheckCircle2 size={13} /> Activated
              </span>
              <span className="font-semibold text-green-600">
                {progress.metric === "volume" ? `${inr(progress.value)} / ${inr(progress.target)}` : `${progress.value} / ${progress.target} payments`}
              </span>
            </div>
            <div
              role="progressbar"
              aria-label={`${offer.title} progress`}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={progress.pct}
              className="h-2 rounded-full bg-green-50 overflow-hidden"
            >
              <div className="h-full rounded-full bg-green-500 transition-all duration-500" style={{ width: `${progress.pct}%` }} />
            </div>
            <p className="text-xs text-green-400 mt-2">{remainingText(offer, progress.remaining)}</p>
          </div>
        )}

        {activated && progress.done && (
          <div className="flex items-start gap-2 rounded-lg bg-emerald-50 border border-emerald-200 px-3 py-2.5 text-xs text-emerald-800">
            <PartyPopper size={15} className="shrink-0 mt-0.5" />
            <span>
              <span className="font-semibold">Goal completed!</span> {inr(offer.reward)} cashback earned. It will be added to your next settlement.
              {offer.period !== "once" && " You can earn it again next period."}
            </span>
          </div>
        )}
      </div>
    </motion.div>
  );
}

export default function Rewards() {
  const { session } = useAuth();
  const { t } = useLanguage();
  const { showToast } = useToast();
  const merchantId = session.merchantId;
  const txns = db.getTxnsByMerchant(merchantId);

  const [activations, setActivations] = useState(() => getActivations(merchantId));
  const [tab, setTab] = useState("offers");

  const now = new Date();
  const rewards = buildRewards(merchantId, txns, activations, now);
  const totals = rewardTotals(rewards);

  const handleActivate = (offer) => {
    setActivations(activateOffer(merchantId, offer.id));
    showToast({ title: "Offer activated", subtitle: `${offer.title} — payments you receive from now on count towards it.`, type: "success" });
  };

  // In-progress offers first, then completed ones, then the not-yet-activated ones.
  const cards = REWARD_OFFERS.map((offer) => ({ offer, progress: getProgress(offer, txns, activations[offer.id], now) })).sort((a, b) => {
    const rank = (c) => (c.progress ? (c.progress.done ? 1 : 0) : 2);
    return rank(a) - rank(b);
  });

  return (
    <div className="max-w-5xl">
      <h1 className="font-display font-bold text-2xl text-green-700">{t("rewardsTitle")}</h1>
      <p className="text-sm text-green-300 mb-6">{t("rewardsSubtitle")}</p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
        <StatCard icon={Gift} label="Total earned" value={inr(totals.total)} sub={`${rewards.length} reward${rewards.length === 1 ? "" : "s"}`} accent="green" />
        <StatCard icon={Clock} label="Pending" value={inr(totals.pending)} sub="Added to your next settlement" accent="green" />
        <StatCard icon={CheckCircle2} label="Credited" value={inr(totals.credited)} sub="Already added to settlements" accent="green" />
      </div>

      <p className="flex items-start gap-2 text-xs text-green-400 mb-6">
        <Info size={14} className="shrink-0 mt-0.5 text-green-300" />
        <span>
          Cashback you earn is added to your settlement and paid to your bank account with the next payout.{" "}
          <Link to="/merchant/settlements" className="text-green-600 font-semibold hover:underline">
            View settlements
          </Link>
        </span>
      </p>

      <div role="tablist" aria-label="Rewards sections" className="inline-flex rounded-lg border border-green-100 bg-white p-1 mb-5">
        {[
          { key: "offers", label: "Offers" },
          { key: "history", label: `History (${rewards.length})` },
        ].map((tabItem) => (
          <button
            key={tabItem.key}
            role="tab"
            aria-selected={tab === tabItem.key}
            onClick={() => setTab(tabItem.key)}
            className={`px-4 py-1.5 rounded-md text-sm font-semibold transition-colors ${
              tab === tabItem.key ? "bg-green-500 text-white" : "text-green-500 hover:bg-green-50"
            }`}
          >
            {tabItem.label}
          </button>
        ))}
      </div>

      {tab === "offers" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {cards.map(({ offer, progress }) => (
            <OfferCard key={offer.id} offer={offer} progress={progress} onActivate={handleActivate} />
          ))}
        </div>
      )}

      {tab === "history" && (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[640px]">
              <thead className="bg-green-50 text-green-500 text-xs uppercase font-semibold">
                <tr>
                  <th className="text-left px-5 py-3">Earned on</th>
                  <th className="text-left px-5 py-3">Reward</th>
                  <th className="text-left px-5 py-3">Earned for</th>
                  <th className="text-right px-5 py-3">Amount</th>
                  <th className="text-right px-5 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-green-50">
                {rewards.map((r) => (
                  <tr key={r.id} className="hover:bg-green-50/50">
                    <td className="px-5 py-3 text-green-400 text-xs whitespace-nowrap">{fmtDate(r.earned_at)}</td>
                    <td className="px-5 py-3 font-semibold text-green-700">{r.title}</td>
                    <td className="px-5 py-3 text-green-400 text-xs">{r.reason}</td>
                    <td className="px-5 py-3 text-right font-semibold text-green-700">{inr(r.amount)}</td>
                    <td className="px-5 py-3 text-right">
                      <StatusBadge status={r.status} />
                      <p className="text-[11px] text-green-300 mt-1">{r.credited_at ? `Credited ${fmtDate(r.credited_at)}` : "With next settlement"}</p>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {rewards.length === 0 && (
            <div className="text-center py-10 px-4">
              <p className="text-sm text-green-300 flex items-center justify-center gap-2">
                <Gift size={16} /> No rewards yet. Activate an offer and complete its goal to earn your first cashback.
              </p>
              <button onClick={() => setTab("offers")} className="mt-3 text-xs font-semibold text-green-600 hover:underline">
                Browse offers
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
