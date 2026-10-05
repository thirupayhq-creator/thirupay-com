// Merchant Rewards — ThiruPay → merchant cashback offers (frontend demo).
//
// How it works (mirrors the "Cashback → Activate Offer" flow in real merchant apps):
//   1. ThiruPay publishes offers (REWARD_OFFERS below). Merchants do not create offers.
//   2. The merchant taps "Activate". Only successful payments received AFTER activation count.
//   3. Progress and earned rewards are DERIVED from the merchant's real transactions,
//      so nothing can get out of sync. Only the activation time is stored (localStorage).
//   4. A completed offer gives a reward: "pending" first, then "credited" with the next
//      settlement (simulated as 24h after it was earned).
//
// When the real backend is ready: replace getActivations/activateOffer with API calls and
// buildRewards with the rewards list returned by the server. The page UI stays the same.

const STORAGE_KEY = "tp_reward_activations";
const DAY = 86400000;
export const CREDIT_DELAY_MS = DAY; // demo: reward is added to the settlement ~1 day after it's earned

// rule.metric: "count" (number of payments) | "volume" (total ₹ collected)
// rule.minAmount: a payment must be at least this much to count
// rule.payment_mode / rule.payment_method: optional filters (e.g. "UPI", "QR")
// period: "once" | "day" | "week" | "month" — the target resets every period
export const REWARD_OFFERS = [
  {
    id: "first_payment",
    title: "First Payment Bonus",
    description: "Receive your first payment after activating and get a welcome cashback.",
    period: "once",
    rule: { metric: "count", target: 1, minAmount: 100 },
    reward: 25,
    eligibility: "All active merchants",
    conditions: ["Payment must be ₹100 or more.", "Only payments received after you activate the offer count.", "Reward is given once per merchant."],
  },
  {
    id: "daily_starter",
    title: "Daily Starter",
    description: "Keep the counter busy every day and earn a small daily cashback.",
    period: "day",
    rule: { metric: "count", target: 3, minAmount: 0 },
    reward: 10,
    eligibility: "All active merchants",
    conditions: ["Payments of any amount count.", "Resets every day at midnight.", "Cashback is given once per day."],
  },
  {
    id: "weekly_boost",
    title: "Weekly Boost",
    description: "Steady weekly sales earn a bigger cashback.",
    period: "week",
    rule: { metric: "count", target: 10, minAmount: 200 },
    reward: 50,
    eligibility: "Payments of ₹200 and above",
    conditions: ["Each payment must be ₹200 or more.", "Week runs Monday to Sunday.", "Refunded or failed payments don't count."],
  },
  {
    id: "upi_champion",
    title: "UPI Champion",
    description: "Push your customers to pay by UPI and earn extra.",
    period: "week",
    rule: { metric: "count", target: 15, minAmount: 0, payment_mode: "UPI" },
    reward: 40,
    eligibility: "UPI payments only",
    conditions: ["Only UPI payments count (cards and wallets don't).", "Week runs Monday to Sunday.", "Refunded or failed payments don't count."],
  },
  {
    id: "monthly_volume",
    title: "Monthly Volume Bonus",
    description: "Hit your monthly collection target for a volume bonus.",
    period: "month",
    rule: { metric: "volume", target: 25000, minAmount: 0 },
    reward: 250,
    eligibility: "All active merchants",
    conditions: ["Total of successful payments in the calendar month.", "Resets on the 1st of every month.", "Refunded or failed payments don't count."],
  },
];

// Demo-only sample history for the seeded demo merchant, so the History tab isn't empty.
// (Same idea as the seeded transactions/settlements in mockData.js.)
const SAMPLE_REWARDS = {
  m_001: [
    { id: "rw_sample_1", offer_id: "weekly_boost", title: "Weekly Boost", reason: "10 payments of ₹200+ · previous week", amount: 50, daysAgo: 12 },
    { id: "rw_sample_2", offer_id: "daily_starter", title: "Daily Starter", reason: "3 payments · one day last week", amount: 10, daysAgo: 6 },
  ],
};

// ---------- Activation storage ----------
function readAll() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
  } catch {
    return {};
  }
}

export function getActivations(merchantId) {
  return readAll()[merchantId] || {};
}

export function activateOffer(merchantId, offerId) {
  const all = readAll();
  const mine = all[merchantId] || {};
  if (!mine[offerId]) mine[offerId] = new Date().toISOString();
  all[merchantId] = mine;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
  } catch {
    // storage full/unavailable — activation just won't persist
  }
  return mine;
}

// ---------- Period maths (weeks run Monday → Sunday) ----------
export function periodStart(period, date) {
  const y = date.getFullYear();
  const m = date.getMonth();
  const d = date.getDate();
  if (period === "day") return new Date(y, m, d);
  if (period === "week") return new Date(y, m, d - ((date.getDay() + 6) % 7));
  if (period === "month") return new Date(y, m, 1);
  return new Date(0); // "once"
}

export function periodEnd(period, start) {
  const y = start.getFullYear();
  const m = start.getMonth();
  const d = start.getDate();
  if (period === "day") return new Date(y, m, d + 1, 0, 0, 0, -1);
  if (period === "week") return new Date(y, m, d + 7, 0, 0, 0, -1);
  if (period === "month") return new Date(y, m + 1, 1, 0, 0, 0, -1);
  return null; // "once" never ends
}

const fmtDay = (d) => d.toLocaleDateString("en-IN", { day: "2-digit", month: "short" });
const fmtMonth = (d) => d.toLocaleDateString("en-IN", { month: "short", year: "numeric" });
const inr = (n) => `₹${Number(n).toLocaleString("en-IN")}`;

// ---------- Text helpers ----------
function paymentNoun(rule, count) {
  const prefix = rule.payment_mode ? `${rule.payment_mode} ` : rule.payment_method ? `${rule.payment_method} ` : "";
  return `${prefix}payment${count === 1 ? "" : "s"}`;
}

// "10 payments of ₹200+", "15 UPI payments", "₹25,000 in payments"
export function describeRule(offer, count = offer.rule.target) {
  const { rule } = offer;
  if (rule.metric === "volume") return `${inr(rule.target)} in payments`;
  return `${count} ${paymentNoun(rule, count)}${rule.minAmount ? ` of ${inr(rule.minAmount)}+` : ""}`;
}

const PERIOD_WORD = { once: "", day: " today", week: " this week", month: " this month" };

// "10 more payments of ₹200+ this week to earn ₹50"
export function remainingText(offer, remaining) {
  const { rule, period, reward } = offer;
  if (rule.metric === "volume") return `Collect ${inr(remaining)} more${PERIOD_WORD[period]} to earn ${inr(reward)}`;
  return `${remaining} more ${paymentNoun(rule, remaining)}${rule.minAmount ? ` of ${inr(rule.minAmount)}+` : ""}${PERIOD_WORD[period]} to earn ${inr(reward)}`;
}

// "Receive 10 payments of ₹200+ this week" / "Collect ₹25,000 this month"
export function goalText(offer) {
  const word = PERIOD_WORD[offer.period];
  if (offer.rule.metric === "volume") return `Collect ${inr(offer.rule.target)}${word}`;
  return `Receive ${describeRule(offer)}${word}`;
}

export function validityText(offer, now = new Date()) {
  if (offer.period === "once") return "One-time offer · no expiry";
  const end = periodEnd(offer.period, periodStart(offer.period, now));
  if (offer.period === "day") return "Valid today · renews daily";
  return `Valid till ${fmtDay(end)} · renews ${offer.period === "week" ? "weekly" : "monthly"}`;
}

function periodLabel(offer, start) {
  if (offer.period === "day") return fmtDay(start);
  if (offer.period === "week") return `${fmtDay(start)} – ${fmtDay(periodEnd("week", start))}`;
  if (offer.period === "month") return fmtMonth(start);
  return "";
}

// ---------- Evaluation ----------
function qualifies(offer, tx) {
  const { rule } = offer;
  if (tx.status !== "success") return false;
  if (tx.amount < (rule.minAmount || 0)) return false;
  if (rule.payment_mode && tx.payment_mode !== rule.payment_mode) return false;
  if (rule.payment_method && tx.payment_method !== rule.payment_method) return false;
  return true;
}

// Progress inside ONE period window. `doneAt` = time of the payment that completed the target.
function evaluateWindow(offer, txns, from, to) {
  const inWindow = txns
    .filter((tx) => {
      const ts = new Date(tx.created_at).getTime();
      return ts >= from.getTime() && (to == null || ts <= to.getTime()) && qualifies(offer, tx);
    })
    .sort((a, b) => new Date(a.created_at) - new Date(b.created_at));

  const { metric, target } = offer.rule;
  let running = 0;
  let doneAt = null;
  for (const tx of inWindow) {
    running += metric === "volume" ? tx.amount : 1;
    if (doneAt == null && running >= target) doneAt = tx.created_at;
  }
  return { value: running, doneAt };
}

// Live progress for the CURRENT period. Returns null when the offer isn't activated.
export function getProgress(offer, txns, activatedAt, now = new Date()) {
  if (!activatedAt) return null;
  const activated = new Date(activatedAt);
  const start = periodStart(offer.period, now);
  const end = periodEnd(offer.period, start);
  const from = activated > start ? activated : start;
  const { value, doneAt } = evaluateWindow(offer, txns, from, end);
  const target = offer.rule.target;
  const shown = Math.min(value, target);
  return {
    value: shown,
    target,
    pct: Math.round((shown / target) * 100),
    done: doneAt != null,
    remaining: Math.max(target - value, 0),
    metric: offer.rule.metric,
  };
}

// Every reward the merchant has earned so far (each period can reward once).
export function buildRewards(merchantId, txns, activations, now = new Date()) {
  const rewards = [];

  REWARD_OFFERS.forEach((offer) => {
    const activatedAt = activations[offer.id];
    if (!activatedAt) return;
    const activated = new Date(activatedAt);

    let cursor = periodStart(offer.period, activated);
    for (let guard = 0; guard < 400 && cursor <= now; guard++) {
      const end = periodEnd(offer.period, cursor);
      const from = activated > cursor ? activated : cursor;
      const { doneAt } = evaluateWindow(offer, txns, from, end);
      if (doneAt) {
        const label = periodLabel(offer, cursor);
        rewards.push({
          id: `rw_${offer.id}_${cursor.getTime()}`,
          offer_id: offer.id,
          title: offer.title,
          reason: `${describeRule(offer)}${label ? ` · ${label}` : ""}`,
          amount: offer.reward,
          earned_at: doneAt,
        });
      }
      if (end == null) break; // "once" offers have a single window
      cursor = new Date(end.getTime() + 1);
    }
  });

  (SAMPLE_REWARDS[merchantId] || []).forEach((s) => {
    rewards.push({ id: s.id, offer_id: s.offer_id, title: s.title, reason: s.reason, amount: s.amount, earned_at: new Date(now.getTime() - s.daysAgo * DAY).toISOString() });
  });

  return rewards
    .map((r) => {
      const creditedAt = new Date(new Date(r.earned_at).getTime() + CREDIT_DELAY_MS);
      const credited = creditedAt <= now;
      return { ...r, status: credited ? "credited" : "pending", credited_at: credited ? creditedAt.toISOString() : null };
    })
    .sort((a, b) => new Date(b.earned_at) - new Date(a.earned_at));
}

export function rewardTotals(rewards) {
  const sum = (list) => list.reduce((s, r) => s + r.amount, 0);
  return {
    total: sum(rewards),
    pending: sum(rewards.filter((r) => r.status === "pending")),
    credited: sum(rewards.filter((r) => r.status === "credited")),
  };
}
