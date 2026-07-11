import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { XCircle, RotateCcw } from "lucide-react";

export default function PaymentFailure() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: "#070707" }}>
      <div className="max-w-md w-full text-center">
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 rounded-full flex items-center justify-center"
            style={{ background: "rgba(239,68,68,0.12)", border: "2px solid rgba(239,68,68,0.3)" }}>
            <XCircle size={40} className="text-red-400" />
          </div>
        </div>

        <h1 className="text-3xl font-black text-white uppercase mb-2"
          style={{ fontFamily: "'Playfair Display', serif" }}>
          Pago Rechazado
        </h1>
        <p className="text-gray-400 text-sm mb-8">
          Tu pago fue rechazado o cancelado. Podés intentar nuevamente.
        </p>

        <div className="flex gap-3">
          <Link to={createPageUrl("TicketSales")} className="flex-1">
            <button className="w-full py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2"
              style={{ background: "linear-gradient(135deg, #009EE3 0%, #00B7EA 100%)", color: "#fff" }}>
              <RotateCcw size={15} /> Reintentar compra
            </button>
          </Link>
          <Link to={createPageUrl("Home")} className="flex-1">
            <button className="w-full py-3.5 rounded-xl font-bold text-sm"
              style={{ border: "1px solid #333", color: "#888" }}>
              Volver al inicio
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}