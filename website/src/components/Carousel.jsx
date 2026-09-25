import { useState, useEffect, useCallback, memo } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

// Cinematic hero slider — Range Rover-inspired.
// No dots, no card frame. Just wide imagery, minimal arrows,
// and a slow crossfade. Caption (if provided) sits bottom-left.
const Carousel = memo(({ slides = [], interval = 8000 }) => {
  const [index, setIndex] = useState(0);

  const next = useCallback(() => {
    if (!slides.length) return;
    setIndex((i) => (i + 1) % slides.length);
  }, [slides.length]);

  const prev = useCallback(() => {
    if (!slides.length) return;
    setIndex((i) => (i - 1 + slides.length) % slides.length);
  }, [slides.length]);

  useEffect(() => {
    if (!slides.length) return;
    const timer = setInterval(next, interval);
    return () => clearInterval(timer);
  }, [next, interval, slides.length]);

  if (!slides || slides.length === 0) return null;

  return (
    <div
      className="relative w-full overflow-hidden bg-surface select-none"
      style={{ height: "clamp(360px, 52vw, 720px)" }}
    >
      {/* Slides — crossfade with subtle scale */}
      {slides.map((slide, i) => (
        <div
          key={i}
          className={`absolute inset-0 transition-opacity duration-[1400ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${
            i === index
              ? "opacity-100 z-10"
              : "opacity-0 z-0 pointer-events-none"
          }`}
        >
          <img
            src={slide.src}
            alt={slide.alt}
            loading={i === 0 ? "eager" : "lazy"}
            className={`w-full h-full object-cover transition-transform duration-[9000ms] ease-out ${
              i === index ? "scale-105" : "scale-100"
            }`}
          />
        </div>
      ))}

      {/* Cinematic overlay — top and bottom fade, no heavy tint */}
      <div className="absolute inset-0 z-20 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-t from-background/85 via-background/10 to-background/40" />
      </div>

      {/* Caption — bottom-left, editorial style */}
      {slides[index]?.caption && (
        <div className="absolute left-6 sm:left-10 lg:left-16 bottom-8 sm:bottom-12 z-30 max-w-md">
          <div className="flex items-center gap-3 mb-4">
            <span className="h-px w-8 bg-primary" />
            <span className="text-[10px] uppercase tracking-luxe font-medium text-white/70">
              {slides[index].caption.eyebrow}
            </span>
          </div>
          <h3 className="font-display text-3xl sm:text-4xl lg:text-5xl leading-[1.05] tracking-[-0.02em] text-white">
            {slides[index].caption.title}
          </h3>
        </div>
      )}

      {/* Minimal arrows — thin, at the edges, fade in on hover */}
      <button
        type="button"
        onClick={prev}
        aria-label="Previous slide"
        className="absolute left-4 sm:left-6 lg:left-10 top-1/2 -translate-y-1/2 z-30 text-white/70 hover:text-white transition-colors duration-300 p-2 cursor-pointer"
      >
        <ChevronLeft size={26} strokeWidth={1.25} />
      </button>

      <button
        type="button"
        onClick={next}
        aria-label="Next slide"
        className="absolute right-4 sm:right-6 lg:right-10 top-1/2 -translate-y-1/2 z-30 text-white/70 hover:text-white transition-colors duration-300 p-2 cursor-pointer"
      >
        <ChevronRight size={26} strokeWidth={1.25} />
      </button>

      {/* Progress line — thin, bottom, not dots */}
      <div className="absolute bottom-0 left-0 right-0 z-30 flex">
        {slides.map((_, i) => (
          <button
            type="button"
            key={i}
            onClick={() => setIndex(i)}
            aria-label={`Go to slide ${i + 1}`}
            className="flex-1 h-[2px] cursor-pointer group"
          >
            <span
              className={`block h-full transition-all duration-500 ease-out ${
                i === index
                  ? "bg-primary"
                  : "bg-white/15 group-hover:bg-white/35"
              }`}
            />
          </button>
        ))}
      </div>
    </div>
  );
});

export default Carousel;
