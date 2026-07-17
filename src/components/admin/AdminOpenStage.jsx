import { useState, useEffect, useMemo } from "react";
import { base44 } from "@/api/base44Client";
import { Search, Star, StarOff, ExternalLink, Download, Mail, MessageCircle, X, Filter, RefreshCw } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

const STATUSES = [
  { value: "nueva", label: "Nueva", color: "#75AADB" },
  { value: "pendiente_revision", label: "Pendiente de revisión", color: "#C9A84C" },
  { value: "material_incompleto", label: "Material incompleto", color: "#ef4444" },
  { value: "en_evaluacion", label: "En evaluación", color: "#8888FF" },
  { value: "preseleccionada", label: "Preseleccionada", color: "#a855f7" },
  { value: "contactada", label: "Contactada", color: "#22d3ee" },
  { value: "entrevista", label: "Entrevista / Reunión", color: "#f59e0b" },
  { value: "fecha_propuesta", label: "Fecha propuesta", color: "#3b82f6" },
  { value: "confirmada", label: "Confirmada", color: "#22c55e" },
  { value: "en_espera", label: "En espera", color: "#6b7280" },
  { value: "no_seleccionada", label: "No seleccionada", color: "#555" },
  { value: "presentacion_realizada", label: "Presentación realizada", color: "#10b981" },
  { value: "cancelada", label: "Cancelada", color: "#dc2626" },
];

const STATUS_MAP = Object.fromEntries(STATUSES.map(s => [s.value, s]));

const PROJECT_TYPES = ["solista", "duo", "banda", "dj", "productor", "instrumentista", "otro"];

function StatCard({ label, value, color }) {
  return (
    <div className="p-3 rounded-xl text-center" style={{ background: "#111", border: "1px solid #222" }}>
      <div className="text-xl md:text-2xl font-bold truncate" style={{ color }}>{value}</div>
      <div className="text-xs text-gray-500 mt-0.5">{label}</div>
    </div>
  );
}

export default function AdminOpenStage() {
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [cityFilter, setCityFilter] = useState("");
  const [selected, setSelected] = useState(null);
  const [saving, setSaving] = useState(false);

  const load = () => {
    setLoading(true);
    base44.entities.ArtistApplication.list("-created_date").then(setApps).catch(() => {}).finally(() => setLoading(false));
  };
  useEffect(() => { load(); }, []);

  const cities = useMemo(() => [...new Set(apps.map(a => a.city).filter(Boolean))].sort(), [apps]);

  const filtered = apps.filter(a => {
    if (search && !`${a.artistic_name} ${a.contact_name} ${a.email} ${a.musical_genre}`.toLowerCase().includes(search.toLowerCase())) return false;
    if (statusFilter && a.status !== statusFilter) return false;
    if (typeFilter && a.project_type !== typeFilter) return false;
    if (cityFilter && a.city !== cityFilter) return false;
    return true;
  });

  // Detect duplicates (same email or artistic_name)
  const dupKeys = useMemo(() => {
    const seen = {};
    const dups = new Set();
    apps.forEach(a => {
      [a.email, a.artistic_name?.toLowerCase()].forEach(k => {
        if (!k) return;
        if (seen[k]) dups.add(a.id);
        else seen[k] = true;
      });
    });
    return dups;
  }, [apps]);

  const stats = {
    total: apps.length,
    nuevas: apps.filter(a => a.status === "nueva").length,
    pendientes: apps.filter(a => a.status === "pendiente_revision").length,
    preseleccionadas: apps.filter(a => a.status === "preseleccionada").length,
    confirmadas: apps.filter(a => a.status === "confirmada").length,
    realizadas: apps.filter(a => a.status === "presentacion_realizada").length,
  };

  const updateApp = async (id, data) => {
    setSaving(true);
    try {
      await base44.entities.ArtistApplication.update(id, data);
      setApps(prev => prev.map(a => a.id === id ? { ...a, ...data } : a));
      setSelected(s => s && s.id === id ? { ...s, ...data } : s);
    } catch { alert("Error al guardar"); }
    finally { setSaving(false); }
  };

  const exportCSV = () => {
    const headers = ["artistic_name", "contact_name", "email", "whatsapp", "city", "province", "project_type", "musical_genre", "member_count", "status", "created_date"];
    const rows = filtered.map(a => headers.map(h => `"${(a[h] ?? "").toString().replace(/"/g, '""')}"`).join(","));
    const csv = [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `postulaciones_open_stage_${format(new Date(), "dd-MM-yyyy")}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const links = (a) => [
    { label: "Instagram", url: a.instagram_url },
    { label: "Spotify", url: a.spotify_url },
    { label: "YouTube", url: a.youtube_url },
    { label: "SoundCloud", url: a.soundcloud_url },
    { label: "TikTok", url: a.tiktok_url },
    { label: "Web", url: a.website_url },
    { label: "Video en vivo", url: a.live_video_url },
    { label: "Drive", url: a.drive_folder_url },
  ].filter(l => l.url);

  const files = (a) => [
    { label: "Fotos", url: a.profile_images },
    { label: "Press kit", url: a.press_kit_file },
    { label: "Rider técnico", url: a.technical_rider_file },
  ].filter(f => f.url);

  return (
    <div>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h2 className="text-xl font-bold text-white" style={{ fontFamily: "'Playfair Display', serif" }}>Open Stage — Postulaciones</h2>
          <p className="text-xs text-gray-500 mt-0.5">{filtered.length} de {apps.length} postulaciones</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={exportCSV} className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold text-gray-300 transition-colors" style={{ background: "#111", border: "1px solid #2a2a2a" }}>
            <Download size={13} /> Exportar CSV
          </button>
          <button onClick={load} className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs text-gray-500 hover:text-white transition-colors" style={{ background: "#111", border: "1px solid #2a2a2a" }}>
            <RefreshCw size={13} /> Actualizar
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 md:grid-cols-6 gap-2 mb-6">
        <StatCard label="Total" value={stats.total} color="#fff" />
        <StatCard label="Nuevas" value={stats.nuevas} color="#75AADB" />
        <StatCard label="Pendientes" value={stats.pendientes} color="#C9A84C" />
        <StatCard label="Preselec." value={stats.preseleccionadas} color="#a855f7" />
        <StatCard label="Confirm." value={stats.confirmadas} color="#22c55e" />
        <StatCard label="Realizadas" value={stats.realizadas} color="#10b981" />
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-2 mb-5">
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar por nombre, género..."
            className="w-full pl-9 pr-3 py-2 rounded-lg text-sm text-white outline-none" style={{ background: "#111", border: "1px solid #2a2a2a" }} />
        </div>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="px-3 py-2 rounded-lg text-sm text-white outline-none" style={{ background: "#111", border: "1px solid #2a2a2a" }}>
          <option value="">Todos los estados</option>
          {STATUSES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
        </select>
        <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)} className="px-3 py-2 rounded-lg text-sm text-white outline-none capitalize" style={{ background: "#111", border: "1px solid #2a2a2a" }}>
          <option value="">Todos los tipos</option>
          {PROJECT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
        <select value={cityFilter} onChange={e => setCityFilter(e.target.value)} className="px-3 py-2 rounded-lg text-sm text-white outline-none" style={{ background: "#111", border: "1px solid #2a2a2a" }}>
          <option value="">Todas las ciudades</option>
          {cities.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      {/* List */}
      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 rounded-full animate-spin" style={{ border: "2px solid #1a1a1a", borderTop: "2px solid #75AADB" }} />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-600">
          <Filter size={32} className="mx-auto mb-3 opacity-30" />
          <p className="text-sm">No hay postulaciones que coincidan con los filtros.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map(a => {
            const st = STATUS_MAP[a.status] || STATUS_MAP.nueva;
            const isDup = dupKeys.has(a.id);
            return (
              <div key={a.id} className="flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all hover:bg-white/5"
                style={{ background: "#111", border: `1px solid ${a.is_favorite ? "rgba(201,168,76,0.3)" : "#1e1e1e"}` }}
                onClick={() => setSelected(a)}>
                <button onClick={(e) => { e.stopPropagation(); updateApp(a.id, { is_favorite: !a.is_favorite }); }}
                  className="shrink-0 text-gray-600 hover:text-yellow-400 transition-colors">
                  {a.is_favorite ? <Star size={16} fill="#C9A84C" style={{ color: "#C9A84C" }} /> : <StarOff size={16} />}
                </button>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-white font-semibold text-sm truncate">{a.artistic_name}</span>
                    {isDup && <span className="text-xs px-1.5 py-0.5 rounded font-bold" style={{ background: "rgba(239,68,68,0.15)", color: "#ef4444" }}>DUP</span>}
                  </div>
                  <p className="text-xs text-gray-500 truncate">{a.contact_name} · {a.musical_genre} · {a.city}</p>
                </div>
                <span className="text-xs px-2 py-1 rounded-full shrink-0 font-medium" style={{ background: `${st.color}15`, color: st.color, border: `1px solid ${st.color}33` }}>
                  {st.label}
                </span>
                <span className="text-xs text-gray-600 shrink-0 hidden sm:block">
                  {a.created_date ? format(new Date(a.created_date), "d MMM", { locale: es }) : ""}
                </span>
              </div>
            );
          })}
        </div>
      )}

      {/* Detail modal */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-4 overflow-y-auto" style={{ background: "rgba(0,0,0,0.85)" }} onClick={() => setSelected(null)}>
          <div className="w-full max-w-3xl rounded-2xl my-8" style={{ background: "#0d0d0d", border: "1px solid #2a2a2a" }} onClick={e => e.stopPropagation()}>
            {/* Modal header */}
            <div className="flex items-start justify-between p-5 border-b" style={{ borderColor: "#1a1a1a" }}>
              <div className="min-w-0">
                <h3 className="text-xl font-bold text-white" style={{ fontFamily: "'Playfair Display', serif" }}>{selected.artistic_name}</h3>
                <p className="text-sm text-gray-500">{selected.contact_name} · {selected.email}</p>
              </div>
              <button onClick={() => setSelected(null)} className="text-gray-500 hover:text-white shrink-0 ml-3"><X size={20} /></button>
            </div>

            <div className="p-5 space-y-5 max-h-[70vh] overflow-y-auto">
              {/* Status + favorite + proposed date */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="text-xs text-gray-500 uppercase tracking-wider block mb-1">Estado</label>
                  <select value={selected.status} onChange={e => { updateApp(selected.id, { status: e.target.value, reviewed_date: new Date().toISOString() }); }}
                    className="w-full px-3 py-2 rounded-lg text-sm text-white outline-none" style={{ background: "#1a1a1a", border: "1px solid #333" }}>
                    {STATUSES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-gray-500 uppercase tracking-wider block mb-1">Fecha propuesta</label>
                  <input type="date" value={selected.proposed_date || ""} onChange={e => updateApp(selected.id, { proposed_date: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg text-sm text-white outline-none" style={{ background: "#1a1a1a", border: "1px solid #333" }} />
                </div>
                <div>
                  <label className="text-xs text-gray-500 uppercase tracking-wider block mb-1">Revisado por</label>
                  <input value={selected.reviewed_by || ""} onChange={e => updateApp(selected.id, { reviewed_by: e.target.value })}
                    placeholder="Nombre del revisor"
                    className="w-full px-3 py-2 rounded-lg text-sm text-white outline-none" style={{ background: "#1a1a1a", border: "1px solid #333" }} />
                </div>
              </div>

              {/* Contact actions */}
              <div className="flex gap-2 flex-wrap">
                <a href={`https://wa.me/${selected.whatsapp?.replace(/[^0-9]/g, "")}`} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold transition-colors" style={{ background: "rgba(37,211,102,0.1)", color: "#22c55e", border: "1px solid rgba(37,211,102,0.3)" }}>
                  <MessageCircle size={13} /> WhatsApp
                </a>
                <a href={`mailto:${selected.email}`} className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold transition-colors" style={{ background: "rgba(116,172,223,0.1)", color: "#75AADB", border: "1px solid rgba(116,172,223,0.3)" }}>
                  <Mail size={13} /> Email
                </a>
                <button onClick={() => updateApp(selected.id, { is_favorite: !selected.is_favorite })}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold transition-colors" style={{ background: selected.is_favorite ? "rgba(201,168,76,0.15)" : "#1a1a1a", color: selected.is_favorite ? "#C9A84C" : "#666", border: "1px solid #333" }}>
                  {selected.is_favorite ? <Star size={13} fill="#C9A84C" /> : <StarOff size={13} />} Favorito
                </button>
              </div>

              {/* Info grid */}
              <div className="grid grid-cols-2 gap-3 text-sm">
                {[
                  ["Tipo de proyecto", selected.project_type],
                  ["Integrantes", selected.member_count],
                  ["Género principal", selected.musical_genre],
                  ["Géneros secundarios", selected.secondary_genres],
                  ["Repertorio", selected.repertoire_type],
                  ["Ciudad", selected.city],
                  ["Provincia", selected.province],
                  ["WhatsApp", selected.whatsapp],
                  ["Instagram", selected.instagram_user],
                  ["Año de formación", selected.formation_year],
                  ["Duración", selected.performance_duration],
                  ["Cant. canciones", selected.song_count],
                  ["Idioma", selected.content_language],
                  ["Seguidores", selected.social_followers],
                  ["Público estimado", selected.estimated_audience],
                  ["Edad responsable", selected.contact_age],
                ].map(([label, val]) => val ? (
                  <div key={label} className="p-2 rounded-lg" style={{ background: "#111" }}>
                    <p className="text-xs text-gray-500 uppercase">{label}</p>
                    <p className="text-gray-200 text-sm capitalize">{String(val)}</p>
                  </div>
                ) : null)}
              </div>

              {/* Long text fields */}
              {[
                ["Descripción", selected.project_description],
                ["Experiencia en vivo", selected.live_experience],
                ["Motivación", selected.motivation],
                ["Diferencial", selected.project_differential],
                ["Experiencia esperada", selected.expected_experience],
                ["Plan de difusión", selected.promotion_plan],
                ["Info adicional", selected.additional_info],
                ["Requisitos técnicos", selected.technical_requirements],
                ["Fechas disponibles", selected.available_dates],
                ["Horario disponible", selected.available_time],
                ["Integrantes", selected.members],
              ].map(([label, val]) => val ? (
                <div key={label}>
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">{label}</p>
                  <p className="text-sm text-gray-300 whitespace-pre-wrap p-3 rounded-lg" style={{ background: "#111" }}>{val}</p>
                </div>
              ) : null)}

              {/* Links */}
              {links(selected).length > 0 && (
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Enlaces artísticos</p>
                  <div className="flex flex-wrap gap-2">
                    {links(selected).map(l => (
                      <a key={l.label} href={l.url} target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors hover:bg-white/5" style={{ background: "#111", color: "#75AADB", border: "1px solid #2a2a2a" }}>
                        <ExternalLink size={11} /> {l.label}
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* Files */}
              {files(selected).length > 0 && (
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Archivos</p>
                  <div className="flex flex-wrap gap-2">
                    {files(selected).map(f => {
                      const urls = f.url.split(",").map(u => u.trim()).filter(Boolean);
                      return urls.map((url, i) => (
                        <a key={`${f.label}-${i}`} href={url} target="_blank" rel="noopener noreferrer"
                          className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors hover:bg-white/5" style={{ background: "#111", color: "#C9A84C", border: "1px solid #2a2a2a" }}>
                          <Download size={11} /> {f.label}{urls.length > 1 ? ` ${i + 1}` : ""}
                        </a>
                      ));
                    })}
                  </div>
                </div>
              )}

              {/* Technical booleans */}
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Equipamiento</p>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {[
                    ["Instrumentos", selected.owns_instruments],
                    ["Micrófonos", selected.owns_microphones],
                    ["Amplificadores", selected.owns_amplifiers],
                    ["Consola", selected.owns_console],
                    ["Controladora", selected.owns_controller],
                    ["Operador de sonido", selected.has_sound_engineer],
                    ["Asistencia técnica", selected.needs_technical_assistance],
                  ].map(([l, v]) => (
                    <div key={l} className="flex justify-between p-2 rounded" style={{ background: "#111" }}>
                      <span className="text-gray-500">{l}</span>
                      <span className="capitalize" style={{ color: v === "si" ? "#22c55e" : v === "no" ? "#ef4444" : "#C9A84C" }}>{v || "—"}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Internal notes */}
              <div>
                <label className="text-xs text-gray-500 uppercase tracking-wider mb-1 block">Notas internas</label>
                <textarea value={selected.internal_notes || ""} onChange={e => setSelected(s => ({ ...s, internal_notes: e.target.value }))}
                  onBlur={e => updateApp(selected.id, { internal_notes: e.target.value })}
                  rows={3} placeholder="Notas del equipo de producción..."
                  className="w-full px-3 py-2 rounded-lg text-sm text-white outline-none resize-none" style={{ background: "#111", border: "1px solid #2a2a2a" }} maxLength={5000} />
              </div>

              {selected.reviewed_date && (
                <p className="text-xs text-gray-600 text-center">Revisado: {format(new Date(selected.reviewed_date), "d MMM yyyy, HH:mm", { locale: es })}</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}