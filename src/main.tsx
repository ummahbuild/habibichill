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

createRoot(document.getElementById("root")!).render(<App />);
