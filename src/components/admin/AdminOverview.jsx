import { useEffect, useState } from "react";
import { base44 } from "@/api/base44Client";
import { CalendarDays, Music2, Images, Wine, Megaphone, Mail, ClipboardList, ArrowRight, RefreshCw } from "lucide-react";

const cards = [
  { key: "events", label: "Eventos", icon: CalendarDays, color: "#D8B76A", tab: "events" },
  { key: "artists", label: "Artistas", icon: Music2, color: "#9B9BFF", tab: "artists" },
  { key: "gallery", label: "Álbumes", icon: Images, color: "#72B7C7", tab: "gallery" },
  { key: "menu", label: "Productos en carta", icon: Wine, color: "#B6A0E8", tab: "menu" },
  { key: "promotions", label: "Promociones", icon: Megaphone, color: "#E5A06A", tab: "promos" },
  { key: "newsletter", label: "Suscriptores", icon: Mail, color: "#83B99B", tab: "newsletter" },
];

export default function AdminOverview({ onNavigate }) {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState("");
  const [updatedAt, setUpdatedAt] = useState(null);

  const load = async () => {
    setError("");
    try {
      const [events, artists, gallery, menu, promotions, newsletter, requests] = await Promise.all([
        base44.entities.Event.count({}),
        base44.entities.Artist.count({}),
        base44.entities.GalleryAlbum.count({}),
        base44.entities.MenuItem.count({}),
        base44.entities.Promotion.count({}),
        base44.entities.NewsletterSubscriber.count({}),
        base44.entities.PrivateEventRequest.count({ status: "pendiente" }),
      ]);
      setStats({ events, artists, gallery, menu, promotions, newsletter, requests });
      setUpdatedAt(new Date());
    } catch {
      setError("No se pudieron cargar todos los indicadores. Revisá los permisos y volvé a intentar.");
    }
  };

  useEffect(() => { load(); }, []);

  return (
    <section className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
        <div>
          <p className="text-[11px] uppercase tracking-[0.2em] mb-2" style={{ color: "#C9A84C" }}>Centro de gestión</p>
          <h2 className="text-2xl md:text-3xl font-bold text-white">Resumen de Pacha Disco</h2>
          <p className="text-sm text-gray-500 mt-1">Estado de los contenidos y tareas de administración.</p>
        </div>
        <button type="button" onClick={load} className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm text-gray-300" style={{ background: "#151515", border: "1px solid #303030" }}>
          <RefreshCw size={14} /> Actualizar
        </button>
      </div>

      {error && <div role="alert" className="rounded-xl p-3 text-sm text-amber-200" style={{ background: "rgba(180,130,30,.1)", border: "1px solid rgba(201,168,76,.25)" }}>{error}</div>}

      <div className="grid grid-cols-2 xl:grid-cols-3 gap-3">
        {cards.map(({ key, label, icon: Icon, color, tab }) => (
          <button type="button" key={key} onClick={() => onNavigate(tab)} className="text-left rounded-2xl p-4 md:p-5 transition-transform active:scale-[.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-400" style={{ background: "#111", border: "1px solid #292929" }}>
            <div className="flex items-center justify-between gap-2">
              <span className="flex items-center justify-center w-9 h-9 rounded-xl" style={{ background: color + "18", color }}><Icon size={18} /></span>
              <ArrowRight size={15} className="text-gray-600" />
            </div>
            <p className="text-2xl md:text-3xl font-semibold text-white mt-4 tabular-nums">{stats ? stats[key] : "—"}</p>
            <p className="text-xs md:text-sm text-gray-500 mt-1">{label}</p>
          </button>
        ))}
      </div>

      <button type="button" onClick={() => onNavigate("requests")} className="w-full flex items-center justify-between gap-4 rounded-2xl p-4 md:p-5 text-left" style={{ background: "linear-gradient(110deg, rgba(201,168,76,.12), rgba(201,168,76,.03))", border: "1px solid rgba(201,168,76,.25)" }}>
        <div className="flex items-center gap-3 min-w-0">
          <span className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: "rgba(201,168,76,.14)", color: "#D8B76A" }}><ClipboardList size={19} /></span>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-white">Solicitudes de eventos privados</p>
            <p className="text-xs text-gray-500 mt-1">Revisar consultas pendientes recibidas por el sitio</p>
          </div>
        </div>
        <span className="text-xl font-semibold text-white tabular-nums">{stats ? stats.requests : "—"}</span>
      </button>

      <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-gray-600">
        <span>Los indicadores reflejan registros, no necesariamente servicios activos.</span>
        <span>{updatedAt ? `Actualizado ${updatedAt.toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" })}` : "Sin actualizar"}</span>
      </div>
    </section>
  );
}
