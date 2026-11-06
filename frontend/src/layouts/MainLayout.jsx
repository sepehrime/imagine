import Header from "../components/Header";
import Footer from "../components/Footer";
import BackendStatusBanner from "../components/BackendStatusBanner";
import Celebration from "../components/Celebration";
import PageTransition from "../components/PageTransition";

/**
 * MainLayout Component
 *
 * SWE Design Patterns applied:
 * 1. The Layout / Wrapper Pattern: Keeps Header and Footer persistent across all views.
 * 2. Sticky Footer via Flexbox: Using `min-h-screen flex flex-col` guarantees the footer stays
 *    anchored at the bottom of the viewport even when page content is short.
 * 3. Responsive Container: Centralizes max-width constraint (`max-w-7xl`) and responsive padding
 *    so individual pages don't have to duplicate layout margins.
 * 4. App-Wide Overlays in One Place: the backend-offline banner, page transition and
 *    completion confetti are mounted here once, so no page has to remember them.
 */
export default function MainLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200">
      <Header />
      <BackendStatusBanner />
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10">
        <PageTransition>{children}</PageTransition>
      </main>
      <Footer />
      <Celebration />
    </div>
  );
}
