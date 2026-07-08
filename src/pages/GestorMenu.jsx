import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import AdminMenu from "@/components/admin/AdminMenu";
import MenuQR from "@/components/admin/MenuQR";
import { ShieldOff, Wine, Loader2 } from "lucide-react";

export default function GestorMenu() {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    base44.auth.me().then(u => {
      setUser(u);
      setAuthLoading(false);
    }).catch(() => setAuthLoading(false));
  }, []);

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
        className="px-6 py-3 rounded-lg text-sm font-bold text-white" style={{ background: "#75AADB" }}>
        Iniciar Sesión
      </button>
    </div>
  );

  return (
    <div style={{ background: "#0A0A0A", minHeight: "100vh" }}>
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: "rgba(116,170,219,0.15)", border: "1px solid rgba(116,170,219,0.3)" }}>
            <Wine size={18} style={{ color: "#75AADB" }} />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-white" style={{ fontFamily: "'Playfair Display', serif" }}>Gestor de Menú</h1>
            <p className="text-gray-500 text-xs">Editá precios, descripciones y disponibilidad</p>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2"><AdminMenu /></div>
          <div><MenuQR /></div>
        </div>
      </div>
    </div>
  );
}