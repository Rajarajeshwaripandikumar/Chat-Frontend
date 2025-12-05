import { useChatStore } from "../store/useChatStore";
import { useEffect, useRef } from "react";

import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import MessageSkeleton from "./skeletons/MessageSkeleton";
import { useAuthStore } from "../store/useAuthStore";
import { formatMessageTime } from "../lib/utils";

const ChatContainer = () => {
  const {
    messages,
    getMessages,
    isMessagesLoading,
    selectedUser,
    subscribeToMessages,
    unsubscribeFromMessages,
  } = useChatStore();

  const { authUser } = useAuthStore();

  const messageEndRef = useRef(null);

  // load messages when user changes
  useEffect(() => {
    if (!selectedUser?._id) return;
    getMessages(selectedUser._id);
    subscribeToMessages();
    return () => unsubscribeFromMessages();
  }, [selectedUser?._id, getMessages, subscribeToMessages, unsubscribeFromMessages]);

  // scroll to bottom whenever messages change
  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }
  }, [messages.length, selectedUser?._id]);

  /* --------------------------- LOADING SKELETON --------------------------- */
  if (isMessagesLoading) {
    return (
      <div className="flex-1 flex flex-col min-h-0 bg-base-100">
        <ChatHeader />

        {/* scroll only here */}
        <div className="flex-1 min-h-0 overflow-y-auto">
          <MessageSkeleton />
        </div>

        <MessageInput />
      </div>
    );
  }

  /* --------------------------------- CHAT --------------------------------- */
  return (
    <div className="flex-1 flex flex-col min-h-0 bg-base-100">
      <ChatHeader />

      {/* Messages */}
      <div className="flex-1 min-h-0 overflow-y-auto p-3 sm:p-4 space-y-3 sm:space-y-4">
        {messages.map((message) => (
          <div
            key={message._id}
            className={`chat ${
              message.senderId === authUser._id ? "chat-end" : "chat-start"
            } max-w-[90%]`}
          >
            {/* Avatar */}
            <div className="chat-image avatar">
              <div className="size-8 sm:size-10 rounded-full border">
                <img
                  src={
                    message.senderId === authUser._id
                      ? authUser.profilePic || "/avatar.png"
                      : selectedUser.profilePic || "/avatar.png"
                  }
                  alt="profile pic"
                />
              </div>
            </div>

            {/* Time */}
            <div className="chat-header mb-1">
              <time className="text-[10px] sm:text-xs opacity-50 ml-1">
                {formatMessageTime(message.createdAt)}
              </time>
            </div>

            {/* Bubble */}
            <div className="chat-bubble flex flex-col break-words max-w-[75vw] sm:max-w-[60vw]">
              {message.image && (
                <img
                  src={message.image}
                  alt="Attachment"
                  className="rounded-md mb-2 max-w-[70vw] sm:max-w-[200px]"
                  onLoad={() => {
                    if (messageEndRef.current) {
                      messageEndRef.current.scrollIntoView({
                        behavior: "smooth",
                        block: "end",
                      });
                    }
                  }}
                />
              )}

              {message.text && (
                <p className="text-sm sm:text-base">
                  {message.text}
                </p>
              )}
            </div>
          </div>
        ))}

        {/* invisible anchor at the very bottom */}
        <div ref={messageEndRef} />
      </div>

      <MessageInput />
    </div>
  );
};

export default ChatContainer;
