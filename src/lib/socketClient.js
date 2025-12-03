// src/lib/socketClient.js
import { io } from "socket.io-client";

let socket = null;
let currentToken = null;

// Same key as axios/useAuthStore
const TOKEN_STORAGE_KEY = "token";

const RAW_URL = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "") || "";
const NAMESPACE = "/chat";

function buildNamespaceUrl(rawUrl) {
  if (!rawUrl) return "";
  let u = rawUrl.replace(/\/+$/, "");
  u = u.replace(/\/api(\/.*)?$/i, ""); // strip /api
  if (u.endsWith(NAMESPACE)) return u;
  return `${u}${NAMESPACE}`;
}

const url = buildNamespaceUrl(RAW_URL);
const endpoint = url || NAMESPACE; // "" => "/chat"

/** Create a new socket instance with the current token */
function createSocket(token) {
  if (socket) {
    try {
      socket.disconnect();
    } catch {}
    socket = null;
  }

  socket = io(endpoint, {
    path: "/socket.io",
    withCredentials: true,
    auth: token ? { token } : {}, // <--- token-based auth
    autoConnect: false,
    reconnection: true,
    reconnectionAttempts: Infinity,
    reconnectionDelay: 500,
    reconnectionDelayMax: 2000,
  });

  socket.on("connect", () => {
    console.log("[socketClient] connected:", socket.id);
  });

  socket.on("disconnect", (reason) => {
    console.log("[socketClient] disconnected:", reason);
  });

  socket.on("connect_error", (err) => {
    console.warn("[socketClient] connect_error:", err?.message || err);
  });

  return socket;
}

/** Set/clear token in memory + localStorage (NO auto-connect) */
export function setToken(token) {
  currentToken = token || null;

  if (typeof window !== "undefined" && window.localStorage) {
    try {
      if (token) {
        window.localStorage.setItem(TOKEN_STORAGE_KEY, token);
      } else {
        window.localStorage.removeItem(TOKEN_STORAGE_KEY);
      }
    } catch {}
  }
}

/** Wait for an active connection */
export function waitForConnect(timeoutMs = 8000) {
  const token =
    currentToken ||
    (typeof window !== "undefined" &&
      window.localStorage?.getItem(TOKEN_STORAGE_KEY)) ||
    null;

  if (socket && socket.connected) return Promise.resolve(socket);

  const s = createSocket(token);

  return new Promise((resolve, reject) => {
    let timer = null;

    const onConnect = () => {
      cleanup();
      resolve(s);
    };

    const onError = (err) => {
      cleanup();
      reject(err || new Error("connect_error"));
    };

    const cleanup = () => {
      try {
        s.off("connect", onConnect);
        s.off("connect_error", onError);
      } catch {}
      if (timer) {
        clearTimeout(timer);
        timer = null;
      }
    };

    s.once("connect", onConnect);
    s.once("connect_error", onError);

    s.connect();

    if (timeoutMs > 0) {
      timer = setTimeout(() => {
        cleanup();
        reject(new Error("connect_timeout"));
      }, timeoutMs);
    }
  });
}

export function getSocket() {
  return socket;
}

export function disconnect() {
  currentToken = null;
  if (typeof window !== "undefined" && window.localStorage) {
    try {
      window.localStorage.removeItem(TOKEN_STORAGE_KEY);
    } catch {}
  }
  if (socket) {
    try {
      socket.disconnect();
    } catch {}
    socket = null;
  }
}

export function isConnected() {
  return !!(socket && socket.connected);
}

export function on(event, handler) {
  if (!socket) return;
  socket.on(event, handler);
}

export function off(event, handler) {
  if (!socket) return;
  socket.off(event, handler);
}
