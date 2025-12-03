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
        {/* Branding */}
        <Link
          to="/"
          className="flex items-center gap-3 hover:opacity-90 transition"
        >
          <div className="size-9 rounded-xl bg-primary/10 flex items-center justify-center">
            <MessageSquare className="w-5 h-5 text-primary" />
          </div>
          <h1 className="text-xl font-bold tracking-tight">Chintu</h1>
        </Link>

        {/* Right Side */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Settings */}
          <Link
            to="/settings"
            className="btn btn-sm btn-ghost gap-2 shadow-sm border border-base-300 hover:bg-base-200"
          >
            <Settings className="w-4 h-4" />
            <span className="hidden sm:inline">Settings</span>
          </Link>

          {/* Authenticated Options */}
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
                  hover:bg-red-500 hover:text-white transition-colors
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
