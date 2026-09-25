import { memo } from "react";
import { useNavigate } from "react-router";
import heroPoster from "../assets/products/F2SS1.webp";
import heroVideo from "../assets/videos/hero.mp4";

const Hero = memo(({ onExplore }) => {
  const navigate = useNavigate();

  return (
    <section
      id="home"
      className="relative w-full min-h-[70vh] lg:min-h-[80vh] overflow-hidden bg-ink text-white flex flex-col"
    >
      {/* Background VIDEO — Range Rover style */}
      <div className="absolute inset-0 z-0">
        <video
          className="w-full h-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          poster={heroPoster}
        >
          <source src={heroVideo} type="video/mp4" />
        </video>
      </div>

      {/* Cinematic overlays */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-r from-ink/60 via-ink/20 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-ink via-ink/40 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-20 flex-1 flex items-center">
        <div className="max-w-[1600px] w-full mx-auto px-6 sm:px-10 lg:px-16 pt-24 pb-16 lg:pt-28 lg:pb-20">
          <div className="max-w-2xl">
            <h1
              className="animate-fade-up text-display-upper text-white mb-3 text-[clamp(1.875rem,3vw,2.75rem)] leading-[1.02]"
              style={{ animationDelay: "120ms" }}
            >
              JHATPAT JIO
            </h1>

            <p
              className="animate-fade-up text-display-upper text-white/85 mb-12 text-[clamp(1.5rem,2.2vw,2rem)] leading-[1.15]"
              style={{ animationDelay: "220ms" }}
            >
              The Original
              <br />
              Electric Rickshaw.
            </p>

            <div
              className="animate-fade-up flex flex-wrap items-center gap-6"
              style={{ animationDelay: "320ms" }}
            >
              <button
                onClick={onExplore}
                className="text-punch uppercase font-medium text-white border border-white/40 hover:border-white hover:bg-white hover:text-ink transition-all duration-500 px-7 py-3.5 rounded-full"
              >
                Explore Vehicles
              </button>

              <button
                onClick={() => navigate("/DealerForm")}
                className="link-luxe text-punch uppercase font-medium text-white/70 hover:text-white transition-colors duration-300"
              >
                Become a Dealer
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom spec ledger */}
      <div className="relative z-20 border-t border-white/[0.06]">
        <div className="max-w-[1600px] mx-auto px-6 sm:px-10 lg:px-16">
          <div className="grid grid-cols-2 md:grid-cols-4">
            {[
              { value: "2013", label: "Founded" },
              { value: "02", label: "Models" },
              { value: "160", label: "AH Max Battery" },
              { value: "18", label: "Mo. Warranty" },
            ].map((item, i) => (
              <div
                key={item.label}
                className={`py-6 pr-4 md:pr-6 ${
                  i !== 3 ? "md:border-r border-white/10" : ""
                } ${i % 2 === 0 ? "border-r border-white/10 md:border-r" : ""}`}
              >
                <p className="font-display tabular text-xl sm:text-2xl font-normal text-white leading-none">
                  {item.value}
                </p>
                <p className="text-eyebrow text-white/50 mt-3">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
});

export default Hero;
