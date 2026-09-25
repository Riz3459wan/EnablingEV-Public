import { memo } from "react";
import { Link } from "react-router";
import { ArrowLeft } from "lucide-react";
import BrandMark from "../ui/BrandMark";

// Split-screen auth layout — Range Rover / premium editorial treatment.
// Left: brand panel with serif wordmark, role tagline, bullet list.
// Right: clean form area with underline inputs (no card, no boxes).
const AuthShell = memo(
  ({ icon: Icon, roleLabel, title, subtitle, bullets = [], children }) => (
    <div className="min-h-screen bg-ink text-white flex">
      {/* ─── Left — Brand panel (desktop only) ─────────────────── */}
      <div className="hidden lg:flex lg:w-[45%] xl:w-[42%] relative flex-col justify-between p-12 xl:p-16 border-r border-white/[0.06] overflow-hidden">
        {/* Subtle atmospheric glow */}
        <div className="pointer-events-none absolute top-0 left-0 w-[600px] h-[600px] rounded-full bg-primary/[0.04] blur-[180px] -z-0" />

        {/* Wordmark top */}
        <Link
          to="/"
          className="relative z-10 flex items-center gap-3 text-white w-fit group"
        >
          <BrandMark className="h-9 w-auto transition-transform duration-500 group-hover:scale-105" />
          <span className="font-display text-2xl tracking-tight text-white">
            Enabling<span className="text-primary">EV</span>
          </span>
        </Link>

        {/* Center content — vertically centered */}
        <div className="relative z-10 flex-1 flex items-center">
          <div className="max-w-md">
            {/* Role eyebrow */}
            <div className="flex items-center gap-3 mb-10">
              <span className="h-px w-8 bg-primary/60" />
              <span className="text-eyebrow text-primary/80">{roleLabel}</span>
            </div>

            {/* Big serif headline */}
            <h2 className="font-display uppercase text-white text-[clamp(2rem,3.2vw,2.75rem)] leading-[1.02] tracking-[-0.015em] mb-8">
              {title}
            </h2>

            {/* Subtitle */}
            <p className="text-lead text-white/60 mb-12 max-w-sm">{subtitle}</p>

            {/* Bullets */}
            {bullets.length > 0 && (
              <ul className="space-y-0 border-t border-white/[0.08]">
                {bullets.map((b, i) => (
                  <li
                    key={i}
                    className="py-4 border-b border-white/[0.08] text-white/55 text-sm leading-relaxed"
                  >
                    {b}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Copyright bottom */}
        <p className="relative z-10 text-white/30 text-xs">
          © 2026 Enabling E-Vehicle Pvt. Ltd.
        </p>
      </div>

      {/* ─── Right — Form panel ────────────────────────────────── */}
      <div className="flex-1 flex items-center justify-center relative px-6 sm:px-10 py-20 lg:py-24">
        {/* Mobile-only glow */}
        <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[400px] rounded-full bg-primary/[0.04] blur-[160px] lg:hidden" />

        <div className="relative w-full max-w-md">
          {/* Mobile back link */}
          <Link
            to="/"
            className="lg:hidden flex items-center gap-2 text-white/60 hover:text-white text-sm mb-10 transition-colors duration-300 w-fit"
          >
            <ArrowLeft size={14} /> Back to home
          </Link>

          {/* Mobile brand mark */}
          <div className="lg:hidden flex items-center gap-3 mb-10">
            <BrandMark className="h-8 w-auto" />
            <span className="font-display text-xl tracking-tight text-white">
              Enabling<span className="text-primary">EV</span>
            </span>
          </div>

          {/* Mobile role eyebrow */}
          <div className="lg:hidden flex items-center gap-3 mb-6">
            <span className="h-px w-6 bg-primary/60" />
            <span className="text-eyebrow text-primary/80">{roleLabel}</span>
          </div>

          {/* Mobile title */}
          <h1 className="lg:hidden font-display uppercase text-white text-3xl sm:text-4xl leading-[1.05] tracking-[-0.015em] mb-8">
            {title}
          </h1>

          {/* Desktop-only intro */}
          <div className="hidden lg:block mb-10">
            <div className="flex items-center gap-3 mb-3">
              <span className="h-px w-8 bg-primary/60" />
              <span className="text-eyebrow text-white/50">Sign In</span>
            </div>
            <p className="text-white/50 text-sm">
              Continue to your {roleLabel.toLowerCase()} dashboard.
            </p>
          </div>

          {/* Form children */}
          <div>{children}</div>
        </div>
      </div>
    </div>
  ),
);

export default AuthShell;
