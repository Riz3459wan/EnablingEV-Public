import { memo } from "react";
import { Link } from "react-router";
import Wordmark from "../ui/Wordmark";
import heroImg from "../../assets/products/F2SS1.webp";

/**
 * Modern auth layout — VoltPulse-inspired, EnablingEV branded.
 *
 * Left:  Full-bleed dark EV image with cinematic overlay
 * Right: Centered frosted dark glass card with glowing accents
 *
 * Layout:
 *   - Fixed height (h-screen), no page scroll
 *   - Mobile: image as top banner, form fills remaining viewport
 *   - Desktop: card centered vertically
 */
const AuthShell = memo(({ roleLabel, title, subtitle, children }) => (
  <div className="h-screen w-screen bg-ink text-white relative overflow-hidden flex flex-col">
    {/* ─── Full-bleed background image ──────────────────────── */}
    <div className="absolute inset-0 z-0">
      <img
        src={heroImg}
        alt=""
        aria-hidden="true"
        className="w-full h-full object-cover brightness-[0.55] contrast-[1.05]"
      />
      {/* Dark overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-ink/70 via-ink/50 to-ink/90" />
      <div className="absolute inset-0 bg-gradient-to-r from-ink/80 via-ink/40 to-ink/60" />
    </div>

    {/* ─── Top bar — wordmark left, back link right ──────── */}
    <header className="relative z-20 flex items-center justify-between px-6 sm:px-10 lg:px-16 py-5 sm:py-6 shrink-0">
      <Link
        to="/"
        className="flex items-center text-white hover:opacity-90 transition-opacity duration-300"
      >
        <Wordmark size="md" />
      </Link>

      <Link
        to="/"
        className="hidden sm:inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] font-semibold text-white/60 hover:text-white transition-colors duration-300"
      >
        ← Back to Home
      </Link>
    </header>

    {/* ─── Main content — centered card ──────────────────── */}
    <div className="relative z-10 flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-16 pb-6 overflow-y-auto">
      <div className="w-full max-w-md my-auto">
        {/* Card — frosted dark glass */}
        <div className="relative bg-ink/70 backdrop-blur-2xl border border-white/[0.08] rounded-2xl p-6 sm:p-10 shadow-2xl shadow-black/60 overflow-hidden">
          {/* Accent glow at top of card */}
          <div className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-[300px] h-[300px] rounded-full bg-primary/[0.15] blur-[80px]" />

          {/* Content */}
          <div className="relative">
            {/* Wordmark inside card */}
            <div className="flex items-center justify-center mb-8">
              <Wordmark size="lg" />
            </div>

            {/* Role label */}
            <div className="flex items-center justify-center gap-3 mb-4">
              <span className="h-px w-6 bg-primary/60" />
              <span className="text-[10px] uppercase tracking-[0.28em] font-semibold text-primary">
                {roleLabel}
              </span>
              <span className="h-px w-6 bg-primary/60" />
            </div>

            {/* Title */}
            <h1 className="font-display uppercase text-white text-[clamp(1.35rem,3vw,1.75rem)] leading-[1.1] tracking-[-0.01em] text-center mb-3">
              {title}
            </h1>

            {/* Subtitle */}
            <p className="text-white/55 text-sm text-center leading-relaxed mb-8 max-w-xs mx-auto">
              {subtitle}
            </p>

            {/* Form */}
            <div>{children}</div>
          </div>
        </div>

        {/* Footer below card */}
        <p className="text-center text-[10px] uppercase tracking-[0.2em] text-white/30 mt-5">
          © 2026 Enabling E-Vehicle Pvt. Ltd.
        </p>
      </div>
    </div>
  </div>
));

export default AuthShell;
