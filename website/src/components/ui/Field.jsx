import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

const Field = ({ label, error, className = "", children }) => (
  <div className={className}>
    {label && (
      <label className="block text-eyebrow text-white/40 mb-3">{label}</label>
    )}
    {children}
    {error && (
      <p className="text-amber-300 text-xs mt-2 leading-relaxed">{error}</p>
    )}
  </div>
);

const inputBase =
  "w-full bg-transparent border-0 border-b rounded-none px-0 py-3 text-sm sm:text-base text-white placeholder:text-white/30 outline-none transition-colors duration-300 focus:ring-0";

export const Input = ({ error, className = "", ...rest }) => (
  <input
    className={`${inputBase} ${
      error
        ? "border-red-500/60 focus:border-red-500"
        : "border-white/15 focus:border-primary"
    } ${className}`}
    {...rest}
  />
);

export const PasswordInput = ({ error, className = "", ...rest }) => {
  const [visible, setVisible] = useState(false);

  return (
    <div className="relative">
      <input
        type={visible ? "text" : "password"}
        className={`${inputBase} pr-11 ${
          error
            ? "border-red-500/60 focus:border-red-500"
            : "border-white/15 focus:border-primary"
        } ${className}`}
        {...rest}
      />
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        tabIndex={-1}
        className="absolute right-0 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors duration-300"
        aria-label={visible ? "Hide password" : "Show password"}
      >
        {visible ? <EyeOff size={17} /> : <Eye size={17} />}
      </button>
    </div>
  );
};

export const Select = ({ error, className = "", children, ...rest }) => (
  <select
    className={`${inputBase} ${
      error
        ? "border-red-500/60 focus:border-red-500"
        : "border-white/15 focus:border-primary"
    } ${className}`}
    {...rest}
  >
    {children}
  </select>
);

export const Textarea = ({ error, className = "", ...rest }) => (
  <textarea
    className={`${inputBase} resize-none ${
      error
        ? "border-red-500/60 focus:border-red-500"
        : "border-white/15 focus:border-primary"
    } ${className}`}
    {...rest}
  />
);

export default Field;
