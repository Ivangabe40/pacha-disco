import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useSearchParams, Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { CheckCircle, Ticket, Loader2 } from "lucide-react";

export default function PaymentSuccess() {
  const [params] = useSearchParams();
  const orderId = params.get("external_reference");
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (orderId) {
      base44.entities.TicketOrder.get(orderId).then(o => {
        setOrder(o);
        setLoading(false);
      }).catch(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [orderId]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: "#070707" }}>
      <div className="max-w-md w-full text-center">
        {loading ? (
          <Loader2 size={32} className="animate-spin mx-auto" style={{ color: "#C9A84C" }} />
        ) : (
          <>
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 rounded-full flex items-center justify-center"
                style={{ background: "rgba(34,197,94,0.12)", border: "2px solid rgba(34,197,94,0.3)" }}>
                <CheckCircle size={40} className="text-green-400" />
              </div>
            </div>

            <h1 className="text-3xl font-black text-white uppercase mb-2"
              style={{ fontFamily: "'Playfair Display', serif" }}>
              ¡Compra Aprobada!
            </h1>
            <p className="text-gray-400 text-sm mb-8">Tu pago fue procesado correctamente.</p>

            {order && (
              <div className="rounded-2xl p-6 mb-8 text-left space-y-3"
                style={{ background: "#111", border: "1px solid #222" }}>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400 text-sm">Evento</span>
                  <span className="text-white text-sm font-medium text-right">{order.event_title}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400 text-sm">Entradas</span>
                  <span className="text-white font-semibold">{order.quantity}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400 text-sm">Total pagado</span>
                  <span className="font-bold text-lg" style={{ color: "#C9A84C" }}>${order.total?.toLocaleString()}</span>
                </div>
                <div className="h-px my-2" style={{ background: "#222" }} />
                <div className="flex items-center justify-between">
                  <span className="text-gray-400 text-sm flex items-center gap-1.5">
                    <Ticket size={13} /> Orden
                  </span>
                  <span className="text-gray-300 text-xs font-mono">{order.id?.slice(0, 12)}</span>
                </div>
              </div>
            )}

            <Link to={createPageUrl("Home")}>
              <button className="w-full py-3.5 rounded-xl font-bold text-sm"
                style={{ background: "linear-gradient(135deg, #C9A84C 0%, #E8C97A 50%, #C9A84C 100%)", color: "#0A0A0A" }}>
                Volver al inicio
              </button>
            </Link>
          </>
        )}
      </div>
    </div>
  );
}