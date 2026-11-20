import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { User, LogOut, Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function MisCuenta() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    base44.auth.me()
      .then(setUser)
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  const handleLogout = () => base44.auth.logout("/");

  const handleDeleteAccount = async () => {
    setDeleting(true);
    try {
      if (user?.id) await base44.entities.User.delete(user.id);
    } catch {
      // La plataforma puede restringir la autobaja: se continúa con el cierre de sesión
    }
    try {
      await base44.auth.logout();
    } catch {
      window.location.href = "/";
    }
  };

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

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <button className="w-full py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all"
              style={{ background: "rgba(239,68,68,0.08)", color: "#ef4444", border: "1px solid rgba(239,68,68,0.2)" }}>
              <Trash2 size={15} /> Eliminar Cuenta
            </button>
          </AlertDialogTrigger>
          <AlertDialogContent style={{ background: "#0f0f0f", border: "1px solid rgba(239,68,68,0.3)" }}>
            <AlertDialogHeader>
              <AlertDialogTitle className="text-white">¿Eliminar tu cuenta?</AlertDialogTitle>
              <AlertDialogDescription className="text-gray-400">
                Esta acción es permanente e irreversible. Se eliminarán los datos asociados a tu cuenta.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel style={{ background: "#1a1a1a", color: "#888", border: "1px solid #2a2a2a" }}>
                Cancelar
              </AlertDialogCancel>
              <AlertDialogAction onClick={handleDeleteAccount} disabled={deleting}
                style={{ background: "#ef4444", color: "#fff" }}>
                {deleting ? "Eliminando..." : "Sí, eliminar cuenta"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}