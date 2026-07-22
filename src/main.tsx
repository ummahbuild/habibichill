import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

const restoreRedirectedPath = () => {
  const params = new URLSearchParams(window.location.search);
  const redirectedPath = params.get("redirect");

  if (!redirectedPath) return;

  const nextUrl = decodeURIComponent(redirectedPath);
  window.history.replaceState(null, "", nextUrl);
};

restoreRedirectedPath();

const rootEl = document.getElementById("root");
if (!rootEl) {
  document.body.innerHTML =
    '<main style="font-family:system-ui;padding:2rem;text-align:center"><h1>HabibiChill failed to start</h1><p>Please reload the page.</p><button onclick="location.reload()">Reload</button></main>';
} else {
  createRoot(rootEl).render(<App />);
}
