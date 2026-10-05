import { useState } from "react";
import { ShieldCheck, UserPlus, MoreVertical, X } from "lucide-react";
import { db } from "../../data/mockData";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import { logAuditEvent } from "../../data/auditLog";

const EMPTY_FORM = { name: "", email: "", password: "" };

export default function ManageAdmins() {
  const { session } = useAuth();
  const { showToast } = useToast();
  const [admins, setAdmins] = useState(db.getAdminUsers());
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [openMenuFor, setOpenMenuFor] = useState(null);

  const activeCount = admins.filter((a) => a.status !== "deactivated").length;

  const handleAdd = (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.password.trim()) {
      showToast({ title: "Fill in all fields", type: "error" });
      return;
    }
    if (db.isEmailTaken(form.email)) {
      showToast({ title: "That email is already in use", type: "error" });
      return;
    }
    const created = db.addAdminUser(form);
    setAdmins(db.getAdminUsers());
    setForm(EMPTY_FORM);
    setShowForm(false);
    logAuditEvent({ actor: session?.name || "Super Admin", action: "Added Admin account", details: created.email });
    showToast({ title: "Admin account created", subtitle: created.email, type: "success" });
  };

  const toggleStatus = (admin) => {
    const nextStatus = admin.status === "deactivated" ? "active" : "deactivated";
    db.setAdminUserStatus(admin.id, nextStatus);
    setAdmins(db.getAdminUsers());
    setOpenMenuFor(null);
    logAuditEvent({ actor: session?.name || "Super Admin", action: `${nextStatus === "deactivated" ? "Deactivated" : "Reactivated"} Admin account`, details: admin.email });
    showToast({ title: `${admin.name} ${nextStatus === "deactivated" ? "deactivated" : "reactivated"}`, type: "success" });
  };

  return (
    <div className="max-w-2xl">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center shrink-0">
          <ShieldCheck size={20} />
        </div>
        <div>
          <h1 className="font-display font-bold text-xl text-slate-800">Manage Admins</h1>
          <p className="text-sm text-slate-400">Platform-level admin accounts — separate from Staff Management.</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-card p-5 mb-4 flex items-center justify-between">
        <div>
          <p className="font-semibold text-slate-800">{admins.length} admin{admins.length !== 1 ? "s" : ""}</p>
          <p className="text-xs text-slate-400">{activeCount} active · {admins.length - activeCount} deactivated</p>
        </div>
      </div>

      <button
        onClick={() => setShowForm((s) => !s)}
        className="w-full flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-600 text-[#05070D] font-semibold py-3 rounded-xl mb-4"
      >
        {showForm ? <X size={16} /> : <UserPlus size={16} />}
        {showForm ? "Cancel" : "Add Admin"}
      </button>

      {showForm && (
        <form onSubmit={handleAdd} className="bg-white rounded-2xl shadow-card p-5 mb-4 space-y-3">
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1.5">Name</label>
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm outline-none focus:border-amber-500" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1.5">Email</label>
            <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm outline-none focus:border-amber-500" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1.5">Password</label>
            <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm outline-none focus:border-amber-500" />
          </div>
          <p className="text-[11px] text-slate-400">New accounts are always "Admin" tier — Super Admin stays a single, fixed identity.</p>
          <button type="submit" className="w-full bg-[#0B1220] hover:bg-black text-white font-semibold py-2.5 rounded-lg text-sm">
            Create Admin Account
          </button>
        </form>
      )}

      <div className="space-y-3">
        {admins.map((a) => {
          const isYou = a.id === session?.userId;
          const isSuper = a.adminRole === "Super Admin";
          const deactivated = a.status === "deactivated";
          return (
            <div key={a.id} className="bg-white rounded-2xl shadow-card p-5 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-rose-700 text-white flex items-center justify-center font-bold text-sm shrink-0">
                {a.name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-slate-800 text-sm truncate">{a.name}</p>
                <p className="text-xs text-slate-400 truncate">{a.email}</p>
                <div className="flex items-center gap-1.5 mt-1.5">
                  <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${isSuper ? "bg-amber-50 text-amber-700" : deactivated ? "bg-slate-100 text-slate-500" : "bg-emerald-50 text-emerald-700"}`}>
                    {isSuper ? "Super Admin" : deactivated ? "Deactivated" : "Active"}
                  </span>
                  {isYou && <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-500">You</span>}
                </div>
              </div>
              {!isSuper && !isYou && (
                <div className="relative">
                  <button onClick={() => setOpenMenuFor(openMenuFor === a.id ? null : a.id)} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg">
                    <MoreVertical size={16} />
                  </button>
                  {openMenuFor === a.id && (
                    <div className="absolute right-0 top-full mt-1 bg-white border border-slate-100 rounded-lg shadow-card overflow-hidden z-10 w-40">
                      <button onClick={() => toggleStatus(a)} className="w-full text-left px-3 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-50">
                        {deactivated ? "Reactivate" : "Deactivate"}
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
