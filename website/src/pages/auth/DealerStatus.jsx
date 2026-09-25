import { useState } from "react";
import { Link } from "react-router";
import {
  Search,
  Loader2,
  Clock,
  CheckCircle2,
  XCircle,
  ArrowRight,
  Phone,
  Sparkles,
} from "lucide-react";
import api from "../../api/client";
import AuthShell from "../../components/layout/AuthShell";
import Field, { Input } from "../../components/ui/Field";
import { PrimaryButton } from "../../components/ui/Button";

const STATES = {
  pending: {
    icon: Clock,
    gradient: "from-amber-400 to-orange-500",
    textColor: "text-amber-700",
    bgColor: "bg-gradient-to-br from-amber-50 to-orange-50",
    borderColor: "border-amber-200",
    title: "Still Under Review",
    body: "Your registration request hasn't been reviewed yet. Check back later, or wait for our email once a decision is made.",
  },
  approved: {
    icon: CheckCircle2,
    gradient: "from-primary to-emerald-500",
    textColor: "text-emerald-700",
    bgColor: "bg-gradient-to-br from-emerald-50 to-green-50",
    borderColor: "border-emerald-200",
    title: "Approved!",
    body: "Your request was approved. We've emailed you an activation code — enter it on the activation page to finish setting up your account.",
  },
  rejected: {
    icon: XCircle,
    gradient: "from-red-400 to-rose-500",
    textColor: "text-red-700",
    bgColor: "bg-gradient-to-br from-red-50 to-rose-50",
    borderColor: "border-red-200",
    title: "Not Approved",
    body: "Your request wasn't approved this time. You're welcome to review the details and submit a new request.",
  },
};

const DealerStatus = () => {
  const [mobileNo, setMobileNo] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setResult(null);
    setSubmitting(true);
    try {
      const res = await api.get("/dealer/status", { params: { mobileNo } });
      const status = (res.data?.status || "").toLowerCase();
      if (!STATES[status]) {
        setError("No registration request found for this mobile number.");
      } else {
        setResult({ status, reason: res.data?.reason });
      }
    } catch (err) {
      if (err.response?.status === 404) {
        setError("No registration request found for this mobile number.");
      } else {
        setError("Something went wrong while checking your status.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const state = result ? STATES[result.status] : null;
  const StateIcon = state?.icon;

  return (
    <AuthShell
      icon={Search}
      roleLabel="Dealer"
      title="Track Your Request"
      subtitle="See whether your dealer registration is still pending, approved, or was not approved — all in one place."
      bullets={[
        "Uses the mobile number from your registration",
        "No login required for this check",
        "Approved? Head to the activation page next",
      ]}
    >
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        {/* Info banner */}
        <div className="flex items-start gap-2.5 bg-gradient-to-r from-primary/5 to-cyan-500/5 border border-primary/20 rounded-xl px-3.5 py-3 animate-fade-in">
          <Sparkles size={14} className="text-primary mt-0.5 shrink-0" />
          <p className="text-[11px] text-foreground/80 leading-relaxed">
            Enter the mobile number you used during registration to see your
            current status.
          </p>
        </div>

        <Field label="Mobile Number">
          <div className="relative">
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 w-6 h-6 rounded-md bg-primary/10 flex items-center justify-center pointer-events-none">
              <Phone size={12} className="text-primary" />
            </div>
            <Input
              type="tel"
              autoFocus
              value={mobileNo}
              onChange={(e) => {
                setMobileNo(e.target.value.replace(/[^0-9]/g, "").slice(0, 10));
                setResult(null);
                setError("");
              }}
              placeholder="10-digit mobile number"
              className="!pl-12 font-mono"
              required
            />
          </div>
        </Field>

        {error && (
          <div className="flex items-start gap-2.5 text-red-600 text-xs bg-red-50 border border-red-200 rounded-xl px-3.5 py-3 leading-relaxed animate-fade-in">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 shrink-0" />
            {error}
          </div>
        )}

        {state && (
          <div
            className={`relative rounded-2xl border ${state.borderColor} ${state.bgColor} p-4 overflow-hidden animate-scale-in`}
          >
            {/* Decorative blob */}
            <div
              className={`absolute -top-12 -right-12 w-32 h-32 rounded-full bg-gradient-to-br ${state.gradient} opacity-10 blur-2xl`}
            />

            <div className="relative flex items-start gap-3 mb-2.5">
              <div
                className={`w-10 h-10 rounded-xl bg-gradient-to-br ${state.gradient} flex items-center justify-center shadow-lg shrink-0`}
              >
                <StateIcon size={20} className="text-white" strokeWidth={2.5} />
              </div>
              <div>
                <p className={`font-bold text-sm ${state.textColor}`}>
                  {state.title}
                </p>
                <p className="text-[10px] text-muted-foreground font-mono">
                  {mobileNo}
                </p>
              </div>
            </div>
            <p className="relative text-xs leading-relaxed opacity-90 pl-1">
              {state.body}
            </p>
            {result.status === "rejected" && result.reason && (
              <div className="relative mt-3 pt-3 border-t border-current/10">
                <p className="text-xs leading-relaxed opacity-90 pl-1">
                  <span className="font-bold">Reason:</span> {result.reason}
                </p>
              </div>
            )}
          </div>
        )}

        <PrimaryButton
          type="submit"
          disabled={submitting || mobileNo.length !== 10}
          className="w-full justify-center !py-3.5 shadow-lg shadow-primary/30 shine relative group text-sm disabled:opacity-50"
        >
          {submitting ? (
            <>
              <Loader2 size={16} className="animate-spin" /> Checking status...
            </>
          ) : (
            <>
              <Search size={15} />
              Check My Status
            </>
          )}
        </PrimaryButton>

        {/* Contextual action */}
        {result?.status === "approved" && (
          <Link
            to="/dealerActivate"
            className="flex items-center justify-center gap-2 bg-gradient-to-r from-primary to-emerald-500 text-white font-bold text-sm py-3 rounded-xl shadow-lg shadow-primary/30 hover:shadow-primary/50 transition-all group animate-fade-in"
          >
            <CheckCircle2 size={16} />
            Enter Activation Code
            <ArrowRight
              size={14}
              className="group-hover:translate-x-1 transition-transform"
            />
          </Link>
        )}
        {result?.status === "rejected" && (
          <Link
            to="/DealerForm"
            className="flex items-center justify-center gap-2 bg-foreground text-white font-bold text-sm py-3 rounded-xl hover:bg-foreground/90 transition-all group animate-fade-in"
          >
            Submit New Request
            <ArrowRight
              size={14}
              className="group-hover:translate-x-1 transition-transform"
            />
          </Link>
        )}

        <div className="pt-2 text-center">
          <Link
            to="/dealerLogin"
            className="text-xs text-muted-foreground hover:text-primary transition-colors"
          >
            Already activated?{" "}
            <span className="underline underline-offset-4 font-semibold">
              Sign in here
            </span>
          </Link>
        </div>
      </form>
    </AuthShell>
  );
};

export default DealerStatus;
