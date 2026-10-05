import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import { useRegistration } from "../../context/RegistrationContext";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import { IDENTITY_DOC_TYPES, PAN_REGEX, readFile } from "../../data/registrationConfig";
import { AccordionSection, Field, FileUploadField, inputCls } from "../../components/register/formUI";

// Stage 3 — bank account + KYC documents. Submitting this page is what actually
// creates the merchant account (user + merchant + KYC record, all "pending").
export default function RegisterKYC() {
  const { form, updateForm, files, setFile, markRegistrationComplete } = useRegistration();
  const { registerMerchant } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [openSection, setOpenSection] = useState("bank");
  const toggleSection = (key) => setOpenSection((prev) => (prev === key ? "" : key));

  const [fieldErrors, setFieldErrors] = useState({});
  const [submitError, setSubmitError] = useState("");
  const setFieldError = (key, msg) => setFieldErrors((f) => ({ ...f, [key]: msg }));

  const handleUpload = async (key, file, opts) => {
    if (!file) return;
    setFieldError(key, "");
    try {
      const { fileName, fileData } = await readFile(file, opts);
      setFile(key, { name: fileName, data: fileData });
    } catch (err) {
      setFieldError(key, err.message || "Could not upload file.");
    }
  };

  const identityDocLabel = IDENTITY_DOC_TYPES.find((d) => d.value === form.identityDocType)?.label || "Document";

  // ---------- Section completion ticks ----------
  const bankDone =
    !!form.accountHolder?.trim() &&
    !!form.accountNumber &&
    form.accountNumber === form.confirmAccountNumber &&
    (form.ifsc || "").length === 11 &&
    !!form.bankName?.trim() &&
    !!form.branch?.trim();
  const companyIdentityDone = PAN_REGEX.test((form.pan || "").trim().toUpperCase()) && !!files.panFile;
  const identityDone = !!form.identityDocType && !!form.identityDocNumber?.trim() && !!files.identityFile;
  const companyDocsDone = parseInt(form.numberOfDirectors, 10) >= 2 && !!files.directorsZip && !!files.incorporationFile;

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitError("");

    // Bank
    if (form.accountNumber !== form.confirmAccountNumber) {
      setOpenSection("bank");
      setSubmitError("Account number and Confirm Account Number must match.");
      return;
    }
    if ((form.ifsc || "").length !== 11) {
      setOpenSection("bank");
      setSubmitError("IFSC code must be exactly 11 characters.");
      return;
    }

    // Company identity
    const pan = (form.pan || "").trim().toUpperCase();
    if (!PAN_REGEX.test(pan)) {
      setOpenSection("companyIdentity");
      setSubmitError("Enter a valid PAN number, e.g. ABCDE1234F (5 letters, 4 digits, 1 letter).");
      return;
    }
    if (!files.panFile) {
      setOpenSection("companyIdentity");
      setSubmitError("Upload the PAN card.");
      return;
    }

    // Identity verification
    if (!form.identityDocType) {
      setOpenSection("identityVerification");
      setSubmitError("Choose one identity verification document type.");
      return;
    }
    if (!form.identityDocNumber?.trim()) {
      setOpenSection("identityVerification");
      setSubmitError(`Enter the ${identityDocLabel} number.`);
      return;
    }
    if (!files.identityFile) {
      setOpenSection("identityVerification");
      setSubmitError(`Upload the ${identityDocLabel} document.`);
      return;
    }

    // Company documents
    const directors = parseInt(form.numberOfDirectors, 10);
    if (!directors || directors < 2) {
      setOpenSection("companyDocuments");
      setSubmitError("Enter a valid number of directors (minimum 2 for a company).");
      return;
    }
    if (!files.directorsZip) {
      setOpenSection("companyDocuments");
      setSubmitError("Upload the directors list (ZIP).");
      return;
    }
    if (!files.incorporationFile) {
      setOpenSection("companyDocuments");
      setSubmitError("Upload the Certificate of Incorporation.");
      return;
    }

    // Everything the merchant filled in across the 3 pages goes in one go.
    const res = registerMerchant(
      { ...form, businessPhoto: files.businessPhoto || "" },
      {
        pan,
        pan_document_name: files.panFile.name,
        pan_document_url: files.panFile.data,
        identity_doc_type: form.identityDocType,
        identity_doc_number: form.identityDocNumber,
        identity_document_name: files.identityFile.name,
        identity_document_url: files.identityFile.data,
        number_of_directors: directors,
        directors_zip_name: files.directorsZip.name,
        directors_zip_url: files.directorsZip.data,
        incorporation_document_name: files.incorporationFile.name,
        incorporation_document_url: files.incorporationFile.data,
      }
    );

    if (!res.ok) {
      setSubmitError(res.error);
      return;
    }

    showToast({
      title: "Registration submitted",
      subtitle: "Your KYC is with our team. We'll notify you once it's approved.",
      type: "success",
      duration: 5000,
    });
    markRegistrationComplete(); // draft is cleared when the wizard unmounts
    navigate("/merchant", { replace: true });
  };

  return (
    <>
      <div className="text-center mb-6">
        <div className="w-12 h-12 rounded-xl bg-green-50 text-green-700 flex items-center justify-center mx-auto mb-3">
          <ShieldCheck size={22} />
        </div>
        <h1 className="font-display font-bold text-xl text-green-700">Bank account &amp; KYC</h1>
        <p className="text-sm text-green-300 mt-1">Settlements go to this account. Documents are verified by our team.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Bank */}
        <AccordionSection title="Bank Account" isOpen={openSection === "bank"} onToggle={() => toggleSection("bank")} done={bankDone}>
          <Field label="Account Holder Name" required>
            <input
              placeholder="Selvi Kumar"
              value={form.accountHolder || ""}
              onChange={(e) => updateForm({ accountHolder: e.target.value })}
              className={inputCls}
            />
          </Field>
          <Field label="Account Number" required>
            <input
              inputMode="numeric"
              placeholder="5011000123456"
              value={form.accountNumber || ""}
              onChange={(e) => updateForm({ accountNumber: e.target.value.replace(/\D/g, "") })}
              className={inputCls}
            />
          </Field>
          <Field label="Confirm Account Number" required>
            <input
              inputMode="numeric"
              placeholder="Re-enter account number"
              value={form.confirmAccountNumber || ""}
              onChange={(e) => updateForm({ confirmAccountNumber: e.target.value.replace(/\D/g, "") })}
              className={inputCls}
            />
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="IFSC Code" required>
              <input
                maxLength={11}
                placeholder="SBIN0001234"
                value={form.ifsc || ""}
                onChange={(e) => updateForm({ ifsc: e.target.value.toUpperCase() })}
                className={`${inputCls} uppercase`}
              />
            </Field>
            <Field label="Bank Name" required>
              <input
                placeholder="State Bank of India"
                value={form.bankName || ""}
                onChange={(e) => updateForm({ bankName: e.target.value })}
                className={inputCls}
              />
            </Field>
          </div>
          <Field label="Branch" required>
            <input
              placeholder="T. Nagar, Chennai"
              value={form.branch || ""}
              onChange={(e) => updateForm({ branch: e.target.value })}
              className={inputCls}
            />
          </Field>
        </AccordionSection>

        {/* Company Identity */}
        <AccordionSection
          title="Company Identity"
          isOpen={openSection === "companyIdentity"}
          onToggle={() => toggleSection("companyIdentity")}
          done={companyIdentityDone}
        >
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="PAN Number" required>
              <input
                value={form.pan || ""}
                onChange={(e) => updateForm({ pan: e.target.value.toUpperCase() })}
                placeholder="e.g. ABCDE1234F"
                maxLength={10}
                className={`${inputCls} uppercase`}
              />
            </Field>
            <FileUploadField
              label="PAN Card Upload *"
              hint="JPEG, PNG or PDF — max 2MB"
              value={files.panFile?.name}
              error={fieldErrors.panFile}
              onChange={(e) => handleUpload("panFile", e.target.files?.[0])}
            />
          </div>
        </AccordionSection>

        {/* Identity Verification */}
        <AccordionSection
          title="Identity Verification"
          subtitle="(Choose any one)"
          isOpen={openSection === "identityVerification"}
          onToggle={() => toggleSection("identityVerification")}
          done={identityDone}
        >
          <Field label="Document Type" required>
            <select
              value={form.identityDocType || ""}
              onChange={(e) => {
                updateForm({ identityDocType: e.target.value, identityDocNumber: "" });
                setFile("identityFile", null);
              }}
              className={`${inputCls} bg-white`}
            >
              <option value="">-- Select Document Type --</option>
              {IDENTITY_DOC_TYPES.map((d) => (
                <option key={d.value} value={d.value}>
                  {d.label}
                </option>
              ))}
            </select>
          </Field>

          {form.identityDocType && (
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label={`${identityDocLabel} Number`} required>
                <input
                  value={form.identityDocNumber || ""}
                  onChange={(e) => updateForm({ identityDocNumber: e.target.value })}
                  placeholder={form.identityDocType === "aadhaar" ? "XXXX-XXXX-XXXX" : `Enter ${identityDocLabel} number`}
                  className={inputCls}
                />
              </Field>
              <FileUploadField
                label={`Upload ${identityDocLabel} *`}
                hint="JPEG, PNG or PDF — max 2MB"
                value={files.identityFile?.name}
                error={fieldErrors.identityFile}
                onChange={(e) => handleUpload("identityFile", e.target.files?.[0])}
              />
            </div>
          )}
        </AccordionSection>

        {/* Company Documents */}
        <AccordionSection
          title="Company Documents"
          isOpen={openSection === "companyDocuments"}
          onToggle={() => toggleSection("companyDocuments")}
          done={companyDocsDone}
        >
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Number of Directors" required>
              <input
                type="number"
                min={2}
                value={form.numberOfDirectors || ""}
                onChange={(e) => updateForm({ numberOfDirectors: e.target.value })}
                placeholder="Total number of directors"
                className={inputCls}
              />
            </Field>
            <FileUploadField
              label="Directors List (ZIP) *"
              hint="ZIP files only"
              accept=".zip"
              value={files.directorsZip?.name}
              error={fieldErrors.directorsZip}
              onChange={(e) => handleUpload("directorsZip", e.target.files?.[0], { maxSizeMB: 5 })}
            />
          </div>
          <FileUploadField
            label="Certificate of Incorporation — (CIN from MCA, MOA & AOA) *"
            hint="JPEG, PNG or PDF — max 4MB"
            value={files.incorporationFile?.name}
            error={fieldErrors.incorporationFile}
            onChange={(e) => handleUpload("incorporationFile", e.target.files?.[0], { maxSizeMB: 4 })}
          />
        </AccordionSection>

        {submitError && <p className="text-rose-600 text-xs font-medium">{submitError}</p>}

        <div className="flex gap-3 pt-2">
          <Link
            to="/register/business"
            className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg border border-green-200 text-green-700 hover:bg-green-50 font-semibold text-sm transition-colors"
          >
            <ArrowLeft size={16} /> Back
          </Link>
          <button
            type="submit"
            className="flex-1 bg-green-500 hover:bg-green-600 text-white font-semibold py-2.5 rounded-lg transition-colors text-sm"
          >
            Submit for verification
          </button>
        </div>
      </form>
    </>
  );
}
