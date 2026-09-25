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
      {/* Full-bleed image */}
      <div className="relative w-full h-[55vh] sm:h-[65vh] lg:h-[75vh]">
        <ImageWithFallback
          src={aboutImg}
          alt="Engineered in India"
          label="Engineered in India"
          className="w-full h-full object-cover"
        />
        {/* Gradient — only bottom fade, top is clear */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-ink" />
      </div>

      {/* Content — pulls up over image (Range Rover style) */}
      <div className="relative max-w-[1600px] mx-auto px-6 sm:px-10 lg:px-16 -mt-32 sm:-mt-40 lg:-mt-48">
        <div className="max-w-3xl lg:pl-8 xl:pl-16">
          {/* Eyebrow */}
          <div className="animate-fade-up flex items-center gap-3 mb-8">
            <span className="h-px w-8 bg-primary/60" />
            <span className="text-eyebrow text-white/60">Our Mission</span>
          </div>

          {/* Headline */}
          <h2
            className="animate-fade-up font-display uppercase text-white text-[clamp(2rem,4.2vw,3.75rem)] leading-[1.02] tracking-[-0.01em] mb-10"
            style={{ animationDelay: "120ms" }}
          >
            Mobility That
            <br />
            Enables Progress.
          </h2>

          {/* Body */}
          <p
            className="animate-fade-up text-lead text-white/65 mb-12 max-w-xl"
            style={{ animationDelay: "220ms" }}
          >
            EnablingEV builds practical electric vehicles for the people who
            keep India moving. Our focus is simple: dependable engineering,
            economical ownership, and support that lasts beyond the sale.
          </p>

          {/* Read link */}
          <div className="animate-fade-up" style={{ animationDelay: "320ms" }}>
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

      {/* Pillars — separate section, below the pulled-up block */}
      <div className="relative max-w-[1600px] mx-auto px-6 sm:px-10 lg:px-16 pb-24 lg:pb-32">
        <div className="grid sm:grid-cols-3 gap-10 sm:gap-8 lg:gap-16 border-t border-white/[0.08] pt-12 mt-24 lg:mt-32">
          {PILLARS.map(({ icon: Icon, title, desc }, i) => (
            <div
              key={title}
              className="animate-fade-up"
              style={{ animationDelay: `${400 + i * 80}ms` }}
            >
              <Icon size={22} className="text-primary mb-6" strokeWidth={1.5} />
              <h3 className="font-display text-2xl sm:text-3xl text-white mb-3 tracking-[-0.01em]">
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
