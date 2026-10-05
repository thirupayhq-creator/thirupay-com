import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { LogIn, ShieldCheck } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

// Full-platform-control portal. Only an account with adminRole "Super Admin"
// (Sir's fixed account, via FIXED_ADMIN_ROLES) may sign in here. Everyone else
// (Admin, Manager, Support Executive, Sales Executive, Verification Officer)
// belongs on /admin/login.
export default function SuperAdminLogin() {
  const { login, logout } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    const res = login(form.email, form.password);
    if (!res.ok) {
      setError(res.error);
      return;
    }
    if (res.session.role !== "admin") {
      logout();
      setError("You don't have permission to access the Super Admin Portal.");
      return;
    }
    const isSuperAdmin = res.session.adminRole === "Super Admin";
    if (!isSuperAdmin) {
      logout();
      setError("You don't have permission to access the Super Admin Portal.");
      return;
    }
    navigate("/superadmin");
  };

  return (
    <div className="min-h-screen bg-[#05070D] flex items-center justify-center px-4 py-10">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-block">
            <img src="/brand/logo-full.png" alt="ThiruPay" className="h-16 w-auto mx-auto brightness-0 invert" />
          </Link>
          <p className="text-amber-400 text-sm mt-1 font-semibold tracking-wide">Super Admin Portal</p>
        </div>

        <div className="bg-white rounded-2xl shadow-card p-8">
          <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-4">
            <ShieldCheck size={20} />
          </div>
          <h1 className="font-display font-bold text-xl text-slate-800 mb-1">Super Admin Login</h1>
          <p className="text-sm text-slate-400 mb-5">Full platform control. Restricted access.</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1.5">Email or username</label>
              <input
                type="text"
                autoComplete="username"
                required
                autoFocus
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="admin@thirupay.in"
                className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-100 outline-none text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1.5">Password</label>
              <input
                type="password"
                required
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="••••••••"
                className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-100 outline-none text-sm"
              />
            </div>

            {error && (
              <p className="text-rose-600 text-xs font-medium">
                {error}
                {error.includes("permission") && (
                  <>
                    {" "}
                    <Link to="/admin/login" className="underline">
                      Go to Admin Portal
                    </Link>
                  </>
                )}
              </p>
            )}

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 bg-[#0B1220] hover:bg-black text-white font-semibold py-2.5 rounded-lg transition-colors text-sm"
            >
              <LogIn size={16} /> Login to Super Admin Portal
            </button>
          </form>

          <p className="text-center text-sm text-slate-400 mt-6">
            Not Super Admin?{" "}
            <Link to="/admin/login" className="text-slate-700 font-semibold hover:underline">
              Admin / Staff login
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
