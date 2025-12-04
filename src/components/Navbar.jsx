import { Link } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { LogOut, MessageSquare, Settings, User } from "lucide-react";

const Navbar = () => {
  const { logout, authUser } = useAuthStore();

  return (
    <header
      className="
        bg-base-100/80 backdrop-blur-xl
        border-b border-base-300
        fixed top-0 w-full z-40
      "
    >
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* BRAND LOGO */}
        <Link to="/" className="flex items-center gap-3 group">
          {/* Outer tile */}
          <div className="h-10 w-10 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition">
            <div className="h-6 w-6 rounded-xl bg-primary flex items-center justify-center">
              <MessageSquare className="w-4 h-4 text-white" />
            </div>
          </div>

          {/* Text block */}
          <div className="flex flex-col leading-tight">
            <span className="text-sm font-semibold tracking-tight">
              Chintu <span className="text-primary">Chat</span>
            </span>

            <span className="text-[11px] text-base-content/60 uppercase tracking-wider">
              by TEJU
            </span>
          </div>
        </Link>

        {/* RIGHT SIDE */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Settings */}
          <Link
            to="/settings"
            className="btn btn-sm btn-ghost gap-2 shadow-sm border border-base-300 hover:bg-base-200"
          >
            <Settings className="w-4 h-4" />
            <span className="hidden sm:inline">Settings</span>
          </Link>

          {authUser && (
            <>
              {/* Profile */}
              <Link
                to="/profile"
                className="btn btn-sm btn-ghost gap-2 shadow-sm border border-base-300 hover:bg-base-200"
              >
                <User className="w-4 h-4" />
                <span className="hidden sm:inline">Profile</span>
              </Link>

              {/* Logout */}
              <button
                onClick={logout}
                className="
                  btn btn-sm btn-ghost gap-2 shadow-sm border border-base-300
                  hover:bg-red-500 hover:text-white transition
                "
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
