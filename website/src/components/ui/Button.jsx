export const PrimaryButton = ({ children, className = "", ...rest }) => (
  <button
    className={`font-sans bg-primary hover:bg-primary-hover text-white px-5 py-2.5 rounded-lg font-semibold text-sm transition-all duration-200 shadow-sm active:scale-[0.98] flex items-center justify-center gap-2 ${className}`}
    {...rest}
  >
    {children}
  </button>
);

export const SecondaryButton = ({ children, className = "", ...rest }) => (
  <button
    className={`font-sans bg-white hover:bg-gray-50 text-foreground border border-border px-5 py-2.5 rounded-lg font-semibold text-sm transition-all duration-200 active:scale-[0.98] flex items-center justify-center gap-2 ${className}`}
    {...rest}
  >
    {children}
  </button>
);

export const EmberButton = ({ children, className = "", ...rest }) => (
  <button
    className={`font-sans bg-ember hover:brightness-110 text-white px-5 py-2.5 rounded-lg font-semibold text-sm transition-all duration-200 shadow-sm active:scale-[0.98] flex items-center justify-center gap-2 ${className}`}
    {...rest}
  >
    {children}
  </button>
);
