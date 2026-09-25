import { useState } from "react";
import { useNavigate } from "react-router";
import { Loader2, ArrowRight, User, Lock } from "lucide-react";
import { useAuth } from "../../auth/AuthContext";
import AuthShell from "../../components/layout/AuthShell";
import Field, { Input, PasswordInput } from "../../components/ui/Field";

const SubAdminLogin = () => {
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const MOCK_USER_ID = "subAdmin";
      const MOCK_PASSWORD = "subadmin123";

      await new Promise((resolve) => setTimeout(resolve, 800));

      if (userId === MOCK_USER_ID && password === MOCK_PASSWORD) {
        const mockToken = "mock-subadmin-token-12345";
        login(mockToken, "subadmin");
        navigate("/subAdminDash");
      } else {
        setError("Invalid credentials. Please try again.");
        setUserId("");
        setPassword("");
      }
    } catch {
      setError("Something went wrong while logging in.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthShell
      roleLabel="Sub Admin"
      title="Sub Admin Login"
      subtitle="Manage dealers, vehicles, and quotations across the entire network."
    >
      <form onSubmit={handleSubmit} className="space-y-5" noValidate>
        <Field label="User ID">
          <Input
            autoFocus
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            placeholder="Enter your user ID"
            icon={User}
            autoComplete="username"
            required
          />
        </Field>

        <Field label="Password">
          <PasswordInput
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            icon={Lock}
            autoComplete="current-password"
            required
          />
        </Field>

        {error && (
          <div className="flex items-start gap-2.5 text-amber-300 text-xs bg-amber-400/[0.08] border border-amber-400/25 rounded-xl px-4 py-3 leading-relaxed">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="group relative w-full inline-flex items-center justify-center gap-2.5 text-[12px] uppercase tracking-[0.2em] font-bold text-ink bg-gradient-to-r from-primary via-primary to-primary hover:brightness-110 transition-all duration-300 px-8 py-4 rounded-full shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/50 disabled:opacity-60 disabled:cursor-not-allowed disabled:shadow-none mt-2"
        >
          {submitting ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Signing In...
            </>
          ) : (
            <>
              Sign In
              <ArrowRight
                size={15}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </>
          )}
        </button>
      </form>
    </AuthShell>
  );
};

export default SubAdminLogin;
