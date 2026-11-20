import { base44 } from "@/api/base44Client";
import useAdminAuth from "@/hooks/useAdminAuth";
import { ShieldOff, LogIn, RefreshCw } from "lucide-react";

export default function AdminGate({ children }) {
  const { checking, isAdmin, status, email } = useAdminAuth();

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#070707" }}>
        <div className="w-10 h-10 rounded-full animate-spin"
          style={{ border: "2px solid #1a1a1a", borderTop: "2px solid #FF0000" }} />
      </div>
    );
  }

  if (!isAdmin) {
    const signedOut = status === "signed_out";
    const failed = status === "error";
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-6 px-4" style={{ background: "#070707" }}>
        {signedOut ? <LogIn size={48} style={{ color: "#FF0000" }} /> : <ShieldOff size={48} style={{ color: "#FF0000" }} />}
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
            {signedOut ? "Iniciá sesión para administrar" : failed ? "No se pudo verificar tu sesión" : "Acceso restringido"}
          </h2>
          <p className="text-gray-400 text-sm max-w-sm">{signedOut ? "Ingresá con tu cuenta de administrador para cargar y editar eventos." : failed ? "Comprobá tu conexión e intentá nuevamente." : "Esta cuenta no tiene permisos administrativos."}</p>
          {status === "forbidden" && email && <p className="text-gray-500 text-xs break-all mt-2">Sesión actual: {email}</p>}
        </div>
        <button onClick={() => base44.auth.redirectToLogin(window.location.href)}
          className="px-6 py-3 rounded-lg text-sm font-bold text-white" style={{ background: "#FF0000" }}>
          {signedOut ? "Iniciar sesión" : "Cambiar de cuenta"}
        </button>
        <button onClick={() => window.location.reload()}
          className="px-6 py-3 rounded-lg text-sm text-gray-300 flex items-center gap-2" style={{ border: "1px solid #333" }}>
          <RefreshCw size={15} /> Reintentar
        </button>
      </div>
    );
  }

  return children;
}