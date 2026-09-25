import { useState } from "react";
import { useNavigate } from "react-router";
import { Loader2 } from "lucide-react";
import { useAuth } from "../../auth/AuthContext";
import AuthShell from "../../components/layout/AuthShell";
import Field, { Input, PasswordInput } from "../../components/ui/Field";
import { PrimaryButton } from "../../components/ui/Button";

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
      // ==============================
      // MOCK / HARDCODED LOGIN
      // ==============================
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

      // ==========================================
      // ORIGINAL API CODE — COMMENTED FOR MOCK DATA
      // ==========================================
      // const response = await api.post("/CreateProfile/login", { userId, password });
      // if (response.status === 200) {
      //   localStorage.setItem("CreateProfile", JSON.stringify(response.data.user));
      //   login(response.data.token, "subadmin");
      //   navigate("/subAdminDash", { state: { userId } });
      // }
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
      subtitle="Manage assigned dealers, vehicles, and quotations."
      bullets={[
        "Register and manage vehicles",
        "Approve quotations from dealers",
        "Browse dealer and customer records",
      ]}
    >
      <form onSubmit={handleSubmit} className="space-y-8" noValidate>
        <Field label="User ID">
          <Input
            autoFocus
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            placeholder="Enter your user ID"
            required
          />
        </Field>

        <Field label="Password">
          <PasswordInput
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
          />
        </Field>

        {error && (
          <p className="text-amber-300 text-xs bg-amber-400/10 border border-amber-400/20 rounded-lg px-3 py-2 leading-relaxed">
            {error}
          </p>
        )}

        {/* Submit */}
        <div className="pt-2">
          <PrimaryButton
            type="submit"
            disabled={submitting}
            className="w-full justify-center !bg-white !text-ink hover:!bg-primary !px-8 !py-4 !text-[13px] !uppercase !tracking-[0.2em] !font-semibold !rounded-full"
          >
            {submitting ? (
              <>
                <Loader2 size={16} className="animate-spin" /> Signing In...
              </>
            ) : (
              "Sign In"
            )}
          </PrimaryButton>
        </div>
      </form>
    </AuthShell>
  );
};

export default SubAdminLogin;
