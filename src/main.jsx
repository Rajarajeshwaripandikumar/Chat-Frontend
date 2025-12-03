// src/main.jsx
import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ErrorBoundary } from "react-error-boundary";
import { Toaster, toast } from "react-hot-toast";
import App from "./App";
import "./index.css";

// START auth check as early as possible (fire-and-forget)
import { useAuthStore } from "./store/useAuthStore";
try {
  const s = useAuthStore.getState();
  if (s && typeof s.checkAuth === "function") {
    // fire-and-forget; components should react to isCheckingAuth/isAuth in store
    s.checkAuth();
  }
} catch (e) {
  console.warn("Early auth bootstrap failed:", e);
}

// Guard createRoot to avoid "already passed to createRoot()" warning in HMR
const container = document.getElementById("root");
if (!window.__REACT_ROOT__) {
  window.__REACT_ROOT__ = createRoot(container);
}

function ErrorFallback({ error, resetErrorBoundary }) {
  React.useEffect(() => {
    if (error) toast.error(`Something went wrong: ${error.message ?? "Unknown"}`);
  }, [error]);

  return (
    <div role="alert" className="p-4">
      <h2 className="text-lg font-semibold">Something went wrong</h2>
      <p className="mb-4">{error?.message ?? "Please try again."}</p>
      <button
        onClick={resetErrorBoundary}
        className="px-3 py-1 rounded bg-blue-600 text-white"
      >
        Try again
      </button>
    </div>
  );
}

window.__REACT_ROOT__.render(
  <React.StrictMode>
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <BrowserRouter
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true,
        }}
      >
        <Toaster />
        <App />
      </BrowserRouter>
    </ErrorBoundary>
  </React.StrictMode>
);
