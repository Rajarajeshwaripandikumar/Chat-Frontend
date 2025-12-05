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
    // ⚠️ DO NOT lock height on mobile → use min-h-screen instead
    <div className="min-h-screen bg-base-200 flex justify-center md:items-center px-3 py-4 sm:px-4">
      <div className="w-full max-w-5xl mx-auto">
        <div className="bg-base-100 border border-base-300 rounded-2xl p-5 sm:p-7 shadow-sm flex flex-col gap-6">
          
          {/* Header */}
          <div>
            <h2 className="text-xl font-semibold text-base-content">Theme</h2>
            <p className="text-sm text-base-content/70">
              Choose a theme and see the preview live below.
            </p>
          </div>

          {/* Main: Stacked on mobile, side-by-side on large screens */}
          <div className="flex flex-col lg:flex-row gap-8">

            {/* LEFT: Theme palette grid */}
            <div className="lg:w-1/2 flex flex-col gap-4">
              <h3 className="text-sm font-medium text-base-content/80">
                Theme Palette
              </h3>

              {/* Mobile-friendly grid (2 columns mobile → 3 sm → 4 md) */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {THEMES.map((t) => {
                  const isActive = theme === t;

                  return (
                    <button
                      key={t}
                      onClick={() => setTheme(t)}
                      className={[
                        "group flex flex-col items-center gap-1.5 p-2 rounded-lg border transition-all",
                        isActive
                          ? "bg-base-200 border-base-300 ring-1 ring-primary/60"
                          : "border-base-300 hover:bg-base-200/60",
                      ].join(" ")}
                    >
                      <div className="relative h-8 w-full rounded-md overflow-hidden shadow-sm" data-theme={t}>
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
            <div className="lg:w-1/2 flex flex-col gap-3">
              <div>
                <h3 className="text-lg font-semibold text-base-content">Preview</h3>
                <p className="text-xs text-base-content/70">
                  See how your chat looks with the selected theme.
                </p>
              </div>

              {/* Fully responsive preview — NO fixed height */}
              <div className="rounded-2xl border border-base-300 bg-base-100 shadow-sm overflow-hidden">
                <div className="p-3 sm:p-4 bg-base-100">
                  <div className="w-full max-w-lg mx-auto">

                    {/* Chat Preview Box */}
                    <div className="bg-base-100 rounded-xl shadow-sm overflow-hidden">

                      {/* Header */}
                      <div className="px-4 py-3 border-b border-base-300 bg-base-100">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-content font-medium">
                            J
                          </div>
                          <div>
                            <h3 className="font-medium text-sm text-base-content">John Doe</h3>
                            <p className="text-xs text-base-content/70">Online</p>
                          </div>
                        </div>
                      </div>

                      {/* Messages */}
                      <div className="p-4 space-y-4 max-h-[220px] overflow-y-auto">
                        {PREVIEW_MESSAGES.map((msg) => (
                          <div
                            key={msg.id}
                            className={`flex ${msg.isSent ? "justify-end" : "justify-start"}`}
                          >
                            <div
                              className={[
                                "max-w-[80%] rounded-xl p-3 shadow-sm",
                                msg.isSent
                                  ? "bg-primary text-primary-content"
                                  : "bg-base-200 text-base-content",
                              ].join(" ")}
                            >
                              <p className="text-sm">{msg.content}</p>
                              <p
                                className={[
                                  "text-[10px] mt-1.5",
                                  msg.isSent
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

                      {/* Input */}
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

        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
