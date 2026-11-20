import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Plus, Trash2, ExternalLink, Edit2, Check, X, ImageIcon } from "lucide-react";
import ImageSizeHint from "./ImageSizeHint";
import { safeHttpUrl } from "@/lib/safeHttpUrl";

export default function AdminGalleryAlbums() {
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ title: "", link: "", cover_url: "" });
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const load = () => base44.entities.GalleryAlbum.list("-created_date").then(d => { setAlbums(d); }).catch(() => {}).finally(() => setLoading(false));
  useEffect(() => { load(); }, []);

  const openNew = () => { setForm({ title: "", link: "", cover_url: "" }); setEditing(null); setShowForm(true); };
  const openEdit = (a) => { setForm({ title: a.title || "", link: a.link || "", cover_url: a.cover_url || "" }); setEditing(a.id); setShowForm(true); };

  const handleImageUpload = async (file) => {
    if (!file) return;
    setUploading(true);
    try {
      const { file_url } = await base44.integrations.Core.UploadPublicFile({ file });
      setForm(f => ({ ...f, cover_url: file_url }));
    } catch { alert("Error al subir la imagen"); }
    finally { setUploading(false); }
  };

  const save = async () => {
    if (!form.title.trim() || !form.link.trim()) return;
    setSaving(true);
    try {
      if (editing) {
        await base44.entities.GalleryAlbum.update(editing, form);
      } else {
        await base44.entities.GalleryAlbum.create(form);
      }
      setShowForm(false);
      load();
    } catch { alert("Error al guardar el álbum"); }
    finally { setSaving(false); }
  };

  const remove = async (id) => {
    if (!window.confirm("¿Eliminar este álbum?")) return;
    try { await base44.entities.GalleryAlbum.delete(id); load(); }
    catch { alert("Error al eliminar el álbum"); }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white" style={{ fontFamily: "'Playfair Display', serif" }}>Álbumes de Fotos</h2>
        <button onClick={openNew}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-white text-sm font-semibold transition-all"
          style={{ background: "linear-gradient(135deg,#FF0000,#ff1a35)" }}>
          <Plus size={16} /> Nuevo Álbum
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="mb-6 p-4 sm:p-6 rounded-2xl" style={{ background: "#111", border: "1px solid rgba(255,0,0,0.3)" }}>
          <h3 className="text-white font-semibold mb-4">{editing ? "Editar álbum" : "Nuevo álbum"}</h3>
          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="text-xs text-gray-400 uppercase tracking-wider block mb-1">Título *</label>
              <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                className="w-full px-4 py-2.5 rounded-xl text-white text-sm outline-none"
                style={{ background: "#1a1a1a", border: "1px solid #333" }}
                placeholder="Ej: Sábado 5 de Abril" />
            </div>
            <div>
              <label className="text-xs text-gray-400 uppercase tracking-wider block mb-1">Link del álbum *</label>
              <input value={form.link} onChange={e => setForm(f => ({ ...f, link: e.target.value }))}
                className="w-full px-4 py-2.5 rounded-xl text-white text-sm outline-none"
                style={{ background: "#1a1a1a", border: "1px solid #333" }}
                placeholder="https://drive.google.com/..." />
            </div>
          </div>
          <div className="mb-4">
            <label className="text-xs text-gray-400 uppercase tracking-wider block mb-1">Imagen de portada (opcional)</label>
            <label className="cursor-pointer block">
              <div className="flex items-center gap-4 p-4 rounded-xl border-2 border-dashed transition-colors"
                style={{ borderColor: form.cover_url ? "rgba(255,0,0,0.4)" : "#333", background: "#1a1a1a" }}>
                {form.cover_url ? (
                  <img src={form.cover_url} alt="portada" className="w-16 h-16 rounded-lg object-cover shrink-0" />
                ) : (
                  <div className="w-16 h-16 rounded-lg flex items-center justify-center shrink-0" style={{ background: "#222" }}>
                    <ImageIcon size={24} style={{ color: "#444" }} />
                  </div>
                )}
                <div>
                  <p className="text-white text-sm font-medium">{uploading ? "Subiendo..." : form.cover_url ? "Cambiar imagen" : "Subir imagen de portada"}</p>
                  <p className="text-gray-600 text-xs mt-0.5">JPG, PNG, WebP</p>
                </div>
                {uploading && <div className="w-5 h-5 rounded-full border-2 border-t-red-500 border-gray-700 animate-spin ml-auto" />}
              </div>
              <input type="file" accept="image/*" className="hidden"
                onChange={e => e.target.files?.[0] && handleImageUpload(e.target.files[0])} />
            </label>
            <ImageSizeHint size="600×600" ratio="1:1" note="formato cuadrado" />
          </div>
          <div className="flex gap-3">
            <button onClick={save} disabled={saving}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-white text-sm font-semibold"
              style={{ background: "#FF0000" }}>
              <Check size={15} /> {saving ? "Guardando..." : "Guardar"}
            </button>
            <button onClick={() => setShowForm(false)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-gray-400 hover:text-white"
              style={{ background: "#1a1a1a" }}>
              <X size={15} /> Cancelar
            </button>
          </div>
        </div>
      )}

      {/* List */}
      {loading ? (
        <div className="flex justify-center py-12"><div className="w-8 h-8 rounded-full border-2 border-t-red-500 border-gray-800 animate-spin"></div></div>
      ) : albums.length === 0 ? (
        <div className="text-center py-16 text-gray-600">No hay álbumes aún. ¡Creá el primero!</div>
      ) : (
        <div className="space-y-3">
          {albums.map(a => (
            <div key={a.id} className="flex items-center gap-2 sm:gap-4 p-3 sm:p-4 rounded-xl"
              style={{ background: "#111", border: "1px solid #222" }}>
              {a.cover_url ? (
                <img src={a.cover_url} alt={a.title} className="w-14 h-14 rounded-lg object-cover shrink-0" />
              ) : (
                <div className="w-14 h-14 rounded-lg shrink-0 flex items-center justify-center text-2xl"
                  style={{ background: "#1a1a1a" }}>📷</div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-white font-semibold truncate">{a.title}</p>
                <p className="text-gray-500 text-xs truncate mt-0.5">{a.link}</p>
              </div>
              <div className="flex items-center gap-1 sm:gap-2 shrink-0">
                <a href={safeHttpUrl(a.link) || undefined} target="_blank" rel="noopener noreferrer"
                  className="p-2 rounded-lg text-gray-400 hover:text-white transition-colors"
                  style={{ background: "#1a1a1a" }}>
                  <ExternalLink size={14} />
                </a>
                <button onClick={() => openEdit(a)}
                  className="p-2 rounded-lg text-gray-400 hover:text-white transition-colors"
                  style={{ background: "#1a1a1a" }}>
                  <Edit2 size={14} />
                </button>
                <button onClick={() => remove(a.id)}
                  className="p-2 rounded-lg text-red-500 hover:text-red-400 transition-colors"
                  style={{ background: "#1a1a1a" }}>
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}