// src/components/AuthImagePattern.jsx
const AuthImagePattern = ({ title, subtitle }) => {
  return (
    <div className="hidden lg:flex items-center justify-center bg-white p-12 relative">
      
      <div className="relative max-w-md w-full">
        {/* mini chat window */}
        <div className="bg-white border border-base-300 rounded-3xl shadow-2xl shadow-base-300/40 mb-8 overflow-hidden">
          
          {/* header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-base-300/60">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-xs">
                💬
              </div>
              <div>
                <p className="text-xs font-semibold text-base-content">
                  Chintu Chat
                </p>
                <p className="text-[10px] text-success flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
                  4 friends online
                </p>
              </div>
            </div>

            <div className="flex gap-1">
              <span className="w-2 h-2 rounded-full bg-error/70" />
              <span className="w-2 h-2 rounded-full bg-warning/70" />
              <span className="w-2 h-2 rounded-full bg-success/70" />
            </div>
          </div>

          {/* messages */}
          <div className="px-4 py-4 space-y-3 text-sm">
            <div className="flex gap-2 items-end">
              <div className="w-7 h-7 rounded-full bg-secondary/20 flex items-center justify-center text-[11px]">
                A
              </div>
              <div className="bg-base-300/80 rounded-2xl rounded-bl-sm px-3 py-2 max-w-[70%]">
                Hey! We saved your last conversation. Ready to jump back in? 🚀
              </div>
            </div>

            <div className="flex gap-2 items-end justify-end">
              <div className="bg-primary text-primary-content rounded-2xl rounded-br-sm px-3 py-2 max-w-[70%]">
                Yup, just logging in from a new device 👀
              </div>
            </div>

            {/* typing indicator */}
            <div className="flex gap-2 items-center mt-1">
              <div className="w-7 h-7 rounded-full bg-accent/20 flex items-center justify-center text-[11px]">
                AI
              </div>
              <div className="bg-base-300/70 rounded-2xl rounded-bl-sm px-3 py-1.5 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-base-content/50 dot-animate" />
                <span className="w-1.5 h-1.5 rounded-full bg-base-content/50 dot-animate delay-150" />
                <span className="w-1.5 h-1.5 rounded-full bg-base-content/50 dot-animate delay-300" />
              </div>
            </div>
          </div>

          {/* footer */}
          <div className="px-4 py-3 border-t border-base-300/60">
            <div className="flex items-center gap-2 text-xs text-base-content/50">
              <span className="w-5 h-5 rounded-full bg-base-300 flex items-center justify-center text-[10px]">
                ⓘ
              </span>
              Messages are synced in real-time across all your devices.
            </div>
          </div>
        </div>

        {/* copy */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-base-content mb-2">{title}</h2>
          <p className="text-base-content/60 text-sm leading-relaxed">{subtitle}</p>
        </div>
      </div>
    </div>
  );
};

export default AuthImagePattern;
