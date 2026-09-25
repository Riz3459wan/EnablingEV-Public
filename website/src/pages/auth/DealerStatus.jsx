import { useState } from "react";
import { Link } from "react-router";
import {
  Loader2,
  ArrowRight,
  CheckCircle2,
  Clock,
  XCircle,
  Search,
  Phone,
} from "lucide-react";
import api from "../../api/client";
import AuthShell from "../../components/layout/AuthShell";
import Field, { Input } from "../../components/ui/Field";

const STATES = {
  pending: {
    icon: Clock,
    textColor: "text-amber-300",
    bgColor: "bg-amber-400/[0.06]",
    borderColor: "border-amber-400/25",
    title: "Still Under Review",
    body: "Your registration request hasn't been reviewed yet. Check back later, or wait for our email.",
  },
  approved: {
    icon: CheckCircle2,
    textColor: "text-primary",
    bgColor: "bg-primary/[0.06]",
    borderColor: "border-primary/30",
    title: "Approved",
    body: "Your request was approved. We've emailed you an activation code — enter it on the activation page to finish setup.",
  },
  rejected: {
    icon: XCircle,
    textColor: "text-red-400",
    bgColor: "bg-red-400/[0.06]",
    borderColor: "border-red-400/30",
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
      roleLabel="Dealer"
      title="Track Request"
      subtitle="See whether your dealer registration is pending, approved, or was not approved."
    >
      <form onSubmit={handleSubmit} className="space-y-5" noValidate>
        <Field label="Mobile Number">
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
            icon={Phone}
            autoComplete="tel"
            required
          />
        </Field>

        {error && (
          <div className="flex items-start gap-2.5 text-red-300 text-xs bg-red-400/[0.08] border border-red-400/25 rounded-xl px-4 py-3 leading-relaxed">
            <span className="w-1.5 h-1.5 rounded-full bg-red-400 mt-1.5 shrink-0" />
            {error}
          </div>
        )}

        {state && (
          <div
            className={`${state.borderColor} ${state.bgColor} border rounded-xl p-4 animate-fade-up`}
          >
            <div className="flex items-start gap-3 mb-3">
              <div
                className={`w-9 h-9 rounded-full border ${state.borderColor} flex items-center justify-center shrink-0`}
              >
                <StateIcon
                  size={16}
                  className={state.textColor}
                  strokeWidth={2}
                />
              </div>
              <div className="pt-0.5">
                <p
                  className={`font-display uppercase text-sm tracking-[-0.01em] ${state.textColor}`}
                >
                  {state.title}
                </p>
                <p className="text-[10px] text-white/40 font-mono mt-0.5">
                  {mobileNo}
                </p>
              </div>
            </div>
            <p className="text-xs leading-relaxed text-white/65">
              {state.body}
            </p>
            {result.status === "rejected" && result.reason && (
              <div className="mt-3 pt-3 border-t border-white/10">
                <p className="text-xs leading-relaxed text-white/65">
                  <span className="font-semibold text-white">Reason:</span>{" "}
                  {result.reason}
                </p>
              </div>
            )}
          </div>
        )}

        <button
          type="submit"
          disabled={submitting || mobileNo.length !== 10}
          className="group relative w-full inline-flex items-center justify-center gap-2.5 text-[12px] uppercase tracking-[0.2em] font-bold text-ink bg-gradient-to-r from-primary via-primary to-primary hover:brightness-110 transition-all duration-300 px-8 py-4 rounded-full shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/50 disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none mt-2"
        >
          {submitting ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Checking...
            </>
          ) : (
            <>
              <Search size={15} />
              Check Status
            </>
          )}
        </button>

        {result?.status === "approved" && (
          <Link
            to="/dealerActivate"
            className="group flex items-center justify-between border border-primary/40 hover:border-primary bg-primary/[0.08] hover:bg-primary/[0.12] transition-all rounded-xl px-5 py-3.5"
          >
            <span className="flex items-center gap-2 text-primary text-[11px] uppercase tracking-[0.14em] font-semibold">
              <CheckCircle2 size={14} />
              Enter Activation Code
            </span>
            <ArrowRight
              size={14}
              className="text-primary transition-transform duration-300 group-hover:translate-x-1"
            />
          </Link>
        )}

        {result?.status === "rejected" && (
          <Link
            to="/DealerForm"
            className="group flex items-center justify-between border border-white/20 hover:border-white/40 bg-white/[0.03] hover:bg-white/[0.06] transition-all rounded-xl px-5 py-3.5"
          >
            <span className="text-white text-[11px] uppercase tracking-[0.14em] font-semibold">
              Submit New Request
            </span>
            <ArrowRight
              size={14}
              className="text-white transition-transform duration-300 group-hover:translate-x-1"
            />
          </Link>
        )}

        <div className="pt-3 border-t border-white/[0.08]">
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
        </div>
      </form>
    </AuthShell>
  );
};

export default DealerStatus;
