import { useState } from "react";
import { useNavigate } from "react-router";
import {
  ShieldCheck,
  Loader2,
  User,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { useAuth } from "../../auth/AuthContext";
import AuthShell from "../../components/layout/AuthShell";

// ═══════════════════════════════════════════════════════════
//  PREMIUM FLOATING LABEL INPUT
// ═══════════════════════════════════════════════════════════
const FloatingInput = ({
  icon: Icon,
  label,
  value,
  onChange,
  showToggle,
  type = "text",
  autoFocus,
  ...rest
}) => {
  const [focused, setFocused] = useState(false);
  const [visible, setVisible] = useState(false);
  const isFloating = focused || value.length > 0;
  const inputType = showToggle ? (visible ? "text" : "password") : type;

  return (
    <div className="relative">
      {/* Floating label */}
      <label
        className={`absolute left-11 transition-all duration-200 pointer-events-none z-10 font-semibold tracking-wide ${
          isFloating
            ? "top-2 text-[10px] text-blue-600 uppercase"
            : "top-1/2 -translate-y-1/2 text-sm text-slate-400"
        }`}
      >
        {label}
      </label>

      {/* Icon */}
      <div
        className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-7 h-7 rounded-lg flex items-center justify-center transition-all duration-200 ${
          focused
            ? "bg-blue-100 text-blue-600 scale-110"
            : "bg-slate-100 text-slate-400"
        }`}
      >
        <Icon size={14} />
      </div>

      {/* Input */}
      <input
        type={inputType}
        value={value}
        onChange={onChange}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        autoFocus={autoFocus}
        className={`w-full pl-12 pr-11 pt-6 pb-2 text-sm font-medium text-slate-900 bg-slate-50/50 border-2 rounded-2xl outline-none transition-all duration-200 ${
          focused
            ? "border-blue-500 bg-white shadow-lg shadow-blue-500/10"
            : "border-slate-100 hover:border-slate-200"
        }`}
        {...rest}
      />

      {/* Show/hide password */}
      {showToggle && (
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          tabIndex={-1}
          className="absolute right-3.5 top-1/2 -translate-y-1/2 w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all"
        >
          {visible ? <EyeOff size={14} /> : <Eye size={14} />}
        </button>
      )}

      {/* Focus underline glow */}
      {focused && (
        <div className="absolute -bottom-0.5 left-4 right-4 h-0.5 bg-gradient-to-r from-transparent via-blue-500 to-transparent rounded-full animate-pulse" />
      )}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════
//  MAIN LOGIN
// ═══════════════════════════════════════════════════════════
const AdminLogin = () => {
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await new Promise((r) => setTimeout(r, 800));
      if (userId === "admin" && password === "admin123") {
        login("mock-token", "admin");
        navigate("/adminDash");
      } else {
        setError("Invalid credentials. Please try again.");
      }
    } catch {
      setError("Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthShell
      icon={ShieldCheck}
      roleLabel="Admin"
      title="Welcome back"
      subtitle="Sign in to access your dashboard, manage dealers and track your EV business."
      bullets={[
        "Approve and manage dealer accounts",
        "Generate & track activation codes",
        "Register vehicles across the network",
      ]}
    >
      {/* ── Header badge ── */}
      <div className="flex items-center gap-2 mb-5">
        <div className="flex items-center gap-1.5 px-2.5 py-1 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-full">
          <Sparkles size={11} className="text-blue-600" />
          <span className="text-[10px] font-bold text-blue-700 uppercase tracking-widest">
            Secure Sign-in
          </span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* User ID field */}
        <FloatingInput
          icon={User}
          label="User ID"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          autoFocus
          required
        />

        {/* Password field */}
        <div>
          <FloatingInput
            icon={Lock}
            label="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            showToggle
            required
          />
          <div className="flex justify-end mt-1.5">
            <button
              type="button"
              className="text-[11px] font-semibold text-blue-600 hover:text-blue-700 hover:underline transition-colors"
            >
              Forgot password?
            </button>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="flex items-start gap-2 text-red-600 text-xs bg-red-50 border border-red-200 rounded-xl px-3 py-2.5 animate-shake">
            <div className="w-4 h-4 rounded-full bg-red-100 flex items-center justify-center shrink-0 mt-0.5">
              <span className="text-red-500 font-bold text-[10px]">!</span>
            </div>
            <span className="font-medium">{error}</span>
          </div>
        )}

        {/* Submit button — compact + cool color */}
        <button
          type="submit"
          disabled={submitting}
          className="group relative w-full py-3 rounded-xl font-bold text-sm text-white transition-all duration-300 active:scale-[0.97] disabled:opacity-60 disabled:cursor-not-allowed overflow-hidden bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-indigo-500/40"
        >
          {/* Shine sweep */}
          <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/25 to-transparent" />

          {/* Animated pulse ring (subtle) */}
          <span className="absolute inset-0 rounded-xl ring-2 ring-blue-400/0 group-hover:ring-blue-400/40 transition-all duration-300" />

          {/* Content */}
          <span className="relative z-10 flex items-center justify-center gap-2">
            {submitting ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Signing you in...
              </>
            ) : (
              <>
                Login
                <ArrowRight
                  size={15}
                  className="group-hover:translate-x-1 transition-transform duration-300"
                />
              </>
            )}
          </span>
        </button>
      </form>
    </AuthShell>
  );
};

export default AdminLogin;
