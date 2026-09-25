import { memo, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { Pause, Play, ChevronDown, Zap } from "lucide-react";
import heroPoster from "../assets/products/F2SS1.webp";
import heroVideo from "../assets/videos/hero.mp4";

const Hero = memo(({ onExplore }) => {
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(true);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      video.play();
      setIsPlaying(true);
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };

  const handleScrollDown = () => {
    if (onExplore) onExplore();
  };

  return (
    <section
      id="home"
      className="relative w-full min-h-[88vh] lg:min-h-[92vh] overflow-hidden bg-ink text-white flex flex-col"
    >
      {/* ─── Background VIDEO — full-bleed, slightly dimmed for text ─── */}
      <div className="absolute inset-0 z-0">
        <video
          ref={videoRef}
          className="w-full h-full object-cover brightness-[0.85] contrast-[1.05]"
          autoPlay
          muted
          loop
          playsInline
          poster={heroPoster}
        >
          <source src={heroVideo} type="video/mp4" />
        </video>
      </div>

      {/* Cinematic overlays — stronger at bottom-left for text readability */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-ink/40 via-ink/10 to-ink/70" />
        <div className="absolute inset-0 bg-gradient-to-r from-ink/70 via-ink/20 to-transparent" />
      </div>

      {/* ─── Content — bottom-left aligned (Range Rover pattern) ─── */}
      <div className="relative z-20 flex-1 flex items-end">
        <div className="max-w-[1600px] w-full mx-auto px-5 sm:px-6 md:px-10 lg:px-16 pb-16 sm:pb-20 lg:pb-24">
          <div className="max-w-xl">
            {/* Eyebrow */}
            <p
              className="animate-fade-up text-[11px] uppercase tracking-[0.28em] font-medium text-white/70 mb-4 sm:mb-5"
              style={{ animationDelay: "80ms" }}
            >
              Electric &middot; Since 2013
            </p>

            {/* Headline — Range Rover scale (restrained ~3.25rem desktop) */}
            <h1
              className="animate-fade-up font-display uppercase text-white mb-3 sm:mb-4 text-[clamp(2rem,4vw,3.25rem)] leading-[1.02] tracking-[-0.005em]"
              style={{ animationDelay: "180ms" }}
            >
              JhatPat Jio
            </h1>

            {/* Sub-headline — UPPERCASE, small, spaced (Range Rover pattern) */}
            <p
              className="animate-fade-up text-[11px] sm:text-[12px] uppercase tracking-[0.14em] font-semibold text-white/80 leading-[1.8] mb-8 sm:mb-10 max-w-lg"
              style={{ animationDelay: "280ms" }}
            >
              The original electric rickshaw.
              <br />
              Built for the people who keep India moving.
            </p>

            {/* CTA row — rectangular buttons, Range Rover style */}
            <div
              className="animate-fade-up flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-8"
              style={{ animationDelay: "380ms" }}
            >
              {/* Primary — solid white rect */}
              <button
                onClick={handleScrollDown}
                className="group inline-flex items-center justify-center bg-white text-ink hover:bg-primary transition-colors duration-300 px-7 sm:px-8 py-3.5 text-[12px] uppercase tracking-[0.16em] font-semibold rounded-none w-full sm:w-auto"
              >
                Make One Yours
              </button>

              {/* Secondary — underlined text + icon */}
              <button
                onClick={() => navigate("/DealerForm")}
                className="group inline-flex items-center justify-center gap-2.5 text-[12px] uppercase tracking-[0.16em] font-semibold text-white border-b border-white/40 hover:border-white pb-1.5 transition-colors duration-300 w-full sm:w-auto"
              >
                <Zap size={13} strokeWidth={2} className="text-white/85" />
                Build Your Own
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ─── Bottom controls: scroll chevron (center) + pause (right) ─── */}
      <div className="relative z-20 pointer-events-none">
        <div className="max-w-[1600px] mx-auto px-5 sm:px-6 md:px-10 lg:px-16 pb-6 flex items-center justify-between">
          {/* Scroll indicator — center-ish */}
          <div className="flex-1 flex justify-center">
            <button
              onClick={handleScrollDown}
              aria-label="Scroll down"
              className="pointer-events-auto text-white/60 hover:text-white transition-colors duration-300 p-2 animate-bounce-subtle"
            >
              <ChevronDown size={22} strokeWidth={1.5} />
            </button>
          </div>

          {/* Pause/Play — right */}
          <button
            onClick={togglePlay}
            aria-label={isPlaying ? "Pause video" : "Play video"}
            className="pointer-events-auto w-11 h-11 rounded-full border border-white/30 hover:border-white text-white/80 hover:text-white transition-all duration-300 flex items-center justify-center"
          >
            {isPlaying ? (
              <Pause size={15} strokeWidth={1.75} fill="currentColor" />
            ) : (
              <Play size={15} strokeWidth={1.75} fill="currentColor" />
            )}
          </button>
        </div>
      </div>
    </section>
  );
});

export default Hero;
