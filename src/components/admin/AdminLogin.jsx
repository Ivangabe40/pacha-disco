import { useState } from "react";
import { Lock, AlertCircle } from "lucide-react";

const ADMIN_PASSWORD = "admin123";
const STORAGE_KEY = "pacha_admin_auth";

export function isAdminAuthenticated() {
  try {
    return localStorage.getItem(STORAGE_KEY) === "true";
  } catch {
    return false;
  }
}

export function adminLogout() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {}
}

export default function AdminLogin({ onSuccess }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      try {
        localStorage.setItem(STORAGE_KEY, "true");
      } catch {}
      setError(false);
      onSuccess?.();
    } else {
      setError(true);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 px-4" style={{ background: "#070707" }}>
      <div className="text-center">
        <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
          style={{ background: "rgba(201,168,76,0.1)", border: "1px solid rgba(201,168,76,0.3)" }}>
          <Lock size={28} style={{ color: "#C9A84C" }} />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
          Panel Administrador
        </h2>
        <p className="text-gray-500 text-sm">Ingresá la contraseña para acceder</p>
      </div>
      <form onSubmit={handleSubmit} className="w-full max-w-xs">
        <input
          type="password"
          value={password}
          onChange={(e) => { setPassword(e.target.value); setError(false); }}
          placeholder="Contraseña"
          autoFocus
          className="w-full px-4 py-3 rounded-xl text-white text-center text-sm outline-none"
          style={{
            background: "#111",
            border: error ? "1px solid #ef4444" : "1px solid #333",
          }}
        />
        {error && (
          <p className="text-red-400 text-xs text-center mt-2 flex items-center justify-center gap-1">
            <AlertCircle size={12} /> Contraseña incorrecta
          </p>
        )}
        <button type="submit"
          className="w-full py-3 rounded-xl font-bold text-sm mt-4"
          style={{ background: "linear-gradient(135deg, #C9A84C 0%, #E8C97A 100%)", color: "#0A0A0A" }}>
          Ingresar
        </button>
      </form>
    </div>
  );
}