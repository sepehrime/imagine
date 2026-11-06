import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MotionConfig } from "framer-motion";
import { ThemeProvider } from "./context/ThemeContext";
import { ProgressProvider } from "./context/ProgressContext";
import MainLayout from "./layouts/MainLayout";
import ScrollToTop from "./components/ScrollToTop";

// Page Route Views
import Home from "./pages/Home";
import Neuron from "./pages/Neuron";
import Build from "./pages/Build";
import ForwardPass from "./pages/ForwardPass";
import Train from "./pages/Train";
import Boundary from "./pages/Boundary";
import Glossary from "./pages/Glossary";
import About from "./pages/About";
import NotFound from "./pages/NotFound";

/**
 * App Root Component
 *
 * SWE Design Patterns applied:
 * 1. Declarative Routing: React Router v7 <Routes> and <Route> establish clean URI mapping.
 * 2. Layout Wrapper: <MainLayout> surrounds all routes, preventing header/footer unmounting.
 * 3. Scroll Restoration: <ScrollToTop> resets viewport coordinates on every route change.
 * 4. Catch-All Route (404): `path="*"` gracefully handles unmapped URLs.
 * 5. Global Providers: <ProgressProvider> holds the one shared progress store;
 *    <MotionConfig reducedMotion="user"> makes every Framer Motion animation
 *    respect the OS "reduce motion" setting.
 */
export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <ThemeProvider>
        <ProgressProvider>
          <MotionConfig reducedMotion="user">
            <MainLayout>
              <Routes>
                {/* Landing & Curriculum Overview */}
                <Route path="/" element={<Home />} />

                {/* The 5 Core Neural Network Learning Sections */}
                <Route path="/neuron" element={<Neuron />} />
                <Route path="/build" element={<Build />} />
                <Route path="/forward-pass" element={<ForwardPass />} />
                <Route path="/train" element={<Train />} />
                <Route path="/boundary" element={<Boundary />} />

                {/* Reference Pages */}
                <Route path="/glossary" element={<Glossary />} />
                <Route path="/about" element={<About />} />

                {/* 404 Catch-All Fallback */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </MainLayout>
          </MotionConfig>
        </ProgressProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}
