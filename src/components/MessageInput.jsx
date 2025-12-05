import { useRef, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { Image, Send, X } from "lucide-react";
import toast from "react-hot-toast";

const MessageInput = () => {
  const [text, setText] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);
  const { sendMessage } = useChatStore();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!text.trim() && !imagePreview) return;

    try {
      await sendMessage({
        text: text.trim(),
        image: imagePreview,
      });

      setText("");
      setImagePreview(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  const canSend = !!text.trim() || !!imagePreview;

  return (
    <div
      className="w-full px-3 sm:px-5 pt-2 pb-3 border-t border-base-300 bg-base-100"
      // extra padding for iOS home bar so send button isn't cut off
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      {/* Image preview */}
      {imagePreview && (
        <div className="mb-3 flex items-center gap-2">
          <div className="relative">
            <img
              src={imagePreview}
              alt="Preview"
              className="w-20 h-20 object-cover rounded-xl border border-base-300 bg-base-200"
            />
            <button
              type="button"
              onClick={removeImage}
              className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-base-100 border border-base-300 flex items-center justify-center shadow-sm"
            >
              <X className="w-3 h-3 text-base-content/70" />
            </button>
          </div>
        </div>
      )}

      {/* Input row */}
      <form
        onSubmit={handleSendMessage}
        className="flex items-center gap-2 bg-base-200 rounded-2xl px-3 py-2 border border-base-300"
      >
        {/* Text + file */}
        <div className="flex-1 flex items-center gap-2">
          <input
            type="text"
            className="flex-1 input input-ghost focus:outline-none focus:bg-base-100 h-9 sm:h-10 text-sm px-0"
            placeholder="Type a message..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />

          <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={fileInputRef}
            onChange={handleImageChange}
          />

          <button
            type="button"
            className={`hidden sm:flex btn btn-ghost btn-circle btn-sm ${
              imagePreview ? "text-primary" : "text-base-content/50"
            }`}
            onClick={() => fileInputRef.current?.click()}
            aria-label="Attach image"
          >
            <Image className="w-4 h-4" />
          </button>
        </div>

        {/* Send */}
        <button
          type="submit"
          className={`btn btn-circle btn-sm ${
            canSend ? "btn-primary" : "btn-ghost text-base-content/40"
          }`}
          disabled={!canSend}
          aria-label="Send message"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};

export default MessageInput;
