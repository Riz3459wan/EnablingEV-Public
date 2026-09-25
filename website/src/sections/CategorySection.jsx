import { memo } from "react";
import {
  Truck,
  Car,
  Package,
  Battery,
  Wrench,
  Zap,
  Factory,
  Store,
  Headphones,
  ArrowUpRight,
} from "lucide-react";
import useScrollReveal from "../hooks/useScrollReveal";

const categories = [
  {
    icon: Truck,
    label: "E-Rickshaw",
    sub: "Passenger & Cargo",
    color: "from-emerald-400 to-green-600",
    count: "2,400+",
  },
  {
    icon: Car,
    label: "Electric Auto",
    sub: "3 Wheeler",
    color: "from-blue-400 to-cyan-600",
    count: "1,800+",
  },
  {
    icon: Package,
    label: "Electric Loader",
    sub: "Cargo Vehicles",
    color: "from-violet-400 to-purple-600",
    count: "950+",
  },
  {
    icon: Battery,
    label: "EV Batteries",
    sub: "Lithium & Lead Acid",
    color: "from-amber-400 to-orange-600",
    count: "3,200+",
  },
  {
    icon: Wrench,
    label: "Spare Parts",
    sub: "Genuine Parts",
    color: "from-pink-400 to-rose-600",
    count: "5,600+",
  },
  {
    icon: Zap,
    label: "Charging",
    sub: "EV Charging",
    color: "from-yellow-400 to-amber-600",
    count: "780+",
  },
  {
    icon: Factory,
    label: "Manufacturers",
    sub: "Verified Companies",
    color: "from-indigo-400 to-blue-600",
    count: "500+",
  },
  {
    icon: Store,
    label: "Dealers",
    sub: "Find Near You",
    color: "from-teal-400 to-emerald-600",
    count: "2,000+",
  },
  {
    icon: Headphones,
    label: "Service Centers",
    sub: "Repair & Maintenance",
    color: "from-red-400 to-pink-600",
    count: "1,200+",
  },
];

const CategoryCard = ({ icon: Icon, label, sub, color, count, index }) => {
  const ref = useScrollReveal({ delay: index * 80 });

  return (
    <button
      ref={ref}
      className="reveal-scale group relative bg-white border border-border rounded-2xl p-5 text-left overflow-hidden magnetic glow-border shimmer-card"
    >
      {/* Animated gradient blob */}
      <div
        className={`absolute -top-16 -right-16 w-32 h-32 rounded-full bg-gradient-to-br ${color} opacity-0 group-hover:opacity-30 blur-3xl transition-all duration-700 group-hover:scale-150`}
      />

      {/* Count badge */}
      <span className="absolute top-4 right-4 text-[10px] font-bold text-muted-foreground bg-gray-100 group-hover:bg-primary/10 group-hover:text-primary px-2 py-0.5 rounded-full transition-all">
        {count}
      </span>

      {/* Icon with rotation + scale */}
      <div
        className={`relative w-14 h-14 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 group-hover:-rotate-6 transition-all duration-500`}
      >
        <Icon size={24} className="text-white" strokeWidth={2.5} />
      </div>

      <p className="relative font-bold text-sm text-foreground mb-0.5 group-hover:text-primary transition-colors">
        {label}
      </p>
      <p className="relative text-xs text-muted-foreground">{sub}</p>

      {/* Arrow appears on hover */}
      <div className="absolute bottom-4 right-4 w-7 h-7 rounded-full bg-primary flex items-center justify-center opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-500">
        <ArrowUpRight size={14} className="text-white" />
      </div>
    </button>
  );
};

const CategorySection = memo(() => {
  const headerRef = useScrollReveal({ delay: 100 });
  const gridRef = useScrollReveal({ delay: 200 });

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto -mt-8 relative z-10">
      <div ref={headerRef} className="reveal text-center mb-12">
        <span className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-2 text-xs font-semibold text-primary mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-primary pulse-dot" />
          Browse Categories
        </span>
        <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-3">
          Explore by <span className="text-gradient">Category</span>
        </h2>
        <p className="text-sm text-muted-foreground max-w-lg mx-auto">
          Find everything you need for your EV business — from vehicles to
          batteries to service.
        </p>
      </div>

      <div
        ref={gridRef}
        className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4"
      >
        {categories.slice(0, 5).map((cat, i) => (
          <CategoryCard key={cat.label} {...cat} index={i} />
        ))}
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
        {categories.slice(5).map((cat, i) => (
          <CategoryCard key={cat.label} {...cat} index={i + 5} />
        ))}
      </div>
    </section>
  );
});

export default CategorySection;
