import { useState } from "react";
import { Zap } from "lucide-react";

const ImageWithFallback = ({
  src,
  alt = "",
  label,
  className = "",
  loading = "lazy",
  ...props
}) => {
  // Error state is tied to the src it happened for. When a new src comes in it
  // starts fresh (state adjusted during render instead of in an effect).
  const [status, setStatus] = useState({ src, errored: false });
  if (status.src !== src) setStatus({ src, errored: false });
  const errored = status.src === src && status.errored;

  if (errored || !src) {
    return (
      <div
        role="img"
        aria-label={alt || label || "Image placeholder"}
        className={`relative flex items-center justify-center overflow-hidden ${className}`}
        style={{
          background:
            "linear-gradient(135deg, #020617 0%, #1e293b 55%, #14532d 100%)",
        }}
        {...props}
      >
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at 50% 35%, rgba(163,230,53,0.35), transparent 60%)",
          }}
        />
        <div className="relative flex flex-col items-center gap-3 text-center px-4">
          <div className="bg-background/60 border border-gray-700 p-3 rounded-xl">
            <Zap size={28} className="text-primary" aria-hidden="true" />
          </div>
          {label && (
            <span className="text-gray-300 text-sm font-medium">{label}</span>
          )}
        </div>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      loading={loading}
      decoding="async"
      onError={() => setStatus({ src, errored: true })}
      className={className}
      {...props}
    />
  );
};

export default ImageWithFallback;
