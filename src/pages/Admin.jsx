import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import AdminLogin, { isAdminAuthenticated, adminLogout } from "@/components/admin/AdminLogin";
import AdminEvents from "@/components/admin/AdminEvents";
import AdminArtists from "@/components/admin/AdminArtists";
import AdminGalleryAlbums from "@/components/admin/AdminGalleryAlbums";
import AdminMenu from "@/components/admin/AdminMenu";
import MenuQR from "@/components/admin/MenuQR";
import AdminPromotions from "@/components/admin/AdminPromotions";
import AdminNewsletter from "@/components/admin/AdminNewsletter";
import AdminNotifications from "@/components/admin/AdminNotifications";
import AdminNovedades from "@/components/admin/AdminNovedades";
import AdminConfiguracion from "@/components/admin/AdminConfiguracion";
import AdminHomeVideo from "@/components/admin/AdminHomeVideo";
import AdminOverview from "@/components/admin/AdminOverview";
import AdminPrivateRequests from "@/components/admin/AdminPrivateRequests";
import { Calendar, Music, Camera, Wine, Megaphone, Mail, Bell, Sparkles, Settings, LogOut, LayoutDashboard, ClipboardList } from "lucide-react";

const LOGO_RED = "https://media.base44.com/images/public/69ad4033370fdc9f9fe8b117/dbb6d658e_pacha-logo-nuevo.png";

const tabs = [
  { id: "overview", label: "Resumen", icon: LayoutDashboard },
  { id: "events", label: "Eventos", icon: Calendar },
  { id: "artists", label: "Artistas", icon: Music },
  { id: "gallery", label: "Galería", icon: Camera },
  { id: "menu", label: "Carta", icon: Wine },
  { id: "promos", label: "Promos", icon: Megaphone },
  { id: "newsletter", label: "Newsletter", icon: Mail },
  { id: "requests", label: "Solicitudes", icon: ClipboardList },
  { id: "notifications", label: "Notif.", icon: Bell },
  { id: "novedades", label: "Novedades", icon: Sparkles },
  { id: "config", label: "Config", icon: Settings },
];

export default function Admin() {
  const [authed, setAuthed] = useState(isAdminAuthenticated());
  const [activeTab, setActiveTab] = useState("overview");
  const [stats, setStats] = useState({ events: 0, artists: 0 });

  useEffect(() => {
    if (!authed) return;
    Promise.all([
      base44.entities.Event.count({}),
      base44.entities.Artist.count({}),
    ]).then(([events, artists]) => {
      setStats({ events, artists });
    }).catch(() => {});
  }, [authed]);

  if (!authed) return <AdminLogin onSuccess={() => setAuthed(true)} />;

  const handleLogout = () => {
    adminLogout();
    setAuthed(false);
  };

  return (
    <div style={{ background: "#0A0A0A", minHeight: "100vh" }}>
      {/* Admin Header */}
      <div className="sticky top-14 md:top-16 z-40 border-b" style={{ background: "#080808", borderColor: "#1a1a1a" }}>
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="flex items-center justify-between gap-3 py-3">
            <div className="flex items-center gap-3 min-w-0">
              <img src={LOGO_RED} alt="Pachá Admin" className="h-10 w-10 rounded-full object-cover" />
              <h1 className="text-white font-bold text-base md:text-lg truncate" style={{ fontFamily: "'Playfair Display', serif" }}>Panel Admin</h1>
            </div>
            <button onClick={handleLogout}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-gray-400 hover:text-white transition-colors shrink-0"
              style={{ border: "1px solid #333" }}>
              <LogOut size={14} /> Salir
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-2 pb-3">
            {[
              { label: "Eventos", value: stats.events, color: "#C9A84C" },
              { label: "Artistas", value: stats.artists, color: "#8888FF" },
            ].map(s => (
              <div key={s.label} className="p-2 md:p-3 rounded-xl text-center" style={{ background: "#111", border: "1px solid #222" }}>
                <div className="text-sm md:text-xl font-bold truncate" style={{ color: s.color }}>{s.value}</div>
                <div className="text-xs text-gray-500 mt-0.5 hidden sm:block">{s.label}</div>
              </div>
            ))}
          </div>

          {/* Tabs */}
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
        {activeTab === "overview" && <AdminOverview onNavigate={setActiveTab} />}
        {activeTab === "requests" && <AdminPrivateRequests />}
        {activeTab === "events" && <AdminEvents />}
        {activeTab === "artists" && <AdminArtists />}
        {activeTab === "gallery" && <AdminGalleryAlbums />}
        {activeTab === "promos" && <AdminPromotions />}
        {activeTab === "newsletter" && <AdminNewsletter />}
        {activeTab === "notifications" && <AdminNotifications />}
        {activeTab === "novedades" && <AdminNovedades />}
        {activeTab === "config" && (
          <div className="space-y-6">
            <AdminHomeVideo />
            <AdminConfiguracion />
          </div>
        )}
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