import { useChatStore } from "../store/useChatStore";

import Sidebar from "../components/Sidebar";
import NoChatSelected from "../components/NoChatSelected";
import ChatContainer from "../components/ChatContainer";

const HomePage = () => {
  const { selectedUser } = useChatStore();

  return (
    <div className="min-h-screen bg-base-200">
      {/* offset for fixed navbar (h-16) */}
      <div className="pt-16 sm:pt-20 px-0 sm:px-4 flex justify-center md:items-center min-h-0">
        <div
          className="
            w-full max-w-6xl 
            h-[calc(100vh-4rem)] sm:h-[calc(100vh-6rem)]
            rounded-none md:rounded-2xl 
            border border-base-300 bg-base-100 shadow-md
            flex overflow-hidden        /* make card flex + clip overflow */
          "
        >
          {/* INNER FLEX ROW */}
          <div className="flex h-full w-full rounded-none md:rounded-2xl overflow-hidden min-h-0">
            {/* LEFT SIDEBAR */}
            <div className="hidden sm:flex flex-col w-72 border-r border-base-300 min-h-0">
              <Sidebar />
            </div>

            {/* On mobile we still want sidebar above messages (optional).
                If your Sidebar already handles mobile, you can remove this block. */}
            <div className="flex sm:hidden flex-col w-full border-b border-base-300 min-h-0">
              <Sidebar />
            </div>

            {/* RIGHT CHAT AREA */}
            <div className="flex-1 flex flex-col min-w-0 min-h-0">
              {selectedUser ? <ChatContainer /> : <NoChatSelected />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
