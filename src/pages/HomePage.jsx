import { useChatStore } from "../store/useChatStore";

import Sidebar from "../components/Sidebar";
import NoChatSelected from "../components/NoChatSelected";
import ChatContainer from "../components/ChatContainer";

const HomePage = () => {
  const { selectedUser } = useChatStore();

  return (
    // area under the fixed navbar (App.jsx already has pt-16 on <main>)
    <div className="bg-base-200 min-h-[calc(100vh-4rem)] px-0 sm:px-4 py-3 sm:py-4 flex justify-center md:items-center">
      <div
        className="
          w-full max-w-6xl
          bg-base-100 border border-base-300 shadow-md
          rounded-none md:rounded-2xl
          flex flex-col sm:flex-row
          overflow-hidden
          min-h-[calc(100vh-4rem)] md:min-h-[calc(100vh-6rem)]
        "
      >
        {/* MOBILE: sidebar full width on top */}
        <div className="sm:hidden border-b border-base-300">
          <Sidebar />
        </div>

        {/* DESKTOP/TABLET: sidebar on the left */}
        <div className="hidden sm:flex w-72 border-r border-base-300 min-h-0">
          <Sidebar />
        </div>

        {/* CHAT AREA */}
        <div className="flex-1 flex flex-col min-w-0 min-h-0">
          {selectedUser ? <ChatContainer /> : <NoChatSelected />}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
