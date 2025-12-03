import { useEffect, useState, useMemo, useCallback } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import SidebarSkeleton from "./skeletons/SidebarSkeleton";
import { Users } from "lucide-react";

const LOCAL_KEY = "chat:selectedUserId";

const Sidebar = () => {
  const { getUsers, users, selectedUser, setSelectedUser, isUsersLoading } = useChatStore();
  const { onlineUsers } = useAuthStore();
  const [showOnlineOnly, setShowOnlineOnly] = useState(false);

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  // Normalize users -> always an array
  const usersArray = Array.isArray(users)
    ? users
    : (users && Array.isArray(users.users) ? users.users : []); // support nested shapes

  // useMemo to avoid re-filtering every render
  const filteredUsers = useMemo(() => {
    if (showOnlineOnly) {
      const onlineSet = new Set((onlineUsers || []).map((id) => String(id)));
      return usersArray.filter((u) => onlineSet.has(String(u._id || u.id)));
    }
    return usersArray;
  }, [usersArray, showOnlineOnly, onlineUsers]);

  // Helper: find a user by id in our normalized array
  const findUserById = useCallback(
    (id) => {
      if (!id) return null;
      return usersArray.find((u) => String(u._id || u.id) === String(id)) || null;
    },
    [usersArray]
  );

  // On mount: if there's a selected user id in localStorage, try to restore it
  useEffect(() => {
    try {
      const storedId = localStorage.getItem(LOCAL_KEY);
      if (storedId && !selectedUser) {
        const u = findUserById(storedId);
        if (u) setSelectedUser(u);
      }
    } catch (err) {
      // ignore storage exceptions
    }
    // Listen for storage events (other tabs changing selection)
    const onStorage = (e) => {
      if (e.key !== LOCAL_KEY) return;
      const newId = e.newValue;
      if (!newId) return;
      const u = findUserById(newId);
      if (u) setSelectedUser(u);
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [findUserById, selectedUser, setSelectedUser]);

  // Auto-select logic
  useEffect(() => {
    if (isUsersLoading) return;
    if (selectedUser) return;

    try {
      const storedId = localStorage.getItem(LOCAL_KEY);
      if (storedId) {
        const u = findUserById(storedId);
        if (u) {
          setSelectedUser(u);
          return;
        }
      }
    } catch (err) {
      // ignore
    }

    if (filteredUsers && filteredUsers.length > 0) {
      setSelectedUser(filteredUsers[0]);
      try {
        localStorage.setItem(LOCAL_KEY, String(filteredUsers[0]._id || filteredUsers[0].id));
      } catch (err) {
        // ignore
      }
    }
  }, [filteredUsers, findUserById, isUsersLoading, selectedUser, setSelectedUser]);

  const handleSelect = (user) => {
    setSelectedUser(user);
    try {
      localStorage.setItem(LOCAL_KEY, String(user._id || user.id));
    } catch (err) {
      // ignore storage write errors
    }
  };

  if (isUsersLoading) return <SidebarSkeleton />;

  const onlineCount = Math.max((onlineUsers?.length || 0) - 1, 0);

  return (
    <aside className="h-full w-20 lg:w-72 border-r border-base-300 bg-base-100 flex flex-col transition-all duration-200">
      {/* Header */}
      <div className="border-b border-base-300 w-full px-4 py-4">
        <div className="flex items-center gap-2">
          <div className="inline-flex items-center justify-center rounded-xl bg-base-200 size-9">
            <Users className="size-5 text-base-content/80" />
          </div>
          <span className="font-medium hidden lg:block text-base-content">
            Contacts
          </span>
        </div>

        <div className="mt-3 hidden lg:flex items-center gap-2">
          <label className="cursor-pointer flex items-center gap-2">
            <input
              type="checkbox"
              checked={showOnlineOnly}
              onChange={(e) => setShowOnlineOnly(e.target.checked)}
              className="checkbox checkbox-sm"
            />
            <span className="text-sm text-base-content/80">Show online only</span>
          </label>
          <span className="text-xs text-base-content/60">
            ({onlineCount} online)
          </span>
        </div>
      </div>

      {/* User list */}
      <div className="overflow-y-auto w-full py-2">
        {filteredUsers.length > 0 ? (
          filteredUsers.map((user) => {
            const id = String(user._id || user.id);
            const isActive =
              selectedUser && String(selectedUser._id || selectedUser.id) === id;
            const isOnline = (onlineUsers || []).some(
              (uid) => String(uid) === id
            );

            return (
              <button
                key={id}
                onClick={() => handleSelect(user)}
                className={[
                  "w-full px-3 py-2 flex items-center gap-3 transition-colors",
                  "hover:bg-base-200",
                  isActive ? "bg-base-200 ring-1 ring-base-300" : "",
                ].join(" ")}
              >
                {/* Avatar */}
                <div className="relative mx-auto lg:mx-0">
                  <img
                    src={user.profilePic || "/avatar.png"}
                    alt={user.fullName || user.name || "User"}
                    className="size-11 object-cover rounded-full border border-base-300"
                  />
                  {isOnline && (
                    <span
                      className="absolute bottom-0 right-0 size-3 rounded-full 
                      bg-success ring-2 ring-base-100"
                    />
                  )}
                </div>

                {/* Name + status (desktop only) */}
                <div className="hidden lg:block text-left min-w-0">
                  <div className="font-medium truncate text-base-content">
                    {user.fullName || user.name}
                  </div>
                  <div className="text-xs text-base-content/60">
                    {isOnline ? "Online" : "Offline"}
                  </div>
                </div>
              </button>
            );
          })
        ) : (
          <div className="text-center text-base-content/60 text-sm py-4 px-3">
            {showOnlineOnly ? "No users online" : "No users found"}
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
