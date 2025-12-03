// src/hooks/useAuthStore.js
import { create } from "zustand";
import { axiosInstance, setAuthToken as _setAuthToken } from "../lib/axios.js";
import toast from "react-hot-toast";
import * as socketClient from "../lib/socketClient.js";

/** ================================
 *  Centralized token setter wrapper
 *  ================================ */
async function setAuthToken(token) {
  try {
    await _setAuthToken(token); // centralized header + localStorage sync
  } catch (e) {
    console.warn("[auth] _setAuthToken error:", e?.message);
  }
}

/** Parse backend responses */
function normalizeUser(data) {
  if (!data) return null;

  // backend returns:
  // { "_id","fullName","email","profilePic","token" }
  if (data._id) {
    return {
      _id: data._id,
      fullName: data.fullName || "",
      email: data.email || "",
      profilePic: data.profilePic || null,
    };
  }

  // fallback for { user: {...} }
  return data.user || null;
}

/** Zustand Auth Store */
export const useAuthStore = create((set, get) => {
  let authPromise = null;

  return {
    authUser: null,
    isSigningUp: false,
    isLoggingIn: false,
    isUpdatingProfile: false,
    isCheckingAuth: true,
    socket: null,
    onlineUsers: [],

    /** =====================
     *  Error handler
     *  ===================== */
    handleError: (error) => {
      if (error?.response)
        return error.response.data?.message || "Something went wrong.";

      if (error?.request) return "Network error.";

      return "Unexpected error.";
    },

    /** =====================
     *       checkAuth()
     *  ===================== */
    checkAuth: () => {
      if (authPromise) return authPromise;

      authPromise = (async () => {
        set({ isCheckingAuth: true });
        try {
          // 1) try cookie-based
          try {
            console.log("[auth] checking /auth/me via cookie");
            const res = await axiosInstance.get("/auth/me", {
              withCredentials: true,
            });

            const user = normalizeUser(res.data.user);
            console.log("[auth] cookie /me:", user);

            if (user) {
              set({ authUser: user });

              // If we already have a token from previous login, use it for sockets
              const token = localStorage.getItem("token");
              console.log(
                "[auth] cookie /me: token from localStorage?",
                !!token
              );

              if (token) {
                await setAuthToken(token); // ensure axios header in sync
                await get().connectSocket();
              } else {
                console.warn(
                  "[auth] cookie /me success but NO token in localStorage → sockets offline until login"
                );
              }

              return user;
            }
          } catch (e) {
            console.log(
              "[auth] /auth/me cookie failed, falling back to token",
              e?.message
            );
          }

          // 2) localStorage token
          const token = localStorage.getItem("token");
          if (!token) {
            console.log("[auth] no token → user null");
            set({ authUser: null });
            return null;
          }

          console.log(
            "[auth] found token in localStorage, verifying with /auth/check"
          );
          // IMPORTANT: use centralized setter so axios + storage stay in sync
          await setAuthToken(token);

          const res = await axiosInstance.get("/auth/check", {
            withCredentials: true,
          });

          const user = normalizeUser(res.data.user || res.data);
          console.log("[auth] /auth/check:", user);

          if (user) {
            set({ authUser: user });
            await get().connectSocket();
            return user;
          }

          console.log("[auth] token invalid, clearing");
          await setAuthToken(null);
          localStorage.removeItem("token");
          set({ authUser: null });
          return null;
        } catch (e) {
          console.warn("[auth] checkAuth fatal:", e);
          await setAuthToken(null);
          localStorage.removeItem("token");
          set({ authUser: null });
          return null;
        } finally {
          set({ isCheckingAuth: false });
          authPromise = null;
        }
      })();

      return authPromise;
    },

    /** =====================
     *      SIGNUP
     *  ===================== */
    signup: async (data) => {
      set({ isSigningUp: true });

      try {
        const res = await axiosInstance.post("/auth/signup", data, {
          withCredentials: true,
        });

        const token = res.data.token || null;
        const user = normalizeUser(res.data);

        if (token) {
          await setAuthToken(token); // handles axios + localStorage
          console.log("[SIGNUP] Token stored");
        }

        set({ authUser: user });
        toast.success("Account created!");

        await get().connectSocket();
      } catch (error) {
        toast.error(get().handleError(error));
      } finally {
        set({ isSigningUp: false, isCheckingAuth: false });
      }
    },

    /** =====================
     *       LOGIN
     *  ===================== */
    login: async (data) => {
      set({ isLoggingIn: true });

      try {
        const res = await axiosInstance.post("/auth/login", data, {
          withCredentials: true,
        });

        console.log("[LOGIN] response:", res.data);

        // backend returns token + user fields together
        const token = res.data.token;
        const user = normalizeUser(res.data);

        if (token) {
          await setAuthToken(token); // axios header + localStorage
          console.log("[LOGIN] Token stored:", token);
        }

        set({ authUser: user });
        toast.success("Logged in!");

        await get().connectSocket();
      } catch (error) {
        toast.error(get().handleError(error));
      } finally {
        set({ isLoggingIn: false, isCheckingAuth: false });
      }
    },

    /** =====================
     *        LOGOUT
     *  ===================== */
    logout: async () => {
      try {
        await axiosInstance.post("/auth/logout", {}, { withCredentials: true });
      } catch (e) {
        console.log("[auth] /auth/logout failed (ignoring):", e?.message);
      }

      await setAuthToken(null);
      localStorage.removeItem("token");

      socketClient.disconnect();

      set({ authUser: null, socket: null, onlineUsers: [] });

      toast.success("Logged out!");
    },

    /** =====================
     *   UPDATE PROFILE
     *  ===================== */
    updateProfile: async (data) => {
      set({ isUpdatingProfile: true });

      try {
        const res = await axiosInstance.put("/auth/update-profile", data, {
          withCredentials: true,
        });

        const user = normalizeUser(res.data.user || res.data);
        set({ authUser: user });

        toast.success("Profile updated!");
      } catch (e) {
        toast.error(get().handleError(e));
      } finally {
        set({ isUpdatingProfile: false });
      }
    },

    /** =====================
     *    CONNECT SOCKET
     *  ===================== */
    connectSocket: async () => {
      const token = localStorage.getItem("token");
      const authUser = get().authUser;

      console.log(
        "[socket] connectSocket → token?",
        !!token,
        "user?",
        !!authUser
      );

      // require user; require token for token-based socket auth
      if (!authUser || !token) {
        console.warn("[socket] abort: missing user or token");
        return;
      }

      // avoid duplicate connections
      const existing = get().socket;
      if (existing && existing.connected) {
        console.log("[socket] already connected, skipping re-connect");
        return;
      }

      // keep socketClient token in sync
      socketClient.setToken(token);

      try {
        await socketClient.waitForConnect(8000);
      } catch (e) {
        console.warn("[socket] waitForConnect failed:", e?.message || e);
      }

      const s = socketClient.getSocket();
      set({ socket: s });

      if (!s) return;

      // Listeners
      s.on("connect", () => {
        console.log("[socket] connected:", s.id);
      });

      s.on("getOnlineUsers", (list) => {
        set({ onlineUsers: list });
      });

      s.on("unauthorized", () => {
        toast.error("Socket unauthorized");
        get().logout();
      });
    },

    /** =====================
     *    DISCONNECT SOCKET
     *  ===================== */
    disconnectSocket: () => {
      socketClient.disconnect();
      set({ socket: null, onlineUsers: [] });
    },
  };
});
