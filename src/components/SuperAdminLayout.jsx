import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { LayoutGrid, Users, ShieldCheck, Receipt, Wallet, LogOut, Sparkles, LifeBuoy, Megaphone, Percent, UserCog, KeyRound, FileStack, Settings, Clock3, ScrollText, ShieldAlert, UsersRound } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useAdminNotifications } from "../hooks/useAdminNotifications";
import NotificationBell from "./NotificationBell";
import MerchantQuickSearch from "./MerchantQuickSearch";

// Super Admin Portal — full platform control. Separate route tree, layout and
// nav from the Admin/Staff Portal, but reuses the same underlying pages,
// notifications hook and search component (see useAdminNotifications /
// MerchantQuickSearch). Access is gated in App.jsx via
// <ProtectedRoute requireSuperAdmin>.
const OPERATIONS_NAV = [
  { to: "/superadmin", label: "Dashboard", icon: LayoutGrid, end: true },
  { to: "/superadmin/merchants", label: "Merchants", icon: Users },
  { to: "/superadmin/kyc", label: "KYC Verification", icon: ShieldCheck },
  { to: "/superadmin/risk-monitoring", label: "Risk Monitoring", icon: ShieldAlert },
  { to: "/superadmin/transactions", label: "Transactions", icon: Receipt },
  { to: "/superadmin/settlements", label: "Settlements", icon: Wallet },
  { to: "/superadmin/commission", label: "Commission Dashboard", icon: Percent },
  { to: "/superadmin/service-requests", label: "Service Requests", icon: Sparkles },
  { to: "/superadmin/support-tickets", label: "Support Tickets", icon: LifeBuoy },
  { to: "/superadmin/banners", label: "Promo Banners", icon: Megaphone },
];

const PLATFORM_NAV = [
  { to: "/superadmin/manage-admins", label: "Manage Admins", icon: UsersRound },
  { to: "/superadmin/staff", label: "Staff Management", icon: UserCog },
  { to: "/superadmin/roles-permissions", label: "Roles & Permissions", icon: KeyRound },
  { to: "/superadmin/announcements", label: "Announcements", icon: Megaphone },
  { to: "/superadmin/company-documents", label: "Company Documents", icon: FileStack },
  { to: "/superadmin/system-settings", label: "System Settings", icon: Settings },
  { to: "/superadmin/security-center", label: "Security Center", icon: ShieldAlert },
  { to: "/superadmin/audit-log", label: "Audit Log", icon: ScrollText },
];

const SELF_NAV = { to: "/superadmin/my-attendance", label: "My Attendance", icon: Clock3 };

function NavItem({ to, label, icon: Icon, end }) {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
          isActive ? "bg-amber-500 text-[#05070D] shadow-glow" : "text-slate-300 hover:bg-white/10"
        }`
      }
    >
      <Icon size={18} />
      {label}
    </NavLink>
  );
}

export default function SuperAdminLayout() {
  const { session, logout } = useAuth();
  const navigate = useNavigate();
  const notifications = useAdminNotifications("/superadmin");

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="h-screen flex overflow-hidden bg-[#F6F7FB]">
      <aside className="w-64 bg-[#0B1220] text-white flex flex-col shrink-0">
        <div className="px-6 py-6 border-b border-white/10">
          <div className="flex items-center gap-2">
            <img src="/brand/logo-icon-white.png" alt="" className="h-7 w-auto" />
            <p className="font-display font-extrabold text-xl tracking-tight">
              Thiru<span className="text-amber-400">Pay</span>
            </p>
          </div>
          <p className="text-amber-400 text-xs mt-0.5 font-semibold tracking-wide">Super Admin Portal</p>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {OPERATIONS_NAV.map((item) => (
            <NavItem key={item.to} {...item} />
          ))}

          <p className="px-3 pt-4 pb-1 text-[10px] font-semibold uppercase tracking-wider text-slate-500">Platform</p>
          {PLATFORM_NAV.map((item) => (
            <NavItem key={item.to} {...item} />
          ))}

          {session?.adminStaffId && (
            <>
              <div className="h-px bg-white/10 my-2" />
              <NavItem {...SELF_NAV} />
            </>
          )}
        </nav>

        <div className="px-3 py-4 border-t border-white/10">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-300 hover:bg-white/10 w-full transition-colors"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-white border-b border-amber-100 flex items-center gap-4 px-8 shrink-0 relative">
          <MerchantQuickSearch basePath="/superadmin" theme="amber" />

          <NotificationBell userId={session?.userId} items={notifications} />

          <div className="ml-auto text-right">
            <p className="text-sm font-semibold text-slate-800">{session?.name}</p>
            <span className="text-[11px] font-semibold text-amber-500">Super Admin</span>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
