import { memo } from "react";

const SIZE_CLASSES = {
  sm: "text-[11px] sm:text-[12px] tracking-[0.20em]",
  md: "text-[13px] sm:text-[14px] lg:text-[15px] tracking-[0.22em]",
  lg: "text-[16px] sm:text-[18px] tracking-[0.22em]",
  xl: "text-[22px] sm:text-[26px] tracking-[0.20em]",
};

const Wordmark = memo(({ size = "md", className = "" }) => (
  <span
    className={`
      wordmark
      ${SIZE_CLASSES[size] || SIZE_CLASSES.md}
      ${className}
    `}
  >
    ENABLING
    <span
      className="inline-block"
      style={{ width: "0.6em" }}
      aria-hidden="true"
    />
    EV
  </span>
));

export default Wordmark;
