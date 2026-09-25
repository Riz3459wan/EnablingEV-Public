import { Link } from "react-router";
import { CheckCircle2, Battery, Zap } from "lucide-react";
import BrandMark from "../ui/BrandMark";

const AuthShell = ({
  icon: Icon,
  roleLabel,
  title,
  subtitle,
  bullets = [],
  children,
}) => (
  <div className="min-h-screen relative bg-white overflow-hidden">
    {/* ── Right Side Diagonal Panel ── */}
    <div
      className="hidden lg:block absolute top-0 right-0 w-[55%] h-full bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a]"
      style={{
        clipPath: "polygon(15% 0, 100% 0, 100% 100%, 0% 100%)",
      }}
    >
      {/* Animated grid */}
      <div
        className="absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(96,165,250,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(96,165,250,0.5) 1px, transparent 1px)",
          backgroundSize: "50px 50px",
          maskImage:
            "radial-gradient(circle at 60% 40%, black 20%, transparent 70%)",
          WebkitMaskImage:
            "radial-gradient(circle at 60% 40%, black 20%, transparent 70%)",
        }}
      />

      {/* Glow orbs */}
      <div className="absolute top-1/4 right-1/4 w-96 h-96 rounded-full bg-blue-500/25 blur-[120px] animate-pulse-slow" />
      <div
        className="absolute bottom-1/4 left-1/4 w-80 h-80 rounded-full bg-emerald-500/15 blur-[100px] animate-pulse-slow"
        style={{ animationDelay: "2s" }}
      />

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-blue-400/60 animate-float-particle"
            style={{
              left: `${20 + Math.random() * 75}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 8}s`,
              animationDuration: `${7 + Math.random() * 5}s`,
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative h-full flex flex-col justify-between p-12 pl-[18%] z-10">
        <div className="flex justify-end">
          <Link
            to="/"
            className="flex items-center gap-2.5 text-white w-fit group"
          >
            <BrandMark className="h-9 w-auto transition-transform group-hover:scale-110 group-hover:rotate-6 duration-300" />
            <span className="font-semibold text-xl tracking-tight text-white">
              Enabling<span className="text-blue-400">EV</span>
            </span>
          </Link>
        </div>

        <div className="max-w-md">
          {/* Animated Battery Illustration */}
          <div className="relative w-32 h-20 mb-8 animate-float">
            {/* Battery outline */}
            <div className="absolute inset-0 border-2 border-blue-400/40 rounded-xl" />
            <div className="absolute -right-2 top-1/2 -translate-y-1/2 w-2 h-6 bg-blue-400/40 rounded-r" />
            {/* Filling bars */}
            <div className="absolute inset-2 flex gap-1">
              {[1, 2, 3, 4].map((n) => (
                <div
                  key={n}
                  className="flex-1 rounded-sm bg-gradient-to-b from-emerald-400 to-emerald-500 animate-battery-fill shadow-[0_0_12px_rgba(16,185,129,0.6)]"
                  style={{ animationDelay: `${n * 0.5}s` }}
                />
              ))}
            </div>
            {/* Lightning */}
            <div className="absolute inset-0 flex items-center justify-center">
              <Zap
                size={32}
                className="text-yellow-300 drop-shadow-[0_0_15px_rgba(253,224,71,0.8)] animate-lightning-pulse"
              />
            </div>
          </div>

          <div className="flex items-center gap-2.5 mb-4">
            <span className="h-px w-8 bg-gradient-to-r from-blue-400 to-transparent" />
            <span className="text-sm text-blue-300 font-semibold uppercase tracking-widest">
              {roleLabel} Portal
            </span>
          </div>

          <h2 className="text-4xl lg:text-5xl font-bold tracking-tight text-white mb-4 leading-tight">
            {title.split(" ").map((word, i) => (
              <span
                key={i}
                className="inline-block animate-fade-in-up"
                style={{ animationDelay: `${i * 120}ms` }}
              >
                {word}&nbsp;
              </span>
            ))}
          </h2>

          <p className="text-slate-400 text-base leading-relaxed mb-8">
            {subtitle}
          </p>

          {bullets.length > 0 && (
            <ul className="space-y-3">
              {bullets.map((b, i) => (
                <li
                  key={b}
                  className="flex items-start gap-3 text-sm text-slate-300 animate-fade-in-up"
                  style={{ animationDelay: `${500 + i * 120}ms` }}
                >
                  <div className="w-5 h-5 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 size={11} className="text-emerald-400" />
                  </div>
                  {b}
                </li>
              ))}
            </ul>
          )}
        </div>

        <p className="text-xs text-slate-500">
          © 2026 Enabling E-Vehicle Private Limited.
        </p>
      </div>
    </div>

    {/* ── Left Side — Form ── */}
    <div className="relative lg:w-[55%] min-h-screen flex items-center justify-center p-4 sm:p-8 z-20">
      <div className="w-full max-w-md">
        {/* Mobile Logo */}
        <Link to="/" className="lg:hidden flex items-center gap-2.5 mb-8 w-fit">
          <BrandMark className="h-9 w-auto" />
          <span className="font-semibold text-xl tracking-tight text-slate-900">
            Enabling<span className="text-blue-600">EV</span>
          </span>
        </Link>

        {/* Card with shine sweep */}
        <div className="relative bg-white border border-slate-200 rounded-3xl shadow-[0_20px_60px_-15px_rgba(15,23,42,0.1)] p-8 sm:p-10 overflow-hidden group animate-scale-in">
          {/* Shine sweep */}
          <div className="absolute top-0 -left-full w-full h-full bg-gradient-to-r from-transparent via-blue-100/40 to-transparent group-hover:left-full transition-all duration-1000 pointer-events-none" />

          {/* Accent line */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-emerald-400 to-blue-500 animate-gradient" />

          <div className="lg:hidden w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center mb-5 shadow-lg shadow-blue-500/30">
            <Icon size={24} className="text-white" />
          </div>

          <div className="hidden lg:flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
              <Battery size={14} className="text-blue-600" />
            </div>
            <span className="text-[10px] uppercase tracking-widest font-bold text-blue-600">
              Secure Login
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold mb-1 text-slate-900">
            {title}
          </h1>
          <p className="text-slate-500 text-sm mb-7">{subtitle}</p>
          {children}
        </div>
      </div>
    </div>
  </div>
);

export default AuthShell;
