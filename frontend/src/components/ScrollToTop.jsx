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
 */
export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant",
    });
  }, [pathname]);

  return null;
}
