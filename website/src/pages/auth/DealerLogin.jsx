import { useState } from "react";
import { useNavigate, Link } from "react-router";
import { Loader2 } from "lucide-react";
import { useAuth } from "../../auth/AuthContext";
import AuthShell from "../../components/layout/AuthShell";
import Field, { Input, PasswordInput } from "../../components/ui/Field";
import { PrimaryButton } from "../../components/ui/Button";

const DealerLogin = () => {
  const [dealerCode, setDealerCode] = useState("");
  const [mobileNo, setMobileNo] = useState("");
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
      const MOCK_DEALER_CODE = "dealer";
      const MOCK_MOBILE_NO = "dealer123";

      await new Promise((resolve) => setTimeout(resolve, 800));

      if (dealerCode === MOCK_DEALER_CODE && mobileNo === MOCK_MOBILE_NO) {
        const mockToken = "mock-dealer-token-12345";
        localStorage.setItem(
          "dealerInfo",
          JSON.stringify({ name: "Demo Dealer", dealerCode: "DEMO0000000001" }),
        );
        login(mockToken, "dealer");
        navigate("/dealerDash");
      } else {
        setError("Invalid credentials. Please try again.");
        setDealerCode("");
        setMobileNo("");
      }

      // ==========================================
      // ORIGINAL API CODE — COMMENTED FOR MOCK DATA
      // ==========================================
      // const response = await api.post("/dealer/login", { dealerCode, mobileNo });
      // if (response.status === 200) {
      //   const dealerInfo = response.data?.dealer || null;
      //   if (dealerInfo) localStorage.setItem("dealerInfo", JSON.stringify(dealerInfo));
      //   login(response.data?.token || "dealer-auth-token", "dealer");
      //   navigate("/dealerDash", { state: { dealerCode } });
      // }
    } catch {
      setError("Something went wrong while logging in.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthShell
      roleLabel="Dealer"
      title="Dealer Login"
      subtitle="Access your dashboard, quotations and customer records."
      bullets={[
        "Track your customers and vehicles",
        "Create and manage quotations",
        "View your dealership performance",
      ]}
    >
      <form onSubmit={handleSubmit} className="space-y-8" noValidate>
        <Field label="Dealer Code">
          <Input
            autoFocus
            value={dealerCode}
            onChange={(e) => setDealerCode(e.target.value)}
            placeholder="Enter your dealer code"
            required
          />
        </Field>

        <Field label="Mobile Number">
          <PasswordInput
            value={mobileNo}
            onChange={(e) => setMobileNo(e.target.value)}
            placeholder="Registered mobile number"
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

        {/* Bottom links — more breathing room */}
        <div className="space-y-4 pt-4 border-t border-white/[0.08]">
          <Link
            to="/DealerForm"
            className="block text-sm text-white/50 hover:text-white transition-colors duration-300"
          >
            Not registered yet?{" "}
            <span className="link-luxe text-white">Register as a dealer →</span>
          </Link>

          <Link
            to="/dealerActivate"
            className="block text-sm text-white/50 hover:text-white transition-colors duration-300"
          >
            Got an activation code?{" "}
            <span className="link-luxe text-white">
              Complete registration →
            </span>
          </Link>

          <Link
            to="/dealerStatus"
            className="block text-sm text-white/50 hover:text-white transition-colors duration-300"
          >
            Check your request status →
          </Link>
        </div>
      </form>
    </AuthShell>
  );
};

export default DealerLogin;
