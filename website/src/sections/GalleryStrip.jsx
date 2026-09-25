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
      {/* Header — left title, right link + arrows */}
      <div className="max-w-[1600px] mx-auto px-6 sm:px-10 lg:px-16 pt-24 lg:pt-32 pb-10 lg:pb-14">
        <div className="flex items-end justify-between gap-6">
          <div>
            <div className="animate-fade-up flex items-center gap-3 mb-6">
              <span className="h-px w-8 bg-primary/60" />
              <span className="text-eyebrow text-white/50">
                Inside EnablingEV
              </span>
            </div>

            <h2
              className="animate-fade-up font-display uppercase text-white text-[clamp(1.75rem,3.2vw,2.75rem)] leading-[1.05] tracking-[-0.01em] max-w-xl"
              style={{ animationDelay: "120ms" }}
            >
              Moments from
              <br />
              the road.
            </h2>
          </div>

          <div className="hidden md:flex items-center gap-10">
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

            <div className="flex items-center gap-3">
              <button
                onClick={() => scroll("prev")}
                aria-label="Previous"
                className="w-12 h-12 rounded-full border border-white/20 hover:border-white text-white/70 hover:text-white transition-colors duration-300 flex items-center justify-center"
              >
                <ArrowLeft size={18} strokeWidth={1.5} />
              </button>
              <button
                onClick={() => scroll("next")}
                aria-label="Next"
                className="w-12 h-12 rounded-full border border-white/20 hover:border-white text-white/70 hover:text-white transition-colors duration-300 flex items-center justify-center"
              >
                <ArrowRightIcon size={18} strokeWidth={1.5} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Horizontal scroll strip */}
      <div className="relative">
        <div
          ref={stripRef}
          className="flex gap-2 sm:gap-3 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-12 lg:pb-16 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
        >
          <div className="shrink-0 w-6 sm:w-10 lg:w-16" aria-hidden />

          {IMAGES.map((img, i) => (
            <Link
              key={i}
              to="/gallery"
              className="relative shrink-0 snap-start overflow-hidden group"
            >
              <div className="w-[78vw] sm:w-[52vw] lg:w-[34vw] xl:w-[28vw] h-[60vh] sm:h-[65vh] lg:h-[72vh]">
                <ImageWithFallback
                  src={img.src}
                  alt={img.alt}
                  label={img.alt}
                  className="w-full h-full object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-105"
                />
              </div>
            </Link>
          ))}

          <div className="shrink-0 w-6 sm:w-10 lg:w-16" aria-hidden />
        </div>
      </div>

      {/* Mobile "View all" */}
      <div className="md:hidden flex justify-center pb-16">
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
      </div>
    </section>
  );
});

export default GalleryStrip;
