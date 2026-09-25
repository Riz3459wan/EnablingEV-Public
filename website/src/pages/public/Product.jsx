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

const ModelSection = memo(({ product, index, onEnquire }) => {
  const [imageIndex, setImageIndex] = useState(0);
  const [zoomImg, setZoomImg] = useState(null);

  const isReversed = index % 2 === 1;
  const currentImage = product.images[imageIndex];

  const stepImage = (dir) => {
    setImageIndex(
      (i) => (i + dir + product.images.length) % product.images.length,
    );
  };

  return (
    <section className="relative bg-ink text-white">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 md:px-10 lg:px-16 py-14 sm:py-16 lg:py-28">
        <div
          className={`grid lg:grid-cols-2 gap-8 sm:gap-10 lg:gap-16 items-start ${
            isReversed ? "lg:[&>*:first-child]:order-2" : ""
          }`}
        >
          {/* Image carousel */}
          <div className="relative">
            <div className="relative aspect-[4/3.2] overflow-hidden bg-background">
              <ImageWithFallback
                src={currentImage}
                alt={product.name}
                label={product.name}
                onClick={() => setZoomImg(currentImage)}
                className="w-full h-full object-cover cursor-zoom-in"
              />
            </div>

            {product.images.length > 1 && (
              <>
                <button
                  onClick={() => stepImage(-1)}
                  aria-label="Previous image"
                  className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full border border-white/20 hover:border-white text-white/70 hover:text-white bg-ink/40 backdrop-blur-md transition-all duration-300 flex items-center justify-center"
                >
                  <ChevronLeft size={16} strokeWidth={1.5} />
                </button>
                <button
                  onClick={() => stepImage(1)}
                  aria-label="Next image"
                  className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full border border-white/20 hover:border-white text-white/70 hover:text-white bg-ink/40 backdrop-blur-md transition-all duration-300 flex items-center justify-center"
                >
                  <ChevronRight size={16} strokeWidth={1.5} />
                </button>

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

          {/* Specs side */}
          <div className="max-w-xl">
            <div className="animate-fade-up flex items-center gap-3 mb-4 sm:mb-6">
              <span className="h-px w-6 sm:w-8 bg-primary/60" />
              <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.28em] font-medium text-white/50">
                Model {String(index + 1).padStart(2, "0")}
              </span>
            </div>

            <h2
              className="animate-fade-up font-display uppercase text-white text-[clamp(1.5rem,3.2vw,2.75rem)] leading-[1.02] tracking-[-0.015em] mb-5 sm:mb-6"
              style={{ animationDelay: "120ms" }}
            >
              {product.name}
            </h2>

            <p
              className="animate-fade-up text-lead text-white/65 mb-8 sm:mb-10 max-w-lg"
              style={{ animationDelay: "200ms" }}
            >
              {product.features.slice(0, 2).join(". ")}.
            </p>

            {/* Spec grid */}
            <div
              className="animate-fade-up grid grid-cols-2 gap-x-5 sm:gap-x-8 gap-y-5 sm:gap-y-6 mb-8 sm:mb-12 border-t border-white/[0.08] pt-6 sm:pt-8"
              style={{ animationDelay: "280ms" }}
            >
              {product.features.slice(2, 6).map((feature) => {
                const [label, ...rest] = feature.split(" - ");
                return (
                  <div key={feature}>
                    <p className="font-display tabular text-base sm:text-lg lg:text-xl text-white leading-tight">
                      {rest.length > 0 ? rest.join(" - ") : label}
                    </p>
                    {rest.length > 0 && (
                      <p className="text-[10px] sm:text-[11px] uppercase tracking-[0.28em] text-white/40 mt-2">
                        {label}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Battery options */}
            <div
              className="animate-fade-up mb-8 sm:mb-10"
              style={{ animationDelay: "360ms" }}
            >
              <div className="flex items-center gap-3 mb-3 sm:mb-4">
                <BatteryFull size={15} className="text-primary/80" />
                <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.28em] font-medium text-white/50">
                  Battery Options
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {product.batteryOptions.map((b) => (
                  <span
                    key={b}
                    className="text-[10px] sm:text-xs uppercase tracking-[0.15em] font-medium border border-white/15 rounded-full px-3 sm:px-4 py-1.5 sm:py-2 text-white/70"
                  >
                    {b}
                  </span>
                ))}
              </div>
            </div>

            {/* Colors */}
            <div
              className="animate-fade-up mb-8 sm:mb-12"
              style={{ animationDelay: "440ms" }}
            >
              <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.28em] font-medium text-white/50 block mb-3 sm:mb-4">
                Available Colors
              </span>
              <div className="flex flex-wrap gap-3 sm:gap-4">
                {product.colors.map((c) => (
                  <div key={c.value} className="flex items-center gap-2">
                    <span
                      className="w-6 h-6 sm:w-7 sm:h-7 rounded-full border border-white/20"
                      style={{ backgroundColor: colorMap[c.value] }}
                      title={c.label}
                    />
                    <span className="text-[10px] sm:text-xs uppercase tracking-[0.15em] text-white/60">
                      {c.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA */}
            <div
              className="animate-fade-up flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-8 lg:gap-10"
              style={{ animationDelay: "520ms" }}
            >
              <button
                onClick={() => onEnquire(product.name)}
                className="group inline-flex items-center justify-center gap-3 text-punch uppercase font-medium text-white border border-white/40 hover:border-white hover:bg-white hover:text-ink transition-all duration-500 px-6 sm:px-7 py-3.5 rounded-full w-full sm:w-auto"
              >
                Enquire Now
                <ArrowRight
                  size={14}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </button>

              <Link
                to="/contact"
                className="group inline-flex items-center justify-center gap-2 text-punch uppercase text-white/70 hover:text-white transition-colors duration-300 w-full sm:w-auto py-2"
              >
                <span className="link-luxe">Find a Dealer</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Accessories */}
        <div
          className="animate-fade-up mt-12 sm:mt-16 pt-8 sm:pt-10 border-t border-white/[0.06]"
          style={{ animationDelay: "600ms" }}
        >
          <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.28em] font-medium text-white/50 block mb-4 sm:mb-6">
            Accessories Included
          </span>
          <div className="flex flex-wrap gap-x-6 sm:gap-x-8 gap-y-2.5 sm:gap-y-3 text-xs sm:text-sm text-white/55">
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
      {/* Hero */}
      <section className="relative bg-ink border-b border-white/[0.06]">
        <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[500px] sm:w-[800px] h-[300px] sm:h-[400px] rounded-full bg-primary/[0.03] blur-[140px] sm:blur-[160px]" />

        <div className="relative max-w-[1600px] mx-auto px-4 sm:px-6 md:px-10 lg:px-16 pt-32 sm:pt-40 lg:pt-48 pb-14 sm:pb-20 lg:pb-28 text-center">
          <div className="animate-fade-up flex items-center justify-center gap-2 sm:gap-3 mb-6 sm:mb-8">
            <span className="h-px w-6 sm:w-8 bg-primary/60" />
            <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.28em] font-medium text-white/50">
              Our Vehicles
            </span>
            <span className="h-px w-6 sm:w-8 bg-primary/60" />
          </div>

          <h1
            className="animate-fade-up font-display uppercase text-white text-[clamp(1.75rem,4.5vw,4rem)] leading-[1.02] tracking-[-0.015em] mb-6 sm:mb-8 max-w-4xl mx-auto text-balance"
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

      {/* Model sections */}
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

      {/* Final CTA */}
      <section className="relative bg-ink border-t border-white/[0.06]">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 md:px-10 lg:px-16 py-16 sm:py-20 lg:py-32">
          <div className="max-w-2xl mx-auto text-center">
            <div className="animate-fade-up flex items-center justify-center gap-2 sm:gap-3 mb-8 sm:mb-10">
              <span className="h-px w-6 sm:w-8 bg-primary/60" />
              <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.28em] font-medium text-white/50">
                Not Sure Yet?
              </span>
              <span className="h-px w-6 sm:w-8 bg-primary/60" />
            </div>

            <h2
              className="animate-fade-up font-display uppercase text-white text-[clamp(1.5rem,3.2vw,2.75rem)] leading-[1.05] tracking-[-0.01em] mb-8 sm:mb-12"
              style={{ animationDelay: "120ms" }}
            >
              Talk To Our Team.
            </h2>

            <div
              className="animate-fade-up flex flex-col sm:flex-row sm:flex-wrap items-center justify-center gap-4 sm:gap-6 lg:gap-10"
              style={{ animationDelay: "220ms" }}
            >
              <button
                onClick={() => openVehicleEnquiry("")}
                className="group inline-flex items-center justify-center gap-3 text-punch uppercase font-medium text-white border border-white/40 hover:border-white hover:bg-white hover:text-ink transition-all duration-500 px-6 sm:px-8 py-3.5 sm:py-4 rounded-full w-full sm:w-auto"
              >
                Get In Touch
                <ArrowRight
                  size={14}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </button>

              <Link
                to="/DealerForm"
                className="group inline-flex items-center justify-center gap-2 text-punch uppercase text-white/70 hover:text-white transition-colors duration-300 w-full sm:w-auto py-2"
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
