import { useLocation, useNavigate } from "react-router-dom";
import { Home, Calendar, Wine } from "lucide-react";
import { useTabHistory } from "@/components/TabHistoryProvider";

const tabs = [
  { label: "Inicio", icon: Home, path: "/" },
  { label: "Eventos", icon: Calendar, path: "/Eventos" },
  { label: "Carta", icon: Wine, path: "/Menu" },
];

const HIDE_ON = ["/Admin", "/admin", "/configuracion", "/gestor-menu", "/MisCuenta", "/QR", "/qr-carta", "/pachi"];

export default function MobileBottomBar() {
  const location = useLocation();
  const navigate = useNavigate();
  const tabHistory = useTabHistory();

  if (HIDE_ON.some((path) => location.pathname.toLowerCase().startsWith(path.toLowerCase()))) return null;

  const handleTabClick = (path) => {
    if (tabHistory?.navigateToTab) tabHistory.navigateToTab(path);
    else navigate(path);
  };

  const isTabActive = (path) => {
    const current = location.pathname.toLowerCase();
    if (path === "/") return current === "/" || current === "/home";
    if (path === "/Eventos") return current === "/eventos" || current.startsWith("/eventdetail");
    if (path === "/Menu") return current === "/menu" || current === "/qr-carta";
    return current === path.toLowerCase();
  };

  return (
    <nav aria-label="Navegación principal móvil" className="md:hidden fixed bottom-0 left-0 right-0 z-50" style={{ background: "rgba(7,7,7,0.97)", borderTop: "1px solid rgba(255,0,0,0.2)", backdropFilter: "blur(20px)", paddingBottom: "env(safe-area-inset-bottom, 0px)" }}>
      <div className="grid grid-cols-3 gap-1 px-2" style={{ minHeight: 68 }}>
        {tabs.map(({ label, icon: Icon, path }) => {
          const active = isTabActive(path);
          return (
            <button key={path} type="button" onClick={() => handleTabClick(path)} aria-label={label} aria-current={active ? "page" : undefined}
              className="flex flex-col items-center justify-center gap-1 min-w-0 min-h-[64px] rounded-2xl active:scale-[0.97] transition-transform focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-3px] focus-visible:outline-red-500"
              style={{ userSelect: "none", WebkitTapHighlightColor: "transparent", background: active ? "rgba(255,0,0,0.08)" : "transparent", border: "none", cursor: "pointer", touchAction: "manipulation", padding: "6px 0" }}>
              <span className="flex items-center justify-center rounded-full shrink-0" style={{ width: 40, height: 24, background: active ? "rgba(255,0,0,0.16)" : "transparent" }}>
                <Icon size={22} strokeWidth={active ? 2.4 : 1.9} style={{ color: active ? "#FF3B30" : "#8a8a8a" }} />
              </span>
              <span className="block text-[11px] font-semibold uppercase tracking-[0.06em] leading-[14px] whitespace-nowrap" style={{ color: active ? "#FF3B30" : "#9a9a9a" }}>{label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
