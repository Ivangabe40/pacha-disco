import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Clock } from "lucide-react";

export default function PaymentPending() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: "#070707" }}>
      <div className="max-w-md w-full text-center">
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 rounded-full flex items-center justify-center"
            style={{ background: "rgba(234,179,8,0.12)", border: "2px solid rgba(234,179,8,0.3)" }}>
            <Clock size={40} className="text-yellow-400" />
          </div>
        </div>

        <h1 className="text-3xl font-black text-white uppercase mb-2"
          style={{ fontFamily: "'Playfair Display', serif" }}>
          Pago Pendiente
        </h1>
        <p className="text-gray-400 text-sm mb-8">
          Tu pago está pendiente de acreditación. Te avisaremos cuando se confirme.
        </p>

        <div className="rounded-xl p-4 mb-8 text-sm text-yellow-400"
          style={{ background: "rgba(234,179,8,0.06)", border: "1px solid rgba(234,179,8,0.2)" }}>
          Si pagaste por transferencia o efectivo, puede demorar hasta 48hs hábiles en acreditarse.
        </div>

        <Link to={createPageUrl("Home")}>
          <button className="w-full py-3.5 rounded-xl font-bold text-sm"
            style={{ background: "linear-gradient(135deg, #C9A84C 0%, #E8C97A 50%, #C9A84C 100%)", color: "#0A0A0A" }}>
            Volver al inicio
          </button>
        </Link>
      </div>
    </div>
  );
}