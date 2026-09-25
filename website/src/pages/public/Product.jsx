import { memo, useState } from "react";
import { Link } from "react-router";
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  BatteryFull,
} from "lucide-react";
import ImageWithFallback from "../../components/ImageWithFallback";
import Lightbox from "../../components/ui/Lightbox";
import { useModal } from "../../context/ModalContext";
import products, { colorMap } from "../../data/products";

// Product — Range Rover "Models" page treatment.
// Each model gets a full editorial section: image carousel, statement,
// spec grid, colors, battery options, accessories, enquiry CTA.
// Alternating layout so the page reads like a catalogue, not a grid.

const ModelSection = memo(({ product, index, onEnquire }) => {
  const [imageIndex, setImageIndex] = useState(0);
  const [zoomImg, setZoomImg] = useState(null);

  const isReversed = index % 2 === 1;
  const currentImage = product.images[imageIndex];

  const stepImage = (dir) => {
    setImageIndex((i) => {
      const next = (i + dir + product.images.length) % product.images.length;
      return next;
    });
  };

  return (
    <section className="relative bg-ink text-white">
      <div className="max-w-[1600px] mx-auto px-6 sm:px-10 lg:px-16 py-20 lg:py-28">
        <div
          className={`grid lg:grid-cols-2 gap-10 lg:gap-16 items-start ${
            isReversed ? "lg:[&>*:first-child]:order-2" : ""
          }`}
        >
          {/* ─── Image carousel side ─────────────────────────── */}
          <div className="relative">
            <div className="relative aspect-[4/3.2] overflow-hidden bg-background">
              <ImageWithFallback
                src={currentImage}
                alt={product.name}
                label={product.name}
                onClick={() => setZoomImg(currentImage)}
                className="w-full h-full object-cover cursor-zoom-in transition-transform duration-[1400ms] ease-out"
              />
            </div>

            {/* Carousel controls — minimal, corners */}
            {product.images.length > 1 && (
              <>
                <button
                  onClick={() => stepImage(-1)}
                  aria-label="Previous image"
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full border border-white/20 hover:border-white text-white/70 hover:text-white bg-ink/40 backdrop-blur-md transition-all duration-300 flex items-center justify-center"
                >
                  <ChevronLeft size={18} strokeWidth={1.5} />
                </button>
                <button
                  onClick={() => stepImage(1)}
                  aria-label="Next image"
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full border border-white/20 hover:border-white text-white/70 hover:text-white bg-ink/40 backdrop-blur-md transition-all duration-300 flex items-center justify-center"
                >
                  <ChevronRight size={18} strokeWidth={1.5} />
                </button>

                {/* Progress line — bottom */}
                <div className="absolute bottom-0 left-0 right-0 flex">
                  {product.images.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setImageIndex(i)}
                      aria-label={`Go to image ${i + 1}`}
                      className="flex-1 h-[2px] cursor-pointer group"
                    >
                      <span
                        className={`block h-full transition-all duration-500 ease-out ${
                          i === imageIndex
                            ? "bg-primary"
                            : "bg-white/15 group-hover:bg-white/35"
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* ─── Specs / details side ────────────────────────── */}
          <div className="max-w-xl">
            {/* Eyebrow */}
            <div className="animate-fade-up flex items-center gap-3 mb-6">
              <span className="h-px w-8 bg-primary/60" />
              <span className="text-eyebrow text-white/50">
                Model {String(index + 1).padStart(2, "0")}
              </span>
            </div>

            {/* Model name */}
            <h2
              className="animate-fade-up font-display uppercase text-white text-[clamp(1.75rem,3.2vw,2.75rem)] leading-[1.02] tracking-[-0.015em] mb-6"
              style={{ animationDelay: "120ms" }}
            >
              {product.name}
            </h2>

            {/* Statement — pulled from features[0..1] */}
            <p
              className="animate-fade-up text-lead text-white/65 mb-10 max-w-lg"
              style={{ animationDelay: "200ms" }}
            >
              {product.features.slice(0, 2).join(". ")}.
            </p>

            {/* Spec grid — top 4 features */}
            <div
              className="animate-fade-up grid grid-cols-2 gap-x-8 gap-y-6 mb-12 border-t border-white/[0.08] pt-8"
              style={{ animationDelay: "280ms" }}
            >
              {product.features.slice(2, 6).map((feature) => {
                const [label, ...rest] = feature.split(" - ");
                return (
                  <div key={feature}>
                    <p className="font-display tabular text-lg sm:text-xl text-white leading-tight">
                      {rest.length > 0 ? rest.join(" - ") : label}
                    </p>
                    {rest.length > 0 && (
                      <p className="text-eyebrow text-white/40 mt-2">{label}</p>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Battery options */}
            <div
              className="animate-fade-up mb-10"
              style={{ animationDelay: "360ms" }}
            >
              <div className="flex items-center gap-3 mb-4">
                <BatteryFull size={16} className="text-primary/80" />
                <span className="text-eyebrow text-white/50">
                  Battery Options
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {product.batteryOptions.map((b) => (
                  <span
                    key={b}
                    className="text-xs uppercase tracking-[0.15em] font-medium border border-white/15 rounded-full px-4 py-2 text-white/70"
                  >
                    {b}
                  </span>
                ))}
              </div>
            </div>

            {/* Colors */}
            <div
              className="animate-fade-up mb-12"
              style={{ animationDelay: "440ms" }}
            >
              <span className="text-eyebrow text-white/50 block mb-4">
                Available Colors
              </span>
              <div className="flex flex-wrap gap-3">
                {product.colors.map((c) => (
                  <div key={c.value} className="flex items-center gap-2">
                    <span
                      className="w-7 h-7 rounded-full border border-white/20"
                      style={{ backgroundColor: colorMap[c.value] }}
                      title={c.label}
                    />
                    <span className="text-xs uppercase tracking-[0.15em] text-white/60">
                      {c.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA */}
            <div
              className="animate-fade-up flex flex-wrap items-center gap-8 sm:gap-10"
              style={{ animationDelay: "520ms" }}
            >
              <button
                onClick={() => onEnquire(product.name)}
                className="group inline-flex items-center gap-3 text-punch uppercase font-medium text-white border border-white/40 hover:border-white hover:bg-white hover:text-ink transition-all duration-500 px-7 py-3.5 rounded-full"
              >
                Enquire Now
                <ArrowRight
                  size={14}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </button>

              <Link
                to="/contact"
                className="group inline-flex items-center gap-2 text-punch uppercase text-white/70 hover:text-white transition-colors duration-300"
              >
                <span className="link-luxe">Find a Dealer</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Accessories included — full width below */}
        <div
          className="animate-fade-up mt-16 pt-10 border-t border-white/[0.06]"
          style={{ animationDelay: "600ms" }}
        >
          <span className="text-eyebrow text-white/50 block mb-6">
            Accessories Included
          </span>
          <div className="flex flex-wrap gap-x-8 gap-y-3 text-sm text-white/55">
            {product.accessories.map((a) => (
              <span key={a} className="inline-flex items-center gap-2">
                <span className="w-1 h-1 rounded-full bg-primary/60" />
                {a}
              </span>
            ))}
          </div>
        </div>
      </div>

      <Lightbox src={zoomImg} onClose={() => setZoomImg(null)} />
    </section>
  );
});

const Product = () => {
  const { openVehicleEnquiry } = useModal();

  return (
    <div className="bg-ink text-white">
      {/* ─── Hero — small editorial intro ──────────────────────── */}
      <section className="relative bg-ink border-b border-white/[0.06]">
        <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full bg-primary/[0.03] blur-[160px]" />

        <div className="relative max-w-[1600px] mx-auto px-6 sm:px-10 lg:px-16 pt-40 lg:pt-48 pb-20 lg:pb-28 text-center">
          <div className="animate-fade-up flex items-center justify-center gap-3 mb-8">
            <span className="h-px w-8 bg-primary/60" />
            <span className="text-eyebrow text-white/50">Our Vehicles</span>
            <span className="h-px w-8 bg-primary/60" />
          </div>

          <h1
            className="animate-fade-up font-display uppercase text-white text-[clamp(2rem,4.5vw,4rem)] leading-[1.02] tracking-[-0.015em] mb-8 max-w-4xl mx-auto text-balance"
            style={{ animationDelay: "120ms" }}
          >
            Built For Every Route,
            <br />
            <span className="text-primary">Everyday.</span>
          </h1>

          <p
            className="animate-fade-up text-lead text-white/60 max-w-2xl mx-auto"
            style={{ animationDelay: "220ms" }}
          >
            Two families of electric rickshaws — the everyday passenger F2 SS
            and the premium Fine MS. Each built with the same conviction:
            dependable mobility, for the people who keep India moving.
          </p>
        </div>
      </section>

      {/* ─── Model sections ────────────────────────────────────── */}
      {products.map((product, i) => (
        <div
          key={product.name}
          className={i > 0 ? "border-t border-white/[0.06]" : ""}
        >
          <ModelSection
            product={product}
            index={i}
            onEnquire={openVehicleEnquiry}
          />
        </div>
      ))}

      {/* ─── Final CTA ─────────────────────────────────────────── */}
      <section className="relative bg-ink border-t border-white/[0.06]">
        <div className="max-w-[1600px] mx-auto px-6 sm:px-10 lg:px-16 py-24 lg:py-32">
          <div className="max-w-2xl mx-auto text-center">
            <div className="animate-fade-up flex items-center justify-center gap-3 mb-10">
              <span className="h-px w-8 bg-primary/60" />
              <span className="text-eyebrow text-white/50">Not Sure Yet?</span>
              <span className="h-px w-8 bg-primary/60" />
            </div>

            <h2
              className="animate-fade-up font-display uppercase text-white text-[clamp(1.75rem,3.2vw,2.75rem)] leading-[1.05] tracking-[-0.01em] mb-12"
              style={{ animationDelay: "120ms" }}
            >
              Talk To Our Team.
            </h2>

            <div
              className="animate-fade-up flex flex-wrap items-center justify-center gap-6 sm:gap-10"
              style={{ animationDelay: "220ms" }}
            >
              <button
                onClick={() => openVehicleEnquiry("")}
                className="group inline-flex items-center gap-3 text-punch uppercase font-medium text-white border border-white/40 hover:border-white hover:bg-white hover:text-ink transition-all duration-500 px-8 py-4 rounded-full"
              >
                Get In Touch
                <ArrowRight
                  size={14}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </button>

              <Link
                to="/DealerForm"
                className="group inline-flex items-center gap-2 text-punch uppercase text-white/70 hover:text-white transition-colors duration-300"
              >
                <span className="link-luxe">Become A Dealer</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Product;
