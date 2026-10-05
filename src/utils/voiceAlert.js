// Voice announcements for the Soundbox: turns an amount into words ("five hundred rupees")
// using the Indian system (thousand / lakh / crore) and speaks it with the browser's
// speech synthesis. A real Soundbox device does this itself; the web app previews it.

const ONES = ["", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen", "seventeen", "eighteen", "nineteen"];
const TENS = ["", "", "twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety"];

function below100(n) {
  if (n < 20) return ONES[n];
  return TENS[Math.floor(n / 10)] + (n % 10 ? ` ${ONES[n % 10]}` : "");
}

function below1000(n) {
  const hundreds = Math.floor(n / 100);
  const rest = n % 100;
  return [hundreds ? `${ONES[hundreds]} hundred` : "", rest ? below100(rest) : ""].filter(Boolean).join(" ");
}

// 0 ≤ n < 1000 crore, whole numbers
export function numberToWords(n) {
  if (n === 0) return "zero";
  const parts = [];
  const crore = Math.floor(n / 1e7);
  const lakh = Math.floor((n % 1e7) / 1e5);
  const thousand = Math.floor((n % 1e5) / 1e3);
  const rest = n % 1e3;
  if (crore) parts.push(`${numberToWords(crore)} crore`);
  if (lakh) parts.push(`${below100(lakh)} lakh`);
  if (thousand) parts.push(`${below100(thousand)} thousand`);
  if (rest) parts.push(below1000(rest));
  return parts.join(" ");
}

// 500 → "five hundred rupees" · 1250.5 → "one thousand two hundred fifty rupees and fifty paise"
export function amountToWords(amount) {
  const total = Math.round(Number(amount) * 100);
  if (!Number.isFinite(total) || total < 0 || total >= 1e12) return null;
  const rupees = Math.floor(total / 100);
  const paise = total % 100;
  const parts = [];
  if (rupees || !paise) parts.push(`${numberToWords(rupees)} ${rupees === 1 ? "rupee" : "rupees"}`);
  if (paise) parts.push(`${numberToWords(paise)} paise`);
  return parts.join(" and ");
}

export function announcementText(amount) {
  const words = amountToWords(amount);
  return words ? `Payment of ${words} received.` : "Payment received.";
}

export const isSpeechSupported = () => typeof window !== "undefined" && "speechSynthesis" in window && typeof window.SpeechSynthesisUtterance !== "undefined";

// volume: 0–100. Returns true when speech was handed to the browser.
export function speak(text, volume = 70) {
  if (!isSpeechSupported()) return false;
  try {
    const utterance = new window.SpeechSynthesisUtterance(text);
    utterance.lang = "en-IN";
    utterance.volume = Math.min(1, Math.max(0, volume / 100));
    utterance.rate = 0.95;
    const voice = window.speechSynthesis.getVoices?.().find((v) => v.lang === "en-IN");
    if (voice) utterance.voice = voice;
    window.speechSynthesis.speak(utterance);
    return true;
  } catch {
    return false;
  }
}
