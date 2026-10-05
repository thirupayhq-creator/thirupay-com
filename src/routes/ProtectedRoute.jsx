import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// requireSuperAdmin: only an account with adminRole "Super Admin" (Sir's fixed
// account, via FIXED_ADMIN_ROLES) may pass.
// excludeSuperAdmin: Super Admin accounts are redirected to their own portal
// instead of the Admin/Staff one, keeping the two portals logically separate.
export default function ProtectedRoute({ role, requireSuperAdmin, excludeSuperAdmin, children }) {
  const { session } = useAuth();

  if (!session) return <Navigate to="/login" replace />;
  if (role && session.role !== role) {
    return <Navigate to={session.role === "admin" ? "/admin" : "/merchant"} replace />;
  }

  const isSuperAdmin = session.role === "admin" && session.adminRole === "Super Admin";
  if (requireSuperAdmin && !isSuperAdmin) return <Navigate to="/admin" replace />;
  if (excludeSuperAdmin && isSuperAdmin) return <Navigate to="/superadmin" replace />;

  return children;
}
