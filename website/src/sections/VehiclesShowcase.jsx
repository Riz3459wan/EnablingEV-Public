import { memo, useState } from "react";
import { Link } from "react-router";
import { ArrowRight } from "lucide-react";
import ImageWithFallback from "../components/ImageWithFallback";
import f2ss1 from "../assets/products/F2SS1.webp";
import ms1 from "../assets/products/MS1.webp";

const MODELS = [
  {
    id: "f2ss",
    tab: "F2 SS",
    tabSub: "Passenger",
    name: "JhatPat F2 SS",
    statement:
      "The everyday passenger rickshaw. Iron body, heavy-duty differential, and a paint finish that holds up to Indian roads year after year.",
    image: f2ss1,
    specs: [
      { label: "Motor Warranty", value: "12 mo" },
      { label: "Battery Range", value: "135–160 AH" },
      { label: "Body", value: "Iron" },
      { label: "Suspension", value: '43" Heavy Duty' },
    ],
  },
  {
    id: "ms",
    tab: "FINE MS",
    tabSub: "Premium",
    name: "JhatPat Fine MS",
    statement:
      "Steel body, advanced controller, and a luxury finish. The Fine MS is built for riders who want more from every kilometre.",
    image: ms1,
    specs: [
      { label: "Motor Warranty", value: "18 mo" },
      { label: "Battery Range", value: "135–160 AH" },
      { label: "Body", value: "Steel" },
      { label: "Controller", value: "Advanced" },
    ],
  },
];

const VehiclesShowcase = memo(() => {
  const [active, setActive] = useState(0);

  return (
    <section
      id="vehicles"
      className="relative bg-ink text-white overflow-hidden"
    >
      {/* ─── Tab switcher ──────────────────────────────────────── */}
      <div className="relative max-w-[1600px] mx-auto px-4 sm:px-6 md:px-10 lg:px-16 pt-12 sm:pt-16 lg:pt-20">
        <div className="animate-fade-up flex items-center justify-center gap-8 sm:gap-12 lg:gap-16 border-b border-white/[0.06] pb-4 sm:pb-5">
          {MODELS.map((m, i) => (
            <button
              key={m.id}
              onClick={() => setActive(i)}
              className="group flex flex-col items-center gap-1 pb-3 relative"
            >
              <span
                className={`text-[10px] sm:text-[11px] uppercase tracking-[0.28em] font-medium transition-colors duration-300 ${
                  active === i
                    ? "text-primary"
                    : "text-white/40 group-hover:text-white/70"
                }`}
              >
                {m.tab}
              </span>
              <span
                className={`font-display text-base sm:text-lg lg:text-xl uppercase transition-colors duration-300 ${
                  active === i
                    ? "text-white"
                    : "text-white/40 group-hover:text-white/70"
                }`}
              >
                {m.tabSub}
              </span>
              <span
                className={`absolute bottom-0 left-0 right-0 h-px transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                  active === i
                    ? "bg-primary scale-x-100"
                    : "bg-white/15 scale-x-0"
                }`}
              />
            </button>
          ))}
        </div>
      </div>

      {/* ─── Content ──────────────────────────────────────────── */}
      <div className="relative mt-8 sm:mt-10 lg:mt-12">
        {MODELS.map((m, i) => {
          const isActive = active === i;
          return (
            <div
              key={m.id}
              className={`${
                isActive
                  ? "relative opacity-100"
                  : "absolute inset-0 opacity-0 pointer-events-none"
              } transition-opacity duration-700 ease-out`}
            >
              <div className="grid lg:grid-cols-2 items-center gap-0">
                {/* Image side */}
                <div
                  className={`relative h-[45vh] sm:h-[50vh] lg:h-[70vh] ${
                    i % 2 === 1 ? "lg:order-2" : ""
                  }`}
                >
                  <ImageWithFallback
                    src={m.image}
                    alt={m.name}
                    label={m.name}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  {/* Subtle inner border — separates image from text without boxing it */}
                  <div
                    className={`absolute inset-0 pointer-events-none border-white/[0.08] ${
                      i % 2 === 1 ? "lg:border-l" : "lg:border-r"
                    }`}
                  />
                  {/* Edge fade toward text side */}
                  <div
                    className={`absolute inset-0 pointer-events-none ${
                      i % 2 === 1
                        ? "bg-gradient-to-l from-ink/60 via-transparent to-transparent"
                        : "bg-gradient-to-r from-ink/60 via-transparent to-transparent"
                    }`}
                  />
                </div>

                {/* Text side */}
                <div
                  className={`flex items-center justify-center px-5 sm:px-6 md:px-10 lg:px-16 py-12 sm:py-14 lg:py-20 ${
                    i % 2 === 1 ? "lg:order-1" : ""
                  }`}
                >
                  <div className="max-w-lg w-full">
                    <p className="text-[10px] sm:text-[11px] uppercase tracking-[0.28em] font-medium text-primary/80 mb-4 sm:mb-6">
                      {m.tab} · {m.tabSub}
                    </p>

                    <h2 className="font-display uppercase text-white text-[clamp(1.5rem,3vw,2.5rem)] leading-[1.02] tracking-[-0.01em] mb-5 sm:mb-6">
                      {m.name}
                    </h2>

                    <p className="text-lead text-white/65 mb-8 sm:mb-10">
                      {m.statement}
                    </p>

                    <div className="grid grid-cols-2 gap-x-5 sm:gap-x-8 gap-y-5 sm:gap-y-6 mb-8 sm:mb-10 border-t border-white/[0.08] pt-6 sm:pt-8">
                      {m.specs.map((s) => (
                        <div key={s.label}>
                          <p className="font-display tabular text-lg sm:text-xl lg:text-2xl text-white leading-none">
                            {s.value}
                          </p>
                          <p className="text-[10px] sm:text-[11px] uppercase tracking-[0.28em] text-white/40 mt-2 sm:mt-3">
                            {s.label}
                          </p>
                        </div>
                      ))}
                    </div>

                    <Link
                      to="/product"
                      className="group inline-flex items-center gap-2 text-punch uppercase text-white hover:text-primary transition-colors duration-300"
                    >
                      <span className="link-luxe">Explore {m.tab}</span>
                      <ArrowRight
                        size={14}
                        className="transition-transform duration-300 group-hover:translate-x-1"
                      />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom breathing room */}
      <div className="h-10 sm:h-12 lg:h-14" />
    </section>
  );
});

export default VehiclesShowcase;
