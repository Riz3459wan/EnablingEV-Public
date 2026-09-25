import { memo } from "react";
import { Link } from "react-router";
import { ArrowRight, Leaf, ShieldCheck, Zap } from "lucide-react";
import ImageWithFallback from "../../components/ImageWithFallback";
import aboutImg from "../../assets/about/about.webp";

const PILLARS = [
  {
    icon: Leaf,
    title: "Cleaner",
    desc: "Zero tailpipe emissions — quieter streets, cleaner air, and a lighter footprint on every route we run.",
  },
  {
    icon: ShieldCheck,
    title: "Dependable",
    desc: "Engineered and tested for the daily reality of Indian roads — durable, serviceable, and built to last beyond the sale.",
  },
  {
    icon: Zap,
    title: "Efficient",
    desc: "Lower running costs, longer range, and one less thing to worry about — so owners can focus on the work.",
  },
];

const Mission = memo(() => {
  return (
    <div className="bg-ink text-white">
      {/* Hero */}
      <section className="relative bg-ink border-b border-white/[0.06]">
        <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[500px] sm:w-[800px] h-[300px] sm:h-[400px] rounded-full bg-primary/[0.03] blur-[140px] sm:blur-[160px]" />

        <div className="relative max-w-[1600px] mx-auto px-4 sm:px-6 md:px-10 lg:px-16 pt-32 sm:pt-40 lg:pt-48 pb-14 sm:pb-20 lg:pb-28 text-center">
          <div className="animate-fade-up flex items-center justify-center gap-2 sm:gap-3 mb-6 sm:mb-8">
            <span className="h-px w-6 sm:w-8 bg-primary/60" />
            <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.28em] font-medium text-white/50">
              Our Mission
            </span>
            <span className="h-px w-6 sm:w-8 bg-primary/60" />
          </div>

          <h1
            className="animate-fade-up font-display uppercase text-white text-[clamp(1.75rem,4.5vw,4rem)] leading-[1.02] tracking-[-0.015em] mb-6 sm:mb-8 max-w-4xl mx-auto text-balance"
            style={{ animationDelay: "120ms" }}
          >
            Mobility That
            <br />
            <span className="text-primary">Enables Progress.</span>
          </h1>

          <p
            className="animate-fade-up text-lead text-white/60 max-w-2xl mx-auto"
            style={{ animationDelay: "220ms" }}
          >
            EnablingEV builds practical electric vehicles for the people who
            keep India moving. Our focus is simple — dependable engineering,
            economical ownership, and support that lasts beyond the sale.
          </p>
        </div>
      </section>

      {/* Full-bleed image chapter */}
      <section className="relative w-full h-[45vh] sm:h-[60vh] lg:h-[85vh] overflow-hidden">
        <div className="absolute inset-0 z-0">
          <ImageWithFallback
            src={aboutImg}
            alt="EnablingEV manufacturing"
            label="EnablingEV"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="absolute inset-0 z-10 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-transparent" />
        </div>

        <div className="relative z-20 h-full flex items-end">
          <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 md:px-10 lg:px-16 pb-12 sm:pb-20 lg:pb-28">
            <div className="max-w-3xl lg:pl-8 xl:pl-16">
              <div className="animate-fade-up flex items-center gap-3 mb-6 sm:mb-8">
                <span className="h-px w-6 sm:w-10 bg-primary" />
                <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.28em] font-medium text-white/70">
                  Every Vehicle, Every Route
                </span>
              </div>

              <h2
                className="animate-fade-up font-display uppercase text-white text-[clamp(1.5rem,3.5vw,3rem)] leading-[1.02] tracking-[-0.01em] mb-4 sm:mb-6"
                style={{ animationDelay: "120ms" }}
              >
                Guided By Purpose.
                <br />
                Driven By India.
              </h2>

              <p
                className="animate-fade-up text-lead text-white/65 max-w-xl"
                style={{ animationDelay: "220ms" }}
              >
                Every JhatPat Jio on the road is a small promise kept — a
                cleaner commute, a steadier income, a dependable vehicle for the
                people who keep our cities moving.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pillars */}
      <section className="relative bg-ink border-t border-white/[0.06]">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 md:px-10 lg:px-16 py-16 sm:py-20 lg:py-32">
          <div className="grid lg:grid-cols-[1fr_2fr] gap-10 lg:gap-20 items-start">
            <div className="max-w-md">
              <div className="animate-fade-up flex items-center gap-3 mb-6 sm:mb-8">
                <span className="h-px w-6 sm:w-8 bg-primary/60" />
                <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.28em] font-medium text-white/50">
                  What We Stand For
                </span>
              </div>

              <h2
                className="animate-fade-up font-display uppercase text-white text-[clamp(1.5rem,3.2vw,2.75rem)] leading-[1.05] tracking-[-0.01em]"
                style={{ animationDelay: "120ms" }}
              >
                Three
                <br />
                Principles,
                <br />
                One
                <br />
                Purpose.
              </h2>
            </div>

            <div className="space-y-0">
              {PILLARS.map(({ icon: Icon, title, desc }, i) => (
                <div
                  key={title}
                  className="animate-fade-up grid grid-cols-1 sm:grid-cols-[180px_1fr] gap-3 sm:gap-8 lg:gap-12 py-6 sm:py-8 lg:py-10 border-t border-white/[0.08] last:border-b last:border-white/[0.08]"
                  style={{ animationDelay: `${200 + i * 100}ms` }}
                >
                  <div className="flex items-center gap-3 sm:gap-4">
                    <Icon
                      size={20}
                      className="text-primary/80 shrink-0"
                      strokeWidth={1.5}
                    />
                    <h3 className="font-display text-xl sm:text-2xl lg:text-3xl uppercase text-white tracking-[-0.01em]">
                      {title}
                    </h3>
                  </div>
                  <p className="text-white/60 text-sm sm:text-base leading-relaxed max-w-lg">
                    {desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Pull-quote */}
      <section className="relative bg-ink border-t border-white/[0.06]">
        <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[500px] sm:w-[800px] h-[300px] sm:h-[400px] rounded-full bg-primary/[0.03] blur-[140px] sm:blur-[160px]" />

        <div className="relative max-w-[1600px] mx-auto px-4 sm:px-6 md:px-10 lg:px-16 py-16 sm:py-24 lg:py-40">
          <div className="max-w-4xl mx-auto text-center">
            <div className="animate-fade-up flex items-center justify-center gap-2 sm:gap-3 mb-6 sm:mb-10">
              <span className="h-px w-6 sm:w-8 bg-primary/60" />
              <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.28em] font-medium text-white/50">
                The Promise
              </span>
              <span className="h-px w-6 sm:w-8 bg-primary/60" />
            </div>

            <p
              className="animate-fade-up font-display text-white text-[clamp(1.25rem,2.6vw,2.25rem)] leading-[1.45] sm:leading-[1.4] tracking-[-0.015em] text-balance"
              style={{ animationDelay: "120ms" }}
            >
              Mobility should be efficient, reliable, and environmentally
              responsible. That is the promise we made to ourselves in 2013 —
              and the promise we keep, one vehicle at a time.
            </p>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative bg-ink border-t border-white/[0.06]">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 md:px-10 lg:px-16 py-16 sm:py-20 lg:py-32">
          <div className="max-w-2xl mx-auto text-center">
            <div className="animate-fade-up flex items-center justify-center gap-2 sm:gap-3 mb-8 sm:mb-10">
              <span className="h-px w-6 sm:w-8 bg-primary/60" />
              <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.28em] font-medium text-white/50">
                Join The Journey
              </span>
              <span className="h-px w-6 sm:w-8 bg-primary/60" />
            </div>

            <h2
              className="animate-fade-up font-display uppercase text-white text-[clamp(1.5rem,3.2vw,2.75rem)] leading-[1.05] tracking-[-0.01em] mb-8 sm:mb-12"
              style={{ animationDelay: "120ms" }}
            >
              Explore The JhatPat Jio Range.
            </h2>

            <div
              className="animate-fade-up flex flex-col sm:flex-row sm:flex-wrap items-center justify-center gap-4 sm:gap-6 lg:gap-10"
              style={{ animationDelay: "220ms" }}
            >
              <Link
                to="/product"
                className="group inline-flex items-center justify-center gap-3 text-punch uppercase font-medium text-white border border-white/40 hover:border-white hover:bg-white hover:text-ink transition-all duration-500 px-6 sm:px-8 py-3.5 sm:py-4 rounded-full w-full sm:w-auto"
              >
                Explore Vehicles
                <ArrowRight
                  size={14}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </Link>

              <Link
                to="/DealerForm"
                className="group inline-flex items-center justify-center gap-2 text-punch uppercase text-white/70 hover:text-white transition-colors duration-300 w-full sm:w-auto py-2"
              >
                <span className="link-luxe">Become A Dealer</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
});

export default Mission;
