import { memo } from "react";
import {
  Truck,
  ShieldCheck,
  Scale,
  MapPin,
  Lock,
  ArrowRight,
} from "lucide-react";
import useScrollReveal from "../hooks/useScrollReveal";

const features = [
  {
    icon: Truck,
    title: "Wide Range of EV Models",
    desc: "From e-rickshaws to electric loaders",
    color: "from-blue-500 to-cyan-600",
  },
  {
    icon: ShieldCheck,
    title: "Verified Business Listings",
    desc: "All dealers and manufacturers are verified",
    color: "from-green-500 to-emerald-600",
  },
  {
    icon: Scale,
    title: "Easy Comparison & Enquiry",
    desc: "Compare specs and get instant quotes",
    color: "from-purple-500 to-violet-600",
  },
  {
    icon: MapPin,
    title: "Pan India Network",
    desc: "Available across all major cities",
    color: "from-orange-500 to-amber-600",
  },
  {
    icon: Lock,
    title: "Secure & Reliable Platform",
    desc: "Your data is safe with us",
    color: "from-red-500 to-pink-600",
  },
];

const FeatureCard = ({ icon: Icon, title, desc, color, delay }) => {
  const ref = useScrollReveal();

  return (
    <div
      ref={ref}
      className="reveal-scale group relative bg-white border border-border rounded-2xl p-5 text-center hover-lift overflow-hidden"
      style={{ transitionDelay: `${delay}ms` }}
    >
      {/* Animated gradient overlay */}
      <div
        className={`absolute inset-0 bg-gradient-to-br ${color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}
      />

      {/* Glow on hover */}
      <div
        className={`absolute -top-10 -right-10 w-24 h-24 rounded-full bg-gradient-to-br ${color} opacity-0 group-hover:opacity-30 blur-2xl transition-all duration-700 group-hover:scale-150`}
      />

      <div
        className={`relative w-14 h-14 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-500`}
      >
        <Icon size={24} className="text-white" />
      </div>
      <h3 className="relative text-sm font-bold text-foreground mb-1.5 leading-snug">
        {title}
      </h3>
      <p className="relative text-xs text-muted-foreground leading-relaxed">
        {desc}
      </p>

      {/* Bottom accent line */}
      <div
        className={`absolute bottom-0 left-0 h-0.5 bg-gradient-to-r ${color} w-0 group-hover:w-full transition-all duration-500`}
      />
    </div>
  );
};

const WhyChooseSection = memo(() => {
  const titleRef = useScrollReveal();

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div ref={titleRef} className="reveal text-center mb-12">
        <div className="flex items-center justify-center gap-2 mb-3">
          <span className="w-8 h-1 bg-gradient-to-r from-primary to-cyan-500 rounded-full" />
          <span className="text-xs font-semibold text-primary uppercase tracking-wider">
            Why Us
          </span>
          <span className="w-8 h-1 bg-gradient-to-r from-cyan-500 to-primary rounded-full" />
        </div>
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-3">
          Why Choose EVConnect?
        </h2>
        <p className="text-sm text-muted-foreground max-w-xl mx-auto">
          A complete platform for all your EV business needs
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {features.map((f, i) => (
          <FeatureCard key={f.title} {...f} delay={i * 100} />
        ))}
      </div>

      <div className="mt-12 text-center reveal">
        <a
          href="#vehicles"
          className="group inline-flex items-center gap-2 text-primary font-semibold text-sm hover:gap-3 transition-all"
        >
          Explore All Features
          <ArrowRight
            size={16}
            className="group-hover:translate-x-1 transition-transform"
          />
        </a>
      </div>
    </section>
  );
});

export default WhyChooseSection;
