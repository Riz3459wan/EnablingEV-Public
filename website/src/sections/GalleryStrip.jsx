import { memo, useRef } from "react";
import { Link } from "react-router";
import {
  ArrowRight,
  ArrowLeft,
  ArrowRight as ArrowRightIcon,
} from "lucide-react";
import ImageWithFallback from "../components/ImageWithFallback";
import r1 from "../assets/gallery/Rikshaw1.webp";
import r2 from "../assets/gallery/Rikshaw2.webp";
import r3 from "../assets/gallery/Rikshaw3.webp";
import r4 from "../assets/gallery/Rikshaw4.webp";
import r5 from "../assets/gallery/Rikshaw5.webp";
import r6 from "../assets/gallery/Rikshaw6.webp";
import r7 from "../assets/gallery/Rikshaw7.webp";

const IMAGES = [
  { src: r1, alt: "JhatPat Jio on the road" },
  { src: r4, alt: "EnablingEV in service" },
  { src: r2, alt: "Fleet on the highway" },
  { src: r6, alt: "Detail of the cabin" },
  { src: r3, alt: "EnablingEV at golden hour" },
  { src: r7, alt: "On the open road" },
  { src: r5, alt: "EnablingEV fleet" },
];

const GalleryStrip = memo(() => {
  const stripRef = useRef(null);

  const scroll = (direction) => {
    const el = stripRef.current;
    if (!el) return;
    const amount = el.clientWidth * 0.75;
    el.scrollBy({
      left: direction === "next" ? amount : -amount,
      behavior: "smooth",
    });
  };

  return (
    <section
      id="gallery"
      className="relative bg-ink text-white overflow-hidden"
    >
      {/* ─── Header ─────────────────────────────────────────── */}
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 md:px-10 lg:px-16 pt-14 sm:pt-16 lg:pt-24 pb-6 sm:pb-8 lg:pb-12">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 sm:gap-4">
          {/* Left — text */}
          <div>
            <div className="animate-fade-up flex items-center gap-3 mb-4 sm:mb-6">
              <span className="h-px w-6 sm:w-8 bg-primary/60" />
              <span className="text-eyebrow text-white/50">
                Inside EnablingEV
              </span>
            </div>

            <h2 className="animate-fade-up font-display uppercase text-white text-[clamp(1.5rem,3.2vw,2.75rem)] leading-[1.05] tracking-[-0.01em] max-w-xl">
              Moments from
              <br />
              the road.
            </h2>
          </div>

          {/* Right — arrows (desktop) + view all (all) */}
          <div className="flex items-center justify-between sm:justify-end gap-6 sm:gap-10">
            <Link
              to="/gallery"
              className="group inline-flex items-center gap-2 text-punch uppercase text-white hover:text-primary transition-colors duration-300"
            >
              <span className="link-luxe">View Full Gallery</span>
              <ArrowRight
                size={14}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </Link>

            {/* Arrows — desktop only */}
            <div className="hidden md:flex items-center gap-3">
              <button
                onClick={() => scroll("prev")}
                aria-label="Previous"
                className="w-11 h-11 lg:w-12 lg:h-12 rounded-full border border-white/20 hover:border-white text-white/70 hover:text-white transition-colors duration-300 flex items-center justify-center"
              >
                <ArrowLeft size={16} strokeWidth={1.5} />
              </button>
              <button
                onClick={() => scroll("next")}
                aria-label="Next"
                className="w-11 h-11 lg:w-12 lg:h-12 rounded-full border border-white/20 hover:border-white text-white/70 hover:text-white transition-colors duration-300 flex items-center justify-center"
              >
                <ArrowRightIcon size={16} strokeWidth={1.5} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ─── Horizontal scroll strip ────────────────────────── */}
      <div className="relative">
        <div
          ref={stripRef}
          className="flex gap-2 sm:gap-3 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-12 sm:pb-14 lg:pb-20 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
        >
          {/* Left spacer — matches page padding */}
          <div className="shrink-0 w-4 sm:w-6 md:w-10 lg:w-16" aria-hidden />

          {IMAGES.map((img, i) => (
            <Link
              key={i}
              to="/gallery"
              className="relative shrink-0 snap-start overflow-hidden group"
            >
              <div className="w-[82vw] sm:w-[60vw] md:w-[45vw] lg:w-[34vw] xl:w-[28vw] h-[45vh] sm:h-[55vh] lg:h-[70vh]">
                <ImageWithFallback
                  src={img.src}
                  alt={img.alt}
                  label={img.alt}
                  className="w-full h-full object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-105"
                />
              </div>
            </Link>
          ))}

          {/* Right spacer */}
          <div className="shrink-0 w-4 sm:w-6 md:w-10 lg:w-16" aria-hidden />
        </div>
      </div>

      {/* ─── Mobile "View all" (bottom, for phones without header link visible) ─── */}
      <div className="md:hidden flex justify-center pb-14 sm:pb-16">
        <Link
          to="/gallery"
          className="group inline-flex items-center gap-2 text-punch uppercase text-white/70 hover:text-white transition-colors duration-300"
        >
          <span className="link-luxe">View Full Gallery</span>
          <ArrowRight
            size={14}
            className="transition-transform duration-300 group-hover:translate-x-1"
          />
        </Link>
      </div>
    </section>
  );
});

export default GalleryStrip;
