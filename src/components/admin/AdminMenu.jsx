import { useState, useEffect, useRef } from "react";
import { base44 } from "@/api/base44Client";
import { Plus, Pencil, Trash2, Star, X, Check, Wine, Upload, Loader2 } from "lucide-react";

const CATEGORIES = ["Tragos Clásicos", "Tragos de la Casa", "Shots", "Cervezas", "Vinos & Espumantes", "Sin Alcohol", "Combos"];

const empty = { name: "", description: "", price: "", category: "Tragos Clásicos", is_available: true, is_featured: false, sort_order: 0 };

export default function AdminMenu() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(empty);
  const [saving, setSaving] = useState(false);
  const [activeCategory, setActiveCategory] = useState("all");
  const [importing, setImporting] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => { loadItems(); }, []);

  const loadItems = () => {
    base44.entities.MenuItem.list("sort_order").then(data => {
      setItems(data);
      setLoading(false);
    });
  };

  const openNew = () => { setForm(empty); setEditing(null); setShowForm(true); };
  const openEdit = (item) => { setForm({ ...item, price: item.price.toString() }); setEditing(item.id); setShowForm(true); };
  const closeForm = () => { setShowForm(false); setEditing(null); setForm(empty); };

  const handleSave = async () => {
    if (!form.name || !form.price || !form.category) return;
    setSaving(true);
    const data = { ...form, price: parseFloat(form.price) };
    if (editing) {
      await base44.entities.MenuItem.update(editing, data);
    } else {
      await base44.entities.MenuItem.create(data);
    }
    setSaving(false);
    closeForm();
    loadItems();
  };

  const handleDelete = async (id) => {
    if (!confirm("¿Eliminar este producto?")) return;
    await base44.entities.MenuItem.delete(id);
    loadItems();
  };

  const toggleAvailable = async (item) => {
    await base44.entities.MenuItem.update(item.id, { is_available: !item.is_available });
    loadItems();
  };

  const toggleFeatured = async (item) => {
    await base44.entities.MenuItem.update(item.id, { is_featured: !item.is_featured });
    loadItems();
  };

  const categories = [...new Set(items.map(i => i.category))];
  const filtered = activeCategory === "all" ? items : items.filter(i => i.category === activeCategory);

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Wine size={20} style={{ color: "#E8001D" }} />
          <h2 className="text-xl font-bold text-white">Carta de Tragos</h2>
          <span className="text-xs px-2 py-0.5 rounded-full text-gray-400" style={{ background: "#1a1a1a" }}>
            {items.length} productos
          </span>
        </div>
        <button onClick={openNew}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-bold"
          style={{ background: "#E8001D", color: "#fff" }}>
          <Plus size={15} /> Agregar
        </button>
      </div>

      {/* Category filter */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-5 scrollbar-hide">
        <button onClick={() => setActiveCategory("all")}
          className="shrink-0 px-3 py-1.5 rounded-full text-xs font-bold transition-all"
          style={activeCategory === "all" ? { background: "#E8001D", color: "#fff" } : { background: "#1a1a1a", color: "#666" }}>
          Todos
        </button>
        {categories.map(cat => (
          <button key={cat} onClick={() => setActiveCategory(cat)}
            className="shrink-0 px-3 py-1.5 rounded-full text-xs font-bold transition-all"
            style={activeCategory === cat ? { background: "#E8001D", color: "#fff" } : { background: "#1a1a1a", color: "#666" }}>
            {cat}
          </button>
        ))}
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.85)" }}>
          <div className="w-full max-w-md rounded-2xl p-6" style={{ background: "#111", border: "1px solid #2a2a2a" }}>
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-white font-bold text-lg">{editing ? "Editar Producto" : "Nuevo Producto"}</h3>
              <button onClick={closeForm} className="text-gray-500 hover:text-white"><X size={18} /></button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs text-gray-500 uppercase tracking-wider mb-1 block">Nombre *</label>
                <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                  placeholder="Ej: Mojito Clásico"
                  className="w-full px-4 py-3 rounded-lg text-white text-sm outline-none"
                  style={{ background: "#1a1a1a", border: "1px solid #2a2a2a" }} />
              </div>
              <div>
                <label className="text-xs text-gray-500 uppercase tracking-wider mb-1 block">Descripción</label>
                <input value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}
                  placeholder="Ej: Ron, menta, limón, soda"
                  className="w-full px-4 py-3 rounded-lg text-white text-sm outline-none"
                  style={{ background: "#1a1a1a", border: "1px solid #2a2a2a" }} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-gray-500 uppercase tracking-wider mb-1 block">Precio *</label>
                  <input type="number" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })}
                    placeholder="0"
                    className="w-full px-4 py-3 rounded-lg text-white text-sm outline-none"
                    style={{ background: "#1a1a1a", border: "1px solid #2a2a2a" }} />
                </div>
                <div>
                  <label className="text-xs text-gray-500 uppercase tracking-wider mb-1 block">Orden</label>
                  <input type="number" value={form.sort_order} onChange={e => setForm({ ...form, sort_order: parseInt(e.target.value) || 0 })}
                    className="w-full px-4 py-3 rounded-lg text-white text-sm outline-none"
                    style={{ background: "#1a1a1a", border: "1px solid #2a2a2a" }} />
                </div>
              </div>
              <div>
                <label className="text-xs text-gray-500 uppercase tracking-wider mb-1 block">Categoría *</label>
                <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg text-white text-sm outline-none"
                  style={{ background: "#1a1a1a", border: "1px solid #2a2a2a" }}>
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={form.is_available} onChange={e => setForm({ ...form, is_available: e.target.checked })}
                    className="w-4 h-4 rounded accent-red-600" />
                  <span className="text-sm text-gray-400">Disponible</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={form.is_featured} onChange={e => setForm({ ...form, is_featured: e.target.checked })}
                    className="w-4 h-4 rounded accent-red-600" />
                  <span className="text-sm text-gray-400">Destacado</span>
                </label>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button onClick={closeForm}
                className="flex-1 py-3 rounded-lg text-sm font-bold text-gray-400"
                style={{ background: "#1a1a1a" }}>
                Cancelar
              </button>
              <button onClick={handleSave} disabled={saving}
                className="flex-1 py-3 rounded-lg text-sm font-bold text-white flex items-center justify-center gap-2"
                style={{ background: "#E8001D", opacity: saving ? 0.7 : 1 }}>
                <Check size={15} /> {saving ? "Guardando..." : "Guardar"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Items Table */}
      {loading ? (
        <div className="text-center py-12 text-gray-600">Cargando...</div>
      ) : (
        <div className="space-y-2">
          {filtered.map(item => (
            <div key={item.id} className="flex items-center gap-3 px-4 py-3 rounded-xl"
              style={{ background: "#0f0f0f", border: `1px solid ${item.is_available ? "#1e1e1e" : "#1a1a1a"}`, opacity: item.is_available ? 1 : 0.5 }}>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-white text-sm font-semibold truncate">{item.name}</span>
                  {item.is_featured && <Star size={11} fill="#C9A84C" style={{ color: "#C9A84C", shrink: 0 }} />}
                </div>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-xs text-gray-600">{item.category}</span>
                  {item.description && <span className="text-xs text-gray-700 truncate">· {item.description}</span>}
                </div>
              </div>
              <div className="text-sm font-black shrink-0" style={{ color: "#C9A84C" }}>
                ${item.price.toLocaleString()}
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <button onClick={() => toggleAvailable(item)}
                  title={item.is_available ? "Deshabilitar" : "Habilitar"}
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold transition-all"
                  style={{ background: item.is_available ? "rgba(34,197,94,0.15)" : "#1a1a1a", color: item.is_available ? "#22c55e" : "#555" }}>
                  {item.is_available ? "✓" : "✗"}
                </button>
                <button onClick={() => openEdit(item)}
                  className="w-7 h-7 rounded-lg flex items-center justify-center transition-all hover:text-white text-gray-600"
                  style={{ background: "#1a1a1a" }}>
                  <Pencil size={12} />
                </button>
                <button onClick={() => handleDelete(item.id)}
                  className="w-7 h-7 rounded-lg flex items-center justify-center transition-all hover:text-red-500 text-gray-700"
                  style={{ background: "#1a1a1a" }}>
                  <Trash2 size={12} />
                </button>
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="text-center py-12 text-gray-600">
              <Wine size={32} className="mx-auto mb-2 opacity-30" />
              <p className="text-sm">No hay productos. Agregá el primero.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}