import { memo, useRef, useState } from "react";
import {
  Heart,
  MapPin,
  CheckCircle2,
  ArrowRight,
  Star,
  Zap,
  TrendingUp,
} from "lucide-react";
import { Link } from "react-router";
import heroImg from "../assets/products/F2SS1.webp";
import useScrollReveal from "../hooks/useScrollReveal";

const featured = [
  {
    id: 1,
    brand: "Mahindra",
    name: "E-Alfa Plus",
    price: "1,85,000",
    badge: "Popular",
    badgeColor: "from-green-500 to-emerald-600",
    range: "120 km",
    battery: "1.2 kWh",
    payload: "500 kg",
    location: "Delhi",
    rating: 4.8,
    trend: "+12%",
  },
  {
    id: 2,
    brand: "Tata",
    name: "Ace EV",
    price: "3,45,000",
    badge: "Best Seller",
    badgeColor: "from-orange-500 to-amber-600",
    range: "150 km",
    battery: "3.0 kWh",
    payload: "1000 kg",
    location: "Lucknow",
    rating: 4.9,
    trend: "+28%",
  },
  {
    id: 3,
    brand: "Bajaj",
    name: "RE E-Tech",
    price: "1,95,000",
    badge: null,
    range: "110 km",
    battery: "1.5 kWh",
    payload: "400 kg",
    location: "Bangalore",
    rating: 4.7,
    trend: "+8%",
  },
  {
    id: 4,
    brand: "Piaggio",
    name: "Ape E-Xtra",
    price: "2,75,000",
    badge: null,
    range: "120 km",
    battery: "2.6 kWh",
    payload: "700 kg",
    location: "Mumbai",
    rating: 4.8,
    trend: "+15%",
  },
];

const VehicleCard = ({ v, index }) => {
  const ref = useScrollReveal({ delay: index * 120 });
  const cardRef = useRef(null);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
  const [isHovering, setIsHovering] = useState(false);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMousePos({ x, y });
  };

  return (
    <div
      ref={(el) => {
        ref.current = el;
        cardRef.current = el;
      }}
      className="reveal-scale group relative bg-white border border-border rounded-2xl overflow-hidden magnetic glow-border"
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {/* Spotlight follows cursor */}
      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-300 z-20"
        style={{
          opacity: isHovering ? 1 : 0,
          background: `radial-gradient(400px circle at ${mousePos.x}% ${mousePos.y}%, rgba(16, 185, 129, 0.15), transparent 60%)`,
        }}
      />

      {/* Image area */}
      <div className="relative bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50 p-4 h-48 flex items-center justify-center overflow-hidden">
        {/* Animated grid */}
        <div className="absolute inset-0 bg-dots opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {v.badge && (
          <span
            className={`absolute top-3 left-3 z-10 bg-gradient-to-r ${v.badgeColor} text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full shadow-lg pulse-dot`}
          >
            {v.badge}
          </span>
        )}

        {/* Trend badge */}
        <span className="absolute top-3 right-10 z-10 flex items-center gap-1 bg-white/90 backdrop-blur-sm border border-green-200 text-green-700 text-[10px] font-bold px-2 py-1 rounded-full shadow-sm">
          <TrendingUp size={10} /> {v.trend}
        </span>

        <button className="absolute top-3 right-3 z-10 p-2 bg-white/90 backdrop-blur-sm rounded-full border border-border hover:border-red-400 hover:bg-white transition-all shadow-sm">
          <Heart
            size={14}
            className="text-muted-foreground hover:text-red-500 transition-colors"
          />
        </button>

        {/* Glow */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-32 h-32 bg-primary/0 group-hover:bg-primary/30 rounded-full blur-3xl transition-all duration-700 group-hover:scale-150" />
        </div>

        <img
          src={heroImg}
          alt={v.name}
          className="relative w-full h-full object-contain group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-700"
        />
      </div>

      {/* Details */}
      <div className="p-4 relative z-30">
        <div className="flex items-center justify-between mb-1">
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
            {v.brand}
          </p>
          <div className="flex items-center gap-1 text-xs bg-amber-50 border border-amber-200 rounded-full px-2 py-0.5">
            <Star size={10} className="text-amber-500 fill-amber-500" />
            <span className="font-bold text-amber-700">{v.rating}</span>
          </div>
        </div>
        <h3 className="font-bold text-foreground mb-2 text-base">{v.name}</h3>
        <p className="text-xl font-bold text-gradient mb-3">₹{v.price}</p>

        {/* Specs */}
        <div className="grid grid-cols-3 gap-2 mb-4 py-3 border-y border-border">
          {[
            { label: "Range", value: v.range },
            { label: "Battery", value: v.battery },
            { label: "Payload", value: v.payload },
          ].map((spec, i) => (
            <div
              key={spec.label}
              className={`text-center ${i === 1 ? "border-x border-border" : ""}`}
            >
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-0.5">
                {spec.label}
              </p>
              <p className="font-bold text-foreground text-xs">{spec.value}</p>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-3">
          <MapPin size={12} className="text-primary" />
          <span>{v.location}</span>
          <CheckCircle2 size={12} className="text-primary ml-auto" />
          <span className="text-primary font-bold">Verified</span>
        </div>

        <button className="shine relative w-full bg-gradient-to-r from-primary to-emerald-500 hover:from-primary-hover hover:to-emerald-600 text-white text-xs font-bold py-2.5 rounded-lg transition-all duration-300 shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/40 flex items-center justify-center gap-1.5 icon-wiggle">
          <Zap size={12} />
          Get Best Price
        </button>
      </div>
    </div>
  );
};

const FeaturedVehicles = memo(() => {
  const headerRef = useScrollReveal({ delay: 100 });

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div
        ref={headerRef}
        className="reveal flex justify-between items-end mb-10"
      >
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="w-8 h-1 bg-gradient-to-r from-primary to-cyan-500 rounded-full" />
            <span className="text-xs font-semibold text-primary uppercase tracking-wider">
              Top Picks
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-2">
            Featured <span className="text-gradient">Vehicles</span>
          </h2>
          <p className="text-sm text-muted-foreground">
            Top rated and most popular electric vehicles
          </p>
        </div>
        <Link
          to="/product"
          className="hidden md:inline-flex items-center gap-2 text-primary text-sm font-semibold underline-sweep group"
        >
          View All Vehicles
          <ArrowRight
            size={16}
            className="group-hover:translate-x-1 transition-transform"
          />
        </Link>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {featured.map((v, i) => (
          <VehicleCard key={v.id} v={v} index={i} />
        ))}
      </div>
    </section>
  );
});

export default FeaturedVehicles;
