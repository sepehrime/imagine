import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * ScrollToTop Component
 *
 * SWE Design Pattern: SPA Scroll Restoration.
 * In a traditional multi-page website, navigating to a new URL causes the browser to reload
 * and start at the top of the viewport. In a Single Page Application (SPA), client-side route
 * transitions swap out components without a browser reload, which can leave the user stranded
 * halfway down the next page.
 *
 * This utility component listens to pathname mutations from React Router and imperatively
 * resets the scroll coordinates to the top of the window.
 *
 * Deep links are respected: when the URL has a #hash (e.g. /glossary#weight),
 * it does nothing and lets the target page scroll to that element instead.
 */
export default function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) return;
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant",
    });
  }, [pathname, hash]);

  return null;
}
