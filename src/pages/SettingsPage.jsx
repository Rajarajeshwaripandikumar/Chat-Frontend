import { THEMES } from "../constants";
import { useThemeStore } from "../store/useThemeStore";
import { Send } from "lucide-react";

const PREVIEW_MESSAGES = [
  { id: 1, content: "Hey! How's it going?", isSent: false },
  { id: 2, content: "I'm doing great! Just working on some new features.", isSent: true },
];

const SettingsPage = () => {
  const { theme, setTheme } = useThemeStore();

  return (
    // 🔑 fill the app shell, no window scroll
    <div className="h-full bg-base-200 flex justify-center md:items-center">
      <div className="w-full max-w-5xl mx-auto px-4 py-6 md:py-8 h-full">
        <div className="bg-base-100 border border-base-300 rounded-2xl p-5 sm:p-7 shadow-sm h-full flex flex-col">
          {/* Header */}
          <div className="mb-4">
            <h2 className="text-xl font-semibold text-base-content">Theme</h2>
            <p className="text-sm text-base-content/70">
              Choose a theme for your chat interface and see it live on the right.
            </p>
          </div>

          {/* Main content: themes (left) + preview (right) */}
          <div className="flex-1 min-h-0 flex flex-col lg:flex-row gap-8">
            {/* LEFT: Theme grid */}
            <div className="lg:w-1/2 space-y-4 overflow-y-auto lg:pr-2 min-h-0">
              <h3 className="text-sm font-medium text-base-content/80 mb-1">
                Theme palette
              </h3>

              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-4 gap-2">
                {THEMES.map((t) => {
                  const isActive = theme === t;
                  return (
                    <button
                      key={t}
                      className={[
                        "group flex flex-col items-center gap-1.5 p-2 rounded-lg border transition-all",
                        isActive
                          ? "bg-base-200 border-base-300 ring-1 ring-primary/60"
                          : "border-transparent hover:bg-base-200/60",
                      ].join(" ")}
                      onClick={() => setTheme(t)}
                    >
                      <div
                        className="relative h-8 w-full rounded-md overflow-hidden shadow-sm"
                        data-theme={t}
                      >
                        <div className="absolute inset-0 grid grid-cols-4 gap-px p-1">
                          <div className="rounded bg-primary" />
                          <div className="rounded bg-secondary" />
                          <div className="rounded bg-accent" />
                          <div className="rounded bg-neutral" />
                        </div>
                      </div>
                      <span className="text-[11px] font-medium truncate w-full text-center text-base-content/80">
                        {t.charAt(0).toUpperCase() + t.slice(1)}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* RIGHT: Preview */}
            <div className="lg:w-1/2 flex flex-col space-y-3">
              <div>
                <h3 className="text-lg font-semibold text-base-content">
                  Preview
                </h3>
                <p className="text-xs text-base-content/70">
                  Live preview of how your chat will look with the selected theme.
                </p>
              </div>

              <div className="flex-1 min-h-0 rounded-2xl border border-base-300 overflow-hidden bg-base-100 shadow-sm">
                <div className="p-4 bg-base-200 h-full flex items-center justify-center">
                  <div className="w-full max-w-lg">
                    {/* Mock Chat UI */}
                    <div className="bg-base-100 rounded-xl shadow-sm overflow-hidden">
                      {/* Chat Header */}
                      <div className="px-4 py-3 border-b border-base-300 bg-base-100">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-content font-medium">
                            J
                          </div>
                          <div>
                            <h3 className="font-medium text-sm text-base-content">
                              John Doe
                            </h3>
                            <p className="text-xs text-base-content/70">Online</p>
                          </div>
                        </div>
                      </div>

                      {/* Chat Messages */}
                      <div className="p-4 space-y-4 min-h-[180px] max-h-[220px] overflow-y-auto bg-base-100">
                        {PREVIEW_MESSAGES.map((message) => (
                          <div
                            key={message.id}
                            className={`flex ${
                              message.isSent ? "justify-end" : "justify-start"
                            }`}
                          >
                            <div
                              className={[
                                "max-w-[80%] rounded-xl p-3 shadow-sm",
                                message.isSent
                                  ? "bg-primary text-primary-content"
                                  : "bg-base-200 text-base-content",
                              ].join(" ")}
                            >
                              <p className="text-sm">{message.content}</p>
                              <p
                                className={[
                                  "text-[10px] mt-1.5",
                                  message.isSent
                                    ? "text-primary-content/70"
                                    : "text-base-content/70",
                                ].join(" ")}
                              >
                                12:00 PM
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Chat Input */}
                      <div className="p-4 border-t border-base-300 bg-base-100">
                        <div className="flex gap-2">
                          <input
                            type="text"
                            className="input input-bordered flex-1 text-sm h-10"
                            placeholder="Type a message..."
                            value="This is a preview"
                            readOnly
                          />
                          <button className="btn btn-primary h-10 min-h-0">
                            <Send size={18} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* end main */}
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
