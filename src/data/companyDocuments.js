// ThiruPay's own company-level compliance documents (not a merchant's KYC —
// this is the platform's own paperwork). Super Admin manages this from the
// Company Documents page.

export const DOCUMENT_TYPES = [
  { key: "incorporation", label: "Certificate of Incorporation", hasExpiry: false },
  { key: "gst", label: "GST Registration", hasExpiry: false },
  { key: "pan", label: "PAN Card (Company)", hasExpiry: false },
  { key: "pa_authorization", label: "RBI / Payment Aggregator Authorization", hasExpiry: true },
  { key: "bank_agreement", label: "Bank Settlement Agreement", hasExpiry: true },
];

const KEY = "tp_company_documents";

export function getCompanyDocuments() {
  try {
    return JSON.parse(localStorage.getItem(KEY)) || {};
  } catch {
    return {};
  }
}

// record: { fileName, dataUrl, uploadedAt, expiry }
export function saveCompanyDocument(docKey, record) {
  const all = getCompanyDocuments();
  all[docKey] = record;
  localStorage.setItem(KEY, JSON.stringify(all));
}

export function removeCompanyDocument(docKey) {
  const all = getCompanyDocuments();
  delete all[docKey];
  localStorage.setItem(KEY, JSON.stringify(all));
}
