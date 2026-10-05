import { NavLink, Outlet, useNavigate, useLocation } from "react-router-dom";
import { LayoutGrid, Users, ShieldCheck, Receipt, Wallet, LogOut, Sparkles, LifeBuoy, ShieldAlert, Clock3, Megaphone, Percent } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { canAccessAdmin } from "../data/adminRoles";
import { useAdminNotifications } from "../hooks/useAdminNotifications";
import NotificationBell from "./NotificationBell";
import MerchantQuickSearch from "./MerchantQuickSearch";

// Admin/Staff Portal — Admin, Manager, Support Executive, Sales Executive,
// Verification Officer. Staff Management lives exclusively in the Super
// Admin Portal now (granting admin access is a platform-level decision).
const NAV = [
  { to: "/admin", label: "Dashboard", navKey: "dashboard", icon: LayoutGrid, end: true },
  { to: "/admin/merchants", label: "Merchants", navKey: "merchants", icon: Users },
  { to: "/admin/kyc", label: "KYC Verification", navKey: "kyc", icon: ShieldCheck },
  { to: "/admin/transactions", label: "Transactions", navKey: "transactions", icon: Receipt },
  { to: "/admin/settlements", label: "Settlements", navKey: "settlements", icon: Wallet },
  { to: "/admin/commission", label: "Commission Dashboard", navKey: "commission", icon: Percent },
  { to: "/admin/service-requests", label: "Service Requests", navKey: "service-requests", icon: Sparkles },
  { to: "/admin/support-tickets", label: "Support Tickets", navKey: "support-tickets", icon: LifeBuoy },
  { to: "/admin/banners", label: "Promo Banners", navKey: "banners", icon: Megaphone },
];

// Personal utility route — always accessible to any logged-in staff account,
// not gated by the role permission matrix (it's "my own" data, not a module).
const SELF_NAV = { to: "/admin/my-attendance", label: "My Attendance", icon: Clock3 };

export default function AdminLayout() {
  const { session, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const notifications = useAdminNotifications("/admin");

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="h-screen flex overflow-hidden bg-[#F6F7FB]">
      <aside className="w-64 bg-green-700 text-white flex flex-col shrink-0">
        <div className="px-6 py-6 border-b border-white/10">
          <div className="flex items-center gap-2">
            <img src="/brand/logo-icon-white.png" alt="" className="h-7 w-auto" />
            <p className="font-display font-extrabold text-xl tracking-tight">
              Thiru<span className="text-orange-400">Pay</span>
            </p>
          </div>
          <p className="text-green-200 text-xs mt-0.5">Admin / Staff Portal</p>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {NAV.filter((n) => canAccessAdmin(session?.adminRole, n.navKey)).map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive ? "bg-green-500 text-white shadow-glow" : "text-green-100 hover:bg-white/10"
                }`
              }
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
          {session?.adminStaffId && (
            <>
              <div className="h-px bg-white/10 my-2" />
              <NavLink
                to={SELF_NAV.to}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive ? "bg-green-500 text-white shadow-glow" : "text-green-100 hover:bg-white/10"
                  }`
                }
              >
                <Clock3 size={18} />
                {SELF_NAV.label}
              </NavLink>
            </>
          )}
        </nav>

        <div className="px-3 py-4 border-t border-white/10">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-green-100 hover:bg-white/10 w-full transition-colors"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-white border-b border-green-100 flex items-center gap-4 px-8 shrink-0 relative">
          <MerchantQuickSearch basePath="/admin" theme="green" />

          <NotificationBell userId={session?.userId} items={notifications} />

          <div className="ml-auto text-right">
            <p className="text-sm font-semibold text-green-700">{session?.name}</p>
            <span className="text-[11px] font-semibold text-green-400">{session?.adminRole}</span>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-8">
          {(() => {
            const matched = [...NAV].sort((a, b) => b.to.length - a.to.length).find((n) => location.pathname.startsWith(n.to));
            if (matched && !canAccessAdmin(session?.adminRole, matched.navKey)) {
              return (
                <div className="max-w-md mx-auto mt-16 text-center">
                  <ShieldAlert size={36} className="text-green-200 mx-auto mb-4" />
                  <p className="font-semibold text-green-700 mb-1">Access restricted</p>
                  <p className="text-sm text-green-400">Your {session?.adminRole || "staff"} role doesn't have access to this section.</p>
                </div>
              );
            }
            return <Outlet />;
          })()}
        </main>
      </div>
    </div>
  );
}
