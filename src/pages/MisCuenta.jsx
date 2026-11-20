import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { User, LogOut, MessageCircle } from "lucide-react";

export default function MisCuenta() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    base44.auth.me()
      .then(setUser)
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  const handleLogout = () => base44.auth.logout("/");

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: "#070707" }}>
      <div className="w-10 h-10 rounded-full animate-spin" style={{ border: "2px solid #1a1a1a", borderTop: "2px solid #FF0000" }} />
    </div>
  );

  if (!user) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 px-4" style={{ background: "#070707" }}>
      <User size={48} style={{ color: "#FF0000", opacity: 0.5 }} />
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>Iniciá sesión</h2>
        <p className="text-gray-500 text-sm">Necesitás una cuenta para ver tus datos.</p>
      </div>
      <button onClick={() => base44.auth.redirectToLogin(window.location.href)}
        className="px-6 py-3 rounded-lg text-sm font-bold text-white"
        style={{ background: "#FF0000" }}>
        Iniciar Sesión
      </button>
    </div>
  );

  return (
    <div style={{ background: "#070707", minHeight: "100vh" }} className="pb-24">
      <div className="max-w-lg mx-auto px-4 pt-8 space-y-6">
        <div className="text-center pt-4">
          <p className="text-xs text-gray-600 uppercase tracking-widest mb-1">Mi cuenta</p>
          <h1 className="text-3xl font-black text-white" style={{ fontFamily: "'Playfair Display', serif" }}>
            {user.full_name || "Mi cuenta"}
          </h1>
        </div>

        <div className="rounded-2xl p-6" style={{ background: "#111", border: "1px solid #1e1e1e" }}>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-11 h-11 rounded-full flex items-center justify-center"
              style={{ background: "rgba(255,0,0,0.12)", border: "1px solid rgba(255,0,0,0.3)" }}>
              <User size={18} style={{ color: "#FF0000" }} />
            </div>
            <div className="min-w-0">
              <p className="text-white font-semibold truncate">{user.full_name || "Sin nombre"}</p>
              <p className="text-gray-500 text-sm truncate">{user.email}</p>
            </div>
          </div>
          <p className="text-gray-600 text-xs leading-relaxed">
            Estos son los datos de tu cuenta. Si necesitás modificarlos, escribinos por WhatsApp.
          </p>
        </div>

        <button onClick={handleLogout}
          className="w-full py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all"
          style={{ background: "rgba(255,255,255,0.04)", color: "#ddd", border: "1px solid #2a2a2a" }}>
          <LogOut size={15} /> Cerrar sesión
        </button>

        <div className="rounded-2xl p-5" style={{ background: "#0d0d0d", border: "1px solid #1e1e1e" }}>
          <h2 className="text-white font-bold text-sm mb-2">Baja de cuenta</h2>
          <p className="text-gray-500 text-xs leading-relaxed mb-3">
            La baja se gestiona con el equipo de Pachá para poder verificar la identidad del titular.
            Escribinos y la procesamos desde la administración.
          </p>
          <ul className="text-gray-600 text-xs leading-relaxed space-y-1 mb-4">
            <li>· Se elimina tu cuenta de acceso y los datos de tu perfil.</li>
            <li>· Pueden permanecer registros históricos que no contienen datos personales.</li>
            <li>· Cerrar sesión no elimina la cuenta.</li>
          </ul>
          <a href="https://wa.me/5493468546935?text=Hola!%20Quiero%20dar%20de%20baja%20mi%20cuenta"
            target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold"
            style={{ border: "1px solid #25D366", color: "#25D366" }}>
            <MessageCircle size={13} /> Pedir la baja por WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}