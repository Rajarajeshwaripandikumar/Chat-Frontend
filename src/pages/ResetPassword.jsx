import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { Lock, Loader2 } from "lucide-react";

const ResetPasswordPage = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const { resetPassword, isResettingPassword } = useAuthStore();

  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const ok = await resetPassword(token, password);
    if (ok) navigate("/login");
  };

  return (
    <div className="h-full flex items-center justify-center bg-base-100">
      <div className="w-full max-w-md p-6 rounded-xl border border-base-300 shadow">
        <h1 className="text-2xl font-semibold text-center mb-4">Create New Password</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <Lock className="absolute left-3 top-3 h-5 w-5 text-base-content/40" />
            <input
              type="password"
              required
              placeholder="New password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input input-bordered w-full pl-11 h-11"
            />
          </div>

          <button className="btn btn-primary w-full h-11" disabled={isResettingPassword}>
            {isResettingPassword ? <Loader2 className="h-5 w-5 animate-spin" /> : "Reset Password"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
