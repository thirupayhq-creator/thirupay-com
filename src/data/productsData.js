// Products & Inventory (Business Tools) — per-merchant product list, kept in
// localStorage for this frontend demo. Billing (next tool) reads the same list and
// calls adjustStock() at checkout, so keep these functions as the single entry point.
//
// When the real backend is ready, swap the bodies of these functions for API calls.

const STORAGE_KEY = "tp_products";

export const LOW_STOCK_THRESHOLD = 5; // 1..5 units left = "Low stock", 0 = "Out of stock"
export const PRODUCT_CATEGORIES = ["Grocery", "Snacks", "Dairy", "Beverages", "Personal Care", "Household", "Stationery", "Other"];

// Sample catalogue for the seeded demo merchant only. Other merchants start empty.
const DEMO_PRODUCTS = {
  m_001: [
    { name: "Biscuits", price: 10, category: "Snacks", stock: 62 },
    { name: "Milk 500 ml", price: 28, category: "Dairy", stock: 33 },
    { name: "Rice 1 kg", price: 60, category: "Grocery", stock: 38 },
    { name: "Soap", price: 35, category: "Personal Care", stock: 4 },
    { name: "Sugar 1 kg", price: 45, category: "Grocery", stock: 25 },
    { name: "Tea Powder 250 g", price: 120, category: "Grocery", stock: 12 },
  ],
};

const newId = () => `p_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;
const byName = (a, b) => a.name.localeCompare(b.name, "en", { sensitivity: "base" });

function readAll() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
  } catch {
    return {};
  }
}

function writeAll(all) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
    return true;
  } catch {
    return false;
  }
}

export function getProducts(merchantId) {
  const all = readAll();
  if (all[merchantId] === undefined && DEMO_PRODUCTS[merchantId]) {
    all[merchantId] = DEMO_PRODUCTS[merchantId].map((p) => ({ ...p, id: newId(), created_at: new Date().toISOString() }));
    writeAll(all);
  }
  return (all[merchantId] || []).slice().sort(byName);
}

export function stockStatus(product) {
  if (product.stock <= 0) return "out";
  if (product.stock <= LOW_STOCK_THRESHOLD) return "low";
  return "in";
}

export function productStats(products) {
  return {
    total: products.length,
    low: products.filter((p) => stockStatus(p) === "low").length,
    out: products.filter((p) => stockStatus(p) === "out").length,
    stockValue: products.reduce((sum, p) => sum + p.price * p.stock, 0),
  };
}

// Validates form input (strings) and returns { errors, clean }.
// `editingId` lets a product keep its own name without tripping the duplicate check.
export function validateProduct(existing, input, editingId = null) {
  const errors = {};
  const name = (input.name || "").trim().replace(/\s+/g, " ");
  const category = (input.category || "").trim() || "Other";
  const priceText = String(input.price ?? "").trim();
  const stockText = String(input.stock ?? "").trim();

  if (name.length < 2) errors.name = "Enter a product name (at least 2 characters).";
  else if (name.length > 60) errors.name = "Product name must be 60 characters or fewer.";
  else if (existing.some((p) => p.id !== editingId && p.name.toLowerCase() === name.toLowerCase())) errors.name = "You already have a product with this name.";

  const price = Number(priceText);
  if (!priceText || Number.isNaN(price) || price <= 0) errors.price = "Enter a price greater than ₹0.";
  else if (!/^\d+(\.\d{1,2})?$/.test(priceText)) errors.price = "Price can have at most 2 decimal places.";
  else if (price > 999999) errors.price = "Price must be ₹9,99,999 or less.";

  const stock = Number(stockText);
  if (stockText === "" || !Number.isInteger(stock) || stock < 0) errors.stock = "Enter stock as a whole number (0 or more).";
  else if (stock > 999999) errors.stock = "Stock must be 9,99,999 or less.";

  if (category.length > 30) errors.category = "Category must be 30 characters or fewer.";

  return { errors, clean: { name, category, price: Math.round(price * 100) / 100, stock } };
}

// Adds (editingId = null) or updates a product. Returns { ok, products, error, product }.
export function saveProduct(merchantId, input, editingId = null) {
  const all = readAll();
  const list = all[merchantId] || [];
  const { errors, clean } = validateProduct(list, input, editingId);
  if (Object.keys(errors).length) return { ok: false, errors };

  let saved;
  let next;
  if (editingId) {
    next = list.map((p) => (p.id === editingId ? (saved = { ...p, ...clean, updated_at: new Date().toISOString() }) : p));
  } else {
    saved = { id: newId(), ...clean, created_at: new Date().toISOString() };
    next = [...list, saved];
  }
  all[merchantId] = next;
  if (!writeAll(all)) return { ok: false, errors: { form: "Could not save — browser storage is full or blocked." } };
  return { ok: true, product: saved, products: next.slice().sort(byName) };
}

// Change stock by +/- delta (never below 0). Returns the updated list.
export function adjustStock(merchantId, productId, delta) {
  const all = readAll();
  const list = (all[merchantId] || []).map((p) => (p.id === productId ? { ...p, stock: Math.max(0, p.stock + delta) } : p));
  all[merchantId] = list;
  writeAll(all);
  return list.slice().sort(byName);
}

export function deleteProduct(merchantId, productId) {
  const all = readAll();
  all[merchantId] = (all[merchantId] || []).filter((p) => p.id !== productId);
  writeAll(all);
  return all[merchantId].slice().sort(byName);
}
