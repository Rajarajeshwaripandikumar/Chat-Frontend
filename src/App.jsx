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

  // Fetch authentication status when app loads
  useEffect(() => {
    const fetchAuthStatus = async () => {
      await checkAuth(); // Assuming checkAuth is async
    };
    fetchAuthStatus();
  }, [checkAuth]);

  // Show a loading spinner if the authentication status is still being checked
  if (isCheckingAuth) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin" />
      </div>
    );
  }

  // PrivateRoute for protecting routes that need authentication
  const PrivateRoute = ({ element }) => {
    return authUser ? element : <Navigate to="/login" />;
  };

  return (
    <div data-theme={theme}>
      <Navbar />
      <Routes>
        <Route path="/" element={authUser ? <HomePage /> : <Navigate to="/login" />} />
        <Route path="/signup" element={!authUser ? <SignUpPage /> : <Navigate to="/" />} />
        <Route path="/login" element={!authUser ? <LoginPage /> : <Navigate to="/" />} />
        <Route path="/settings" element={<SettingsPage />} />
        {/* Private routes wrapped with PrivateRoute for auth check */}
        <Route path="/profile" element={<PrivateRoute element={<ProfilePage />} />} />
      </Routes>
      <Toaster />
    </div>
  );
};

export default App;
