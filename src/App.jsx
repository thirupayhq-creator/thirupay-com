import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { LanguageProvider } from "./context/LanguageContext";
import { ToastProvider } from "./context/ToastContext";
import ProtectedRoute from "./routes/ProtectedRoute";

import Landing from "./pages/Landing";
import Product from "./pages/Product";
import About from "./pages/About";
import Contact from "./pages/Contact";
import DownloadApp from "./pages/DownloadApp";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import PayLink from "./pages/PayLink";

import MerchantLayout from "./components/MerchantLayout";
import Dashboard from "./pages/merchant/Dashboard";
import KYCUpload from "./pages/merchant/KYCUpload";
import QRGenerate from "./pages/merchant/QRGenerate";
import PaymentLinks from "./pages/merchant/PaymentLinks";
import Transactions from "./pages/merchant/Transactions";
import Insights from "./pages/merchant/Insights";
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

export default function App() {
  return (
    <AuthProvider>
      <LanguageProvider>
      <ToastProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/product" element={<Product />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/download" element={<DownloadApp />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          {/* Public — no login needed, this is what a customer opens to pay */}
          <Route path="/pay/:linkId" element={<PayLink />} />

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
            <Route path="settlements" element={<SettlementManagement />} />
            <Route path="service-requests" element={<ServiceRequests />} />
            <Route path="support-tickets" element={<SupportTickets />} />
            <Route path="staff" element={<AdminStaffManagement />} />
            <Route path="my-attendance" element={<MyAttendance />} />
          </Route>

          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
      </ToastProvider>
      </LanguageProvider>
    </AuthProvider>
  );
}
