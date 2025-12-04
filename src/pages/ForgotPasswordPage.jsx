import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Mail, Loader2 } from "lucide-react";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const { sendResetEmail, isSendingResetEmail } = useAuthStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await sendResetEmail(email);
  };

  return (
    <div className="h-full flex items-center justify-center bg-base-100">
      <div className="w-full max-w-md p-6 rounded-xl border border-base-300 shadow">
        <h1 className="text-2xl font-semibold text-center mb-2">Reset Password</h1>
        <p className="text-center text-base-content/70 mb-6">
          Enter your email and we’ll send you a reset link.
        </p>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="relative">
            <Mail className="absolute left-3 top-3 h-5 w-5 text-base-content/40" />
            <input
              type="email"
              required
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input input-bordered w-full pl-11 h-11"
            />
          </div>

          <button className="btn btn-primary w-full h-11" disabled={isSendingResetEmail}>
            {isSendingResetEmail ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              "Send reset link"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
