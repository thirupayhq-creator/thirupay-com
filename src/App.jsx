import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { LanguageProvider } from "./context/LanguageContext";
import { RegistrationProvider } from "./context/RegistrationContext";
import { ToastProvider } from "./context/ToastContext";
import ProtectedRoute from "./routes/ProtectedRoute";

import Landing from "./pages/Landing";
import Product from "./pages/Product";
import ProductDetail from "./pages/ProductDetail";
import About from "./pages/About";
import InvestmentPartnership from "./pages/InvestmentPartnership";
import Contact from "./pages/Contact";
import DownloadApp from "./pages/DownloadApp";
import Login from "./pages/auth/Login";
import RegisterLayout from "./components/register/RegisterLayout";
import RegisterAccount from "./pages/register/RegisterAccount";
import RegisterBusiness from "./pages/register/RegisterBusiness";
import RegisterKYC from "./pages/register/RegisterKYC";
import AdminLogin from "./pages/auth/AdminLogin";
import PayLink from "./pages/PayLink";
import TermsAndConditions from "./components/site/TermsAndConditions";

import MerchantLayout from "./components/MerchantLayout";
import Dashboard from "./pages/merchant/Dashboard";
import KYCUpload from "./pages/merchant/KYCUpload";
import QRGenerate from "./pages/merchant/QRGenerate";
import PaymentLinks from "./pages/merchant/PaymentLinks";
import PayMerchant from "./pages/PayMerchant";
import Transactions from "./pages/merchant/Transactions";
import Insights from "./pages/merchant/Insights";
import Rewards from "./pages/merchant/Rewards";
import Products from "./pages/merchant/Products";
import Billing from "./pages/merchant/Billing";
import Khata from "./pages/merchant/Khata";
import Expenses from "./pages/merchant/Expenses";
import Soundbox from "./pages/merchant/Soundbox";
import Settlements from "./pages/merchant/Settlements";
import Services from "./pages/merchant/Services";
import Help from "./pages/merchant/Help";
import Profile from "./pages/merchant/Profile";

import AdminLayout from "./components/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import MerchantManagement from "./pages/admin/MerchantManagement";
import KYCVerification from "./pages/admin/KYCVerification";
import TransactionMonitor from "./pages/admin/TransactionMonitor";
import SettlementManagement from "./pages/admin/SettlementManagement";
import ServiceRequests from "./pages/admin/ServiceRequests";
import SupportTickets from "./pages/admin/SupportTickets";
import AdminStaffManagement from "./pages/admin/AdminStaffManagement";
import MyAttendance from "./pages/admin/MyAttendance";

import AdminBanners from "./pages/admin/AdminBanners";
import AdminCommission from "./pages/admin/AdminCommission";

export default function App() {
  // Test frontend → backend connection
  const testBackend = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/test");

      const data = await response.json();

      console.log("Backend response:", data);

      alert(data.message);
    } catch (error) {
      console.error("Backend connection failed:", error);
      alert("Backend connection failed");
    }
  };

  return (
    <AuthProvider>
      <LanguageProvider>
        <ToastProvider>
          <RegistrationProvider>
          <BrowserRouter>

            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/product" element={<Product />} />
              <Route path="/product/:slug" element={<ProductDetail />} />
              <Route path="/about" element={<About />} />
              <Route
                path="/investment-partnership"
                element={<InvestmentPartnership />}
              />
              <Route path="/contact" element={<Contact />} />
              <Route path="/download" element={<DownloadApp />} />
              <Route
                path="/terms-and-conditions"
                element={<TermsAndConditions />}
              />
              <Route path="/login" element={<Login />} />
              {/* 3-stage merchant registration wizard. /register itself redirects to stage 1,
                  so every existing "Get started" link keeps working. */}
              <Route path="/register" element={<RegisterLayout />}>
                <Route index element={<Navigate to="account" replace />} />
                <Route path="account" element={<RegisterAccount />} />
                <Route path="business" element={<RegisterBusiness />} />
                <Route path="kyc" element={<RegisterKYC />} />
              </Route>
              <Route path="/admin/login" element={<AdminLogin />} />

              <Route path="/pay/:linkId" element={<PayLink />} />
              <Route path="/pay" element={<PayMerchant />} />   

              <Route
                path="/merchant"
                element={
                  <ProtectedRoute role="merchant">
                    <MerchantLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<Dashboard />} />
                <Route path="kyc" element={<KYCUpload />} />
                <Route path="qr" element={<QRGenerate />} />
                <Route path="links" element={<PaymentLinks />} />
                <Route path="transactions" element={<Transactions />} />
                <Route path="insights" element={<Insights />} />
                <Route path="rewards" element={<Rewards />} />
                <Route path="products" element={<Products />} />
                <Route path="billing" element={<Billing />} />
                <Route path="khata/:customerId?" element={<Khata />} />
                <Route path="expenses" element={<Expenses />} />
                <Route path="soundbox" element={<Soundbox />} />
                <Route path="settlements" element={<Settlements />} />
                <Route path="services" element={<Services />} />
                <Route path="help" element={<Help />} />
                <Route path="profile" element={<Profile />} />
              </Route>

              <Route
                path="/admin"
                element={
                  <ProtectedRoute role="admin">
                    <AdminLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<AdminDashboard />} />
                <Route path="merchants" element={<MerchantManagement />} />
                <Route path="kyc" element={<KYCVerification />} />
                <Route path="transactions" element={<TransactionMonitor />} />
                <Route
                  path="settlements"
                  element={<SettlementManagement />}
                />
                <Route
                  path="commission"
                  element={<AdminCommission />}
                />
                <Route
                  path="service-requests"
                  element={<ServiceRequests />}
                />
                <Route
                  path="support-tickets"
                  element={<SupportTickets />}
                />
                <Route path="banners" element={<AdminBanners />} />
                <Route path="staff" element={<AdminStaffManagement />} />
                <Route
                  path="my-attendance"
                  element={<MyAttendance />}
                />
              </Route>

              <Route
                path="*"
                element={<Navigate to="/login" replace />}
              />
            </Routes>

          </BrowserRouter>
          </RegistrationProvider>
        </ToastProvider>
      </LanguageProvider>
    </AuthProvider>
  );
}
