import { memo } from "react";
import { ChevronRight, ArrowRight } from "lucide-react";
import { Link } from "react-router";
import vehicles from "../data/vehicles";

// Catalog-style stacked rows rather than a grid of identical cards — this
// is literally a two-item catalog, so a wide plate per vehicle gives each
// one room to breathe instead of squeezing both into equal-width boxes.
const VehiclesSection = memo(({ onEnquire }) => (
  <section
    id="vehicles"
    className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-surface text-white"
  >
    <div className="flex justify-between items-end mb-14">
      <div>
        <div className="flex items-center gap-2.5 mb-4">
          <span className="h-px w-8 bg-accent" />
          <span className="text-sm text-muted-foreground">Our vehicles</span>
        </div>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-white max-w-lg text-balance">
          Two families. One job: get you moving.
        </h2>
      </div>
      <Link
        to="/product"
        className="hidden md:flex text-primary text-sm font-medium items-center gap-1.5 hover:gap-2.5 hover:text-primary-hover transition-all shrink-0"
      >
        Full spec sheet <ArrowRight size={16} />
      </Link>
    </div>

    <div className="flex flex-col divide-y divide-border border-y border-border">
      {vehicles.map((v) => (
        <div
          key={v.id}
          className="group grid md:grid-cols-[auto_1fr_auto] items-center gap-6 md:gap-10 py-9"
        >
          <span className="font-display tabular text-5xl sm:text-6xl font-semibold text-placeholder group-hover:text-accent/70 transition-colors">
            {v.id}
          </span>

          <div>
            <p className="text-accent text-sm font-medium mb-2">
              {v.category}
            </p>
            <h3 className="text-2xl sm:text-3xl font-semibold text-white mb-2 tracking-tight">
              {v.title}
            </h3>
            <p className="text-muted-foreground text-sm sm:text-base leading-relaxed max-w-md">
              {v.desc}
            </p>
          </div>

          <button
            onClick={() => onEnquire(v.title)}
            className="justify-self-start md:justify-self-end text-white border border-line rounded-full pl-5 pr-4 py-2.5 text-sm font-medium flex items-center gap-1.5 group-hover:border-accent/50 group-hover:text-accent transition-all cursor-pointer shrink-0"
          >
            Enquire <ChevronRight size={16} />
          </button>
        </div>
      ))}
    </div>

    <div className="flex justify-center mt-8 md:hidden">
      <Link to="/product" className="text-primary text-sm font-medium flex items-center gap-1.5">
        Full spec sheet <ArrowRight size={16} />
      </Link>
    </div>
  </section>
));

export default VehiclesSection;
