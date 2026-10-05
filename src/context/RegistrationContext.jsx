import { createContext, useContext, useState, useEffect, useCallback, useMemo, useRef } from "react";
import { BUSINESS_CATEGORIES, ENTITY_TYPES, isAccountStepValid, isBusinessStepValid } from "../data/registrationConfig";

// Holds the in-progress merchant registration across the 3 wizard pages.
//
// - Text fields are saved to sessionStorage so a refresh doesn't wipe the form
//   (sessionStorage clears when the tab closes).
// - Passwords, bank account numbers and ID document numbers are NEVER written to the draft — after a
//   refresh the merchant just re-enters them.
// - Uploaded files (business photo, KYC documents) live in memory only. They can
//   be several MB and would blow the sessionStorage quota.
const DRAFT_KEY = "tp_registration_draft";
const NEVER_PERSIST = ["password", "confirmPassword", "accountNumber", "confirmAccountNumber", "identityDocNumber"];

const initialForm = { businessCategory: BUSINESS_CATEGORIES[0], entityType: ENTITY_TYPES[0] };

function loadDraft() {
  try {
    const raw = sessionStorage.getItem(DRAFT_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

const RegistrationContext = createContext(null);

export function RegistrationProvider({ children }) {
  const [form, setForm] = useState(() => ({ ...initialForm, ...loadDraft() }));
  // { businessPhoto: dataUrl, panFile: {name, data}, identityFile, directorsZip, incorporationFile }
  const [files, setFiles] = useState({});

  useEffect(() => {
    try {
      const safe = { ...form };
      NEVER_PERSIST.forEach((k) => delete safe[k]);
      sessionStorage.setItem(DRAFT_KEY, JSON.stringify(safe));
    } catch {
      // Storage unavailable/full — the wizard still works, it just won't survive a refresh.
    }
  }, [form]);

  const updateForm = useCallback((patch) => setForm((f) => ({ ...f, ...patch })), []);
  const setFile = useCallback((key, value) => setFiles((f) => ({ ...f, [key]: value })), []);

  const resetRegistration = useCallback(() => {
    setForm({ ...initialForm });
    setFiles({});
    try {
      sessionStorage.removeItem(DRAFT_KEY);
    } catch {
      // ignore
    }
  }, []);

  // After a successful submit we must NOT clear the draft immediately: the wizard is still
  // on screen for a moment (route changes are deferred) and the step guard would bounce the
  // merchant back to stage 1. So the last page only flags completion, and the wizard layout
  // clears the draft when it unmounts.
  const completedRef = useRef(false);
  const markRegistrationComplete = useCallback(() => {
    completedRef.current = true;
  }, []);
  const clearIfCompleted = useCallback(() => {
    if (!completedRef.current) return;
    completedRef.current = false;
    resetRegistration();
  }, [resetRegistration]);

  const value = useMemo(
    () => ({
      form,
      files,
      updateForm,
      setFile,
      resetRegistration,
      markRegistrationComplete,
      clearIfCompleted,
      accountDone: isAccountStepValid(form),
      businessDone: isBusinessStepValid(form),
    }),
    [form, files, updateForm, setFile, resetRegistration, markRegistrationComplete, clearIfCompleted]
  );

  return <RegistrationContext.Provider value={value}>{children}</RegistrationContext.Provider>;
}

export function useRegistration() {
  const ctx = useContext(RegistrationContext);
  if (!ctx) throw new Error("useRegistration must be used inside <RegistrationProvider>");
  return ctx;
}
