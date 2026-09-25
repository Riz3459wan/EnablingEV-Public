import { useState } from "react";
import { useNavigate, Link } from "react-router";
import { Loader2, ArrowRight, User, Lock, Phone } from "lucide-react";
import { useAuth } from "../../auth/AuthContext";
import AuthShell from "../../components/layout/AuthShell";
import Field, { Input, PasswordInput } from "../../components/ui/Field";

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
      subtitle="Sign in to access your dashboard, quotations and customer records."
    >
      <form onSubmit={handleSubmit} className="space-y-5" noValidate>
        {/* Dealer Code */}
        <Field label="Dealer Code">
          <Input
            autoFocus
            value={dealerCode}
            onChange={(e) => setDealerCode(e.target.value)}
            placeholder="Enter your dealer code"
            icon={User}
            autoComplete="username"
            required
          />
        </Field>

        {/* Mobile Number */}
        <Field label="Mobile Number">
          <PasswordInput
            value={mobileNo}
            onChange={(e) => setMobileNo(e.target.value)}
            placeholder="Registered mobile number"
            icon={Phone}
            autoComplete="tel"
            required
          />
        </Field>

        {/* Error */}
        {error && (
          <div className="flex items-start gap-2.5 text-amber-300 text-xs bg-amber-400/[0.08] border border-amber-400/25 rounded-xl px-4 py-3 leading-relaxed">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
            {error}
          </div>
        )}

        {/* Submit — glowing pill button */}
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

        {/* Divider */}
        <div className="flex items-center gap-4 pt-3">
          <span className="flex-1 h-px bg-white/[0.08]" />
          <span className="text-[10px] uppercase tracking-[0.24em] font-semibold text-white/30">
            or
          </span>
          <span className="flex-1 h-px bg-white/[0.08]" />
        </div>

        {/* Bottom links */}
        <div className="space-y-2.5">
          <Link
            to="/DealerForm"
            className="group flex items-center justify-between py-2.5 text-[11px] uppercase tracking-[0.14em] font-semibold text-white/60 hover:text-white transition-colors duration-300"
          >
            <span>Not registered yet?</span>
            <span className="flex items-center gap-1.5 text-primary">
              Register
              <ArrowRight
                size={12}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </span>
          </Link>

          <Link
            to="/dealerActivate"
            className="group flex items-center justify-between py-2.5 text-[11px] uppercase tracking-[0.14em] font-semibold text-white/60 hover:text-white transition-colors duration-300"
          >
            <span>Have an activation code?</span>
            <span className="flex items-center gap-1.5 text-primary">
              Activate
              <ArrowRight
                size={12}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </span>
          </Link>

          <Link
            to="/dealerStatus"
            className="group flex items-center justify-between py-2.5 text-[11px] uppercase tracking-[0.14em] font-semibold text-white/60 hover:text-white transition-colors duration-300"
          >
            <span>Check request status</span>
            <ArrowRight
              size={12}
              className="transition-transform duration-300 group-hover:translate-x-1"
            />
          </Link>
        </div>
      </form>
    </AuthShell>
  );
};

export default DealerLogin;
