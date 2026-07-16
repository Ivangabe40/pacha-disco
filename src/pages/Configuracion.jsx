import { useState } from "react";
import AdminLogin, { isAdminAuthenticated } from "@/components/admin/AdminLogin";
import AdminConfiguracion from "@/components/admin/AdminConfiguracion";

export default function Configuracion() {
  const [authed, setAuthed] = useState(isAdminAuthenticated());

  if (!authed) return <AdminLogin onSuccess={() => setAuthed(true)} />;

  return (
    <div style={{ background: "#0A0A0A", minHeight: "100vh" }}>
      <div className="max-w-3xl mx-auto px-4 md:px-8 py-8">
        <AdminConfiguracion />
      </div>
    </div>
  );
}