import { createContext, useContext, useRef, useEffect, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const TAB_ROOTS = ["/", "/Home", "/Menu", "/Eventos"];

const TabHistoryContext = createContext(null);

export function TabHistoryProvider({ children }) {
  const location = useLocation();
  const navigate = useNavigate();
  const tabPaths = useRef(new Map());
  const activeTab = useRef(null);

  useEffect(() => {
    const path = location.pathname;
    if (TAB_ROOTS.includes(path)) {
      activeTab.current = path;
    }
    if (activeTab.current) {
      tabPaths.current.set(activeTab.current, path + location.search);
    }
  }, [location.pathname, location.search]);

  const navigateToTab = useCallback(
    (tabPath) => {
      // Volver a tocar la pestaña activa siempre lleva a su raíz
      if (activeTab.current === tabPath) {
        navigate(tabPath);
        return;
      }
      const saved = tabPaths.current.get(tabPath);
      if (saved && saved !== tabPath) {
        navigate(saved);
      } else {
        navigate(tabPath);
      }
    },
    [navigate]
  );

  return (
    <TabHistoryContext.Provider value={{ navigateToTab }}>
      {children}
    </TabHistoryContext.Provider>
  );
}

export function useTabHistory() {
  return useContext(TabHistoryContext);
}