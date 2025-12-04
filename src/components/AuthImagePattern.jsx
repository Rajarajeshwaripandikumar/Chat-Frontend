// src/components/AuthImagePattern.jsx
const people = [
  { name: "Alex", status: "typing…", pos: "top-4 left-10" },
  { name: "Jordan", status: "online", pos: "top-16 right-6" },
  { name: "Sam", status: "last seen 2m", pos: "bottom-8 left-4" },
  { name: "Taylor", status: "online", pos: "bottom-16 right-10" },
];

const AuthImagePattern = ({ title, subtitle }) => {
  return (
    <div className="hidden lg:flex items-center justify-center bg-base-200 relative overflow-hidden p-12">
      {/* gradient halo */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(251,191,36,0.18),transparent_60%)]" />

      {/* connection lines */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute left-1/2 top-1/2 w-64 h-64 -translate-x-1/2 -translate-y-1/2 border border-base-300/40 rounded-full" />
        <div className="absolute left-1/2 top-1/2 w-96 h-96 -translate-x-1/2 -translate-y-1/2 border border-base-300/30 rounded-full" />
      </div>

      {/* center conversation card */}
      <div className="relative z-10 max-w-md text-center">
        <div className="mb-8 inline-flex flex-col items-center gap-3">
          <div className="bg-base-100 border border-base-300 rounded-2xl px-5 py-4 shadow-xl shadow-base-300/40">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center font-semibold text-primary">
                💬
              </div>
              <div className="text-left">
                <p className="text-xs uppercase tracking-wide text-base-content/40">
                  Live conversation
                </p>
                <p className="text-sm font-medium text-base-content">You & Alex</p>
              </div>
            </div>

            <div className="space-y-2 text-left text-xs">
              <div className="flex gap-2">
                <div className="px-3 py-2 rounded-2xl bg-primary/15 text-primary-foreground/90">
                  Hey! Ready to continue our chat?
                </div>
              </div>
              <div className="flex gap-2 justify-end">
                <div className="px-3 py-2 rounded-2xl bg-base-300 text-base-content">
                  Always. Logging you in now ✨
                </div>
              </div>
              <div className="mt-1 flex items-center gap-1 text-[10px] text-base-content/50">
                <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
                Secure • End-to-end encrypted
              </div>
            </div>
          </div>

          <h2 className="text-3xl font-bold text-base-content">{title}</h2>
          <p className="text-base-content/60 text-sm leading-relaxed">
            {subtitle}
          </p>
        </div>
      </div>

      {/* orbiting chat avatars */}
      {people.map((p, idx) => (
        <div
          key={p.name}
          className={`absolute ${p.pos} z-0`}
          style={{
            animation: `float-${idx % 2 === 0 ? "up" : "down"} ${
              7 + idx
            }s ease-in-out infinite`,
          }}
        >
          <div className="bg-base-100/95 border border-base-300 rounded-2xl px-3 py-2 shadow-md shadow-base-300/40 backdrop-blur">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center text-xs">
                {p.name[0]}
              </div>
              <div>
                <p className="text-xs font-medium text-base-content">
                  {p.name}
                </p>
                <p className="text-[10px] text-base-content/60">{p.status}</p>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AuthImagePattern;
