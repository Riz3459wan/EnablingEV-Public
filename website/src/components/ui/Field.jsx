import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

const Field = ({ label, error, className = "", children }) => (
  <div className={className}>
    {label && (
      <label className="block text-[10px] sm:text-[11px] uppercase tracking-[0.24em] font-semibold text-white/45 mb-2.5 font-rr">
        {label}
      </label>
    )}
    {children}
    {error && (
      <p className="text-amber-300 text-xs mt-2 leading-relaxed">{error}</p>
    )}
  </div>
);

const inputBase =
  "w-full bg-white/[0.03] border border-white/[0.1] rounded-xl px-4 py-3 text-sm sm:text-base text-white placeholder:text-white/30 outline-none transition-all duration-300 focus:border-primary/60 focus:bg-white/[0.05] focus:shadow-[0_0_0_3px_oklch(87%_0.2_124.12_/_0.08)]";

export const Input = ({ error, icon: Icon, className = "", ...rest }) => {
  if (Icon) {
    return (
      <div className="relative">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/35 pointer-events-none">
          <Icon size={16} strokeWidth={1.75} />
        </span>
        <input
          className={`${inputBase} !pl-11 ${
            error ? "!border-red-500/60" : ""
          } ${className}`}
          {...rest}
        />
      </div>
    );
  }

  return (
    <input
      className={`${inputBase} ${
        error ? "!border-red-500/60" : ""
      } ${className}`}
      {...rest}
    />
  );
};

export const PasswordInput = ({
  error,
  icon: Icon,
  className = "",
  ...rest
}) => {
  const [visible, setVisible] = useState(false);

  return (
    <div className="relative">
      {Icon && (
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/35 pointer-events-none">
          <Icon size={16} strokeWidth={1.75} />
        </span>
      )}
      <input
        type={visible ? "text" : "password"}
        className={`${inputBase} ${Icon ? "!pl-11" : ""} !pr-11 ${
          error ? "!border-red-500/60" : ""
        } ${className}`}
        {...rest}
      />
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        tabIndex={-1}
        className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors duration-300"
        aria-label={visible ? "Hide password" : "Show password"}
      >
        {visible ? <EyeOff size={16} /> : <Eye size={16} />}
      </button>
    </div>
  );
};

export const Select = ({ error, className = "", children, ...rest }) => (
  <select
    className={`${inputBase} ${error ? "!border-red-500/60" : ""} ${className}`}
    {...rest}
  >
    {children}
  </select>
);

export const Textarea = ({ error, className = "", ...rest }) => (
  <textarea
    className={`${inputBase} resize-none ${
      error ? "!border-red-500/60" : ""
    } ${className}`}
    {...rest}
  />
);

export default Field;
