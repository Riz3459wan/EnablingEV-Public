import { memo } from "react";
import { Link } from "react-router";
import { Leaf, ShieldCheck, Zap, ArrowRight } from "lucide-react";
import ImageWithFallback from "../components/ImageWithFallback";
import aboutImg from "../assets/about/about.webp";

const PILLARS = [
  {
    icon: Leaf,
    title: "Cleaner",
    desc: "Zero tailpipe emissions — quieter streets, cleaner air.",
  },
  {
    icon: ShieldCheck,
    title: "Dependable",
    desc: "Engineered and tested for the daily reality of Indian roads.",
  },
  {
    icon: Zap,
    title: "Efficient",
    desc: "Lower running costs, longer range, and one less thing to worry about.",
  },
];

const MissionSection = memo(() => {
  return (
    <section
      id="mission"
      className="relative bg-ink text-white overflow-hidden"
    >
      {/* ─── Full-bleed image ───────────────────────────────── */}
      <div className="relative w-full h-[45vh] sm:h-[55vh] lg:h-[70vh]">
        <ImageWithFallback
          src={aboutImg}
          alt="Engineered in India"
          label="Engineered in India"
          className="w-full h-full object-cover"
        />
        {/* Bottom fade into bg */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-ink" />
      </div>

      {/* ─── Content — pulled up over image ─────────────────── */}
      <div className="relative max-w-[1600px] mx-auto px-4 sm:px-6 md:px-10 lg:px-16 -mt-24 sm:-mt-32 lg:-mt-48">
        <div className="max-w-3xl lg:pl-8 xl:pl-16">
          <div className="animate-fade-up flex items-center gap-3 mb-6 sm:mb-8">
            <span className="h-px w-6 sm:w-8 bg-primary/60" />
            <span className="text-eyebrow text-white/60">Our Mission</span>
          </div>

          <h2 className="animate-fade-up font-display uppercase text-white text-[clamp(1.75rem,4vw,3.75rem)] leading-[1.02] tracking-[-0.01em] mb-6 sm:mb-8">
            Mobility That
            <br />
            Enables Progress.
          </h2>

          <p className="animate-fade-up text-lead text-white/65 mb-8 sm:mb-10 max-w-xl">
            EnablingEV builds practical electric vehicles for the people who
            keep India moving. Our focus is simple: dependable engineering,
            economical ownership, and support that lasts beyond the sale.
          </p>

          <div className="animate-fade-up">
            <Link
              to="/about"
              className="group inline-flex items-center gap-2 text-punch uppercase text-white hover:text-primary transition-colors duration-300"
            >
              <span className="link-luxe">Learn More About Us</span>
              <ArrowRight
                size={14}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </Link>
          </div>
        </div>
      </div>

      {/* ─── Pillars ────────────────────────────────────────── */}
      <div className="relative max-w-[1600px] mx-auto px-4 sm:px-6 md:px-10 lg:px-16 pb-14 sm:pb-16 lg:pb-24">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-6 md:gap-8 lg:gap-16 border-t border-white/[0.08] pt-10 sm:pt-12 mt-12 sm:mt-16 lg:mt-20">
          {PILLARS.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="animate-fade-up">
              <Icon
                size={20}
                className="text-primary mb-4 sm:mb-6"
                strokeWidth={1.5}
              />
              <h3 className="font-display text-xl sm:text-2xl lg:text-3xl text-white mb-2 sm:mb-3 tracking-[-0.01em]">
                {title}
              </h3>
              <p className="text-white/55 text-sm sm:text-base leading-relaxed">
                {desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
});

export default MissionSection;
