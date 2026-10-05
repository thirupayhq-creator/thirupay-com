import { useState } from "react";
import { motion } from "framer-motion";
import { Package, AlertTriangle, PackageX, IndianRupee, Plus, Minus, Search, Pencil, Trash2 } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useLanguage } from "../../context/LanguageContext";
import { useToast } from "../../context/ToastContext";
import { PRODUCT_CATEGORIES, adjustStock, deleteProduct, getProducts, productStats, saveProduct, stockStatus } from "../../data/productsData";
import StatCard from "../../components/StatCard";
import Modal from "../../components/Modal";

const inr = (n) => `₹${Number(n).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
const inrWhole = (n) => `₹${Math.round(n).toLocaleString("en-IN")}`;

const inputCls = "w-full px-4 py-2.5 rounded-lg border border-green-100 focus:border-green-500 focus:ring-2 focus:ring-green-100 outline-none text-sm";

const STATUS_STYLE = {
  in: { label: "In stock", cls: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  low: { label: "Low stock", cls: "bg-amber-50 text-amber-700 border-amber-200" },
  out: { label: "Out of stock", cls: "bg-rose-50 text-rose-700 border-rose-200" },
};

const FILTERS = [
  { key: "all", label: "All" },
  { key: "in", label: "In stock" },
  { key: "low", label: "Low stock" },
  { key: "out", label: "Out of stock" },
];

function StockBadge({ product }) {
  const s = STATUS_STYLE[stockStatus(product)];
  return <span className={`inline-block text-xs font-semibold px-2.5 py-1 rounded-full border whitespace-nowrap ${s.cls}`}>{s.label}</span>;
}

function StockStepper({ product, onChange }) {
  return (
    <div className="inline-flex items-center gap-1">
      <button
        type="button"
        onClick={() => onChange(product, -1)}
        disabled={product.stock <= 0}
        aria-label={`Decrease stock of ${product.name}`}
        className="w-8 h-8 rounded-lg border border-green-100 text-green-600 hover:bg-green-50 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center"
      >
        <Minus size={14} />
      </button>
      <span className="w-10 text-center text-sm font-semibold text-green-700" aria-label={`${product.stock} in stock`}>
        {product.stock}
      </span>
      <button
        type="button"
        onClick={() => onChange(product, 1)}
        aria-label={`Increase stock of ${product.name}`}
        className="w-8 h-8 rounded-lg border border-green-100 text-green-600 hover:bg-green-50 flex items-center justify-center"
      >
        <Plus size={14} />
      </button>
    </div>
  );
}

function RowActions({ product, onEdit, onDelete }) {
  return (
    <div className="inline-flex items-center gap-1">
      <button
        type="button"
        onClick={() => onEdit(product)}
        aria-label={`Edit ${product.name}`}
        title="Edit"
        className="w-8 h-8 rounded-lg text-green-500 hover:bg-green-50 flex items-center justify-center"
      >
        <Pencil size={15} />
      </button>
      <button
        type="button"
        onClick={() => onDelete(product)}
        aria-label={`Delete ${product.name}`}
        title="Delete"
        className="w-8 h-8 rounded-lg text-rose-500 hover:bg-rose-50 flex items-center justify-center"
      >
        <Trash2 size={15} />
      </button>
    </div>
  );
}

// Add / Edit product dialog
function ProductModal({ merchantId, product, onClose, onSaved }) {
  const editing = !!product;
  const [form, setForm] = useState({
    name: product?.name || "",
    price: product ? String(product.price) : "",
    category: product?.category || "",
    stock: product ? String(product.stock) : "",
  });
  const [errors, setErrors] = useState({});

  const set = (k, v) => {
    setForm((f) => ({ ...f, [k]: v }));
    if (errors[k]) setErrors((e) => ({ ...e, [k]: undefined }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const res = saveProduct(merchantId, form, product?.id || null);
    if (!res.ok) {
      setErrors(res.errors);
      return;
    }
    onSaved(res.products, res.product, editing);
  };

  const field = (label, key, props = {}) => (
    <div>
      <label htmlFor={`prod-${key}`} className="block text-xs font-semibold text-green-500 mb-1.5">
        {label}
      </label>
      <input
        id={`prod-${key}`}
        value={form[key]}
        onChange={(e) => set(key, e.target.value)}
        aria-invalid={!!errors[key]}
        aria-describedby={errors[key] ? `prod-${key}-err` : undefined}
        className={`${inputCls} ${errors[key] ? "border-rose-300" : ""}`}
        {...props}
      />
      {errors[key] && (
        <p id={`prod-${key}-err`} className="text-rose-600 text-xs font-medium mt-1.5">
          {errors[key]}
        </p>
      )}
    </div>
  );

  return (
    <Modal title={editing ? "Edit product" : "Add product"} onClose={onClose}>
      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        {field("Product name *", "name", { placeholder: "e.g. Rice 1 kg", maxLength: 60 })}
        <div className="grid grid-cols-2 gap-4">
          {field("Price (₹) *", "price", { placeholder: "0.00", inputMode: "decimal" })}
          {field(editing ? "Stock *" : "Opening stock *", "stock", { placeholder: "0", inputMode: "numeric" })}
        </div>
        {field("Category", "category", { placeholder: "e.g. Grocery", list: "product-categories", maxLength: 30 })}
        <datalist id="product-categories">
          {PRODUCT_CATEGORIES.map((c) => (
            <option key={c} value={c} />
          ))}
        </datalist>

        {errors.form && <p className="text-rose-600 text-xs font-medium">{errors.form}</p>}

        <div className="flex gap-3 pt-2">
          <button type="button" onClick={onClose} className="px-5 py-2.5 rounded-lg border border-green-200 text-green-700 hover:bg-green-50 font-semibold text-sm transition-colors">
            Cancel
          </button>
          <button type="submit" className="flex-1 bg-green-500 hover:bg-green-600 text-white font-semibold py-2.5 rounded-lg transition-colors text-sm">
            {editing ? "Save changes" : "Add product"}
          </button>
        </div>
      </form>
    </Modal>
  );
}

export default function Products() {
  const { session } = useAuth();
  const { t } = useLanguage();
  const { showToast } = useToast();
  const merchantId = session.merchantId;

  const [products, setProducts] = useState(() => getProducts(merchantId));
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [modal, setModal] = useState(null); // { type: "form", product? } | { type: "delete", product }

  const stats = productStats(products);

  const q = query.trim().toLowerCase();
  const visible = products.filter((p) => {
    if (filter !== "all" && stockStatus(p) !== filter) return false;
    if (!q) return true;
    return p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q);
  });

  const handleStock = (product, delta) => setProducts(adjustStock(merchantId, product.id, delta));

  const handleSaved = (list, saved, editing) => {
    setProducts(list);
    setModal(null);
    showToast({ title: editing ? "Product updated" : "Product added", subtitle: saved.name, type: "success" });
  };

  const handleDelete = () => {
    const target = modal.product;
    setProducts(deleteProduct(merchantId, target.id));
    setModal(null);
    showToast({ title: "Product deleted", subtitle: target.name, type: "success" });
  };

  return (
    <div className="max-w-5xl">
      <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
        <div>
          <h1 className="font-display font-bold text-2xl text-green-700">{t("productsTitle")}</h1>
          <p className="text-sm text-green-300">{t("productsSubtitle")}</p>
        </div>
        <button
          type="button"
          onClick={() => setModal({ type: "form" })}
          className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white font-semibold px-5 py-2.5 rounded-lg transition-colors text-sm"
        >
          <Plus size={16} /> Add Product
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard icon={Package} label="Total products" value={stats.total} sub={stats.total === 1 ? "1 item listed" : `${stats.total} items listed`} />
        <StatCard icon={IndianRupee} label="Stock value" value={inrWhole(stats.stockValue)} sub="Price × units in stock" />
        <StatCard icon={AlertTriangle} label="Low stock" value={stats.low} sub="5 or fewer units left" />
        <StatCard icon={PackageX} label="Out of stock" value={stats.out} sub="Needs restocking" />
      </div>

      <div className="flex flex-wrap items-center gap-3 mb-4">
        <div className="relative flex-1 min-w-[220px]">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-green-300" aria-hidden="true" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products"
            aria-label="Search products"
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-green-100 bg-white focus:border-green-500 focus:ring-2 focus:ring-green-100 outline-none text-sm"
          />
        </div>
        <div role="group" aria-label="Filter by stock" className="inline-flex rounded-lg border border-green-100 bg-white p-1">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              type="button"
              aria-pressed={filter === f.key}
              onClick={() => setFilter(f.key)}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${filter === f.key ? "bg-green-500 text-white" : "text-green-500 hover:bg-green-50"}`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Empty: no products at all */}
      {products.length === 0 && (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="card text-center py-14 px-4">
          <div className="w-14 h-14 rounded-2xl bg-green-50 text-green-500 flex items-center justify-center mx-auto mb-4">
            <Package size={26} />
          </div>
          <p className="font-display font-semibold text-green-700">No products yet</p>
          <p className="text-sm text-green-300 mt-1 mb-5">Add the items you sell. You'll use them for billing and to keep track of stock.</p>
          <button
            type="button"
            onClick={() => setModal({ type: "form" })}
            className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white font-semibold px-5 py-2.5 rounded-lg text-sm transition-colors"
          >
            <Plus size={16} /> Add your first product
          </button>
        </motion.div>
      )}

      {/* Empty: filters/search hide everything */}
      {products.length > 0 && visible.length === 0 && (
        <div className="card text-center py-10 px-4">
          <p className="text-sm text-green-300">No products match your search or filter.</p>
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setFilter("all");
            }}
            className="mt-2 text-xs font-semibold text-green-600 hover:underline"
          >
            Clear search and filters
          </button>
        </div>
      )}

      {visible.length > 0 && (
        <>
          {/* Desktop / tablet: table */}
          <div className="card overflow-hidden hidden md:block">
            <table className="w-full text-sm">
              <thead className="bg-green-50 text-green-500 text-xs uppercase font-semibold">
                <tr>
                  <th className="text-left px-5 py-3">Product</th>
                  <th className="text-left px-5 py-3">Category</th>
                  <th className="text-right px-5 py-3">Price</th>
                  <th className="text-left px-5 py-3">Status</th>
                  <th className="text-left px-5 py-3">Stock</th>
                  <th className="text-right px-5 py-3">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-green-50">
                {visible.map((p) => (
                  <tr key={p.id} className="hover:bg-green-50/50">
                    <td className="px-5 py-3 font-semibold text-green-700">{p.name}</td>
                    <td className="px-5 py-3 text-green-400">{p.category}</td>
                    <td className="px-5 py-3 text-right font-semibold text-green-700">{inr(p.price)}</td>
                    <td className="px-5 py-3">
                      <StockBadge product={p} />
                    </td>
                    <td className="px-5 py-3">
                      <StockStepper product={p} onChange={handleStock} />
                    </td>
                    <td className="px-5 py-3 text-right">
                      <RowActions product={p} onEdit={(x) => setModal({ type: "form", product: x })} onDelete={(x) => setModal({ type: "delete", product: x })} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Phone: cards */}
          <ul className="md:hidden space-y-3">
            {visible.map((p) => (
              <li key={p.id} className="card p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-semibold text-green-700 truncate">{p.name}</p>
                    <p className="text-xs text-green-300 mt-0.5">
                      {inr(p.price)} · {p.category}
                    </p>
                  </div>
                  <StockBadge product={p} />
                </div>
                <div className="flex items-center justify-between mt-3">
                  <StockStepper product={p} onChange={handleStock} />
                  <RowActions product={p} onEdit={(x) => setModal({ type: "form", product: x })} onDelete={(x) => setModal({ type: "delete", product: x })} />
                </div>
              </li>
            ))}
          </ul>
        </>
      )}

      {modal?.type === "form" && <ProductModal merchantId={merchantId} product={modal.product} onClose={() => setModal(null)} onSaved={handleSaved} />}

      {modal?.type === "delete" && (
        <Modal title="Delete product?" onClose={() => setModal(null)}>
          <p className="text-sm text-green-500">
            <span className="font-semibold text-green-700">{modal.product.name}</span> will be removed from your product list. Past bills are not affected.
          </p>
          <div className="flex gap-3 pt-5">
            <button type="button" onClick={() => setModal(null)} className="px-5 py-2.5 rounded-lg border border-green-200 text-green-700 hover:bg-green-50 font-semibold text-sm transition-colors">
              Cancel
            </button>
            <button type="button" onClick={handleDelete} className="flex-1 bg-rose-600 hover:bg-rose-700 text-white font-semibold py-2.5 rounded-lg transition-colors text-sm">
              Delete product
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}
