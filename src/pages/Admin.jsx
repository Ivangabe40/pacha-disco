import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import AdminEvents from "@/components/admin/AdminEvents";
import AdminArtists from "@/components/admin/AdminArtists";
import AdminGallery from "@/components/admin/AdminGallery";
import AdminTickets from "@/components/admin/AdminTickets";
import AdminMenu from "@/components/admin/AdminMenu";
import MenuQR from "@/components/admin/MenuQR";
import { Calendar, Music, Camera, Ticket, Wine } from "lucide-react";

const LOGO_RED = "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/user_69abf6aff758a16386edeb04/0e73ec46b_IMG-20260121-WA0031.jpg";

const tabs = [
  { id: "events", label: "Eventos", icon: Calendar },
  { id: "tickets", label: "Entradas", icon: Ticket },
  { id: "artists", label: "Artistas", icon: Music },
  { id: "gallery", label: "Galería", icon: Camera },
  { id: "menu", label: "Carta Tragos", icon: Wine },
];

export default function Admin() {
  const [activeTab, setActiveTab] = useState("events");
  const [stats, setStats] = useState({ events: 0, tickets: 0, artists: 0 });

  useEffect(() => {
    Promise.all([
      base44.entities.Event.list(),
      base44.entities.Ticket.list(),
      base44.entities.Artist.list(),
    ]).then(([events, tickets, artists]) => {
      setStats({ events: events.length, tickets: tickets.length, artists: artists.length });
    });
  }, []);

  return (
    <div style={{ background: "#0A0A0A", minHeight: "100vh" }}>
      {/* Admin Header */}
      <div className="sticky top-16 z-40 border-b" style={{ background: "#080808", borderColor: "#1a1a1a" }}>
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="flex items-center gap-4 py-4">
            <img src={LOGO_RED} alt="Pachá Admin" className="h-8 object-contain" />
            <div>
              <h1 className="text-white font-bold text-lg" style={{ fontFamily: "'Playfair Display', serif" }}>Panel de Administración</h1>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 pb-4">
            {[
              { label: "Eventos", value: stats.events, color: "#C9A84C" },
              { label: "Entradas vendidas", value: stats.tickets, color: "#E8001D" },
              { label: "Artistas", value: stats.artists, color: "#8888FF" },
            ].map(s => (
              <div key={s.label} className="p-3 rounded-xl text-center" style={{ background: "#111", border: "1px solid #222" }}>
                <div className="text-2xl font-bold" style={{ color: s.color }}>{s.value}</div>
                <div className="text-xs text-gray-500 mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>

          {/* Tabs */}
          <div className="flex gap-1">
            {tabs.map(t => {
              const Icon = t.icon;
              return (
                <button key={t.id} onClick={() => setActiveTab(t.id)}
                  className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-colors rounded-t-lg"
                  style={activeTab === t.id
                    ? { color: "#C9A84C", borderBottom: "2px solid #C9A84C", background: "rgba(201,168,76,0.05)" }
                    : { color: "#666" }}>
                  <Icon size={14} />{t.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        {activeTab === "events" && <AdminEvents />}
        {activeTab === "tickets" && <AdminTickets />}
        {activeTab === "artists" && <AdminArtists />}
        {activeTab === "gallery" && <AdminGallery />}
      </div>
    </div>
  );
}