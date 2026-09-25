import { memo } from "react";
import { Link } from "react-router";
import { ArrowRight } from "lucide-react";
import ImageWithFallback from "../../components/ImageWithFallback";
import aboutImg from "../../assets/about/about.webp";
import heroImg from "../../assets/products/F2SS1.webp";
import msImg from "../../assets/products/MS1.webp";

// About — Range Rover editorial treatment.
// Structure: full-bleed hero → alternating chapters → pull-quote → closing CTA.
// All serif, uppercase eyebrows, generous whitespace, thin dividers.
const About = memo(() => {
  return (
    <div className="bg-ink text-white">
      {/* ─── 1. HERO — full-bleed image, one-line statement ──────── */}
      <section className="relative w-full h-[70vh] sm:h-[80vh] lg:h-screen overflow-hidden">
        <div className="absolute inset-0 z-0">
          <ImageWithFallback
            src={aboutImg}
            alt="Enabling E-Vehicle manufacturing"
            label="About EnablingEV"
            className="w-full h-full object-cover"
            loading="eager"
          />
        </div>

        {/* Cinematic overlays */}
        <div className="absolute inset-0 z-10 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-ink/60" />
        </div>

        {/* Content — bottom-left */}
        <div className="relative z-20 h-full flex items-end">
          <div className="w-full max-w-[1600px] mx-auto px-6 sm:px-10 lg:px-16 pb-20 lg:pb-28">
            <div className="max-w-3xl">
              {/* Eyebrow */}
              <div className="animate-fade-up flex items-center gap-3 mb-8">
                <span className="h-px w-10 bg-primary" />
                <span className="text-eyebrow text-white/70">
                  About EnablingEV
                </span>
              </div>

              {/* Headline */}
              <h1
                className="animate-fade-up font-display uppercase text-white text-[clamp(2rem,4.5vw,4rem)] leading-[1.02] tracking-[-0.015em]"
                style={{ animationDelay: "120ms" }}
              >
                Guided By Purpose.
                <br />
                <span className="text-primary">Built For Progress.</span>
              </h1>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 2. CHAPTER 1 — image left, text right ─────────────── */}
      <section className="relative bg-ink">
        <div className="max-w-[1600px] mx-auto px-6 sm:px-10 lg:px-16 py-24 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Image */}
            <div className="relative h-[50vh] sm:h-[60vh] lg:h-[70vh] overflow-hidden">
              <ImageWithFallback
                src={heroImg}
                alt="JhatPat Jio electric rickshaw"
                label="JhatPat Jio"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Text */}
            <div className="max-w-xl lg:pl-4 xl:pl-8">
              <div className="animate-fade-up flex items-center gap-3 mb-8">
                <span className="h-px w-8 bg-primary/60" />
                <span className="text-eyebrow text-white/50">
                  The Beginning
                </span>
              </div>

              <h2
                className="animate-fade-up font-display uppercase text-white text-[clamp(1.75rem,3.2vw,2.75rem)] leading-[1.05] tracking-[-0.01em] mb-8"
                style={{ animationDelay: "120ms" }}
              >
                A Pioneering Force
                <br />
                In Eco-Friendly
                <br />
                Transportation.
              </h2>

              <div
                className="animate-fade-up space-y-5 text-white/65 text-lead"
                style={{ animationDelay: "220ms" }}
              >
                <p>
                  Welcome to Enabling E-Vehicle Pvt. Ltd., a pioneering force in
                  the realm of eco-friendly transportation solutions. Our
                  commitment to innovation and sustainability is embodied in our
                  flagship product, the JhatPat Jio electric rickshaw.
                </p>
                <p>
                  Founded with a vision to transform urban mobility, Enabling
                  E-Vehicle stands at the forefront of the electric vehicle
                  revolution. Our journey began in 2013, driven by a passion for
                  creating advanced transportation solutions that not only
                  enhance the commuting experience but also contribute to a
                  greener planet.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 3. PULL-QUOTE — centered serif statement ──────────── */}
      <section className="relative bg-ink border-y border-white/[0.06]">
        <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full bg-primary/[0.03] blur-[160px]" />

        <div className="relative max-w-[1600px] mx-auto px-6 sm:px-10 lg:px-16 py-28 lg:py-40">
          <div className="max-w-4xl mx-auto text-center">
            <div className="animate-fade-up flex items-center justify-center gap-3 mb-10">
              <span className="h-px w-8 bg-primary/60" />
              <span className="text-eyebrow text-white/50">Our Belief</span>
              <span className="h-px w-8 bg-primary/60" />
            </div>

            <p
              className="animate-fade-up font-display text-white text-[clamp(1.5rem,2.6vw,2.25rem)] leading-[1.4] tracking-[-0.015em] text-balance"
              style={{ animationDelay: "120ms" }}
            >
              At Enabling E-Vehicle, we believe transportation should be
              efficient, reliable, and environmentally responsible. The JhatPat
              Jio is a testament to our dedication to these values — a seamless
              blend of performance, comfort and sustainability.
            </p>
          </div>
        </div>
      </section>

      {/* ─── 4. CHAPTER 2 — text left, image right ─────────────── */}
      <section className="relative bg-ink">
        <div className="max-w-[1600px] mx-auto px-6 sm:px-10 lg:px-16 py-24 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Text — first in DOM for lg, second for mobile */}
            <div className="max-w-xl lg:order-1">
              <div className="animate-fade-up flex items-center gap-3 mb-8">
                <span className="h-px w-8 bg-primary/60" />
                <span className="text-eyebrow text-white/50">The Journey</span>
              </div>

              <h2
                className="animate-fade-up font-display uppercase text-white text-[clamp(1.75rem,3.2vw,2.75rem)] leading-[1.05] tracking-[-0.01em] mb-8"
                style={{ animationDelay: "120ms" }}
              >
                Over A Decade
                <br />
                Of Building
                <br />
                For India.
              </h2>

              <div
                className="animate-fade-up space-y-5 text-white/65 text-lead"
                style={{ animationDelay: "220ms" }}
              >
                <p>
                  What began in a small workshop in Ghaziabad has grown into a
                  national network of dealers, service centres, and thousands of
                  JhatPat Jio vehicles on the road.
                </p>
                <p>
                  Every vehicle we build is designed for the daily reality of
                  Indian roads — durable, economical, and easy to maintain. That
                  is how we keep our promise: dependable mobility, for the
                  people who keep India moving.
                </p>
              </div>

              {/* Stats — thin dividers */}
              <div
                className="animate-fade-up grid grid-cols-3 gap-6 mt-12 pt-8 border-t border-white/[0.08]"
                style={{ animationDelay: "320ms" }}
              >
                {[
                  { value: "2013", label: "Founded" },
                  { value: "10K+", label: "Vehicles" },
                  { value: "50+", label: "Dealers" },
                ].map((s) => (
                  <div key={s.label}>
                    <p className="font-display tabular text-3xl sm:text-4xl text-white leading-none">
                      {s.value}
                    </p>
                    <p className="text-eyebrow text-white/40 mt-3">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Image */}
            <div className="relative h-[50vh] sm:h-[60vh] lg:h-[70vh] overflow-hidden lg:order-2">
              <ImageWithFallback
                src={msImg}
                alt="JhatPat Fine MS electric rickshaw"
                label="JhatPat Fine MS"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ─── 5. FINAL CTA — closing statement ──────────────────── */}
      <section className="relative bg-ink border-t border-white/[0.06]">
        <div className="max-w-[1600px] mx-auto px-6 sm:px-10 lg:px-16 py-24 lg:py-32">
          <div className="max-w-2xl mx-auto text-center">
            <div className="animate-fade-up flex items-center justify-center gap-3 mb-10">
              <span className="h-px w-8 bg-primary/60" />
              <span className="text-eyebrow text-white/50">Keep Exploring</span>
              <span className="h-px w-8 bg-primary/60" />
            </div>

            <h2
              className="animate-fade-up font-display uppercase text-white text-[clamp(1.75rem,3.2vw,2.75rem)] leading-[1.05] tracking-[-0.01em] mb-12"
              style={{ animationDelay: "120ms" }}
            >
              Discover The JhatPat Jio Range.
            </h2>

            <div
              className="animate-fade-up flex flex-wrap items-center justify-center gap-6 sm:gap-10"
              style={{ animationDelay: "220ms" }}
            >
              <Link
                to="/product"
                className="group inline-flex items-center gap-3 text-punch uppercase font-medium text-white border border-white/40 hover:border-white hover:bg-white hover:text-ink transition-all duration-500 px-8 py-4 rounded-full"
              >
                Explore Vehicles
                <ArrowRight
                  size={14}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </Link>

              <Link
                to="/gallery"
                className="group inline-flex items-center gap-2 text-punch uppercase text-white/70 hover:text-white transition-colors duration-300"
              >
                <span className="link-luxe">View Gallery</span>
                <ArrowRight
                  size={14}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
});

export default About;
