import { useRef, useState, useCallback } from "react";
import { RefreshCw, ChevronDown } from "lucide-react";

const PULL_THRESHOLD = 70;
const MAX_PULL = 100;

export default function PullToRefresh({ onRefresh, children }) {
  const [pullDistance, setPullDistance] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const startY = useRef(0);
  const pulling = useRef(false);

  const handleTouchStart = useCallback(
    (e) => {
      if (isRefreshing) return;
      if (window.scrollY > 0) return;
      startY.current = e.touches[0].clientY;
      pulling.current = true;
    },
    [isRefreshing]
  );

  const handleTouchMove = useCallback(
    (e) => {
      if (!pulling.current || isRefreshing) return;
      const diff = e.touches[0].clientY - startY.current;
      if (diff <= 0) {
        setPullDistance(0);
        return;
      }
      setPullDistance(Math.min(diff * 0.5, MAX_PULL));
    },
    [isRefreshing]
  );

  const handleTouchEnd = useCallback(async () => {
    if (!pulling.current) return;
    pulling.current = false;
    if (pullDistance >= PULL_THRESHOLD) {
      setIsRefreshing(true);
      setPullDistance(PULL_THRESHOLD);
      try {
        await onRefresh();
      } finally {
        setIsRefreshing(false);
        setPullDistance(0);
      }
    } else {
      setPullDistance(0);
    }
  }, [pullDistance, onRefresh, isRefreshing]);

  const progress = Math.min(pullDistance / PULL_THRESHOLD, 1);

  return (
    <div style={{ position: "relative", overflow: "visible" }}>
      {/* Pull indicator — revealed behind content as it slides down */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: pullDistance,
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "center",
          overflow: "hidden",
          zIndex: 0,
          background: "#070707",
          paddingBottom: 10,
          transition: pulling.current ? "none" : "height 0.3s ease",
        }}
      >
        {isRefreshing ? (
          <RefreshCw size={22} className="animate-spin" style={{ color: "#E8001D" }} />
        ) : pullDistance > 5 ? (
          <ChevronDown
            size={22}
            style={{
              color: "#E8001D",
              opacity: progress,
              transform: `scale(${0.6 + progress * 0.4})`,
              transition: "transform 0.1s",
            }}
          />
        ) : null}
      </div>
      {/* Content slides down on pull */}
      <div
        style={{
          transform: `translateY(${pullDistance}px)`,
          transition: pulling.current ? "none" : "transform 0.3s ease",
          position: "relative",
          zIndex: 1,
        }}
      >
        {children}
      </div>
    </div>
  );
}