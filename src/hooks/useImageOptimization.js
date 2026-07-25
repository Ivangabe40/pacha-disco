import { useEffect } from 'react';

/**
 * Optimizes all <img> elements on the page automatically:
 * - Adds decoding="async" for non-blocking image decode
 * - Images above the fold get fetchpriority="high" (load immediately)
 * - Images below the fold get loading="lazy" + fetchpriority="low" (defer until needed)
 * - Uses a MutationObserver to catch dynamically added images (API-loaded flyers, etc.)
 *
 * @param {Array} deps - Dependencies to re-run optimization on (e.g. [location.pathname])
 */
export function useImageOptimization(deps = []) {
  useEffect(() => {
    const optimizeImages = () => {
      const imgs = document.querySelectorAll('img:not([data-img-opt])');
      if (imgs.length === 0) return;

      imgs.forEach((img) => {
        img.setAttribute('data-img-opt', '1');
        img.setAttribute('decoding', 'async');

        const rect = img.getBoundingClientRect();
        const isAboveFold = rect.top < window.innerHeight * 0.8 && rect.bottom > 0;

        if (isAboveFold) {
          img.setAttribute('fetchpriority', 'high');
          // Ensure above-the-fold images load eagerly
          img.removeAttribute('loading');
        } else {
          if (!img.hasAttribute('loading')) {
            img.setAttribute('loading', 'lazy');
          }
          img.setAttribute('fetchpriority', 'low');
        }
      });
    };

    // Run after paint so layout positions are available
    const rafId = requestAnimationFrame(optimizeImages);

    // Re-run on scroll/resize to catch images that shifted into/out of viewport
    let scrollTimeout;
    const onScroll = () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(optimizeImages, 200);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });

    // Catch dynamically added images (API data, route changes, popups)
    const observer = new MutationObserver(() => {
      requestAnimationFrame(optimizeImages);
    });
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      cancelAnimationFrame(rafId);
      clearTimeout(scrollTimeout);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      observer.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}