import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Plus, Trash2, Upload, ToggleLeft, ToggleRight } from "lucide-react";
import ImageSizeHint from "./ImageSizeHint";

const EMPTY = { title: "", description: "", image_url: "", video_url: "", button_label: "Ver más", button_url: "", is_active: true };

export default function AdminPromotions() {
  const [promos, setPromos] = useState([]);
  const [form, setForm] = useState(EMPTY);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [uploading, setUploading] = useState(false);

  const load = () => base44.entities.Promotion.list("-created_date").then(setPromos);
  useEffect(() => { load(); }, []);

  const handleImage = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading("image");
    const { file_url } = await base44.integrations.Core.UploadFile({ file });
    setForm(f => ({ ...f, image_url: file_url }));
    setUploading(false);
  };

  const handleVideo = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading("video");
    const { file_url } = await base44.integrations.Core.UploadFile({ file });
    setForm(f => ({ ...f, video_url: file_url }));
    setUploading(false);
  };

  const save = async () => {
    if (editing) {
      await base44.entities.Promotion.update(editing, form);
    } else {
      await base44.entities.Promotion.create(form);
    }
    setForm(EMPTY);
    setEditing(null);
    setShowForm(false);
    load();
  };

  const remove = async (id) => {
    await base44.entities.Promotion.delete(id);
    load();
  };

  const toggleActive = async (promo) => {
    await base44.entities.Promotion.update(promo.id, { is_active: !promo.is_active });
    load();
  };

  const edit = (p) => {
    setForm({ title: p.title, description: p.description || "", image_url: p.image_url || "", video_url: p.video_url || "", button_label: p.button_label || "Ver más", button_url: p.button_url || "", is_active: p.is_active });
    setEditing(p.id);
    setShowForm(true);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-white font-bold text-lg" style={{ fontFamily: "'Playfair Display', serif" }}>Promociones</h2>
        <button onClick={() => { setForm(EMPTY); setEditing(null); setShowForm(true); }}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold text-white"
          style={{ background: "#E8001D" }}>
          <Plus size={15} /> Nueva
        </button>
      </div>

      {showForm && (
        <div className="p-4 sm:p-5 rounded-xl mb-6" style={{ background: "#111", border: "1px solid #222" }}>
          <div className="grid gap-3">
            <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
              placeholder="Título *" className="w-full px-3 py-2 rounded-lg text-sm text-white bg-transparent"
              style={{ border: "1px solid #333" }} />
            <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
              placeholder="Descripción breve" rows={2}
              className="w-full px-3 py-2 rounded-lg text-sm text-white bg-transparent resize-none"
              style={{ border: "1px solid #333" }} />

            {/* Image upload */}
            <div>
              <label className="flex items-center gap-2 cursor-pointer px-3 py-2 rounded-lg text-sm text-gray-400 transition-colors"
                style={{ border: "1px dashed #333", background: "#0a0a0a" }}>
                <Upload size={14} />
                {uploading === "image" ? "Subiendo..." : form.image_url ? "Cambiar imagen" : "Subir imagen (fallback)"}
                <input type="file" accept="image/*" className="hidden" onChange={handleImage} />
              </label>
              <ImageSizeHint size="1080×1350" ratio="4:5" note="formato vertical" />
              {form.image_url && <img src={form.image_url} alt="" className="mt-2 h-24 object-contain rounded-lg" />}
            </div>

            {/* Video upload (reel 9:16) */}
            <div>
              <label className="flex items-center gap-2 cursor-pointer px-3 py-2 rounded-lg text-sm text-gray-400 transition-colors"
                style={{ border: "1px dashed #555", background: "#0a0a0a" }}>
                <Upload size={14} />
                {uploading === "video" ? "Subiendo video..." : form.video_url ? "Cambiar video (reel)" : "Subir video reel 9:16 (opcional)"}
                <input type="file" accept="video/*" className="hidden" onChange={handleVideo} />
              </label>
              <ImageSizeHint size="1080×1920" ratio="9:16" note="formato reel vertical · máx. 10MB" />
              {form.video_url && (
                <div className="mt-2 flex items-center gap-2">
                  <video src={form.video_url} className="h-24 rounded-lg" style={{ aspectRatio: "9/16" }} muted />
                  <button type="button" onClick={() => setForm(f => ({ ...f, video_url: "" }))}
                    className="text-xs text-red-500 hover:text-red-400">Quitar video</button>
                </div>
              )}
              <p className="text-xs text-gray-600 mt-1">Si hay video, el popup mostrará el video. Si no, mostrará la imagen.</p>
            </div>

            <input value={form.button_label} onChange={e => setForm(f => ({ ...f, button_label: e.target.value }))}
              placeholder="Texto del botón (ej: Ver más)" className="w-full px-3 py-2 rounded-lg text-sm text-white bg-transparent"
              style={{ border: "1px solid #333" }} />
            <input value={form.button_url} onChange={e => setForm(f => ({ ...f, button_url: e.target.value }))}
              placeholder="URL del botón (ej: https://wa.me/...)" className="w-full px-3 py-2 rounded-lg text-sm text-white bg-transparent"
              style={{ border: "1px solid #333" }} />

            <label className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer">
              <input type="checkbox" checked={form.is_active} onChange={e => setForm(f => ({ ...f, is_active: e.target.checked }))} />
              Mostrar en el sitio (popup activo)
            </label>

            <div className="flex gap-2 mt-1">
              <button onClick={save}
                className="flex-1 py-2 rounded-lg text-sm font-bold text-white"
                style={{ background: "#E8001D" }}>
                {editing ? "Guardar cambios" : "Crear promoción"}
              </button>
              <button onClick={() => { setShowForm(false); setEditing(null); }}
                className="px-4 py-2 rounded-lg text-sm text-gray-400"
                style={{ border: "1px solid #333" }}>
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="grid gap-4">
        {promos.map(p => (
          <div key={p.id} className="flex gap-2 sm:gap-4 items-start p-3 sm:p-4 rounded-xl"
            style={{ background: "#111", border: "1px solid #222" }}>
            {p.image_url && <img src={p.image_url} alt={p.title} className="w-12 h-16 sm:w-16 sm:h-20 object-cover rounded-lg shrink-0" />}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-white font-semibold text-sm truncate">{p.title}</span>
                <span className="text-xs px-2 py-0.5 rounded-full shrink-0"
                  style={{ background: p.is_active ? "rgba(0,200,100,0.15)" : "rgba(255,255,255,0.05)", color: p.is_active ? "#00c864" : "#666" }}>
                  {p.is_active ? "Activa" : "Inactiva"}
                </span>
              </div>
              {p.description && <p className="text-gray-500 text-xs mb-1 line-clamp-2">{p.description}</p>}
              {p.button_url && <p className="text-xs truncate" style={{ color: "#E8001D" }}>{p.button_url}</p>}
            </div>
            <div className="flex flex-col gap-2 shrink-0">
              <button onClick={() => toggleActive(p)} className="text-gray-400 hover:text-white transition-colors">
                {p.is_active ? <ToggleRight size={20} style={{ color: "#00c864" }} /> : <ToggleLeft size={20} />}
              </button>
              <button onClick={() => edit(p)} className="text-xs text-gray-400 hover:text-white transition-colors px-2 py-1 rounded"
                style={{ border: "1px solid #333" }}>
                Editar
              </button>
              <button onClick={() => remove(p.id)} className="text-gray-600 hover:text-red-500 transition-colors">
                <Trash2 size={15} />
              </button>
            </div>
          </div>
        ))}
        {promos.length === 0 && !showForm && (
          <p className="text-gray-600 text-sm text-center py-8">No hay promociones. Creá la primera.</p>
        )}
      </div>
    </div>
  );
}