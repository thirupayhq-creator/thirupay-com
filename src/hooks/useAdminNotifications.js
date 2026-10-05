import { db } from "../data/mockData";

// Shared across AdminLayout and SuperAdminLayout so both portals build their
// bell notifications the same way. `basePath` lets each portal deep-link
// notifications into its own route tree ("/admin/..." or "/superadmin/...").
export function useAdminNotifications(basePath = "/admin") {
  const merchantName = (id) => db.getMerchantById(id)?.business_name || id;

  return [
    ...db.getMerchants()
      .filter((m) => m.status === "pending")
      .map((m) => ({
        id: `kyc-${m.merchant_id}`,
        title: `${m.business_name} — KYC review pending`,
        subtitle: "New merchant needs KYC verification",
        to: `${basePath}/kyc`,
        ts: m.registered_at ? new Date(m.registered_at).getTime() : 0,
      })),
    ...db.getAllRequests()
      .filter((r) => r.status === "requested")
      .map((r) => ({
        id: `req-${r.request_id}`,
        title: `${merchantName(r.merchant_id)} — ${r.type.replace("_", " ")} request`,
        subtitle: "Service request needs review",
        to: `${basePath}/service-requests`,
        ts: new Date(r.created_at).getTime(),
      })),
    ...db.getAllSettlements()
      .filter((s) => s.status === "pending")
      .slice(0, 8)
      .map((s) => ({
        id: `settle-${s.settlement_id}`,
        title: `₹${s.amount.toLocaleString("en-IN")} settlement pending`,
        subtitle: merchantName(s.merchant_id),
        to: `${basePath}/settlements`,
        ts: s.settlement_date ? new Date(s.settlement_date).getTime() : 0,
      })),
    ...db.getAllTickets()
      .filter((tk) => tk.status !== "resolved")
      .map((tk) => ({
        id: `ticket-${tk.ticket_id}`,
        title: `${merchantName(tk.merchant_id)} — ${tk.subject}`,
        subtitle: "Support ticket needs a reply",
        to: `${basePath}/support-tickets`,
        ts: new Date(tk.created_at).getTime(),
      })),
    ...db.getAllLeaves()
      .filter((l) => l.status === "pending")
      .map((l) => {
        const staffName = db.getAdminStaff().find((s) => s.staff_id === l.staff_id)?.name || "Staff";
        return {
          id: `leave-${l.leave_id}`,
          title: `${staffName} — leave request pending`,
          subtitle: "Needs approve/reject",
          to: `${basePath}/staff`,
          ts: new Date(l.created_at).getTime(),
        };
      }),
  ].sort((a, b) => b.ts - a.ts);
}
