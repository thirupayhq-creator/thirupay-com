import { createContext, useContext, useState, useCallback } from "react";
import { db, genId, FIXED_ADMIN_ROLES } from "../data/mockData";
import { logAuditEvent } from "../data/auditLog";
import { authApi } from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSessionState] = useState(() => db.getSession());

  const login = useCallback(async (email, password) => {
    let lastBackendError = null;
    // 1. Try real backend API first
    try {
      const res = await authApi.login(email, password);
      if (res?.success && res.data) {
        const u = res.data.user;
        const m = res.data.merchant;
        const role = u.role?.toLowerCase() === "admin" ? "admin" : "merchant";
        const newSession = {
          userId: u.id,
          role,
          name: u.name,
          email: u.email,
          merchantId: m?.id || null,
          adminRole: role === "admin" ? "Admin" : null,
          adminStaffId: null,
          token: res.data.token,
        };
        if (m) {
          const existingM = db.getMerchantById(m.id);
          if (!existingM) {
            db.addMerchant({
              merchant_id: m.id,
              user_id: u.id,
              business_name: m.businessName || `${u.name}'s Business`,
              owner_name: u.name,
              email: u.email,
              phone: m.phone || "",
              status: m.status?.toLowerCase() || "pending",
              registered_at: new Date().toISOString(),
              created_at: new Date().toISOString(),
            });
          }
        }

        db.setSession(newSession);
        setSessionState(newSession);
        logAuditEvent({
          actor: newSession.name,
          action: "Logged in (Backend API)",
          details: role,
        });
        return { ok: true, session: newSession };
      }
    } catch (apiErr) {
      console.warn("Backend login failed, checking fallback:", apiErr.message);
      lastBackendError = apiErr.message;
    }

    // 2. Fallback to mock accounts (for built-in staff / local demo accounts)
    const user = db.findUserByEmail(email);
    if (user) {
      if (user.password !== password) {
        logAuditEvent({ actor: email, action: "Failed login attempt", details: "Incorrect password" });
        return { ok: false, error: "Incorrect password." };
      }

      let merchant = null;
      if (user.role === "merchant") {
        merchant = db.getMerchantByUserId(user.id);
      }

      const adminRole = user.role === "admin" ? user.adminRole || FIXED_ADMIN_ROLES[user.email.toLowerCase()] || null : null;

      if (user.role === "admin" && user.status === "deactivated") {
        logAuditEvent({ actor: email, action: "Failed login attempt", details: "Account deactivated" });
        return { ok: false, error: "This admin account has been deactivated." };
      }

      const newSession = { userId: user.id, role: user.role, name: user.name, merchantId: merchant?.merchant_id || null, adminRole, adminStaffId: null };
      db.setSession(newSession);
      setSessionState(newSession);
      logAuditEvent({ actor: newSession.name, action: "Logged in", details: user.role === "admin" ? adminRole || "Admin" : "Merchant" });
      return { ok: true, session: newSession };
    }

    // Check ThiruPay's internal admin staff in mock data
    const staff = db.getAdminStaffByEmail(email);
    if (!staff) {
      logAuditEvent({ actor: email, action: "Failed login attempt", details: "No account found" });
      return { ok: false, error: lastBackendError || "No account found. Please check your email." };
    }
    if (staff.password !== password) {
      logAuditEvent({ actor: email, action: "Failed login attempt", details: "Incorrect password" });
      return { ok: false, error: "Incorrect password." };
    }
    if (staff.status !== "active") {
      logAuditEvent({ actor: email, action: "Failed login attempt", details: "Staff account deactivated" });
      return { ok: false, error: "This staff account has been deactivated. Contact your admin." };
    }

    const newSession = {
      userId: staff.staff_id,
      role: "admin",
      name: staff.name,
      merchantId: null,
      adminRole: staff.role,
      adminStaffId: staff.staff_id,
    };
    db.setSession(newSession);
    setSessionState(newSession);
    logAuditEvent({ actor: newSession.name, action: "Logged in", details: `${staff.role} (staff)` });
    return { ok: true, session: newSession };
  }, []);

  // `kyc` is optional: passes KYC record so account, merchant profile and KYC submission
  // are created together on the backend.
  const registerMerchant = useCallback(async (form, kyc) => {
    if (!form.phoneVerified) {
      return { ok: false, error: "Please verify your mobile number with OTP before continuing." };
    }

    // 1. Try real Backend API
    try {
      const res = await authApi.register(
        {
          name: form.ownerName,
          ownerName: form.ownerName,
          email: form.email,
          phone: form.phone,
          password: form.password,
          businessName: form.businessName,
          businessCategory: form.businessCategory,
          entityType: form.entityType,
          gst: form.gst,
          addressLine1: form.addressLine1,
          addressLine2: form.addressLine2,
          pincode: form.pincode,
          city: form.city,
          state: form.state,
          businessPhoto: form.businessPhoto,
          accountHolder: form.accountHolder,
          accountNumber: form.accountNumber,
          ifsc: form.ifsc,
          bankName: form.bankName,
          branch: form.branch,
        },
        kyc
      );

      if (res?.success && res.data) {
        const u = res.data.user;
        const m = res.data.merchant;
        const newSession = {
          userId: u.id,
          role: "merchant",
          name: form.ownerName,
          email: u.email,
          merchantId: m?.id,
          adminRole: null,
          adminStaffId: null,
          token: res.data.token,
        };

        // Mirror locally so other views have immediate local cache
        try {
          db.addUser({ id: u.id, name: form.ownerName, email: form.email, phone: form.phone, role: "merchant", password: form.password });
          db.addMerchant({
            merchant_id: m.id,
            user_id: u.id,
            business_name: form.businessName,
            owner_name: form.ownerName,
            email: form.email,
            phone: form.phone,
            gst: form.gst || "",
            business_category: form.businessCategory || "",
            entity_type: form.entityType || "",
            status: "pending",
            registered_at: new Date().toISOString(),
            address_line1: form.addressLine1 || "",
            address_line2: form.addressLine2 || "",
            pincode: form.pincode || "",
            city: form.city || "",
            state: form.state || "",
            business_photo: form.businessPhoto || "",
            account_holder: form.accountHolder || "",
            account_number: form.accountNumber || "",
            ifsc: form.ifsc || "",
            bank_name: form.bankName || "",
            branch: form.branch || "",
            bank_verification_status: "pending",
            created_at: new Date().toISOString(),
          });
          if (kyc) {
            db.addKyc({ ...kyc, id: res.data.kyc?.id, merchant_id: m.id, verification_status: "pending" });
          }
        } catch (e) {
          console.warn("Local storage mirror skipped:", e);
        }

        db.setSession(newSession);
        setSessionState(newSession);
        logAuditEvent({ actor: newSession.name, action: "Registered merchant (Backend API)", details: form.businessName });
        return { ok: true, session: newSession };
      }
    } catch (apiErr) {
      console.warn("Backend register error, attempting local fallback if network issue:", apiErr.message);
      // If backend returns a specific error (e.g. Email already registered), return that error
      if (apiErr.message && !apiErr.message.includes("Network connection failed")) {
        return { ok: false, error: apiErr.message };
      }
    }

    // 2. Fallback to local offline registration if backend was completely unreachable
    if (db.isEmailTaken(form.email)) return { ok: false, error: "This email is already registered." };

    const userId = genId("u");
    const merchantId = genId("m");
    try {
      db.addUser({ id: userId, name: form.ownerName, email: form.email, phone: form.phone, role: "merchant", password: form.password });
      db.addMerchant({
        merchant_id: merchantId,
        user_id: userId,
        business_name: form.businessName,
        owner_name: form.ownerName,
        email: form.email,
        phone: form.phone,
        gst: form.gst || "",
        business_category: form.businessCategory || "",
        entity_type: form.entityType || "",
        status: "pending",
        registered_at: new Date().toISOString(),
        address_line1: form.addressLine1 || "",
        address_line2: form.addressLine2 || "",
        pincode: form.pincode || "",
        city: form.city || "",
        state: form.state || "",
        business_photo: form.businessPhoto || "",
        account_holder: form.accountHolder || "",
        account_number: form.accountNumber || "",
        ifsc: form.ifsc || "",
        bank_name: form.bankName || "",
        branch: form.branch || "",
        bank_verification_status: "pending",
        created_at: new Date().toISOString(),
      });
      if (kyc) {
        db.addKyc({ ...kyc, merchant_id: merchantId, verification_status: "pending" });
      }
    } catch {
      return { ok: false, error: "Registration could not be saved." };
    }

    const newSession = { userId, role: "merchant", name: form.ownerName, merchantId, adminRole: null, adminStaffId: null };
    db.setSession(newSession);
    setSessionState(newSession);
    return { ok: true, session: newSession };
  }, []);

  const resetPassword = useCallback((email, newPassword) => {
    const user = db.findUserByEmail(email);
    if (!user) return { ok: false, error: "No account found for this email." };
    db.updateUserPassword(email, newPassword);
    return { ok: true };
  }, []);

  const logout = useCallback(() => {
    authApi.logout();
    const current = db.getSession();
    if (current) {
      logAuditEvent({ actor: current.name, action: "Logged out", details: current.role === "admin" ? current.adminRole || "Admin" : "Merchant" });
    }
    db.clearSession();
    setSessionState(null);
  }, []);

  return (
    <AuthContext.Provider value={{ session, login, registerMerchant, logout, resetPassword }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
