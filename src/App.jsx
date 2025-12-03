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

  // check authentication on initial load
  useEffect(() => {
    const fetchAuthStatus = async () => {
      await checkAuth();
    };
    fetchAuthStatus();
  }, [checkAuth]);

  // show loader during auth check
  if (isCheckingAuth) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin" />
      </div>
    );
  }

  // protect routes that require login
  const PrivateRoute = ({ element }) => {
    return authUser ? element : <Navigate to="/login" />;
  };

  return (
    <div data-theme={theme}>
      {/* NAVBAR */}
      <Navbar />

      {/* ALL PAGE CONTENT BELOW NAVBAR */}
      <main className="pt-8 md:pt-12 px-4 md:px-0">
        <Routes>
          {/* Home Route */}
          <Route
            path="/"
            element={authUser ? <HomePage /> : <Navigate to="/login" />}
          />

          {/* Public Routes */}
          <Route
            path="/signup"
            element={!authUser ? <SignUpPage /> : <Navigate to="/" />}
          />
          <Route
            path="/login"
            element={!authUser ? <LoginPage /> : <Navigate to="/" />}
          />

          {/* Settings (open to all or change to private if needed) */}
          <Route path="/settings" element={<SettingsPage />} />

          {/* Private Routes */}
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
