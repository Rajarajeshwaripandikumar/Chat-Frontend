import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
import SettingsPage from "./pages/SettingsPage";
import ProfilePage from "./pages/ProfilePage";

import { Routes, Route, Navigate } from "react-router-dom";
import { useAuthStore } from "./store/useAuthStore";
import { useThemeStore } from "./store/useThemeStore";
import { useEffect } from "react";
import { Loader } from "lucide-react";
import { Toaster } from "react-hot-toast";

const App = () => {
  const { authUser, checkAuth, isCheckingAuth } = useAuthStore();
  const { theme } = useThemeStore();

  // Check auth when the app loads
  useEffect(() => {
    const fetchStatus = async () => {
      await checkAuth();
    };
    fetchStatus();
  }, [checkAuth]);

  // Loader while checking auth
  if (isCheckingAuth) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin" />
      </div>
    );
  }

  // Protect profile and home pages
  const PrivateRoute = ({ element }) => {
    return authUser ? element : <Navigate to="/login" />;
  };

  return (
    <div data-theme={theme}>
      {/* FIXED NAVBAR */}
      <Navbar />

      {/* ADD SPACING BELOW NAVBAR */}
      <main className="pt-20 px-4 md:px-0 min-h-screen">
        <Routes>
          {/* Home */}
          <Route
            path="/"
            element={authUser ? <HomePage /> : <Navigate to="/login" />}
          />

          {/* Auth Routes */}
          <Route
            path="/signup"
            element={!authUser ? <SignUpPage /> : <Navigate to="/" />}
          />
          <Route
            path="/login"
            element={!authUser ? <LoginPage /> : <Navigate to="/" />}
          />

          {/* Settings (public or private based on your preference) */}
          <Route path="/settings" element={<SettingsPage />} />

          {/* Private */}
          <Route
            path="/profile"
            element={<PrivateRoute element={<ProfilePage />} />}
          />
        </Routes>
      </main>

      <Toaster />
    </div>
  );
};

export default App;
