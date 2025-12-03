// src/hooks/useSocket.js
import { useEffect, useRef, useState, useCallback } from "react";
import * as socketClient from "../lib/socketClient";

/**
 * useSocket({ socketUrl, opts, handlers })
 * - socketUrl: optional; if false, the hook doesn't connect
 * - opts: passed to socketClient.connect
 * - handlers: object of event handlers (connect, disconnect, newMessage, ...)
 *
 * Returns { socket, connected, disconnect }.
 */
export default function useSocket({ socketUrl = true, opts = {}, handlers = {} } = {}) {
  const [socket, setSocket] = useState(null); // state so consumers re-render when socket becomes available
  const socketRef = useRef(null); // mutable ref to same socket
  const handlersRef = useRef(handlers); // always contains latest handlers
  const attachedRef = useRef(new Map()); // Map<event, wrapperFn>
  const [connected, setConnected] = useState(false);

  // keep handlersRef current
  handlersRef.current = handlers;

  // stable disconnect that clears the singleton too
  const disconnect = useCallback(() => {
    try {
      // prefer socketClient.disconnect() to clear any shared singleton
      if (typeof socketClient.disconnect === "function") {
        socketClient.disconnect();
      } else {
        const s = socketRef.current;
        if (s && typeof s.disconnect === "function") s.disconnect();
      }
    } catch (e) {
      console.warn("[useSocket] disconnect error", e);
    } finally {
      setConnected(false);
      setSocket(null);
      socketRef.current = null;
      attachedRef.current.clear();
    }
  }, []);

  useEffect(() => {
    if (socketUrl === false) return undefined; // explicit opt-out

    let mounted = true;

    (async () => {
      try {
        // Prefer existing singleton socket if available
        let sock = socketClient.getSocket ? socketClient.getSocket() : null;

        if (!sock) {
          sock = await socketClient.connect(socketUrl, opts);
        }

        if (!mounted || !sock) {
          // if unmounted before connect finished, leave cleanup to return()
          return;
        }

        // set refs and state (consumer will re-render)
        socketRef.current = sock;
        setSocket(sock);

        // helper: attach an event with wrapper so we can reliably remove it later
        function attach(event, fn) {
          if (typeof fn !== "function") return;
          const wrapper = (...args) => {
            try {
              const latest = handlersRef.current?.[event];
              if (typeof latest === "function") latest(...args);
            } catch (err) {
              console.warn("[useSocket] handler error", event, err);
            }
          };
          // store the wrapper so off(event, wrapper) works
          const map = attachedRef.current;
          if (!map.has(event)) map.set(event, []);
          map.get(event).push(wrapper);
          sock.on(event, wrapper);
        }

        // Attach provided handlers
        Object.entries(handlersRef.current || {}).forEach(([event, fn]) => {
          attach(event, fn);
        });

        // Ensure we always maintain connected state
        // If user passed connect/disconnect handlers, we still hook up local state update
        const onConnect = () => {
          setConnected(true);
        };
        const onDisconnect = (reason) => {
          setConnected(false);
        };

        // attach these in addition to user handlers (so state updates reliably)
        attach("connect", onConnect);
        attach("disconnect", onDisconnect);

        // Optionally emit a 'connected' ack event (you had this pattern previously)
        // Not necessary to attach here; consumer can listen to "connected" if desired.

      } catch (err) {
        console.warn("[useSocket] connection error:", err && (err.message || err));
      }
    })();

    return () => {
      // cleanup: remove attached listeners (do NOT disconnect the socket here)
      try {
        const sock = socketRef.current;
        if (sock) {
          const map = attachedRef.current;
          for (const [event, wrappers] of map.entries()) {
            (wrappers || []).forEach((w) => {
              try { sock.off(event, w); } catch (e) { /* ignore */ }
            });
          }
        }
      } catch (e) {
        /* ignore cleanup errors */
      } finally {
        attachedRef.current.clear();
      }
    };
    // intentionally only run when socketUrl changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socketUrl]);

  return { socket, connected, disconnect };
}
