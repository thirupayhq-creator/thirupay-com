import { useEffect, useRef } from "react";
import { db } from "../data/mockData";
import { getSoundbox } from "../data/soundboxData";

// Watches a merchant's transactions and calls onPayment(txn) once for every NEW successful
// payment — but only while their Soundbox is Active. Payments that already existed when the
// hook started are never announced. Works across tabs ("storage" event) with a 1.5s check
// as a fallback, same idea as the Billing UPI checkout.
export function usePaymentAlerts(merchantId, onPayment) {
  const callbackRef = useRef(onPayment);
  useEffect(() => {
    callbackRef.current = onPayment;
  });

  useEffect(() => {
    if (!merchantId) return undefined;
    const seen = new Set(db.getTxnsByMerchant(merchantId).map((t) => t.transaction_id));

    const check = () => {
      const fresh = db.getTxnsByMerchant(merchantId).filter((t) => !seen.has(t.transaction_id));
      if (fresh.length === 0) return;
      fresh.forEach((t) => seen.add(t.transaction_id));
      if (getSoundbox(merchantId).state !== "active") return;
      fresh
        .filter((t) => t.status === "success")
        .sort((a, b) => new Date(a.created_at) - new Date(b.created_at))
        .forEach((t) => callbackRef.current(t));
    };

    const timer = setInterval(check, 1500);
    window.addEventListener("storage", check);
    return () => {
      clearInterval(timer);
      window.removeEventListener("storage", check);
    };
  }, [merchantId]);
}
