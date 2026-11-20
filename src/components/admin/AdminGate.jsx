import { base44 } from "@/api/base44Client";
import useAdminAuth from "@/hooks/useAdminAuth";
import { ShieldOff } from "lucide-react";

export default function AdminGate({ children }) {
  const { checking, isAdmin } = useAdminAuth();

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#070707" }}>
        <div className="w-10 h-10 rounded-full animate-spin"
          style={{ border: "2px solid #1a1a1a", borderTop: "2px solid #FF0000" }} />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-6 px-4" style={{ background: "#070707" }}>
        <ShieldOff size={48} style={{ color: "#FF0000", opacity: 0.6 }} />
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
            Acceso Restringido
          </h2>
          <p className="text-gray-500 text-sm">Esta sección es solo para administradores.</p>
        </div>
        <button onClick={() => base44.auth.redirectToLogin(window.location.href)}
          className="px-6 py-3 rounded-lg text-sm font-bold text-white" style={{ background: "#FF0000" }}>
          Iniciar Sesión
        </button>
      </div>
    );
  }

  return children;
}