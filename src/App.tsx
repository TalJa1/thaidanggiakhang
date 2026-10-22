import { lazy, Suspense, useEffect } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import BootLoader from "./components/BootLoader";
import CommandPalette from "./components/CommandPalette";
import CursorCrosshair from "./components/CursorCrosshair";
import Footer from "./components/Footer";
import GridBackground from "./components/GridBackground";
import Header from "./components/Header";
import Magnetic from "./components/Magnetic";
import PageTransition from "./components/PageTransition";
import ScrollManager from "./components/ScrollManager";
import ScrollRuler from "./components/ScrollRuler";
import { UI } from "./data/content";
import { useFpsGuard } from "./hooks/useFpsGuard";
import { useReducedMotion } from "./hooks/useReducedMotion";
import { startSmoothScroll, stopSmoothScroll } from "./lib/scroll";

const Home = lazy(() => import("./pages/Home"));
const About = lazy(() => import("./pages/About"));
const PassionProject = lazy(() => import("./pages/PassionProject"));
const Research = lazy(() => import("./pages/Research"));
const Community = lazy(() => import("./pages/Community"));
const Awards = lazy(() => import("./pages/Awards"));

function RouteFallback() {
  return (
    <div className="route-fallback" aria-hidden="true">
      <span className="route-fallback__bar" />
      <span className="route-fallback__txt">SYS · SCAN</span>
    </div>
  );
}

export default function App() {
  const location = useLocation();
  const reduced = useReducedMotion();
  useFpsGuard();

  useEffect(() => {
    if (reduced) return;
    startSmoothScroll();
    return () => stopSmoothScroll();
  }, [reduced]);

  return (
    <>
      <a href="#main" className="skip-link">
        {UI.skip}
      </a>
      <GridBackground />
      <Header />
      <main id="main" tabIndex={-1}>
        <Suspense fallback={<RouteFallback />}>
          <div key={location.pathname} className="route">
            <Routes location={location}>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/passion-project" element={<PassionProject />} />
              <Route path="/research" element={<Research />} />
              <Route path="/community" element={<Community />} />
              <Route path="/awards" element={<Awards />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </Suspense>
      </main>
      <Footer />
      <ScrollRuler />
      <CommandPalette />
      <CursorCrosshair />
      <Magnetic />
      <ScrollManager />
      <PageTransition />
      <BootLoader />
    </>
  );
}
