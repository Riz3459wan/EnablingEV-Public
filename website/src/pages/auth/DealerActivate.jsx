import { useState } from "react";
import { useNavigate, Link } from "react-router";
import {
  KeyRound,
  Loader2,
  ArrowRight,
  Phone,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import api from "../../api/client";
import { useAuth } from "../../auth/AuthContext";
import AuthShell from "../../components/layout/AuthShell";
import Field, { Input } from "../../components/ui/Field";
import { PrimaryButton } from "../../components/ui/Button";

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
          "Invalid or expired activation code, or the mobile number doesn't match our records.",
        );
      } else if (err.response?.status === 409) {
        setError(
          "This account has already been activated. Please sign in instead.",
        );
      } else {
        setError("Something went wrong while activating your account.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthShell
      icon={KeyRound}
      roleLabel="Dealer"
      title="Activate Your Account"
      subtitle="Enter the activation code we emailed you to finish setting up your dealer account and access the dashboard."
      bullets={[
        "One-time step after admin approval",
        "Unlocks your full dealer dashboard",
        "Uses the mobile number from registration",
      ]}
    >
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        {/* Info banner */}
        <div className="flex items-start gap-2.5 bg-gradient-to-r from-primary/5 to-cyan-500/5 border border-primary/20 rounded-xl px-3.5 py-3 animate-fade-in">
          <Sparkles size={14} className="text-primary mt-0.5 shrink-0" />
          <p className="text-[11px] text-foreground/80 leading-relaxed">
            <span className="font-bold text-primary">Almost there!</span> Enter
            the code from your approval email to unlock your dashboard.
          </p>
        </div>

        <Field label="Activation Code">
          <div className="relative">
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 w-6 h-6 rounded-md bg-primary/10 flex items-center justify-center pointer-events-none">
              <KeyRound size={12} className="text-primary" />
            </div>
            <Input
              autoFocus
              value={activationCode}
              onChange={(e) => setActivationCode(e.target.value.toUpperCase())}
              placeholder="ACT-XXXXX"
              className="!pl-12 font-mono tracking-[0.2em] font-bold"
              required
            />
          </div>
        </Field>

        <Field label="Mobile Number">
          <div className="relative">
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 w-6 h-6 rounded-md bg-primary/10 flex items-center justify-center pointer-events-none">
              <Phone size={12} className="text-primary" />
            </div>
            <Input
              type="tel"
              value={mobileNo}
              onChange={(e) =>
                setMobileNo(e.target.value.replace(/[^0-9]/g, "").slice(0, 10))
              }
              placeholder="10-digit mobile number"
              className="!pl-12 font-mono"
              required
            />
          </div>
        </Field>

        {error && (
          <div className="flex items-start gap-2.5 text-amber-700 text-xs bg-amber-50 border border-amber-200 rounded-xl px-3.5 py-3 leading-relaxed animate-fade-in">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
            {error}
          </div>
        )}

        <PrimaryButton
          type="submit"
          disabled={submitting}
          className="w-full justify-center !py-3.5 shadow-lg shadow-primary/30 shine relative group text-sm"
        >
          {submitting ? (
            <>
              <Loader2 size={16} className="animate-spin" /> Activating...
            </>
          ) : (
            <>
              <CheckCircle2 size={16} />
              Activate My Account
            </>
          )}
        </PrimaryButton>

        {/* Links */}
        <div className="pt-2 space-y-2.5">
          <Link
            to="/dealerLogin"
            className="flex items-center justify-between text-xs text-muted-foreground hover:text-primary transition-colors group px-1"
          >
            <span>Already activated?</span>
            <span className="font-semibold flex items-center gap-1">
              Sign in
              <ArrowRight
                size={12}
                className="group-hover:translate-x-1 transition-transform"
              />
            </span>
          </Link>
          <Link
            to="/DealerForm"
            className="flex items-center justify-between text-xs text-muted-foreground hover:text-primary transition-colors group px-1"
          >
            <span>Not registered yet?</span>
            <span className="font-semibold flex items-center gap-1">
              Submit request
              <ArrowRight
                size={12}
                className="group-hover:translate-x-1 transition-transform"
              />
            </span>
          </Link>
          <Link
            to="/dealerStatus"
            className="flex items-center justify-between text-xs text-muted-foreground hover:text-primary transition-colors group px-1"
          >
            <span>Don't have a code?</span>
            <span className="font-semibold flex items-center gap-1">
              Check status
              <ArrowRight
                size={12}
                className="group-hover:translate-x-1 transition-transform"
              />
            </span>
          </Link>
        </div>
      </form>
    </AuthShell>
  );
};

export default DealerActivate;
