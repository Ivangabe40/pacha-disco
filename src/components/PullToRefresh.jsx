import { useRef, useState, useEffect } from "react";
import { RefreshCw, ChevronDown } from "lucide-react";

const PULL_THRESHOLD = 70;
const MAX_PULL = 100;

export default function PullToRefresh({ onRefresh, children }) {
  const [pullDistance, setPullDistance] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const containerRef = useRef(null);
  const startY = useRef(0);
  const pulling = useRef(false);
  const pullDistRef = useRef(0);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const handleTouchStart = (e) => {
      if (isRefreshing) return;
      if (window.scrollY > 0) return;
      startY.current = e.touches[0].clientY;
      pulling.current = true;
    };

    const handleTouchMove = (e) => {
      if (!pulling.current || isRefreshing) return;
      const diff = e.touches[0].clientY - startY.current;
      if (diff <= 0) {
        if (pullDistRef.current !== 0) {
          pullDistRef.current = 0;
          setPullDistance(0);
        }
        return;
      }
      // Prevent native scroll/bounce while pulling
      e.preventDefault();
      const dist = Math.min(diff * 0.5, MAX_PULL);
      pullDistRef.current = dist;
      setPullDistance(dist);
    };

    const handleTouchEnd = async () => {
      if (!pulling.current) return;
      pulling.current = false;
      const dist = pullDistRef.current;
      if (dist >= PULL_THRESHOLD) {
        setIsRefreshing(true);
        setPullDistance(PULL_THRESHOLD);
        pullDistRef.current = PULL_THRESHOLD;
        try {
          await onRefresh();
        } finally {
          setIsRefreshing(false);
          setPullDistance(0);
          pullDistRef.current = 0;
        }
      } else {
        setPullDistance(0);
        pullDistRef.current = 0;
      }
    };

    el.addEventListener("touchstart", handleTouchStart, { passive: true });
    el.addEventListener("touchmove", handleTouchMove, { passive: false });
    el.addEventListener("touchend", handleTouchEnd, { passive: true });

    return () => {
      el.removeEventListener("touchstart", handleTouchStart);
      el.removeEventListener("touchmove", handleTouchMove);
      el.removeEventListener("touchend", handleTouchEnd);
    };
  }, [isRefreshing, onRefresh]);

  const progress = Math.min(pullDistance / PULL_THRESHOLD, 1);

  return (
    <div ref={containerRef} style={{ position: "relative", overflow: "visible" }}>
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
          <RefreshCw size={22} className="animate-spin" style={{ color: "#75AADB" }} />
        ) : pullDistance > 5 ? (
          <ChevronDown
            size={22}
            style={{
              color: "#75AADB",
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