import { Upload, Plus, Minus, Check } from "lucide-react";

export const inputCls =
  "w-full px-4 py-2.5 rounded-lg border border-green-100 focus:border-green-500 focus:ring-2 focus:ring-green-100 outline-none text-sm";

export function Field({ label, hint, required, children }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-green-500 mb-1.5">
        {label} {required && <span className="text-rose-500">*</span>}
      </label>
      {children}
      {hint && <p className="text-[11px] text-green-300 mt-1">{hint}</p>}
    </div>
  );
}

export function FileUploadField({ label, hint, value, onChange, error, accept }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-green-500 mb-1.5">{label}</label>
      <label className="flex items-center gap-3 px-4 py-3 rounded-lg border border-dashed border-green-200 cursor-pointer hover:bg-green-50 transition-colors">
        <Upload size={18} className="text-green-400 shrink-0" />
        <span className="text-sm text-green-400 truncate">{value || "Click to upload file"}</span>
        <input type="file" accept={accept} onChange={onChange} className="hidden" />
      </label>
      {hint && <p className="text-[11px] text-green-300 mt-1">{hint}</p>}
      {error && <p className="text-rose-600 text-xs font-medium mt-1.5">{error}</p>}
    </div>
  );
}

// `done` shows a green tick beside the section title once its required fields are filled.
export function AccordionSection({ title, subtitle, isOpen, onToggle, done, children }) {
  return (
    <div className="rounded-xl border border-green-100 bg-white overflow-hidden">
      <button type="button" onClick={onToggle} className="w-full flex items-center justify-between px-5 py-4 text-left">
        <span className="font-semibold text-sm text-green-700 flex items-center gap-2">
          {title}
          {subtitle && <span className="font-normal text-green-300">{subtitle}</span>}
          {done && (
            <span className="w-4 h-4 rounded-full bg-emerald-500 text-white flex items-center justify-center">
              <Check size={11} strokeWidth={3} />
            </span>
          )}
        </span>
        {isOpen ? <Minus size={16} className="text-green-400" /> : <Plus size={16} className="text-green-400" />}
      </button>
      {isOpen && <div className="px-5 pb-5 pt-1 space-y-4">{children}</div>}
    </div>
  );
}
