import { useChatStore } from "../store/useChatStore";

import Sidebar from "../components/Sidebar";
import NoChatSelected from "../components/NoChatSelected";
import ChatContainer from "../components/ChatContainer";

const HomePage = () => {
  const { selectedUser } = useChatStore();

  return (
    // fill the main area (which is already screen height minus navbar)
    <div className="h-full bg-base-200 flex justify-center md:items-center">
      <div
        className="
          w-full max-w-6xl 
          h-full
          rounded-none md:rounded-2xl 
          border border-base-300 bg-base-100 shadow-md
        "
      >
        <div className="flex h-full rounded-none md:rounded-2xl overflow-hidden">
          <Sidebar />
          {selectedUser ? <ChatContainer /> : <NoChatSelected />}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
