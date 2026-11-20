import { useLocation, useNavigate } from "react-router-dom";
import { Home, Calendar, Wine, Sparkles } from "lucide-react";
import { useTabHistory } from "@/components/TabHistoryProvider";

const tabs = [
  { label: "Inicio", icon: Home, path: "/" },
  { label: "Eventos", icon: Calendar, path: "/Eventos" },
  { label: "EE", icon: Sparkles, path: "/Escape", ariaLabel: "Escape Experience" },
  { label: "Carta", icon: Wine, path: "/Menu" },
];

// Rutas privadas o administrativas: no muestran la barra pública.
const HIDDEN_ROUTES = new Set([
  "/Admin",
  "/configuracion",
  "/gestor-menu",
  "/QR",
  "/qr-carta",
  "/MisCuenta",
  "/pachi",
]);

export default function MobileBottomBar() {
  const location = useLocation();
  const navigate = useNavigate();
  const tabHistory = useTabHistory();

  if (HIDDEN_ROUTES.has(location.pathname)) return null;

  const handleTabClick = (path) => {
    if (tabHistory?.navigateToTab) {
      tabHistory.navigateToTab(path);
    } else {
      navigate(path);
    }
  };

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-50"
      style={{
        background: "rgba(7,7,7,0.97)",
        borderTop: "1px solid rgba(255,0,0,0.2)",
        backdropFilter: "blur(20px)",
        paddingBottom: "env(safe-area-inset-bottom, 0px)",
      }}
    >
      <div className="grid grid-cols-4 gap-1 px-2" style={{ height: 68 }}>
        {tabs.map(({ label, icon: Icon, path, ariaLabel }) => {
          const isActive =
            path === "/"
              ? location.pathname === "/" || location.pathname === "/Home"
              : location.pathname === path;
          return (
            <button
              key={path}
              onClick={() => handleTabClick(path)}
              aria-label={ariaLabel || label}
              aria-current={isActive ? "page" : undefined}
              className="flex flex-col items-center justify-center gap-1 min-w-0 h-full rounded-2xl active:scale-[0.96] transition-transform"
              style={{
                userSelect: "none",
                WebkitTapHighlightColor: "transparent",
                background: isActive ? "rgba(255,0,0,0.08)" : "transparent",
                border: "none",
                cursor: "pointer",
                touchAction: "manipulation",
                padding: 0,
              }}
            >
              <span
                className="flex items-center justify-center rounded-full shrink-0"
                style={{
                  width: 40,
                  height: 24,
                  background: isActive ? "rgba(255,0,0,0.16)" : "transparent",
                  boxShadow: isActive ? "0 0 14px rgba(255,0,0,0.3)" : "none",
                  transition: "background 0.2s, box-shadow 0.2s",
                }}
              >
                <Icon
                  size={22}
                  strokeWidth={isActive ? 2.4 : 1.9}
                  style={{ color: isActive ? "#FF3B30" : "#7a7a7a", transition: "color 0.2s" }}
                />
              </span>
              <span
                className="block text-[11px] font-semibold uppercase tracking-[0.06em] leading-[14px] whitespace-nowrap"
                style={{ color: isActive ? "#FF3B30" : "#8a8a8a", transition: "color 0.2s" }}
              >
                {label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}