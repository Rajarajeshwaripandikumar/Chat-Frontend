import { useChatStore } from "../store/useChatStore";

import Sidebar from "../components/Sidebar";
import NoChatSelected from "../components/NoChatSelected";
import ChatContainer from "../components/ChatContainer";

const HomePage = () => {
  const { selectedUser } = useChatStore();

  return (
    <div className="min-h-screen bg-base-200">
      {/* account for fixed navbar height (h-16) */}
      <div className="pt-20 px-3 sm:px-4 flex items-center justify-center">
        <div className="w-full max-w-6xl h-[calc(100vh-6rem)] rounded-2xl border border-base-300 bg-base-100 shadow-md">
          <div className="flex h-full rounded-2xl overflow-hidden">
            <Sidebar />
            {selectedUser ? <ChatContainer /> : <NoChatSelected />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
