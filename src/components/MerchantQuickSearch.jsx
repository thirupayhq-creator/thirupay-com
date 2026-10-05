import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import { db } from "../data/mockData";

// Shared between AdminLayout and SuperAdminLayout. `basePath` routes results
// into whichever portal is currently rendering the search box.
export default function MerchantQuickSearch({ basePath = "/admin", theme = "green" }) {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);

  const matches =
    query.trim().length > 0
      ? db.getMerchants().filter(
          (m) =>
            m.business_name.toLowerCase().includes(query.toLowerCase()) ||
            m.owner_name.toLowerCase().includes(query.toLowerCase()) ||
            m.phone.includes(query)
        )
      : [];

  const goToMerchants = () => {
    if (!query.trim()) return;
    navigate(`${basePath}/merchants?q=${encodeURIComponent(query.trim())}`);
    setShowSuggestions(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") goToMerchants();
    if (e.key === "Escape") setShowSuggestions(false);
  };

  const border = theme === "amber" ? "border-amber-100 focus:border-amber-500 bg-amber-50/50" : "border-green-100 focus:border-green-500 bg-green-50/50";
  const iconColor = theme === "amber" ? "text-amber-300" : "text-green-300";
  const cardBorder = theme === "amber" ? "border-amber-100" : "border-green-100";
  const textMuted = theme === "amber" ? "text-amber-400" : "text-green-300";
  const textStrong = theme === "amber" ? "text-amber-700" : "text-green-700";
  const hoverBg = theme === "amber" ? "hover:bg-amber-50" : "hover:bg-green-50";

  return (
    <div className="relative flex-1 max-w-xs">
      <Search size={15} className={`absolute left-3 top-1/2 -translate-y-1/2 ${iconColor}`} />
      <input
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setShowSuggestions(true);
        }}
        onFocus={() => query && setShowSuggestions(true)}
        onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
        onKeyDown={handleKeyDown}
        placeholder="Search merchants, phone..."
        className={`w-full pl-9 pr-3 py-2 rounded-lg border outline-none text-sm ${border}`}
      />

      {showSuggestions && query.trim() && (
        <div className={`absolute top-full left-0 right-0 mt-1.5 bg-white rounded-lg shadow-card border ${cardBorder} overflow-hidden z-50 max-h-64 overflow-y-auto`}>
          {matches.length === 0 ? (
            <p className={`text-xs ${textMuted} px-4 py-3`}>No merchants match "{query}"</p>
          ) : (
            matches.slice(0, 6).map((m) => (
              <button
                key={m.merchant_id}
                onMouseDown={() => navigate(`${basePath}/merchants?q=${encodeURIComponent(m.business_name)}`)}
                className={`w-full text-left px-4 py-2.5 ${hoverBg} flex items-center justify-between`}
              >
                <div>
                  <p className={`text-xs font-semibold ${textStrong}`}>{m.business_name}</p>
                  <p className={`text-[11px] ${textMuted}`}>{m.owner_name} · {m.phone}</p>
                </div>
                <span className={`text-[10px] font-semibold ${textMuted} capitalize`}>{m.status}</span>
              </button>
            ))
          )}
          {matches.length > 0 && (
            <button
              onMouseDown={goToMerchants}
              className={`w-full text-left px-4 py-2 text-[11px] font-semibold ${textStrong} ${hoverBg} border-t ${cardBorder}`}
            >
              View all results in Merchants →
            </button>
          )}
        </div>
      )}
    </div>
  );
}
