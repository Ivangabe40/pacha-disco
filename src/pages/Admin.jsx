import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import AdminEvents from "@/components/admin/AdminEvents";
import AdminArtists from "@/components/admin/AdminArtists";
import AdminGalleryAlbums from "@/components/admin/AdminGalleryAlbums";

import AdminMenu from "@/components/admin/AdminMenu";
import MenuQR from "@/components/admin/MenuQR";
import AdminPromotions from "@/components/admin/AdminPromotions";

import AdminReservations from "@/components/admin/AdminReservations";
import AdminNewsletter from "@/components/admin/AdminNewsletter";
import AdminNotifications from "@/components/admin/AdminNotifications";
import AdminEscapeBar from "@/components/admin/AdminEscapeBar";
import AdminNovedades from "@/components/admin/AdminNovedades";
import AdminConfiguracion from "@/components/admin/AdminConfiguracion";
import AdminTicketOrders from "@/components/admin/AdminTicketOrders";
import { Calendar, Music, Camera, Wine, ShieldOff, Megaphone, Crown, Mail, Bell, GlassWater, Sparkles, Settings, ShoppingBag } from "lucide-react";

const LOGO_RED = "https://media.base44.com/images/public/69ad4033370fdc9f9fe8b117/7c4e34300_1783489304034.png";

const tabs = [
  { id: "events", label: "Eventos", icon: Calendar },
  { id: "artists", label: "Artistas", icon: Music },
  { id: "gallery", label: "Galería", icon: Camera },
  { id: "menu", label: "Carta", icon: Wine },
  { id: "promos", label: "Promos", icon: Megaphone },
  { id: "reservations", label: "Reservas", icon: Crown },
  { id: "newsletter", label: "Newsletter", icon: Mail },
  { id: "notifications", label: "Notificaciones", icon: Bell },
  { id: "escapebar", label: "Escape Bar", icon: GlassWater },
  { id: "novedades", label: "Novedades", icon: Sparkles },
  { id: "orders", label: "Órdenes MP", icon: ShoppingBag },
  { id: "config", label: "Configuración", icon: Settings },
];

export default function Admin() {
  const [activeTab, setActiveTab] = useState("events");
  const [stats, setStats] = useState({ events: 0, tickets: 0, artists: 0 });
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    base44.auth.me().then(u => {
      setUser(u);
      setAuthLoading(false);
    }).catch(() => {
      setAuthLoading(false);
    });
  }, []);

  useEffect(() => {
    if (user?.role !== "admin") return;
    Promise.all([
    base44.entities.Event.list(),
    base44.entities.Artist.list(),
    ]).then(([events, artists]) => {
    setStats({ events: events.length, artists: artists.length });
    });
  }, [user]);

  if (authLoading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: "#070707" }}>
      <div className="w-10 h-10 rounded-full animate-spin" style={{ border: "2px solid #1a1a1a", borderTop: "2px solid #75AADB" }} />
    </div>
  );

  if (!user || user.role !== "admin") return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 px-4" style={{ background: "#070707" }}>
      <ShieldOff size={48} style={{ color: "#75AADB", opacity: 0.6 }} />
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>Acceso Restringido</h2>
        <p className="text-gray-500 text-sm">Esta sección es solo para administradores.</p>
      </div>
      <button onClick={() => base44.auth.redirectToLogin(window.location.href)}
        className="px-6 py-3 rounded-lg text-sm font-bold text-white"
        style={{ background: "#75AADB" }}>
        Iniciar Sesión
      </button>
    </div>
  );

  return (
    <div style={{ background: "#0A0A0A", minHeight: "100vh" }}>
      {/* Admin Header */}
      <div className="sticky top-14 md:top-16 z-40 border-b" style={{ background: "#080808", borderColor: "#1a1a1a" }}>
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="flex items-center gap-3 py-3">
            <img src={LOGO_RED} alt="Pachá Admin" className="h-10 object-contain" />
            <h1 className="text-white font-bold text-base md:text-lg" style={{ fontFamily: "'Playfair Display', serif" }}>Panel Admin</h1>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-2 pb-3">
            {[
              { label: "Eventos", labelMd: "Eventos", value: stats.events, color: "#C9A84C" },
              { label: "Artistas", labelMd: "Artistas", value: stats.artists, color: "#8888FF" },
            ].map(s => (
              <div key={s.label} className="p-2 md:p-3 rounded-xl text-center" style={{ background: "#111", border: "1px solid #222" }}>
                <div className="text-xl md:text-2xl font-bold" style={{ color: s.color }}>{s.value}</div>
                <div className="text-xs text-gray-500 mt-0.5 hidden md:block">{s.labelMd}</div>
                <div className="text-xs text-gray-500 mt-0.5 md:hidden">{s.label}</div>
              </div>
            ))}
          </div>

          {/* Tabs - scrollable on mobile */}
          <div className="flex gap-0.5 overflow-x-auto scrollbar-hide -mx-1 px-1">
            {tabs.map(t => {
              const Icon = t.icon;
              return (
                <button key={t.id} onClick={() => setActiveTab(t.id)}
                  className="flex items-center gap-1.5 px-3 py-2.5 text-xs md:text-sm font-medium transition-colors rounded-t-lg shrink-0"
                  style={activeTab === t.id
                    ? { color: "#C9A84C", borderBottom: "2px solid #C9A84C", background: "rgba(201,168,76,0.05)" }
                    : { color: "#666" }}>
                  <Icon size={13} /><span>{t.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        {activeTab === "events" && <AdminEvents />}
        {activeTab === "artists" && <AdminArtists />}
        {activeTab === "gallery" && <AdminGalleryAlbums />}
        {activeTab === "promos" && <AdminPromotions />}

        {activeTab === "reservations" && <AdminReservations />}
        {activeTab === "newsletter" && <AdminNewsletter />}
        {activeTab === "notifications" && <AdminNotifications />}
        {activeTab === "escapebar" && <AdminEscapeBar />}
        {activeTab === "novedades" && <AdminNovedades />}
        {activeTab === "orders" && <AdminTicketOrders />}
        {activeTab === "config" && <AdminConfiguracion />}
        {activeTab === "menu" && (
          <div className="grid md:grid-cols-3 gap-6">
            <div className="md:col-span-2"><AdminMenu /></div>
            <div><MenuQR /></div>
          </div>
        )}
      </div>
    </div>
  );
}