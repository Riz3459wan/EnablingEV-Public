import { memo } from "react";
import {
  ShieldCheck,
  Award,
  TrendingUp,
  Users,
  Building2,
  Star,
  CheckCircle2,
  BadgeCheck,
} from "lucide-react";

const brands = [
  { icon: ShieldCheck, name: "GST Verified" },
  { icon: Award, name: "ISO Certified" },
  { icon: TrendingUp, name: "MSME Registered" },
  { icon: Users, name: "10K+ Businesses" },
  { icon: Building2, name: "500+ Manufacturers" },
  { icon: Star, name: "4.8 Rated" },
  { icon: CheckCircle2, name: "Verified Dealers" },
  { icon: BadgeCheck, name: "Trusted Platform" },
];

const TrustMarquee = memo(() => (
  <section className="py-8 bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 border-y border-primary/20 overflow-hidden">
    <div className="marquee-container">
      <div className="marquee-content">
        {[...brands, ...brands].map(({ icon: Icon, name }, i) => (
          <div
            key={`${name}-${i}`}
            className="flex items-center gap-2 text-muted-foreground whitespace-nowrap px-6 group cursor-pointer hover:text-primary transition-colors"
          >
            <Icon
              size={20}
              className="text-primary group-hover:scale-125 transition-transform"
            />
            <span className="text-sm font-bold">{name}</span>
            <span className="text-primary/30">•</span>
          </div>
        ))}
      </div>
    </div>
  </section>
));

export default TrustMarquee;
