import { createContext, useContext, useState, useCallback } from "react";
import { db, genId, FIXED_ADMIN_ROLES } from "../data/mockData";
import { logAuditEvent } from "../data/auditLog";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSessionState] = useState(() => db.getSession());

  const login = useCallback((email, password) => {
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

      // Fixed platform-level admin accounts (Sir's Super Admin account, the
      // built-in Admin account, and any extra Admin-tier account created from
      // Manage Admins) carry their own adminRole field directly. The
      // FIXED_ADMIN_ROLES map is only a fallback for a record that predates
      // that field. A user row that's neither of those two emails but somehow
      // has role "admin" would fall through with adminRole undefined, which
      // canAccessAdmin treats as "no access" (fail closed).
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

    // Not a registered owner/Sir account — check ThiruPay's internal admin staff
    const staff = db.getAdminStaffByEmail(email);
    if (!staff) {
      logAuditEvent({ actor: email, action: "Failed login attempt", details: "No account found" });
      return { ok: false, error: "No account found. Please check your email." };
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

  // `kyc` is optional: the 3-stage registration wizard passes the KYC record so the
  // account, merchant profile and KYC submission are created together (all "pending").
  const registerMerchant = useCallback((form, kyc) => {
    if (db.isEmailTaken(form.email)) return { ok: false, error: "This email is already registered." };
    if (!form.phoneVerified) return { ok: false, error: "Please verify your mobile number with OTP before continuing." };

    const userId = genId("u");
    const merchantId = genId("m");
    let userAdded = false;
    let merchantAdded = false;

    try {
      db.addUser({ id: userId, name: form.ownerName, email: form.email, phone: form.phone, role: "merchant", password: form.password });
      userAdded = true;

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
      merchantAdded = true;

      if (kyc) {
        db.addKyc({ ...kyc, merchant_id: merchantId, verification_status: "pending" });
      }
    } catch (err) {
      // Roll back anything partially created so the email isn't stuck as "already registered"
      if (merchantAdded) db.removeMerchant(merchantId);
      if (userAdded) db.removeUser(userId);
      if (err.message === "STORAGE_QUOTA_EXCEEDED") {
        return { ok: false, error: "Storage is full — try smaller files (or a smaller business photo) and submit again." };
      }
      return { ok: false, error: "Registration could not be saved, please try again." };
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
