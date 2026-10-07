// ============================================================
// TIRU PAY - Frontend API Service Client
// Connects thirupay-com frontend to Express/Node.js backend API
// ============================================================

export const API_BASE =
  import.meta.env?.VITE_API_BASE_URL || "/api/v1";

/**
 * Token storage helpers
 */
export const getToken = () => localStorage.getItem("thirupay_token") || "";
export const setToken = (token) => {
  if (token) {
    localStorage.setItem("thirupay_token", token);
  } else {
    localStorage.removeItem("thirupay_token");
  }
};
export const removeToken = () => localStorage.removeItem("thirupay_token");

/**
 * Base fetch wrapper with auth header & error handling
 */
export async function apiRequest(endpoint, { method = "GET", body, headers = {}, token } = {}) {
  const authToken = token || getToken();
  const reqHeaders = {
    "Content-Type": "application/json",
    ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
    ...headers,
  };

  const url = endpoint.startsWith("http")
    ? endpoint
    : `${API_BASE}${endpoint.startsWith("/") ? "" : "/"}${endpoint}`;

  const config = {
    method,
    headers: reqHeaders,
  };

  if (body !== undefined && method !== "GET") {
    config.body = typeof body === "string" ? body : JSON.stringify(body);
  }

  let response;
  try {
    response = await fetch(url, config);
  } catch (netErr) {
    throw new Error(
      `Network connection failed. Is the backend server running on port 5000? (${netErr.message})`
    );
  }

  let data;
  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok) {
    const errorMsg =
      data?.message ||
      data?.errors?.[0]?.message ||
      data?.error ||
      `Request failed with status ${response.status}`;
    const err = new Error(errorMsg);
    err.status = response.status;
    err.data = data;
    throw err;
  }

  return data;
}

// ------------------------------------------------------------
// AUTHENTICATION & REGISTRATION API
// ------------------------------------------------------------
export const authApi = {
  async register(registrationData, kycData) {
    const payload = {
      ...registrationData,
      ...(kycData ? { kyc: kycData } : {}),
    };
    const res = await apiRequest("/auth/register-merchant", {
      method: "POST",
      body: payload,
    });
    if (res?.data?.token) {
      setToken(res.data.token);
    }
    return res;
  },

  async login(email, password) {
    const res = await apiRequest("/auth/login", {
      method: "POST",
      body: { email, password },
    });
    if (res?.data?.token) {
      setToken(res.data.token);
    }
    return res;
  },

  async getMe() {
    return apiRequest("/auth/me");
  },

  logout() {
    removeToken();
  },
};

// ------------------------------------------------------------
// MERCHANT API
// ------------------------------------------------------------
export const merchantApi = {
  async onboard(merchantData) {
    return apiRequest("/merchants/onboard", {
      method: "POST",
      body: merchantData,
    });
  },

  async getProfile() {
    return apiRequest("/merchants/me");
  },

  async list(page = 1, limit = 20) {
    return apiRequest(`/merchants?page=${page}&limit=${limit}`);
  },

  async updateStatus(id, status) {
    return apiRequest(`/merchants/${id}/status`, {
      method: "PATCH",
      body: { status },
    });
  },

  async getCashfreeOnboardingLink() {
    return apiRequest("/merchants/cashfree-onboarding-link");
  },

  async syncCashfreeStatus() {
    return apiRequest("/merchants/cashfree-sync", {
      method: "POST",
    });
  },
};

// ------------------------------------------------------------
// KYC VERIFICATION API
// ------------------------------------------------------------
export const kycApi = {
  async submit(kycData) {
    return apiRequest("/kyc/submit", {
      method: "POST",
      body: kycData,
    });
  },

  async getStatus() {
    return apiRequest("/kyc/status");
  },

  async getPending(page = 1, limit = 50) {
    return apiRequest(`/kyc/pending?page=${page}&limit=${limit}`);
  },

  async getById(id) {
    return apiRequest(`/kyc/${id}`);
  },

  async verify(kycId, decision, rejectionReason) {
    return apiRequest("/kyc/verify", {
      method: "POST",
      body: {
        kycId,
        decision, // "APPROVE" or "REJECT"
        ...(rejectionReason ? { rejectionReason } : {}),
      },
    });
  },
};

// ------------------------------------------------------------
// PAYMENTS API
// ------------------------------------------------------------
export const paymentApi = {
  async createPayment(paymentData) {
    return apiRequest("/payments", {
      method: "POST",
      body: paymentData,
    });
  },

  async listPayments(page = 1, limit = 20) {
    return apiRequest(`/payments?page=${page}&limit=${limit}`);
  },

  async getPayment(id) {
    return apiRequest(`/payments/${id}`);
  },

  async verifyPayment(id) {
    return apiRequest(`/payments/${id}/verify`, {
      method: "POST",
    });
  },
};
