import { memo } from "react";
import { Link } from "react-router";
import { ArrowRight } from "lucide-react";

// Section 2 — Editorial Intro.
// Range Rover equivalent: the "Guided by more than 50 years of evolution..."
// statement. Pure text, no image, no CTA clutter. This is the breath after
// the cinematic hero — it establishes brand voice before the product story.
const EditorialIntro = memo(() => {
  return (
    <section className="relative bg-ink text-white overflow-hidden">
      {/* Very subtle atmospheric glow — top center, barely visible */}
      <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] rounded-full bg-primary/[0.03] blur-[180px]" />

      <div className="relative max-w-[1600px] mx-auto px-6 sm:px-10 lg:px-16 py-32 lg:py-48">
        <div className="max-w-3xl mx-auto text-center">
          {/* Eyebrow */}
          <div className="animate-fade-up flex items-center justify-center gap-3 mb-10">
            <span className="h-px w-8 bg-primary/60" />
            <span className="text-eyebrow text-white/50">The JhatPat Jio</span>
            <span className="h-px w-8 bg-primary/60" />
          </div>

          {/* Editorial statement — large serif paragraph */}
          <p
            className="animate-fade-up font-display text-white text-[clamp(1.5rem,2.6vw,2.25rem)] leading-[1.4] tracking-[-0.015em] text-balance"
            style={{ animationDelay: "120ms" }}
          >
            Guided by over a decade of evolution, the JhatPat Jio embodies an
            aesthetic grace that remains uninfluenced by fashions and trends.
            Forever underpinned by peerless refinement and breathtaking
            modernity — built for the people who keep India moving.
          </p>

          {/* Minimal link — Range Rover style "Learn more" */}
          <div
            className="animate-fade-up mt-16 flex items-center justify-center"
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
