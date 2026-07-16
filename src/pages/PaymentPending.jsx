import { useState, useEffect, useRef } from "react";
import { base44 } from "@/api/base44Client";
import { useSearchParams, Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Clock, RefreshCw, Loader2 } from "lucide-react";

export default function PaymentPending() {
  const [params] = useSearchParams();
  const orderId = params.get("external_reference");
  const [order, setOrder] = useState(null);
  const [checking, setChecking] = useState(false);
  const pollCount = useRef(0);

  const loadOrder = async () => {
    if (!orderId) return;
    setChecking(true);
    try {
      const o = await base44.entities.TicketOrder.get(orderId);
      setOrder(o);
      // Si el pago ya fue aprobado mientras tanto, redirigir a success
      if (o.status === "approved") {
        window.location.href = "/payment/success?external_reference=" + orderId;
        return;
      }
      if (o.status === "rejected") {
        window.location.href = "/payment/failure?external_reference=" + orderId;
        return;
      }
    } catch {
      /* silent */
    } finally {
      setChecking(false);
    }
  };

  // Auto-poll cada 5s (hasta 12 veces = 60s)
  useEffect(() => {
    if (!orderId) return;
    loadOrder();

    const interval = setInterval(() => {
      if (pollCount.current < 12) {
        pollCount.current++;
        loadOrder();
      } else {
        clearInterval(interval);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [orderId]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: "#070707" }}>
      <div className="max-w-md w-full text-center">
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 rounded-full flex items-center justify-center"
            style={{ background: "rgba(234,179,8,0.12)", border: "2px solid rgba(234,179,8,0.3)" }}>
            {checking ? <Loader2 size={36} className="animate-spin text-yellow-400" /> : <Clock size={40} className="text-yellow-400" />}
          </div>
        </div>

        <h1 className="text-3xl font-black text-white uppercase mb-2"
          style={{ fontFamily: "'Playfair Display', serif" }}>
          Pago Pendiente
        </h1>
        <p className="text-gray-400 text-sm mb-8">
          Tu pago está pendiente de acreditación. Te avisaremos cuando se confirme.
        </p>

        {order && (
          <div className="rounded-xl p-4 mb-8 text-left space-y-2 text-sm"
            style={{ background: "#111", border: "1px solid #222" }}>
            <div className="flex justify-between">
              <span className="text-gray-400">Evento</span>
              <span className="text-white font-medium text-right">{order.event_title}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Entradas</span>
              <span className="text-white font-semibold">{order.quantity}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Orden</span>
              <span className="text-gray-300 font-mono text-xs">{order.id?.slice(0, 12)}</span>
            </div>
          </div>
        )}

        <div className="rounded-xl p-4 mb-8 text-sm text-yellow-400"
          style={{ background: "rgba(234,179,8,0.06)", border: "1px solid rgba(234,179,8,0.2)" }}>
          Si pagaste por transferencia o efectivo, puede demorar hasta 48hs hábiles en acreditarse.
        </div>

        <button onClick={loadOrder} disabled={checking}
          className="w-full py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 mb-3"
          style={{
            background: checking ? "#333" : "linear-gradient(135deg, #C9A84C 0%, #E8C97A 50%, #C9A84C 100%)",
            color: "#0A0A0A",
            cursor: checking ? "not-allowed" : "pointer",
          }}>
          <RefreshCw size={15} className={checking ? "animate-spin" : ""} />
          {checking ? "Verificando..." : "Verificar estado del pago"}
        </button>

        <Link to={createPageUrl("MisEntradas")}>
          <button className="w-full py-3 rounded-xl text-sm text-gray-500"
            style={{ border: "1px solid #333" }}>
            Ver mis entradas más tarde
          </button>
        </Link>
      </div>
    </div>
  );
}