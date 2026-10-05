import { useEffect, useId, useRef } from "react";
import { X } from "lucide-react";

// Small accessible dialog used by the Business Tools pages:
// Esc / backdrop click closes, focus moves into the dialog and returns on close,
// Tab is kept inside, and the page behind doesn't scroll.
export default function Modal({ title, onClose, children, maxWidth = "max-w-md" }) {
  const titleId = useId();
  const panelRef = useRef(null);
  const closeRef = useRef(onClose);

  useEffect(() => {
    closeRef.current = onClose;
  });

  useEffect(() => {
    const previouslyFocused = document.activeElement;
    const panel = panelRef.current;
    const focusables = () =>
      Array.from(panel.querySelectorAll('input, select, textarea, button, a[href], [tabindex]:not([tabindex="-1"])')).filter((el) => !el.disabled);

    // First form field if there is one, otherwise the first button.
    (panel.querySelector("input, select, textarea") || focusables()[0])?.focus();

    const onKeyDown = (e) => {
      if (e.key === "Escape") {
        closeRef.current();
        return;
      }
      if (e.key !== "Tab") return;
      const items = focusables();
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = prevOverflow;
      previouslyFocused?.focus?.();
    };
  }, []);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) closeRef.current();
      }}
    >
      <div ref={panelRef} role="dialog" aria-modal="true" aria-labelledby={titleId} className={`card w-full ${maxWidth} p-6 max-h-[90vh] overflow-y-auto`}>
        <div className="flex items-center justify-between mb-4">
          <h2 id={titleId} className="font-display font-bold text-lg text-green-700">
            {title}
          </h2>
          <button type="button" onClick={onClose} aria-label="Close" className="p-1.5 rounded-lg text-green-400 hover:bg-green-50">
            <X size={18} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
