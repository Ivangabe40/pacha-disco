import AdminGate from "@/components/admin/AdminGate";
import AdminConfiguracion from "@/components/admin/AdminConfiguracion";

export default function Configuracion() {
  return (
    <AdminGate>
      <div style={{ background: "#0A0A0A", minHeight: "100vh" }}>
        <div className="max-w-3xl mx-auto px-4 md:px-8 py-8">
          <AdminConfiguracion />
        </div>
      </div>
    </AdminGate>
  );
}