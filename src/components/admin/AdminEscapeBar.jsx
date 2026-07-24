import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Plus, Trash2, Star, StarOff, Upload, Loader2, Eye, EyeOff, Pencil, X, Check, ImagePlus } from "lucide-react";
import ImageSizeHint from "./ImageSizeHint";
import { format } from "date-fns";
import { es } from "date-fns/locale";

const emptyForm = { title: "", date: "", description: "", promo: "", photo_url: "", is_featured: false, is_hidden: false };

const HEADER_KEY = "escapebar_header_image";
const DEFAULT_HEADER = "https://media.base44.com/images/public/69ad4033370fdc9f9fe8b117/e19167309_file_000000007dd0720eaf818bd4d5f39d02.png";

export default function AdminEscapeBar() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [showHidden, setShowHidden] = useState(false);
  const [headerImg, setHeaderImg] = useState(DEFAULT_HEADER);
  const [headerConfigId, setHeaderConfigId] = useState(null);
  const [uploadingHeader, setUploadingHeader] = useState(false);
  const [headerSaved, setHeaderSaved] = useState(false);

  const loadHeader = () => {
    base44.entities.SiteConfig.filter({ key: HEADER_KEY }).then(res => {
      if (res[0]) { setHeaderImg(res[0].value || DEFAULT_HEADER); setHeaderConfigId(res[0].id); }
    }).catch(() => {});
  };
  useEffect(() => { loadHeader(); }, []);

  const handleHeaderUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploadingHeader(true);
    try {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      setHeaderImg(file_url);
      await saveHeaderImage(file_url);
    } catch { alert("Error al subir la imagen"); }
    finally { setUploadingHeader(false); }
  };

  const saveHeaderImage = async (url) => {
    try {
      if (headerConfigId) {
        await base44.entities.SiteConfig.update(headerConfigId, { value: url });
      } else {
        const created = await base44.entities.SiteConfig.create({ key: HEADER_KEY, value: url, description: "Imagen de fondo del header de Escape Bar (banner Open Stage)" });
        setHeaderConfigId(created.id);
      }
      setHeaderSaved(true);
      setTimeout(() => setHeaderSaved(false), 2000);
    } catch { alert("Error al guardar la imagen de header"); }
  };

  const resetHeader = async () => {
    if (!confirm("¿Restaurar la imagen por defecto?")) return;
    setHeaderImg(DEFAULT_HEADER);
    if (headerConfigId) {
      try { await base44.entities.SiteConfig.update(headerConfigId, { value: DEFAULT_HEADER }); } catch { /* silent */ }
    }
  };

  const load = () => base44.entities.EscapeBarEvent.list("-date").then(d => { setEvents(d); }).catch(() => {}).finally(() => setLoading(false));
  useEffect(() => { load(); }, []);

  const handlePhoto = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      setForm(f => ({ ...f, photo_url: file_url }));
    } catch { alert("Error al subir la foto"); }
    finally { setUploading(false); }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await base44.entities.EscapeBarEvent.create(form);
      setForm(emptyForm);
      setShowForm(false);
      load();
    } catch { alert("Error al crear el evento"); }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await base44.entities.EscapeBarEvent.update(editingId, form);
      setEditingId(null);
      setForm(emptyForm);
      load();
    } catch { alert("Error al guardar los cambios"); }
  };

  const startEdit = (ev) => {
    setEditingId(ev.id);
    setForm({ title: ev.title, date: ev.date, description: ev.description || "", promo: ev.promo || "", photo_url: ev.photo_url || "", is_featured: ev.is_featured || false, is_hidden: ev.is_hidden || false });
    setShowForm(false);
  };

  const cancelEdit = () => { setEditingId(null); setForm(emptyForm); };

  const handleDelete = async (id) => {
    if (!confirm("¿Eliminar este evento?")) return;
    try { await base44.entities.EscapeBarEvent.delete(id); load(); }
    catch { alert("Error al eliminar el evento"); }
  };

  const toggleField = async (ev, field) => {
    try { await base44.entities.EscapeBarEvent.update(ev.id, { [field]: !ev[field] }); load(); }
    catch { /* silent */ }
  };

  const visible = events.filter(e => !e.is_hidden);
  const hidden = events.filter(e => e.is_hidden);
  const displayed = showHidden ? events : visible;

  const FormFields = ({ onSubmit, submitLabel, onCancel }) => (
    <form onSubmit={onSubmit} className="rounded-xl p-4 sm:p-5 mb-5 space-y-4"
      style={{ background: "#0f0f0f", border: "1px solid rgba(201,168,76,0.3)" }}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-xs text-gray-400 uppercase tracking-wider block mb-1">Título *</label>
          <input required value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
            className="w-full rounded-lg px-3 py-2 text-white text-sm" style={{ background: "#1a1a1a", border: "1px solid #333" }}
            placeholder="Ej: Noche de Cócteles Tropicales" />
        </div>
        <div>
          <label className="text-xs text-gray-400 uppercase tracking-wider block mb-1">Fecha *</label>
          <input required type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
            className="w-full rounded-lg px-3 py-2 text-white text-sm" style={{ background: "#1a1a1a", border: "1px solid #333" }} />
        </div>
      </div>
      <div>
        <label className="text-xs text-gray-400 uppercase tracking-wider block mb-1">Promoción</label>
        <input value={form.promo} onChange={e => setForm(f => ({ ...f, promo: e.target.value }))}
          className="w-full rounded-lg px-3 py-2 text-white text-sm" style={{ background: "#1a1a1a", border: "1px solid #333" }}
          placeholder="Ej: 2x1 en tragos toda la noche" />
      </div>
      <div>
        <label className="text-xs text-gray-400 uppercase tracking-wider block mb-1">Descripción</label>
        <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
          rows={3} className="w-full rounded-lg px-3 py-2 text-white text-sm resize-none"
          style={{ background: "#1a1a1a", border: "1px solid #333" }}
          placeholder="Descripción del evento..." />
      </div>
      <div>
        <label className="text-xs text-gray-400 uppercase tracking-wider block mb-1">Foto del evento</label>
        <ImageSizeHint size="1200×675" ratio="16:9" note="formato horizontal" />
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 px-4 py-2 rounded-lg cursor-pointer text-sm font-bold"
            style={{ background: "#1a1a1a", border: "1px solid #333", color: "#C9A84C" }}>
            {uploading ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
            {uploading ? "Subiendo..." : "Subir foto"}
            <input type="file" accept="image/*" onChange={handlePhoto} className="hidden" />
          </label>
          {form.photo_url && <img src={form.photo_url} alt="preview" className="h-12 w-20 object-cover rounded-lg" />}
        </div>
      </div>
      <div className="flex flex-wrap gap-4">
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" checked={form.is_featured} onChange={e => setForm(f => ({ ...f, is_featured: e.target.checked }))} className="w-4 h-4 rounded" />
          <span className="text-sm text-gray-300">Destacado</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" checked={form.is_hidden} onChange={e => setForm(f => ({ ...f, is_hidden: e.target.checked }))} className="w-4 h-4 rounded" />
          <span className="text-sm text-gray-300">Oculto (no aparece en el sitio)</span>
        </label>
      </div>
      <div className="flex gap-3">
        <button type="submit" className="px-6 py-2 rounded-lg text-sm font-black uppercase tracking-widest"
          style={{ background: "linear-gradient(135deg, #C9A84C, #E8C97A)", color: "#050303" }}>
          {submitLabel}
        </button>
        <button type="button" onClick={onCancel} className="px-6 py-2 rounded-lg text-sm font-bold text-gray-400 hover:text-white"
          style={{ background: "#1a1a1a" }}>
          Cancelar
        </button>
      </div>
    </form>
  );

  return (
    <div>
      {/* IMAGEN DE HEADER — BANNER OPEN STAGE */}
      <div className="rounded-xl p-4 sm:p-5 mb-6"
        style={{ background: "#0f0f0f", border: "1px solid rgba(201,168,76,0.3)" }}>
        <div className="flex items-center gap-2 mb-3">
          <ImagePlus size={18} style={{ color: "#C9A84C" }} />
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">Imagen de Header — Escape Bar</h3>
        </div>
        <p className="text-xs text-gray-500 mb-3">Esta imagen aparece como banner principal arriba de todo en la página de Escape Bar.</p>
        <ImageSizeHint size="1200×675 px" ratio="16:9" note="Formato horizontal/apaisado. La imagen se muestra completa en móvil sin recortes." />
        <div className="flex flex-col sm:flex-row gap-4 mt-3">
          <div className="relative rounded-lg overflow-hidden flex-shrink-0" style={{ width: "160px", height: "120px", border: "1px solid #333" }}>
            <img src={headerImg} alt="Header preview" className="w-full h-full object-cover" />
          </div>
          <div className="flex flex-col gap-2 justify-center">
            <label className="flex items-center gap-2 px-4 py-2 rounded-lg cursor-pointer text-sm font-bold w-fit"
              style={{ background: "linear-gradient(135deg, #C9A84C, #E8C97A)", color: "#050303" }}>
              {uploadingHeader ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
              {uploadingHeader ? "Subiendo..." : "Subir / Cambiar imagen"}
              <input type="file" accept="image/*" onChange={handleHeaderUpload} className="hidden" />
            </label>
            <button onClick={resetHeader} className="text-xs text-gray-500 hover:text-gray-300 transition-colors w-fit">Restaurar imagen por defecto</button>
            {headerSaved && <span className="text-xs flex items-center gap-1" style={{ color: "#22c55e" }}><Check size={12} /> Imagen guardada</span>}
          </div>
        </div>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
        <div>
          <h2 className="text-xl font-bold text-white" style={{ fontFamily: "'Playfair Display', serif" }}>
            🍹 Escape Bar — Viernes
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">{visible.length} visibles · {hidden.length} ocultos</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setShowHidden(s => !s)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-colors"
            style={{ background: showHidden ? "rgba(201,168,76,0.15)" : "#1a1a1a", color: showHidden ? "#C9A84C" : "#666", border: "1px solid #2a2a2a" }}>
            {showHidden ? <Eye size={13} /> : <EyeOff size={13} />}
            {showHidden ? "Mostrando ocultos" : "Ver ocultos"}
          </button>
          <button onClick={() => { setShowForm(s => !s); setEditingId(null); setForm(emptyForm); }}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold"
            style={{ background: "linear-gradient(135deg, #C9A84C, #E8C97A)", color: "#050303" }}>
            <Plus size={16} /> Nuevo
          </button>
        </div>
      </div>

      {/* Create form */}
      {showForm && FormFields({ onSubmit: handleCreate, submitLabel: "Publicar", onCancel: () => { setShowForm(false); setForm(emptyForm); } })}

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 rounded-full animate-spin" style={{ border: "2px solid #222", borderTop: "2px solid #C9A84C" }} />
        </div>
      ) : displayed.length === 0 ? (
        <div className="text-center py-16 text-gray-600 text-sm">
          {showHidden ? "No hay eventos ocultos." : "No hay eventos publicados aún."}
        </div>
      ) : (
        <div className="space-y-3">
          {displayed.map(ev => (
            <div key={ev.id}>
              {editingId === ev.id ? (
                FormFields({ onSubmit: handleUpdate, submitLabel: "Guardar cambios", onCancel: cancelEdit })
              ) : (
                <div className="rounded-xl overflow-hidden"
                  style={{
                    background: "#0f0f0f",
                    border: ev.is_featured ? "1px solid rgba(201,168,76,0.45)" : "1px solid #1e1e1e",
                    opacity: ev.is_hidden ? 0.5 : 1,
                  }}>
                  <div className="flex items-center gap-2 sm:gap-3 p-2.5 sm:p-3">
                    {ev.photo_url ? (
                      <img src={ev.photo_url} alt={ev.title} className="w-12 h-12 sm:w-14 sm:h-14 object-cover rounded-lg flex-shrink-0" />
                    ) : (
                      <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-lg flex-shrink-0 flex items-center justify-center text-2xl"
                        style={{ background: "#1a1a1a" }}>🍹</div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-0.5">
                        {ev.is_featured && (
                          <span className="text-xs px-1.5 py-0.5 rounded font-bold" style={{ background: "linear-gradient(135deg, #C9A84C, #E8C97A)", color: "#050303" }}>⭐ Destacado</span>
                        )}
                        {ev.is_hidden && (
                          <span className="text-xs px-1.5 py-0.5 rounded font-bold" style={{ background: "#2a2a2a", color: "#666" }}>Oculto</span>
                        )}
                        <h4 className="text-white font-bold text-sm truncate">{ev.title}</h4>
                      </div>
                      <p className="text-xs text-gray-500">
                        {(() => { try { return format(new Date(ev.date + "T12:00:00"), "EEEE d 'de' MMMM yyyy", { locale: es }); } catch { return ev.date; } })()}
                      </p>
                      {ev.promo && <p className="text-xs mt-0.5" style={{ color: "#E8C97A" }}>🏷 {ev.promo}</p>}
                    </div>
                    {/* Actions */}
                    <div className="flex items-center gap-0.5 sm:gap-1 flex-shrink-0">
                      <button onClick={() => toggleField(ev, "is_featured")} title={ev.is_featured ? "Quitar destacado" : "Destacar"}
                        className="p-1.5 rounded-lg hover:bg-white/5 transition-colors">
                        {ev.is_featured ? <StarOff size={15} style={{ color: "#C9A84C" }} /> : <Star size={15} className="text-gray-600" />}
                      </button>
                      <button onClick={() => toggleField(ev, "is_hidden")} title={ev.is_hidden ? "Mostrar" : "Ocultar"}
                        className="p-1.5 rounded-lg hover:bg-white/5 transition-colors">
                        {ev.is_hidden ? <Eye size={15} className="text-gray-600" /> : <EyeOff size={15} className="text-gray-600" />}
                      </button>
                      <button onClick={() => startEdit(ev)} title="Editar"
                        className="p-1.5 rounded-lg hover:bg-white/5 transition-colors">
                        <Pencil size={15} className="text-gray-600" />
                      </button>
                      <button onClick={() => handleDelete(ev.id)} title="Eliminar"
                        className="p-1.5 rounded-lg hover:bg-red-400/10 transition-colors">
                        <Trash2 size={15} className="text-gray-600" />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}