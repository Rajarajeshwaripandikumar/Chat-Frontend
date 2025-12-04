import { X } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";

const ChatHeader = () => {
  const { selectedUser, setSelectedUser } = useChatStore();
  const { onlineUsers } = useAuthStore();

  const isOnline = onlineUsers.includes(selectedUser._id);

  return (
    <div className="px-4 py-3 border-b border-base-300 bg-base-100 flex-shrink-0 sticky top-0 z-10">
      <div className="flex items-center justify-between gap-3">
        {/* Left: avatar + name + status */}
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div className="avatar">
            <div className="w-10 h-10 rounded-full ring-2 ring-base-300 overflow-hidden">
              <img
                src={selectedUser.profilePic || "/avatar.png"}
                alt={selectedUser.fullName}
              />
            </div>
          </div>

          {/* User info */}
          <div className="flex flex-col">
            <h3 className="font-semibold text-sm text-base-content">
              {selectedUser.fullName}
            </h3>
            <div className="flex items-center gap-1 text-xs text-base-content/70">
              <span
                className={`inline-block h-2 w-2 rounded-full ${
                  isOnline ? "bg-success" : "bg-base-300"
                }`}
              />
              <span>{isOnline ? "Online" : "Offline"}</span>
            </div>
          </div>
        </div>

        {/* Right: close button */}
        <button
          onClick={() => setSelectedUser(null)}
          className="btn btn-ghost btn-sm rounded-full p-1"
          aria-label="Close chat"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default ChatHeader;
