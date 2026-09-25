import { memo } from "react";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router";
import ImageWithFallback from "../components/ImageWithFallback";
import r2 from "../assets/gallery/Rikshaw2.webp";
import r7 from "../assets/gallery/Rikshaw7.webp";

const GallerySection = memo(() => (
  <section
    id="gallery"
    className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-surface text-white"
  >
    <div className="flex justify-between items-end mb-10">
      <div>
        <div className="flex items-center gap-2.5 mb-4">
          <span className="h-px w-8 bg-accent" />
          <span className="text-sm text-muted-foreground">
            Inside EnablingEV
          </span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-white">
          Engineered around real life.
        </h2>
      </div>
      <Link
        to="/gallery"
        className="hidden md:flex text-primary text-sm font-medium items-center gap-1.5 hover:gap-2.5 hover:text-primary-hover transition-all"
      >
        View full gallery <ArrowRight size={16} />
      </Link>
    </div>

    <div className="grid md:grid-cols-2 gap-5">
      <Link
        to="/gallery"
        className="relative rounded-2xl overflow-hidden h-[380px] sm:h-[420px] group border border-border bg-card block"
      >
        <ImageWithFallback
          src={r2}
          alt="Designed for the city"
          label="Designed for the city"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#071A1C]/90 via-[#071A1C]/25 to-transparent pointer-events-none" />
        <h3 className="absolute bottom-6 left-6 text-xl sm:text-2xl font-semibold text-white tracking-tight">
          Designed for the city
        </h3>
      </Link>

      <Link
        to="/gallery"
        className="relative rounded-2xl overflow-hidden h-[380px] sm:h-[420px] group border border-border bg-card block"
      >
        <ImageWithFallback
          src={r7}
          alt="Built with precision"
          label="Built with precision"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#071A1C]/90 via-[#071A1C]/25 to-transparent pointer-events-none" />
        <h3 className="absolute bottom-6 left-6 text-xl sm:text-2xl font-semibold text-white tracking-tight">
          Built with precision
        </h3>
      </Link>
    </div>

    <div className="flex justify-center mt-8 md:hidden">
      <Link
        to="/gallery"
        className="text-primary text-sm font-medium flex items-center gap-1.5"
      >
        View full gallery <ArrowRight size={16} />
      </Link>
    </div>
  </section>
));

export default GallerySection;
