import { jsPDF } from "jspdf";

// Standard PDF fonts can't draw the ₹ glyph, so bills use "Rs." to stay readable everywhere.
const money = (n) => `Rs. ${Number(n).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
const MODE_LABEL = { cash: "Cash", upi: "UPI (ThiruPay)", khata: "Khata (credit)" };

// Builds a shop-counter bill as a PDF. bill: see billingData.createBill. merchant: { business_name, city, state, phone }
export function buildBillPDF(bill, merchant) {
  const W = 320;
  const rowH = 18;
  const H = Math.max(330, 218 + bill.items.length * rowH + (bill.customer_name ? 18 : 0) + (bill.cash_received != null ? 36 : 0));
  const doc = new jsPDF({ unit: "pt", format: [W, H] });
  const navy = "#0B2A4A";
  const gray = "#6B7280";

  doc.setFillColor(11, 42, 74);
  doc.rect(0, 0, W, 64, "F");
  doc.setTextColor("#FFFFFF");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(15);
  doc.text(merchant?.business_name || "Bill", W / 2, 28, { align: "center", maxWidth: W - 40 });
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor("#C9DAEC");
  const place = [merchant?.city, merchant?.state].filter(Boolean).join(", ");
  doc.text(place || "Powered by ThiruPay", W / 2, 46, { align: "center" });

  let y = 90;
  doc.setTextColor(navy);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text(`Bill ${bill.bill_no}`, 24, y);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(gray);
  doc.text(new Date(bill.created_at).toLocaleString("en-IN", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }), W - 24, y, { align: "right" });

  y += 10;
  doc.setDrawColor(220, 228, 238);
  doc.line(24, y, W - 24, y);
  y += 18;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(gray);
  doc.text("ITEM", 24, y);
  doc.text("QTY x RATE", 190, y, { align: "right" });
  doc.text("AMOUNT", W - 24, y, { align: "right" });
  y += 14;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9.5);
  doc.setTextColor(navy);
  bill.items.forEach((i) => {
    doc.text(i.name, 24, y, { maxWidth: 110 });
    doc.text(`${i.qty} x ${Number(i.price).toLocaleString("en-IN")}`, 190, y, { align: "right" });
    doc.text(money(i.line_total), W - 24, y, { align: "right" });
    y += rowH;
  });

  y += 2;
  doc.line(24, y, W - 24, y);
  y += 22;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.text("Total", 24, y);
  doc.text(money(bill.total), W - 24, y, { align: "right" });

  y += 26;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9.5);
  doc.setTextColor(gray);
  const row = (label, value) => {
    doc.text(label, 24, y);
    doc.setTextColor(navy);
    doc.text(String(value), W - 24, y, { align: "right" });
    doc.setTextColor(gray);
    y += 18;
  };
  row("Paid by", MODE_LABEL[bill.payment_mode] || bill.payment_mode);
  if (bill.customer_name) row("Customer", bill.customer_name);
  if (bill.cash_received != null) {
    row("Cash received", money(bill.cash_received));
    row("Change returned", money(bill.change));
  }

  doc.setFontSize(9);
  doc.setTextColor(gray);
  doc.text("Thank you for shopping with us!", W / 2, H - 22, { align: "center" });
  return doc;
}

export function downloadBillPDF(bill, merchant) {
  buildBillPDF(bill, merchant).save(`${bill.bill_no}.pdf`);
}
