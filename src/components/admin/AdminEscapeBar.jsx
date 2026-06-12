import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Plus, Trash2, Star, StarOff, Upload, Loader2 } from "lucide-react";

export default function AdminEscapeBar() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({ title: "", date: "", description: "", promo: "", photo_url: "", is_featured: false });

  const load = () => base44.entities.EscapeBarEvent.list("-date").then(d => { setEvents(d); setLoading(false); });

  useEffect(() => { load(); }, []);

  const handlePhoto = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    const { file_url } = await base44.integrations.Core.UploadFile({ file });
    setForm(f => ({ ...f, photo_url: file_url }));
    setUploading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await base44.entities.EscapeBarEvent.create(form);
    setForm({ title: "", date: "", description: "", promo: "", photo_url: "", is_featured: false });
    setShowForm(false);
    load();
  };

  const handleDelete = async (id) => {
    if (!confirm("¿Eliminar este evento?")) return;
    await base44.entities.EscapeBarEvent.delete(id);
    load();
  };

  const toggleFeatured = async (ev) => {
    await base44.entities.EscapeBarEvent.update(ev.id, { is_featured: !ev.is_featured });
    load();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-white" style={{ fontFamily: "'Playfair Display', serif" }}>
          🍹 Escape Bar — Eventos y Novedades
        </h2>
        <button onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all"
          style={{ background: "linear-gradient(135deg, #C9A84C, #E8C97A)", color: "#050303" }}>
          <Plus size={16} /> Nuevo Evento
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit}
          className="rounded-xl p-6 mb-6 space-y-4"
          style={{ background: "#0f0f0f", border: "1px solid rgba(201,168,76,0.3)" }}>
          <h3 className="text-white font-bold mb-2">Nuevo evento Escape Bar</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-gray-400 uppercase tracking-wider block mb-1">Título *</label>
              <input required value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                className="w-full rounded-lg px-3 py-2 text-white text-sm"
                style={{ background: "#1a1a1a", border: "1px solid #333" }}
                placeholder="Ej: Noche de Cócteles Tropicales" />
            </div>
            <div>
              <label className="text-xs text-gray-400 uppercase tracking-wider block mb-1">Fecha *</label>
              <input required type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
                className="w-full rounded-lg px-3 py-2 text-white text-sm"
                style={{ background: "#1a1a1a", border: "1px solid #333" }} />
            </div>
          </div>
          <div>
            <label className="text-xs text-gray-400 uppercase tracking-wider block mb-1">Promoción</label>
            <input value={form.promo} onChange={e => setForm(f => ({ ...f, promo: e.target.value }))}
              className="w-full rounded-lg px-3 py-2 text-white text-sm"
              style={{ background: "#1a1a1a", border: "1px solid #333" }}
              placeholder="Ej: 2x1 en tragos toda la noche" />
          </div>
          <div>
            <label className="text-xs text-gray-400 uppercase tracking-wider block mb-1">Descripción</label>
            <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
              rows={3}
              className="w-full rounded-lg px-3 py-2 text-white text-sm resize-none"
              style={{ background: "#1a1a1a", border: "1px solid #333" }}
              placeholder="Descripción del evento..." />
          </div>
          <div>
            <label className="text-xs text-gray-400 uppercase tracking-wider block mb-1">Foto del evento</label>
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2 px-4 py-2 rounded-lg cursor-pointer text-sm font-bold transition-all"
                style={{ background: "#1a1a1a", border: "1px solid #333", color: "#C9A84C" }}>
                {uploading ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
                {uploading ? "Subiendo..." : "Subir foto"}
                <input type="file" accept="image/*" onChange={handlePhoto} className="hidden" />
              </label>
              {form.photo_url && (
                <img src={form.photo_url} alt="preview" className="h-12 w-20 object-cover rounded-lg" />
              )}
            </div>
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={form.is_featured}
              onChange={e => setForm(f => ({ ...f, is_featured: e.target.checked }))}
              className="w-4 h-4 rounded" />
            <span className="text-sm text-gray-300">Destacar este evento (aparece primero y grande)</span>
          </label>
          <div className="flex gap-3">
            <button type="submit" className="px-6 py-2 rounded-lg text-sm font-black uppercase tracking-widest transition-all"
              style={{ background: "linear-gradient(135deg, #C9A84C, #E8C97A)", color: "#050303" }}>
              Publicar
            </button>
            <button type="button" onClick={() => setShowForm(false)}
              className="px-6 py-2 rounded-lg text-sm font-bold text-gray-400 hover:text-white transition-colors"
              style={{ background: "#1a1a1a" }}>
              Cancelar
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 rounded-full animate-spin"
            style={{ border: "2px solid #222", borderTop: "2px solid #C9A84C" }} />
        </div>
      ) : events.length === 0 ? (
        <div className="text-center py-16 text-gray-600">
          <p>No hay eventos publicados aún.</p>
          <p className="text-sm mt-1">Hacé clic en "Nuevo Evento" para agregar el primero.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {events.map(ev => (
            <div key={ev.id} className="flex items-center gap-4 rounded-xl p-4"
              style={{ background: "#0f0f0f", border: ev.is_featured ? "1px solid rgba(201,168,76,0.4)" : "1px solid #1e1e1e" }}>
              {ev.photo_url && (
                <img src={ev.photo_url} alt={ev.title} className="w-16 h-16 object-cover rounded-lg flex-shrink-0" />
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  {ev.is_featured && (
                    <span className="text-xs px-2 py-0.5 rounded font-bold"
                      style={{ background: "linear-gradient(135deg, #C9A84C, #E8C97A)", color: "#050303" }}>
                      Destacado
                    </span>
                  )}
                  <h4 className="text-white font-bold truncate">{ev.title}</h4>
                </div>
                <p className="text-xs text-gray-500 mt-0.5">Viernes {ev.date}</p>
                {ev.promo && <p className="text-xs mt-0.5" style={{ color: "#E8C97A" }}>🏷 {ev.promo}</p>}
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <button onClick={() => toggleFeatured(ev)}
                  title={ev.is_featured ? "Quitar destacado" : "Destacar"}
                  className="p-2 rounded-lg transition-colors hover:bg-white/5">
                  {ev.is_featured
                    ? <StarOff size={16} style={{ color: "#C9A84C" }} />
                    : <Star size={16} className="text-gray-600 hover:text-yellow-500" />}
                </button>
                <button onClick={() => handleDelete(ev.id)}
                  className="p-2 rounded-lg transition-colors hover:bg-red-500/10">
                  <Trash2 size={16} className="text-gray-600 hover:text-red-400" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}