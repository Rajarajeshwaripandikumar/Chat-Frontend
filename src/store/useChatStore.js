// src/store/useChatStore.js
import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./useAuthStore";

/**
 * Notes:
 * - Server responses are normalized (support array root or { users: [...] }).
 * - Socket listener stored in state as `messageHandler` so we can off() exactly that handler.
 */

export const useChatStore = create((set, get) => ({
  messages: [],
  users: [],
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,
  messageHandler: null, // store current socket message handler so we can remove it

  // Helper to normalize response into an array
  _normalizeArrayResponse: (data) => {
    if (!data) return [];
    if (Array.isArray(data)) return data;
    if (Array.isArray(data.users)) return data.users;
    if (Array.isArray(data.data)) return data.data;
    return [];
  },

  // Fetch users for chat
  getUsers: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get("/messages/users");
      const users = get()._normalizeArrayResponse(res?.data);
      set({ users });
    } catch (error) {
      console.error("getUsers error:", error);
      toast.error(error?.response?.data?.message || "An error occurred while fetching users.");
      set({ users: [] });
    } finally {
      set({ isUsersLoading: false });
    }
  },

  // Fetch messages for selected user
  getMessages: async (userId) => {
    set({ isMessagesLoading: true });
    try {
      const res = await axiosInstance.get(`/messages/${userId}`);
      // support shapes: array root or { messages: [...] } or { ok:true, messages }
      const payload = res?.data;
      const messages = Array.isArray(payload)
        ? payload
        : Array.isArray(payload?.messages)
        ? payload.messages
        : Array.isArray(payload?.data)
        ? payload.data
        : [];

      set({ messages });
    } catch (error) {
      console.error("getMessages error:", error);
      toast.error(error?.response?.data?.message || "An error occurred while fetching messages.");
      set({ messages: [] });
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  // Send a message to the selected user
  sendMessage: async (messageData) => {
    const { selectedUser, messages } = get();
    if (!selectedUser) {
      toast.error("No recipient selected");
      return;
    }

    try {
      const res = await axiosInstance.post(`/messages/send/${selectedUser._id}`, messageData);

      // Normalize response: server might return the message directly or { message: {...} } or { ok:true, message }
      const payload = res?.data;
      const newMsg = payload?.message || payload?.data || payload;

      // In case server returns wrapper { ok:true, message: {...} }
      const resolved = newMsg?.message ? newMsg.message : newMsg;

      // Final fallback: if resolved is object and has ._id or .id assume it's a single message; otherwise ignore
      const finalMsg =
        resolved && (resolved._id || resolved.id || resolved.senderId) ? resolved : resolved;

      set({ messages: [...messages, finalMsg] });
    } catch (error) {
      console.error("sendMessage error:", error);
      toast.error(error?.response?.data?.message || "An error occurred while sending the message.");
    }
  },

  // Subscribe to incoming messages for the currently selected user
  subscribeToMessages: () => {
    const socket = useAuthStore.getState().socket;
    const selectedUser = get().selectedUser;
    if (!selectedUser) return;
    if (!socket || !socket.connected) {
      // optionally try to connect the socket here or inform user
      console.warn("subscribeToMessages: socket not connected");
      return;
    }

    // remove previous handler if any
    const prevHandler = get().messageHandler;
    if (prevHandler) {
      try {
        socket.off("newMessage", prevHandler);
      } catch (e) {
        console.warn("Error removing previous socket handler", e);
      }
    }

    // define a stable handler so we can remove it later
    const handler = (newMessage) => {
      try {
        // only append if the incoming message involves the selected user
        // Note: compare IDs as strings
        const selId = String(selectedUser._id || selectedUser.id);
        const fromId = String(newMessage.senderId || newMessage.sender || "");
        const toId = String(newMessage.receiverId || newMessage.toUserId || newMessage.to || "");

        // update only if message is from or to the selected user (adjust logic as you prefer)
        if (fromId === selId || toId === selId) {
          set((state) => ({ messages: [...state.messages, newMessage] }));
        }
      } catch (err) {
        console.error("socket newMessage handler error:", err);
      }
    };

    // register and save handler
    socket.on("newMessage", handler);
    set({ messageHandler: handler });
  },

  // Unsubscribe from incoming messages
  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;
    const handler = get().messageHandler;
    if (socket && handler) {
      try {
        socket.off("newMessage", handler);
      } catch (err) {
        console.warn("unsubscribeFromMessages error:", err);
      } finally {
        set({ messageHandler: null });
      }
    }
  },

  // Set the selected user for the chat (unsubscribe previous then subscribe new)
  setSelectedUser: (selectedUser) => {
    // Unsubscribe from previous user's messages
    get().unsubscribeFromMessages();

    // Set new selected user and reset messages (option: keep old messages if you cache per-user)
    set({ selectedUser, messages: [] });

    // Fetch conversation for new selected user (optional)
    get().getMessages(selectedUser._id);

    // Subscribe to new user's incoming messages
    // wait a tick to ensure selectedUser is set (not strictly necessary)
    setTimeout(() => {
      get().subscribeToMessages();
    }, 0);
  },
}));
