import { memo } from "react";
import { Link } from "react-router";
import { ArrowRight } from "lucide-react";

// Section 2 — Editorial Intro.
// Sits immediately after the hero. Pure text, centered, no image, no CTA clutter.
const EditorialIntro = memo(() => {
  return (
    <section className="relative bg-ink text-white overflow-hidden">
      {/* Very subtle atmospheric glow — top center, barely visible */}
      <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[500px] sm:w-[800px] h-[300px] sm:h-[500px] rounded-full bg-primary/[0.03] blur-[140px] sm:blur-[180px]" />

      <div className="relative max-w-[1600px] mx-auto px-5 sm:px-6 md:px-10 lg:px-16 py-12 sm:py-14 lg:py-20">
        <div className="max-w-3xl mx-auto text-center">
          {/* Eyebrow */}
          <div className="animate-fade-up flex items-center justify-center gap-2 sm:gap-3 mb-6 sm:mb-8">
            <span className="h-px w-5 sm:w-8 bg-primary/60" />
            <span className="text-eyebrow text-white/50 text-[10px] sm:text-[11px]">
              The JhatPat Jio
            </span>
            <span className="h-px w-5 sm:w-8 bg-primary/60" />
          </div>

          {/* Editorial statement — large serif paragraph */}
          <p
            className="animate-fade-up font-display text-white text-[clamp(1.25rem,2.6vw,2.25rem)] leading-[1.45] sm:leading-[1.4] tracking-[-0.015em] text-balance"
            style={{ animationDelay: "120ms" }}
          >
            Guided by over a decade of evolution, the JhatPat Jio embodies an
            aesthetic grace that remains uninfluenced by fashions and trends.
            Forever underpinned by peerless refinement and breathtaking
            modernity — built for the people who keep India moving.
          </p>

          {/* Minimal link */}
          <div
            className="animate-fade-up mt-8 sm:mt-10 flex items-center justify-center"
            style={{ animationDelay: "240ms" }}
          >
            <Link
              to="/about"
              className="group inline-flex items-center gap-2 text-punch uppercase text-white/70 hover:text-white transition-colors duration-300"
            >
              <span className="link-luxe">Read Our Story</span>
              <ArrowRight
                size={14}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
});

export default EditorialIntro;
