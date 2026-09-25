import Card from "./Card";
import { SecondaryButton } from "./Button";

export const LoadingCard = ({ rows = 5 }) => (
  <div className="overflow-hidden rounded-xl border border-white/[0.08] bg-white/[0.02]">
    <div className="h-10 bg-white/[0.03]" />
    <div className="divide-y divide-white/[0.04]">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 px-4 py-4">
          <div className="h-3 rounded-full bg-white/[0.05] animate-pulse w-1/4" />
          <div className="h-3 rounded-full bg-white/[0.05] animate-pulse w-1/6" />
          <div className="h-3 rounded-full bg-white/[0.05] animate-pulse w-1/3" />
          <div className="h-3 rounded-full bg-white/[0.05] animate-pulse w-1/5 ml-auto" />
        </div>
      ))}
    </div>
  </div>
);

export const ErrorCard = ({ message, onRetry }) => (
  <Card className="p-8 text-center">
    <p className="text-red-400 text-sm mb-4">{message}</p>
    {onRetry && <SecondaryButton onClick={onRetry}>Retry</SecondaryButton>}
  </Card>
);

export const Banner = ({ type, children }) => (
  <div
    className={`mb-5 px-4 py-3 rounded-lg text-sm border ${
      type === "success"
        ? "bg-primary/[0.08] border-primary/30 text-primary"
        : "bg-red-500/[0.08] border-red-500/25 text-red-400"
    }`}
  >
    {children}
  </div>
);
