import { Link, useLocation } from "react-router-dom";
import { Home, Calendar, Wine, Crown, Coins } from "lucide-react";

const tabs = [
  { label: "Home", icon: Home, path: "/" },
  { label: "Eventos", icon: Calendar, path: "/Home" },
  { label: "Carta", icon: Wine, path: "/Menu" },
  { label: "VIP", icon: Crown, path: "/VIPReservations" },
  { label: "Mis Coins", icon: Coins, path: "/MisCuenta" },
];

export default function MobileBottomBar() {
  const location = useLocation();

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around"
      style={{
        background: "rgba(7,7,7,0.97)",
        borderTop: "1px solid rgba(232,0,29,0.2)",
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
          <Link
            key={path}
            to={path}
            className="flex flex-col items-center justify-center gap-1 flex-1 h-full"
            style={{ userSelect: "none", WebkitTapHighlightColor: "transparent" }}
          >
            <Icon
              size={20}
              style={{ color: isActive ? "#E8001D" : "#555", transition: "color 0.2s" }}
            />
            <span
              className="text-xs font-semibold tracking-wider"
              style={{ color: isActive ? "#E8001D" : "#555", transition: "color 0.2s" }}
            >
              {label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}