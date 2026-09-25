import { memo } from "react";
import { useNavigate } from "react-router";
import { ArrowRight } from "lucide-react";
import ImageWithFallback from "../components/ImageWithFallback";
import dealerImg from "../assets/gallery/Rikshaw.webp";

const DealerCTA = memo(() => {
  const navigate = useNavigate();

  return (
    <section
      id="dealer"
      className="relative w-full overflow-hidden bg-ink text-white"
    >
      {/* Full-bleed background image */}
      <div className="absolute inset-0 z-0">
        <ImageWithFallback
          src={dealerImg}
          alt=""
          label="Dealer network"
          className="w-full h-full object-cover"
        />
        {/* Dark overlays — lighter overall, directional on the text side */}
        <div className="absolute inset-0 bg-ink/55" />
        <div className="absolute inset-0 bg-gradient-to-r from-ink/85 via-ink/30 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-[1600px] mx-auto px-6 sm:px-10 lg:px-16 py-32 lg:py-48">
        <div className="max-w-3xl lg:pl-8 xl:pl-16">
          {/* Eyebrow */}
          <div className="animate-fade-up flex items-center gap-3 mb-10">
            <span className="h-px w-10 bg-primary" />
            <span className="text-eyebrow text-white/60">Dealer Network</span>
          </div>

          {/* Headline — Range Rover scale */}
          <h2
            className="animate-fade-up font-display uppercase text-white text-[clamp(2rem,4.2vw,3.75rem)] leading-[1.02] tracking-[-0.01em] mb-8"
            style={{ animationDelay: "120ms" }}
          >
            Bring Electric
            <br />
            Mobility To
            <br />
            <span className="text-primary">Your City.</span>
          </h2>

          {/* Body */}
          <p
            className="animate-fade-up text-lead text-white/65 mb-12 max-w-xl"
            style={{ animationDelay: "220ms" }}
          >
            Partner with EnablingEV to introduce practical electric vehicles to
            your market — with product guidance, business support, and a
            platform ready for the future.
          </p>

          {/* CTA + link */}
          <div
            className="animate-fade-up flex flex-wrap items-center gap-8 sm:gap-12"
            style={{ animationDelay: "320ms" }}
          >
            <button
              onClick={() => navigate("/DealerForm")}
              className="group inline-flex items-center gap-3 text-punch uppercase font-medium text-white border border-white/40 hover:border-white hover:bg-white hover:text-ink transition-all duration-500 px-8 py-4 rounded-full"
            >
              Become a Dealer
              <ArrowRight
                size={14}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </button>

            <button
              onClick={() => navigate("/contact")}
              className="group inline-flex items-center gap-2 text-punch uppercase text-white/70 hover:text-white transition-colors duration-300"
            >
              <span className="link-luxe">Talk to Our Team</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
});

export default DealerCTA;
