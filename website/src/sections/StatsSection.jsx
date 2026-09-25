import { memo, useState, useEffect, useRef } from "react";
import { Factory, Store, Truck, Users, TrendingUp } from "lucide-react";
import useScrollReveal from "../hooks/useScrollReveal";

const stats = [
  {
    icon: Factory,
    value: 500,
    suffix: "+",
    label: "Manufacturers",
    color: "from-blue-400 to-cyan-600",
  },
  {
    icon: Store,
    value: 2000,
    suffix: "+",
    label: "Dealers",
    color: "from-purple-400 to-violet-600",
  },
  {
    icon: Truck,
    value: 10000,
    suffix: "+",
    label: "EV Listings",
    color: "from-emerald-400 to-green-600",
  },
  {
    icon: Users,
    value: 50000,
    suffix: "+",
    label: "Happy Customers",
    color: "from-orange-400 to-amber-600",
  },
];

const AnimatedNumber = ({ target, duration = 2200 }) => {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started) setStarted(true);
      },
      { threshold: 0.5 },
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [started]);

  useEffect(() => {
    if (!started) return;
    let start = 0;
    const increment = target / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [started, target, duration]);

  return (
    <span ref={ref} className="tabular">
      {count.toLocaleString("en-IN")}
    </span>
  );
};

const StatCard = ({ icon: Icon, value, suffix, label, color, index }) => {
  const ref = useScrollReveal({ delay: index * 150 });

  return (
    <div
      ref={ref}
      className="reveal-scale group relative glass-dark rounded-2xl p-6 text-center overflow-hidden hover:bg-white/10 transition-all duration-500 hover:scale-105 hover:-translate-y-2"
    >
      {/* Animated glow */}
      <div
        className={`absolute inset-0 bg-gradient-to-br ${color} opacity-0 group-hover:opacity-20 rounded-2xl transition-opacity duration-500`}
      />
      <div
        className={`absolute -top-16 -right-16 w-32 h-32 rounded-full bg-gradient-to-br ${color} opacity-0 group-hover:opacity-40 blur-3xl transition-all duration-700 group-hover:scale-150`}
      />

      <div
        className={`relative w-14 h-14 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-500`}
      >
        <Icon size={24} className="text-white" strokeWidth={2.5} />
      </div>
      <p className="relative text-3xl font-bold text-white mb-1">
        <AnimatedNumber target={value} />
        <span className="text-gradient">{suffix}</span>
      </p>
      <p className="relative text-xs text-white/60 font-medium">{label}</p>
    </div>
  );
};

const StatsSection = memo(() => {
  const leftRef = useScrollReveal({ delay: 100 });

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="relative bg-gradient-to-br from-[#0a1628] via-[#0f2a2e] to-[#0a1628] rounded-3xl p-8 sm:p-12 overflow-hidden noise-overlay">
        {/* Animated glows */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/25 rounded-full blur-[120px] float-y" />
        <div
          className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-cyan-500/20 rounded-full blur-[100px] float-y"
          style={{ animationDelay: "2s" }}
        />
        <div className="absolute inset-0 bg-grid opacity-20" />

        <div className="relative grid lg:grid-cols-[1fr_2fr] gap-10 items-center">
          <div ref={leftRef} className="reveal-left">
            <div className="flex items-center gap-2 mb-4">
              <span className="w-8 h-1 bg-gradient-to-r from-primary to-cyan-500 rounded-full" />
              <span className="text-xs font-bold text-primary uppercase tracking-wider">
                Our Impact
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4 leading-tight">
              Trusted by <span className="text-gradient">10,000+</span>{" "}
              Businesses Across India
            </h2>
            <p className="text-white/60 text-sm leading-relaxed mb-6">
              From small dealers to large manufacturers, we help everyone grow
              in the EV ecosystem.
            </p>

            <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-2 animate-glow-pulse">
              <TrendingUp size={16} className="text-primary" />
              <span className="text-white text-sm font-medium">
                Growing <span className="text-primary font-bold">+45%</span> YoY
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {stats.map((s, i) => (
              <StatCard key={s.label} {...s} index={i} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
});

export default StatsSection;
