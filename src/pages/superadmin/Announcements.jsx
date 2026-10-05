import { useState } from "react";
import { Megaphone, Send, Trash2 } from "lucide-react";
import { getAnnouncements, addAnnouncement, removeAnnouncement } from "../../data/announcements";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import { logAuditEvent } from "../../data/auditLog";

export default function Announcements() {
  const { session } = useAuth();
  const { showToast } = useToast();
  const [list, setList] = useState(getAnnouncements());
  const [form, setForm] = useState({ title: "", body: "" });

  const handlePost = (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.body.trim()) {
      showToast({ title: "Title and message are required", type: "error" });
      return;
    }
    const entry = addAnnouncement({ ...form, postedBy: session?.name || "Super Admin" });
    setList(getAnnouncements());
    setForm({ title: "", body: "" });
    logAuditEvent({ actor: session?.name || "Super Admin", action: "Posted announcement", details: entry.title });
    showToast({ title: "Announcement posted", subtitle: "Every merchant will see this on their dashboard.", type: "success" });
  };

  const handleRemove = (id, title) => {
    if (!window.confirm(`Remove "${title}"? Merchants who haven't seen it yet won't see it anymore.`)) return;
    removeAnnouncement(id);
    setList(getAnnouncements());
    logAuditEvent({ actor: session?.name || "Super Admin", action: "Removed announcement", details: title });
  };

  return (
    <div className="max-w-2xl">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center shrink-0">
          <Megaphone size={20} />
        </div>
        <div>
          <h1 className="font-display font-bold text-xl text-slate-800">Announcements</h1>
          <p className="text-sm text-slate-400">Platform-wide messages shown to every merchant's dashboard.</p>
        </div>
      </div>

      <form onSubmit={handlePost} className="bg-white rounded-2xl shadow-card p-5 mb-6 space-y-3">
        <input
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          placeholder="Title (e.g. Scheduled maintenance)"
          className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm outline-none focus:border-amber-500"
        />
        <textarea
          value={form.body}
          onChange={(e) => setForm({ ...form, body: e.target.value })}
          placeholder="Message to all merchants..."
          rows={3}
          className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm outline-none focus:border-amber-500 resize-none"
        />
        <button type="submit" className="flex items-center gap-1.5 text-sm font-semibold text-white bg-[#0B1220] hover:bg-black px-4 py-2 rounded-lg">
          <Send size={14} /> Post Announcement
        </button>
      </form>

      <div className="space-y-3">
        {list.length === 0 ? (
          <p className="text-sm text-slate-400 text-center py-8">No announcements posted yet.</p>
        ) : (
          list.map((a) => (
            <div key={a.id} className="bg-white rounded-2xl shadow-card p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-semibold text-slate-800 text-sm">{a.title}</p>
                  <p className="text-sm text-slate-500 mt-1">{a.body}</p>
                  <p className="text-[11px] text-slate-400 mt-2">
                    {a.postedBy} · {new Date(a.postedAt).toLocaleString("en-IN", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                  </p>
                </div>
                <button onClick={() => handleRemove(a.id, a.title)} className="text-slate-300 hover:text-rose-600 shrink-0">
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
