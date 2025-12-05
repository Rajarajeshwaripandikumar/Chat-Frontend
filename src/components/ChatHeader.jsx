import { X } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";

const ChatHeader = () => {
  const { selectedUser, setSelectedUser } = useChatStore();
  const { onlineUsers } = useAuthStore();

  const isOnline = onlineUsers.includes(selectedUser._id);

  return (
    <div className="px-3 sm:px-4 py-2.5 sm:py-3 border-b border-base-300 bg-base-100 flex-shrink-0">
      <div className="flex items-center justify-between gap-3 min-w-0">
        {/* Left: avatar + name + status */}
        <div className="flex items-center gap-3 min-w-0">
          {/* Avatar */}
          <div className="avatar">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full ring-2 ring-base-300 overflow-hidden">
              <img
                src={selectedUser.profilePic || "/avatar.png"}
                alt={selectedUser.fullName}
              />
            </div>
          </div>

          {/* User info */}
          <div className="flex flex-col min-w-0">
            <h3 className="font-semibold text-sm text-base-content truncate max-w-[120px] sm:max-w-xs">
              {selectedUser.fullName}
            </h3>
            <div className="flex items-center gap-1 text-[11px] sm:text-xs text-base-content/70">
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
          className="btn btn-ghost btn-xs sm:btn-sm rounded-full p-1"
          aria-label="Close chat"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default ChatHeader;
