export const PrimaryButton = ({ children, className = "", ...rest }) => (
  <button
    className={`font-rr bg-primary hover:bg-primary-hover text-ink px-5 py-2.5 rounded-lg font-semibold text-sm transition-all duration-200 active:scale-[0.98] flex items-center justify-center gap-2 ${className}`}
    {...rest}
  >
    {children}
  </button>
);

export const SecondaryButton = ({ children, className = "", ...rest }) => (
  <button
    className={`font-rr bg-white/[0.04] hover:bg-white/[0.08] text-white border border-white/[0.1] px-5 py-2.5 rounded-lg font-semibold text-sm transition-all duration-200 active:scale-[0.98] flex items-center justify-center gap-2 ${className}`}
    {...rest}
  >
    {children}
  </button>
);

export const EmberButton = ({ children, className = "", ...rest }) => (
  <button
    className={`font-rr bg-ember hover:brightness-110 text-ink px-5 py-2.5 rounded-lg font-semibold text-sm transition-all duration-200 active:scale-[0.98] flex items-center justify-center gap-2 ${className}`}
    {...rest}
  >
    {children}
  </button>
);
