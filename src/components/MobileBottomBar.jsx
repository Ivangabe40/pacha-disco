import { useLocation, useNavigate } from "react-router-dom";
import { Home, Calendar, Wine } from "lucide-react";
import { useTabHistory } from "@/components/TabHistoryProvider";

const tabs = [
  { label: "Inicio", icon: Home, path: "/" },
  { label: "Eventos", icon: Calendar, path: "/Eventos" },
  { label: "Carta", icon: Wine, path: "/Menu" },
];

export default function MobileBottomBar() {
  const location = useLocation();
  const navigate = useNavigate();
  const tabHistory = useTabHistory();

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
        height: "calc(68px + env(safe-area-inset-bottom, 0px))",
      }}
    >
      <div className="flex items-stretch h-full px-3 gap-2">
        {tabs.map(({ label, icon: Icon, path }) => {
          const isActive =
            path === "/"
              ? location.pathname === "/" || location.pathname === "/Home"
              : location.pathname === path;
          return (
            <button
              key={path}
              onClick={() => handleTabClick(path)}
              aria-label={label}
              aria-current={isActive ? "page" : undefined}
              className="flex flex-col items-center justify-center gap-1.5 flex-1 my-1.5 rounded-2xl active:scale-[0.96] transition-transform"
              style={{
                userSelect: "none",
                WebkitTapHighlightColor: "transparent",
                background: isActive ? "rgba(255,0,0,0.08)" : "transparent",
                border: "none",
                cursor: "pointer",
                touchAction: "manipulation",
              }}
            >
              <span
                className="flex items-center justify-center rounded-full"
                style={{
                  width: 42,
                  height: 26,
                  background: isActive ? "rgba(255,0,0,0.16)" : "transparent",
                  boxShadow: isActive ? "0 0 16px rgba(255,0,0,0.35)" : "none",
                  transition: "background 0.2s, box-shadow 0.2s",
                }}
              >
                <Icon
                  size={23}
                  strokeWidth={isActive ? 2.4 : 1.9}
                  style={{ color: isActive ? "#FF3B30" : "#6b6b6b", transition: "color 0.2s" }}
                />
              </span>
              <span
                className="text-[11px] font-semibold uppercase tracking-[0.12em] leading-none"
                style={{ color: isActive ? "#FF3B30" : "#777", transition: "color 0.2s" }}
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