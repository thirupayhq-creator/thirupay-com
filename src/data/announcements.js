// Platform-wide announcements from Super Admin to every merchant — maintenance
// notices, new feature launches, policy changes. Separate from Promo Banners
// (customer-facing marketing on the pay page) — this is internal, merchant-facing.

const KEY = "tp_announcements";

export function getAnnouncements() {
  try {
    return JSON.parse(localStorage.getItem(KEY)) || [];
  } catch {
    return [];
  }
}

export function addAnnouncement({ title, body, postedBy }) {
  const all = getAnnouncements();
  const entry = { id: `ann_${Date.now()}`, title, body, postedBy, postedAt: new Date().toISOString() };
  all.unshift(entry);
  localStorage.setItem(KEY, JSON.stringify(all));
  return entry;
}

export function removeAnnouncement(id) {
  const all = getAnnouncements().filter((a) => a.id !== id);
  localStorage.setItem(KEY, JSON.stringify(all));
}

// Merchant-side "seen" tracking so a dismissed announcement doesn't keep
// reappearing for that merchant on every page load.
export function isAnnouncementDismissed(id) {
  const dismissed = JSON.parse(localStorage.getItem("tp_announcements_dismissed") || "[]");
  return dismissed.includes(id);
}

export function dismissAnnouncement(id) {
  const dismissed = JSON.parse(localStorage.getItem("tp_announcements_dismissed") || "[]");
  if (!dismissed.includes(id)) {
    dismissed.push(id);
    localStorage.setItem("tp_announcements_dismissed", JSON.stringify(dismissed));
  }
}
