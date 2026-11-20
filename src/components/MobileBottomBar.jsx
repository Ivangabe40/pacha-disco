import { useLocation, useNavigate } from "react-router-dom";
import { Home, Calendar, Wine, Sparkles, Bot } from "lucide-react";
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

  const items = [...tabs.slice(0, 2), { key: "pachi" }, ...tabs.slice(2)];

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
      <div className="grid grid-cols-5 gap-0.5 px-1 items-center" style={{ height: 68 }}>
        {items.map((item) => {
          if (item.key === "pachi") {
            return (
              <button
                key="pachi"
                onClick={() => window.dispatchEvent(new CustomEvent("pachi:open"))}
                aria-label="Abrir chat de Pachi Bot"
                className="flex flex-col items-center justify-center h-full active:scale-[0.96] transition-transform"
                style={{
                  userSelect: "none",
                  WebkitTapHighlightColor: "transparent",
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  touchAction: "manipulation",
                  padding: 0,
                }}
              >
                <span
                  className="flex items-center justify-center rounded-full"
                  style={{
                    width: 54,
                    height: 54,
                    marginTop: -22,
                    background: "linear-gradient(135deg, #FF0000, #CC0000)",
                    border: "2px solid #070707",
                    boxShadow: "0 4px 18px rgba(255,0,0,0.55)",
                  }}
                >
                  <Bot size={26} className="text-white" />
                </span>
              </button>
            );
          }

          const { label, icon: Icon, path, ariaLabel } = item;
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