import { useState } from "react";
import { useNavigate, Link } from "react-router";
import {
  Loader2,
  ArrowRight,
  CheckCircle2,
  KeyRound,
  Phone,
} from "lucide-react";
import api from "../../api/client";
import { useAuth } from "../../auth/AuthContext";
import AuthShell from "../../components/layout/AuthShell";
import Field, { Input } from "../../components/ui/Field";

const DealerActivate = () => {
  const [activationCode, setActivationCode] = useState("");
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
      const response = await api.post("/dealer/activate", {
        activationCode: activationCode.trim(),
        mobileNo,
      });
      if (response.status === 200) {
        const dealerInfo = response.data?.dealer || null;
        if (dealerInfo) {
          localStorage.setItem("dealerInfo", JSON.stringify(dealerInfo));
        }
        login(response.data?.token || "dealer-auth-token", "dealer");
        navigate("/dealerDash", {
          state: { dealerCode: dealerInfo?.dealerCode },
        });
      }
    } catch (err) {
      if (err.response?.status === 401 || err.response?.status === 404) {
        setError(
          "Invalid or expired activation code, or the mobile number doesn't match.",
        );
      } else if (err.response?.status === 409) {
        setError("This account has already been activated.");
      } else {
        setError("Something went wrong while activating your account.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthShell
      roleLabel="Dealer"
      title="Activate Account"
      subtitle="Enter the activation code from your approval email to finish setup."
    >
      <form onSubmit={handleSubmit} className="space-y-5" noValidate>
        <Field label="Activation Code">
          <Input
            autoFocus
            value={activationCode}
            onChange={(e) => setActivationCode(e.target.value.toUpperCase())}
            placeholder="ACT-XXXXX"
            icon={KeyRound}
            className="!font-mono !tracking-[0.2em]"
            required
          />
        </Field>

        <Field label="Mobile Number">
          <Input
            type="tel"
            value={mobileNo}
            onChange={(e) =>
              setMobileNo(e.target.value.replace(/[^0-9]/g, "").slice(0, 10))
            }
            placeholder="10-digit mobile number"
            icon={Phone}
            autoComplete="tel"
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
          className="group relative w-full inline-flex items-center justify-center gap-2.5 text-[12px] uppercase tracking-[0.2em] font-bold text-ink bg-gradient-to-r from-primary via-primary to-primary hover:brightness-110 transition-all duration-300 px-8 py-4 rounded-full shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/50 disabled:opacity-60 disabled:cursor-not-allowed mt-2"
        >
          {submitting ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Activating...
            </>
          ) : (
            <>
              <CheckCircle2 size={16} />
              Activate Account
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

        <div className="space-y-2.5">
          <Link
            to="/dealerLogin"
            className="group flex items-center justify-between py-2.5 text-[11px] uppercase tracking-[0.14em] font-semibold text-white/60 hover:text-white transition-colors duration-300"
          >
            <span>Already activated?</span>
            <span className="flex items-center gap-1.5 text-primary">
              Sign in
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
            <span>Don't have a code?</span>
            <span className="flex items-center gap-1.5 text-primary">
              Check status
              <ArrowRight
                size={12}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </span>
          </Link>
        </div>
      </form>
    </AuthShell>
  );
};

export default DealerActivate;
