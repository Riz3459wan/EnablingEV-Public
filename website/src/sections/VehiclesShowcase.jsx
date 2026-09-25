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
      {/* Tab switcher */}
      <div className="relative max-w-[1600px] mx-auto px-6 sm:px-10 lg:px-16 pt-24 lg:pt-32">
        <div className="animate-fade-up flex items-center justify-center gap-10 sm:gap-16 border-b border-white/[0.06] pb-6">
          {MODELS.map((m, i) => (
            <button
              key={m.id}
              onClick={() => setActive(i)}
              className="group flex flex-col items-center gap-1 pb-4 relative"
            >
              <span
                className={`text-eyebrow transition-colors duration-300 ${
                  active === i
                    ? "text-primary"
                    : "text-white/40 group-hover:text-white/70"
                }`}
              >
                {m.tab}
              </span>
              <span
                className={`font-display text-lg sm:text-xl uppercase transition-colors duration-300 ${
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

      {/* Content */}
      <div className="relative mt-12 lg:mt-16">
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
                  className={`relative h-[60vh] lg:h-[75vh] ${
                    i % 2 === 1 ? "lg:order-2" : ""
                  }`}
                >
                  <ImageWithFallback
                    src={m.image}
                    alt={m.name}
                    label={m.name}
                    className="w-full h-full object-cover"
                  />
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
                  className={`flex items-center justify-center px-6 sm:px-10 lg:px-16 py-20 lg:py-24 ${
                    i % 2 === 1 ? "lg:order-1" : ""
                  }`}
                >
                  <div className="max-w-lg w-full">
                    <p className="text-eyebrow text-primary/80 mb-6">
                      {m.tab} · {m.tabSub}
                    </p>

                    <h2 className="font-display uppercase text-white text-[clamp(2rem,3.5vw,3rem)] leading-[1.02] tracking-[-0.01em] mb-8">
                      {m.name}
                    </h2>

                    <p className="text-lead text-white/65 mb-12">
                      {m.statement}
                    </p>

                    <div className="grid grid-cols-2 gap-x-8 gap-y-6 mb-12 border-t border-white/[0.08] pt-8">
                      {m.specs.map((s) => (
                        <div key={s.label}>
                          <p className="font-display tabular text-xl sm:text-2xl text-white leading-none">
                            {s.value}
                          </p>
                          <p className="text-eyebrow text-white/40 mt-3">
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
    </section>
  );
});

export default VehiclesShowcase;
