import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App.tsx";

// Hidden "before reveal" states only apply under .motion-ok, so content stays
// visible when motion is reduced (or if scripts fail before this line).
const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
const applyMotion = () => document.documentElement.classList.toggle("motion-ok", !reduce.matches);
applyMotion();
reduce.addEventListener("change", applyMotion);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
);
