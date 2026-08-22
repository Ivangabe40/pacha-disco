import { useLocation, useNavigate } from "react-router-dom";
import { Home, Calendar, Wine, Crown } from "lucide-react";
import { useTabHistory } from "@/components/TabHistoryProvider";

const tabs = [
  { label: "Inicio", icon: Home, path: "/" },
  { label: "Eventos", icon: Calendar, path: "/Home" },
  { label: "Carta", icon: Wine, path: "/Menu" },
  { label: "VIP", icon: Crown, path: "/VIPReservations" },
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
      className="md:hidden fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around"
      style={{
        background: "rgba(7,7,7,0.97)",
        borderTop: "1px solid rgba(255,0,0,0.2)",
        backdropFilter: "blur(20px)",
        paddingBottom: "env(safe-area-inset-bottom, 0px)",
        height: "calc(56px + env(safe-area-inset-bottom, 0px))",
      }}
    >
      {tabs.map(({ label, icon: Icon, path }) => {
        const isActive =
          path === "/"
            ? location.pathname === "/" || location.pathname === "/Home"
            : location.pathname === path;
        return (
          <button
            key={path}
            onClick={() => handleTabClick(path)}
            className="flex flex-col items-center justify-center gap-1 flex-1 h-full"
            style={{
              userSelect: "none",
              WebkitTapHighlightColor: "transparent",
              background: "none",
              border: "none",
              cursor: "pointer",
            }}
          >
            <Icon
              size={20}
              style={{ color: isActive ? "#FF0000" : "#555", transition: "color 0.2s" }}
            />
            <span
              className="text-xs font-semibold tracking-wider"
              style={{ color: isActive ? "#FF0000" : "#555", transition: "color 0.2s" }}
            >
              {label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}