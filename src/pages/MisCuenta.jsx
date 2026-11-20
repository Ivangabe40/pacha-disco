import { useEffect, useState } from "react";
import { base44 } from "@/api/base44Client";
import { UserRound, LogOut, Trash2, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";

export default function MisCuenta() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");
  const [deleted, setDeleted] = useState(false);

  useEffect(() => {
    let active = true;
    base44.auth.me()
      .then((currentUser) => { if (active) setUser(currentUser); })
      .catch(() => { if (active) setUser(null); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  const handleLogout = async () => {
    await base44.auth.logout(window.location.href);
  };

  const handleDeleteAccount = async () => {
    if (!user?.id || deleting) return;
    if (!window.confirm("¿Eliminar el registro de tu perfil de Pacha Disco? Esta acción no se puede deshacer.")) return;
    setDeleting(true);
    setError("");
    try {
      await base44.entities.User.delete(user.id);
      setDeleted(true);
      try { await base44.auth.logout(); }
      catch { window.location.replace("/"); }
    } catch {
      setError("No se pudo eliminar el perfil. Tu sesión sigue abierta. Contactá al equipo para gestionar la baja.");
      setDeleting(false);
    }
  };

  if (loading) return (
    <div className="min-h-[60vh] flex items-center justify-center" style={{ background: "#070707" }}>
      <Loader2 className="animate-spin" size={28} style={{ color: "#FF0000" }} />
    </div>
  );

  if (!user) return (
    <main className="min-h-[60vh] flex flex-col items-center justify-center gap-5 px-5 text-center" style={{ background: "#070707" }}>
      <UserRound size={42} style={{ color: "#777" }} />
      <div>
        <h1 className="text-2xl font-bold text-white">Mi cuenta</h1>
        <p className="text-sm text-gray-400 mt-2">Iniciá sesión para consultar la información de tu cuenta.</p>
      </div>
      <button onClick={() => base44.auth.redirectToLogin(window.location.href)} className="px-6 py-3 rounded-xl text-sm font-bold text-white" style={{ background: "#C90000" }}>Iniciar sesión</button>
    </main>
  );

  if (deleted) return (
    <main className="min-h-[60vh] flex flex-col items-center justify-center gap-4 px-5 text-center" style={{ background: "#070707" }}>
      <CheckCircle2 size={42} style={{ color: "#22c55e" }} />
      <h1 className="text-2xl font-bold text-white">Perfil eliminado</h1>
      <p className="text-sm text-gray-400">El registro de perfil de esta aplicación fue eliminado.</p>
      <a href="/" className="text-sm underline" style={{ color: "#C9A84C" }}>Volver al inicio</a>
    </main>
  );

  return (
    <main className="min-h-[60vh] px-4 py-12" style={{ background: "#070707", color: "#F0EBE3" }}>
      <div className="max-w-lg mx-auto rounded-2xl p-6" style={{ background: "#111", border: "1px solid #292929" }}>
        <div className="flex items-center gap-3 mb-5">
          <div className="w-11 h-11 rounded-full flex items-center justify-center" style={{ background: "rgba(255,0,0,0.12)" }}>
            <UserRound size={20} style={{ color: "#FF5555" }} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">Mi cuenta</h1>
            <p className="text-xs text-gray-500">Pacha Disco</p>
          </div>
        </div>
        <div className="rounded-xl px-4 py-3 mb-5" style={{ background: "#0a0a0a", border: "1px solid #242424" }}>
          <p className="text-[11px] uppercase tracking-wider text-gray-500 mb-1">Cuenta registrada</p>
          <p className="text-sm text-gray-200 break-all">{user.email || "Cuenta autenticada"}</p>
        </div>
        <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold mb-3" style={{ background: "#1b1b1b", border: "1px solid #333", color: "#ddd" }}>
          <LogOut size={16} /> Cerrar sesión
        </button>
        {error && (
          <div role="alert" className="flex items-start gap-2 rounded-xl p-3 mb-3 text-sm text-red-300" style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.25)" }}>
            <AlertCircle size={17} className="shrink-0 mt-0.5" /><p>{error}</p>
          </div>
        )}
        <div className="pt-5 mt-4" style={{ borderTop: "1px solid #2a2a2a" }}>
          <p className="text-sm font-semibold text-gray-200 mb-1">Eliminar cuenta</p>
          <p className="text-xs leading-relaxed text-gray-500 mb-4">Esta acción intenta eliminar el registro de perfil de la aplicación. No implica que se eliminen otros datos o la cuenta de autenticación de Base44.</p>
          <button onClick={handleDeleteAccount} disabled={deleting} className="w-full flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold disabled:opacity-50" style={{ color: "#f87171", background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.25)" }}>
            {deleting ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
            {deleting ? "Eliminando..." : "Eliminar mi perfil"}
          </button>
        </div>
      </div>
    </main>
  );
}
