import { MessageSquare } from "lucide-react";

const NoChatSelected = () => {
  return (
    <div className="w-full flex flex-1 items-center justify-center bg-base-100">
      <div className="max-w-md mx-auto text-center px-6 py-10 rounded-3xl border border-base-300 bg-base-100/80 shadow-sm">
        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="relative">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center animate-bounce shadow-sm">
              <MessageSquare className="w-8 h-8 text-primary" />
            </div>
          </div>
        </div>

        {/* Text */}
        <h2 className="text-2xl font-bold text-base-content mb-2">
          Welcome to Chintu!
        </h2>
        <p className="text-base-content/60 text-sm">
          Select a conversation from the sidebar to start chatting, or choose a
          contact to begin a new one.
        </p>
      </div>
    </div>
  );
};

export default NoChatSelected;
