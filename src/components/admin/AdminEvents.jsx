import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { uploadPublicFile } from "@/lib/uploadFile";
import { Plus, Pencil, Trash2, Star, StarOff, Upload, X } from "lucide-react";
import ImageSizeHint from "./ImageSizeHint";
import AdminSelect from "./AdminSelect";
import { format } from "date-fns";
import { es } from "date-fns/locale";

const emptyEvent = {
  title: "", date: "", description: "", genres: "", djs: "",
  flyer_url: "", background_url: "", video_url: "", status: "activo", is_featured: false
};

export default function AdminEvents() {
  const [events, setEvents] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyEvent);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [loadError, setLoadError] = useState(false);
  const [notice, setNotice] = useState("");

  const load = () => {
    setLoading(true);
    setLoadError(false);
    return base44.entities.Event.list("-date").then(d => setEvents(d)).catch(() => setLoadError(true)).finally(() => setLoading(false));
  };
  useEffect(() => { load(); }, []);

  const openNew = () => { setForm({ ...emptyEvent }); setEditing(null); setNotice(""); setShowForm(true); };
  const openEdit = (e) => { setForm({ title: e.title || "", date: e.date || "", description: e.description || "", genres: e.genres || "", djs: e.djs || "", flyer_url: e.flyer_url || "", background_url: e.background_url || "", video_url: e.video_url || "", status: e.status || "activo", is_featured: e.is_featured || false }); setEditing(e); setShowForm(true); };

  const [uploadingVideo, setUploadingVideo] = useState(false);

  const handleFlyer = async (file) => {
    setUploading(true);
    try {
      const file_url = await uploadPublicFile(file);
      setForm(f => ({ ...f, flyer_url: file_url }));
    } catch { alert("Error al subir el flyer"); }
    finally { setUploading(false); }
  };

  const handleVideo = async (file) => {
    setUploadingVideo(true);
    try {
      const file_url = await uploadPublicFile(file);
      setForm(f => ({ ...f, video_url: file_url }));
    } catch { alert("Error al subir el video"); }
    finally { setUploadingVideo(false); }
  };

  const [uploadingBg, setUploadingBg] = useState(false);
  const handleBackground = async (file) => {
    setUploadingBg(true);
    try {
      const file_url = await uploadPublicFile(file);
      setForm(f => ({ ...f, background_url: file_url }));
    } catch { alert("Error al subir la imagen de fondo"); }
    finally { setUploadingBg(false); }
  };

  const handleSave = async () => {
    if (saving || uploading || uploadingVideo || uploadingBg) return;
    if (!form.title.trim() || !form.date) {
      setNotice("Completá el nombre y la fecha del evento.");
      return;
    }
    const data = { ...form, title: form.title.trim() };
    setSaving(true);
    setNotice("");
    try {
      if (editing) {
        await base44.entities.Event.update(editing.id, data);
      } else {
        await base44.entities.Event.create(data);
      }
      setShowForm(false);
      setEditing(null);
      await load();
      setNotice(editing ? "Evento actualizado correctamente." : "Evento creado correctamente.");
    } catch {
      setNotice("No se pudo guardar el evento. Conservá el formulario e intentá nuevamente.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Eliminar este evento?")) return;
    try {
      await base44.entities.Event.delete(id);
      load();
    } catch { alert("Error al eliminar el evento"); }
  };

  const toggleFeatured = async (event) => {
    const next = !event.is_featured;
    // Optimista: cambia al instante, se revierte si falla
    setEvents(prev => prev.map(e => (e.id === event.id ? { ...e, is_featured: next } : e)));
    try {
      const updated = await base44.entities.Event.update(event.id, { is_featured: next });
      if (updated?.id) setEvents(prev => prev.map(e => (e.id === event.id ? { ...e, ...updated } : e)));
    } catch {
      setEvents(prev => prev.map(e => (e.id === event.id ? { ...e, is_featured: event.is_featured } : e)));
    }
  };

  return (
    <div className="admin-panel">
      {notice && <p role="status" className="mb-4 px-4 py-3 rounded-lg text-sm text-gray-100" style={{ background: "#212121", border: "1px solid #454545" }}>{notice}</p>}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white" style={{ fontFamily: "'Playfair Display', serif" }}>Eventos</h2>
        <button onClick={openNew}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold"
          style={{ background: "linear-gradient(135deg, #C9A84C 0%, #E8C97A 50%, #C9A84C 100%)", color: "#0A0A0A" }}>
          <Plus size={16} /> Nuevo Evento
        </button>
      </div>

      {/* FORM */}
      {showForm && (
        <div className="mb-8 p-4 sm:p-6 rounded-2xl" style={{ background: "#111", border: "1px solid #333" }}>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-white">{editing ? "Editar Evento" : "Nuevo Evento"}</h3>
            <button onClick={() => setShowForm(false)} className="text-gray-500 hover:text-white"><X size={18} /></button>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="text-xs text-gray-400 uppercase tracking-wider block mb-1">Nombre del evento *</label>
              <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl text-white text-sm outline-none"
                style={{ background: "#1a1a1a", border: "1px solid #333" }} placeholder="Ej: Noche Eléctrica" />
            </div>
            <div>
              <label className="text-xs text-gray-400 uppercase tracking-wider block mb-1">Fecha y hora *</label>
              <input type="datetime-local" value={form.date ? form.date.slice(0, 16) : ""} onChange={e => setForm({ ...form, date: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl text-white text-sm outline-none"
                style={{ background: "#1a1a1a", border: "1px solid #333", colorScheme: "dark" }} />
            </div>
            <div>
              <label className="text-xs text-gray-400 uppercase tracking-wider block mb-1">Estado</label>
              <AdminSelect
                value={form.status}
                onValueChange={(value) => setForm({ ...form, status: value })}
                options={[
                  { value: "activo", label: "Activo" },
                  { value: "agotado", label: "Agotado" },
                  { value: "cancelado", label: "Cancelado" },
                ]}
                className="py-2.5 rounded-xl"
                style={{ border: "1px solid #333" }}
              />
            </div>
            <div>
              <label className="text-xs text-gray-400 uppercase tracking-wider block mb-1">Géneros</label>
              <input value={form.genres} onChange={e => setForm({ ...form, genres: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl text-white text-sm outline-none"
                style={{ background: "#1a1a1a", border: "1px solid #333" }} placeholder="Reggaeton, Electrónica..." />
            </div>
            <div>
              <label className="text-xs text-gray-400 uppercase tracking-wider block mb-1">DJs / Artistas</label>
              <input value={form.djs} onChange={e => setForm({ ...form, djs: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl text-white text-sm outline-none"
                style={{ background: "#1a1a1a", border: "1px solid #333" }} placeholder="DJ 1, DJ 2..." />
            </div>
            <div className="md:col-span-2">
              <label className="text-xs text-gray-400 uppercase tracking-wider block mb-1">Descripción</label>
              <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}
                rows={3} className="w-full px-4 py-2.5 rounded-xl text-white text-sm outline-none resize-none"
                style={{ background: "#1a1a1a", border: "1px solid #333" }} placeholder="Descripción del evento..." />
            </div>
            {/* Flyer upload */}
            <div className="md:col-span-2">
              <label className="text-xs text-gray-400 uppercase tracking-wider block mb-2">Flyer (imagen)</label>
              <ImageSizeHint size="1080×1350" ratio="4:5" note="formato vertical" />
              <div className="flex items-start gap-4">
                <label className="cursor-pointer flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium"
                  style={{ border: "1px solid #C9A84C", color: "#C9A84C" }}>
                  <Upload size={14} />
                  {uploading ? "Subiendo..." : "Subir flyer"}
                  <input type="file" accept="image/*" className="hidden"
                    onChange={e => e.target.files[0] && handleFlyer(e.target.files[0])} />
                </label>
                {form.flyer_url && (
                  <div className="relative">
                    <img src={form.flyer_url} alt="flyer" className="h-20 rounded-lg object-cover" />
                    <button onClick={() => setForm({ ...form, flyer_url: "" })}
                      className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center text-xs">
                      <X size={10} />
                    </button>
                  </div>
                )}
              </div>
            </div>
            {/* Background image upload */}
            <div className="md:col-span-2">
              <label className="text-xs text-gray-400 uppercase tracking-wider block mb-2">Imagen de Fondo (Hero)</label>
              <ImageSizeHint size="1920×1080" ratio="16:9" note="formato horizontal · imagen de fondo del hero" />
              <p className="text-xs text-gray-600 mb-3">Se muestra como fondo del hero en el inicio. Si no se carga, se usa el flyer como respaldo.</p>
              <div className="flex items-start gap-4">
                <label className="cursor-pointer flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium"
                  style={{ border: "1px solid #FF0000", color: "#FF0000" }}>
                  <Upload size={14} />
                  {uploadingBg ? "Subiendo..." : form.background_url ? "Cambiar fondo" : "Subir fondo"}
                  <input type="file" accept="image/*" className="hidden"
                    onChange={e => e.target.files[0] && handleBackground(e.target.files[0])} />
                </label>
                {form.background_url && (
                  <div className="relative">
                    <img src={form.background_url} alt="background" className="h-20 w-32 rounded-lg object-cover" />
                    <button onClick={() => setForm({ ...form, background_url: "" })}
                      className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center text-xs">
                      <X size={10} />
                    </button>
                  </div>
                )}
              </div>
            </div>
            {/* Video flyer upload */}
            <div className="md:col-span-2">
              <label className="text-xs text-gray-400 uppercase tracking-wider block mb-2">Flyer en Video (opcional)</label>
              <ImageSizeHint size="1080×1920" ratio="9:16" note="formato vertical · máx. 10MB" />
              <div className="flex items-start gap-4">
                <label className="cursor-pointer flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium"
                  style={{ border: "1px solid #FF0000", color: "#FF0000" }}>
                  <Upload size={14} />
                  {uploadingVideo ? "Subiendo..." : "Subir video"}
                  <input type="file" accept="video/*" className="hidden"
                    onChange={e => e.target.files[0] && handleVideo(e.target.files[0])} />
                </label>
                {form.video_url && (
                  <div className="relative">
                    <video src={form.video_url} className="h-20 rounded-lg object-cover" muted />
                    <button onClick={() => setForm({ ...form, video_url: "" })}
                      className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center text-xs">
                      <X size={10} />
                    </button>
                  </div>
                )}
              </div>
              {form.video_url && <p className="text-xs text-gray-600 mt-1">✓ Video cargado — se mostrará en lugar de la imagen</p>}
            </div>
            <div className="md:col-span-2 flex items-center gap-3">
              <input type="checkbox" id="featured" checked={form.is_featured} onChange={e => setForm({ ...form, is_featured: e.target.checked })}
                className="w-4 h-4" />
              <label htmlFor="featured" className="text-sm text-gray-300">Evento destacado (aparece en hero)</label>
            </div>
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <button onClick={() => setShowForm(false)} className="px-5 py-2 rounded-xl text-gray-400 text-sm"
              style={{ border: "1px solid #333" }}>Cancelar</button>
            <button onClick={handleSave} disabled={saving || uploading || uploadingBg || uploadingVideo || !form.title.trim() || !form.date}
              className="px-6 py-2 rounded-xl text-sm font-semibold"
              style={{ background: "linear-gradient(135deg, #C9A84C 0%, #E8C97A 50%, #C9A84C 100%)", color: "#0A0A0A" }}>
              {saving ? "Guardando..." : editing ? "Guardar cambios" : "Crear evento"}
            </button>
          </div>
        </div>
      )}

      {/* LIST */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 rounded-full border-2 border-t-yellow-500 border-gray-800 animate-spin"></div>
        </div>
      ) : loadError ? (
        <div role="alert" className="text-center py-10 text-gray-300">
          <p>No se pudieron cargar los eventos.</p>
          <button className="mt-4 px-4 py-2 rounded-lg border border-gray-600" onClick={load}>Reintentar</button>
        </div>
      ) : events.length === 0 ? (
        <div className="text-center py-16 text-gray-500">No hay eventos aún. ¡Crea el primero!</div>
      ) : (
        <div className="space-y-3">
          {events.map(event => (
            <div key={event.id} className="flex items-center gap-2 sm:gap-4 p-3 sm:p-4 rounded-xl"
              style={{ background: "#111", border: "1px solid #222" }}>
              {event.flyer_url && (
                <img src={event.flyer_url} alt={event.title} className="w-12 h-16 object-cover rounded-lg flex-shrink-0" />
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h4 className="text-white font-semibold truncate">{event.title}</h4>
                  {event.is_featured && <span className="text-xs px-2 py-0.5 rounded" style={{ background: "rgba(201,168,76,0.2)", color: "#C9A84C" }}>Destacado</span>}
                  <span className={`text-xs px-2 py-0.5 rounded capitalize ${event.status === "activo" ? "bg-green-900/30 text-green-400" : event.status === "agotado" ? "bg-red-900/30 text-red-300" : "bg-gray-900/30 text-gray-400"}`}>
                    {event.status}
                  </span>
                </div>
                <p className="text-gray-500 text-sm mt-0.5">
                  {event.date ? format(new Date(event.date), "d MMM yyyy HH:mm", { locale: es }) : ""}
                </p>
              </div>
              <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
                <button onClick={() => toggleFeatured(event)} className="p-2 min-w-[44px] min-h-[44px] md:min-w-0 md:min-h-0 rounded-lg hover:bg-gray-800 transition-colors"
                  title={event.is_featured ? "Quitar destacado" : "Destacar"}>
                  {event.is_featured ? <Star size={15} style={{ color: "#C9A84C" }} /> : <StarOff size={15} className="text-gray-600" />}
                </button>
                <button onClick={() => openEdit(event)} className="p-2 min-w-[44px] min-h-[44px] md:min-w-0 md:min-h-0 rounded-lg hover:bg-gray-800 text-gray-400 hover:text-white transition-colors">
                  <Pencil size={15} />
                </button>
                <button onClick={() => handleDelete(event.id)} className="p-2 min-w-[44px] min-h-[44px] md:min-w-0 md:min-h-0 rounded-lg hover:bg-red-900/30 text-gray-600 hover:text-red-300 transition-colors">
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}