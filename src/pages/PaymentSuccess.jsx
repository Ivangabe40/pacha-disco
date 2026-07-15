import { useState, useEffect, useRef, useCallback } from "react";
import { base44 } from "@/api/base44Client";
import { useSearchParams, Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { CheckCircle, Ticket, Loader2, Clock, AlertCircle, RefreshCw } from "lucide-react";
import TicketCard from "@/components/tickets/TicketCard";

export default function PaymentSuccess() {
  const [params] = useSearchParams();
  const orderId = params.get("external_reference");
  const [order, setOrder] = useState(null);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [polling, setPolling] = useState(false);
  const [stillProcessing, setStillProcessing] = useState(false);
  const pollCount = useRef(0);
  const timeoutRef = useRef(null);

  const checkOrder = useCallback(async () => {
    if (!orderId) {
      setLoading(false);
      return;
    }
    try {
      const o = await base44.entities.TicketOrder.get(orderId);
      setOrder(o);

      if (o.status === "approved") {
        const ticks = await base44.entities.Ticket.filter({ order_id: orderId });
        setTickets(ticks);
        setLoading(false);
        setPolling(false);
        setStillProcessing(false);
      } else if (o.status === "pending") {
        if (pollCount.current < 10) {
          pollCount.current++;
          setPolling(true);
          setLoading(false);
          timeoutRef.current = setTimeout(() => checkOrder(), 3000);
        } else {
          setPolling(false);
          setStillProcessing(true);
          setLoading(false);
        }
      } else {
        setLoading(false);
        setPolling(false);
      }
    } catch {
      setLoading(false);
      setPolling(false);
    }
  }, [orderId]);

  useEffect(() => {
    checkOrder();
    return () => { if (timeoutRef.current) clearTimeout(timeoutRef.current); };
  }, [checkOrder]);

  const handleRefresh = () => {
    pollCount.current = 0;
    setStillProcessing(false);
    setLoading(true);
    checkOrder();
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12" style={{ background: "#070707" }}>
      <div className="max-w-md w-full text-center">
        {loading || polling ? (
          <>
            <div className="flex justify-center mb-6">
              <Loader2 size={48} className="animate-spin" style={{ color: "#C9A84C" }} />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
              Confirmando tu pago...
            </h1>
            <p className="text-gray-500 text-sm">
              Estamos verificando tu pago con Mercado Pago. Esto puede tardar unos segundos.
            </p>
          </>
        ) : stillProcessing ? (
          <>
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 rounded-full flex items-center justify-center"
                style={{ background: "rgba(234,179,8,0.12)", border: "2px solid rgba(234,179,8,0.3)" }}>
                <Clock size={40} className="text-yellow-400" />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-white mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
              Procesando tu pago
            </h1>
            <p className="text-gray-400 text-sm mb-6">
              Tu pago está siendo procesado por Mercado Pago. Las entradas aparecerán automáticamente cuando se confirme.
            </p>
            {order && (
              <div className="rounded-xl p-4 mb-6 text-sm text-gray-400"
                style={{ background: "#111", border: "1px solid #222" }}>
                <p>Orden: <span className="text-gray-300 font-mono">{order.id?.slice(0, 12)}</span></p>
                <p className="mt-1">{order.event_title} · {order.quantity} entrada(s)</p>
              </div>
            )}
            <button onClick={handleRefresh}
              className="w-full py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 mb-3"
              style={{ background: "linear-gradient(135deg, #C9A84C 0%, #E8C97A 50%, #C9A84C 100%)", color: "#0A0A0A" }}>
              <RefreshCw size={15} /> Verificar estado del pago
            </button>
            <Link to={createPageUrl("MisCuenta")}>
              <button className="w-full py-3 rounded-xl text-sm text-gray-500"
                style={{ border: "1px solid #333" }}>
                Ver mis entradas más tarde
              </button>
            </Link>
          </>
        ) : order?.status === "approved" ? (
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
            <p className="text-gray-400 text-sm mb-2">Tu pago fue procesado correctamente.</p>
            <p className="text-gray-600 text-xs mb-6">
              {tickets.length} entrada(s) · Orden {order.id?.slice(0, 12)}
            </p>

            <div className="space-y-4 mb-8 text-left">
              {tickets.map((ticket, i) => (
                <TicketCard key={ticket.id} ticket={ticket} index={i} />
              ))}
            </div>

            <Link to={createPageUrl("MisCuenta")}>
              <button className="w-full py-3.5 rounded-xl font-bold text-sm mb-3"
                style={{ background: "linear-gradient(135deg, #C9A84C 0%, #E8C97A 50%, #C9A84C 100%)", color: "#0A0A0A" }}>
                Ver mis entradas
              </button>
            </Link>
            <Link to={createPageUrl("Home")}>
              <button className="w-full py-3 rounded-xl text-sm text-gray-500"
                style={{ border: "1px solid #333" }}>
                Volver al inicio
              </button>
            </Link>
          </>
        ) : order?.status === "rejected" ? (
          <>
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 rounded-full flex items-center justify-center"
                style={{ background: "rgba(239,68,68,0.12)", border: "2px solid rgba(239,68,68,0.3)" }}>
                <AlertCircle size={40} className="text-red-400" />
              </div>
            </div>
            <h1 className="text-3xl font-black text-white uppercase mb-2"
              style={{ fontFamily: "'Playfair Display', serif" }}>
              Pago Rechazado
            </h1>
            <p className="text-gray-400 text-sm mb-8">Tu pago fue rechazado. Podés intentar nuevamente.</p>
            <Link to={createPageUrl("TicketSales") + (order?.event_id ? "?event=" + order.event_id : "")} className="block">
              <button className="w-full py-3.5 rounded-xl font-bold text-sm mb-3"
                style={{ background: "linear-gradient(135deg, #009EE3 0%, #00B7EA 100%)", color: "#fff" }}>
                Reintentar compra
              </button>
            </Link>
            <Link to={createPageUrl("Home")}>
              <button className="w-full py-3 rounded-xl text-sm text-gray-500"
                style={{ border: "1px solid #333" }}>
                Volver al inicio
              </button>
            </Link>
          </>
        ) : (
          <>
            <div className="flex justify-center mb-6">
              <Ticket size={48} style={{ color: "#C9A84C", opacity: 0.4 }} />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
              No se encontró la orden
            </h1>
            <p className="text-gray-500 text-sm mb-6">Si creés que es un error, contactanos.</p>
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