import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { uploadPublicFile } from "@/lib/uploadFile";
import { Plus, Trash2, Eye, EyeOff, Upload, ExternalLink, Pencil, X } from "lucide-react";
import ImageSizeHint from "./ImageSizeHint";

export default function AdminNovedades() {
  const [items, setItems] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: "", image_url: "", link: "", description: "", is_active: true });
  const [uploading, setUploading] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const load = () => base44.entities.NovedadBanner.list("-created_date").then(setItems).catch(() => {});

  useEffect(() => { load(); }, []);

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const file_url = await uploadPublicFile(file);
      setForm(f => ({ ...f, image_url: file_url }));
    } catch { alert("Error al subir la imagen"); }
    finally { setUploading(false); }
  };

  const resetForm = () => {
    setForm({ title: "", image_url: "", link: "", description: "", is_active: true });
    setEditingId(null);
    setShowForm(false);
  };

  const handleSave = async () => {
    if (!form.title || !form.image_url) return;
    try {
      if (editingId) {
        await base44.entities.NovedadBanner.update(editingId, form);
      } else {
        await base44.entities.NovedadBanner.create(form);
      }
      resetForm();
      load();
    } catch { alert("Error al guardar la novedad"); }
  };

  const handleEdit = (item) => {
    setEditingId(item.id);
    setForm({ title: item.title || "", image_url: item.image_url || "", link: item.link || "", description: item.description || "", is_active: item.is_active });
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const toggleActive = async (item) => {
    const next = !item.is_active;
    // Optimista: cambia al instante, se revierte si falla
    setItems(prev => prev.map(i => (i.id === item.id ? { ...i, is_active: next } : i)));
    try {
      const updated = await base44.entities.NovedadBanner.update(item.id, { is_active: next });
      if (updated?.id) setItems(prev => prev.map(i => (i.id === item.id ? { ...i, ...updated } : i)));
    } catch {
      setItems(prev => prev.map(i => (i.id === item.id ? { ...i, is_active: item.is_active } : i)));
    }
  };

  const handleDelete = async (item) => {
    try { await base44.entities.NovedadBanner.delete(item.id); load(); }
    catch { alert("Error al eliminar la novedad"); }
  };

  return (
    <div className="admin-panel">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-white" style={{ fontFamily: "'Playfair Display', serif" }}>
          Banners de Novedades
        </h2>
        <button onClick={() => editingId ? resetForm() : setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold"
          style={{ background: editingId ? "#222" : "#FF0000", color: editingId ? "#888" : "#fff" }}>
          {editingId ? <X size={14} /> : <Plus size={14} />} {editingId ? "Cancelar edición" : (showForm ? "Cancelar" : "Nuevo")}
        </button>
      </div>

      <p className="text-gray-500 text-xs mb-6">Solo se muestra 1 banner activo a la vez (el más reciente).</p>

      {showForm && (
        <div className="rounded-xl p-4 sm:p-5 mb-6 space-y-4" style={{ background: "#111", border: `1px solid ${editingId ? "rgba(255,0,0,0.4)" : "#222"}` }}>
          {editingId && <p className="text-xs font-bold uppercase tracking-wider" style={{ color: "#FF0000" }}>Editando novedad existente</p>}
          <input
            value={form.title}
            onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
            placeholder="Título de la novedad"
            className="w-full p-3 rounded-lg text-sm text-white"
            style={{ background: "#1a1a1a", border: "1px solid #333" }}
          />
          <div>
            <label className="block text-xs text-gray-500 mb-2">Imagen / Flyer</label>
            <ImageSizeHint size="1200×675" ratio="16:9" note="formato horizontal" />
            {form.image_url ? (
              <div className="relative rounded-lg overflow-hidden" style={{ maxHeight: 200 }}>
                <img src={form.image_url} alt="" className="w-full object-cover" style={{ maxHeight: 200 }} />
                <button onClick={() => setForm(f => ({ ...f, image_url: "" }))}
                  className="absolute top-2 right-2 w-7 h-7 flex items-center justify-center rounded-full"
                  style={{ background: "rgba(0,0,0,0.7)" }}>
                  <Trash2 size={12} className="text-white" />
                </button>
              </div>
            ) : (
              <label className="flex items-center justify-center gap-2 p-6 rounded-lg cursor-pointer border-dashed border-2"
                style={{ borderColor: "#333", color: "#666" }}>
                <Upload size={16} />
                <span className="text-sm">{uploading ? "Subiendo..." : "Subir imagen"}</span>
                <input type="file" accept="image/*" className="hidden" onChange={handleUpload} disabled={uploading} />
              </label>
            )}
          </div>
          <input
            value={form.link}
            onChange={e => setForm(f => ({ ...f, link: e.target.value }))}
            placeholder="Link destino (opcional)"
            className="w-full p-3 rounded-lg text-sm text-white"
            style={{ background: "#1a1a1a", border: "1px solid #333" }}
          />
          <textarea
            value={form.description}
            onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
            placeholder="Descripción (opcional, máx. 1000 caracteres)"
            maxLength={1000}
            rows={3}
            className="w-full p-3 rounded-lg text-sm text-white resize-none"
            style={{ background: "#1a1a1a", border: "1px solid #333" }}
          />
          <div className="flex gap-3">
            <button onClick={handleSave}
              className="px-6 py-2.5 rounded-lg text-sm font-bold"
              style={{ background: "#FF0000", color: "#fff" }}>
              Guardar
            </button>
            <button onClick={resetForm}
              className="px-6 py-2.5 rounded-lg text-sm font-bold"
              style={{ background: "#222", color: "#888" }}>
              Cancelar
            </button>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {items.map(item => (
          <div key={item.id} className="flex items-center gap-2 sm:gap-4 p-3 rounded-xl"
            style={{ background: "#111", border: "1px solid #1e1e1e" }}>
            {item.image_url && (
              <img src={item.image_url} alt="" className="w-20 h-14 rounded-lg object-cover shrink-0" />
            )}
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm font-bold truncate">{item.title}</p>
              {item.link && (
                <a href={item.link} target="_blank" rel="noopener noreferrer" className="text-xs flex items-center gap-1" style={{ color: "#C9A84C" }}>
                  <ExternalLink size={10} /> Link
                </a>
              )}
            </div>
            <div className="flex items-center gap-1 sm:gap-2 shrink-0">
              <button onClick={() => handleEdit(item)}
                className="w-11 h-11 md:w-8 md:h-8 flex items-center justify-center rounded-lg transition-all"
                style={{ background: "rgba(255,0,0,0.1)" }}
                title="Editar">
                <Pencil size={13} style={{ color: "#FF0000" }} />
              </button>
              <button onClick={() => toggleActive(item)}
                className="w-11 h-11 md:w-8 md:h-8 flex items-center justify-center rounded-lg transition-all"
                style={{ background: item.is_active ? "rgba(34,197,94,0.15)" : "rgba(255,255,255,0.05)" }}>
                {item.is_active ? <Eye size={14} className="text-green-500" /> : <EyeOff size={14} className="text-gray-600" />}
              </button>
              <button onClick={() => handleDelete(item)}
                className="w-11 h-11 md:w-8 md:h-8 flex items-center justify-center rounded-lg"
                style={{ background: "rgba(255,0,0,0.1)" }}>
                <Trash2 size={14} style={{ color: "#FF0000" }} />
              </button>
            </div>
          </div>
        ))}
        {items.length === 0 && (
          <p className="text-gray-600 text-sm text-center py-8">No hay novedades creadas aún.</p>
        )}
      </div>
    </div>
  );
}