import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useSearchParams, Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { XCircle, RotateCcw } from "lucide-react";

export default function PaymentFailure() {
  const [params] = useSearchParams();
  const orderId = params.get("external_reference");
  const [order, setOrder] = useState(null);

  useEffect(() => {
    if (!orderId) return;
    base44.entities.TicketOrder.get(orderId).then(setOrder).catch(() => {});
  }, [orderId]);

  const retryUrl = order?.event_id
    ? createPageUrl("TicketSales") + "?event=" + order.event_id
    : createPageUrl("TicketSales");

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
        <p className="text-gray-400 text-sm mb-2">
          Tu pago fue rechazado o cancelado. No se generaron entradas ni se cobró nada.
        </p>
        <p className="text-gray-600 text-xs mb-8">
          Podés intentar nuevamente la compra cuando quieras.
        </p>

        {order && (
          <div className="rounded-xl p-4 mb-8 text-left space-y-2 text-sm"
            style={{ background: "#111", border: "1px solid #222" }}>
            <div className="flex justify-between">
              <span className="text-gray-400">Evento</span>
              <span className="text-white font-medium text-right">{order.event_title}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Orden</span>
              <span className="text-gray-300 font-mono text-xs">{order.id?.slice(0, 12)}</span>
            </div>
          </div>
        )}

        <div className="flex gap-3">
          <Link to={retryUrl} className="flex-1">
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