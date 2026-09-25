import { memo } from "react";
import { useNavigate } from "react-router";
import { Check, ArrowRight } from "lucide-react";
import { EmberButton } from "../components/ui/Button";

const FEATURES = [
  "Product & sales guidance",
  "Dealer onboarding support",
  "Customer lifecycle tools",
  "Future-ready digital portal",
];

// No longer takes onOpenDealer — this CTA goes straight to real registration.
const DealerSection = memo(() => {
  const navigate = useNavigate();

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="bg-card border border-border rounded-2xl p-8 sm:p-12 lg:p-16 grid lg:grid-cols-2 gap-10 lg:gap-14 items-center">
        <div>
          <div className="flex items-center gap-2.5 mb-5">
            <span className="h-px w-8 bg-ember" />
            <span className="text-sm text-muted-foreground">
              Dealer network
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-white mb-6 leading-tight text-balance">
            Bring electric mobility to your city.
          </h2>
          <p className="text-muted-foreground text-base sm:text-lg leading-relaxed">
            Partner with EnablingEV to introduce practical electric vehicles
            to your market — with product guidance, business support, and a
            platform ready for future integration.
          </p>
        </div>

        <div className="flex flex-col gap-4">
          <ul className="grid sm:grid-cols-2 gap-x-6 gap-y-3.5">
            {FEATURES.map((item) => (
              <li key={item} className="flex items-start gap-2.5">
                <Check size={17} className="text-ember shrink-0 mt-0.5" />
                <span className="text-sm font-medium text-white/90">
                  {item}
                </span>
              </li>
            ))}
          </ul>

          <EmberButton
            className="w-full mt-4 !py-3.5 text-base sm:text-lg"
            onClick={() => navigate("/DealerForm")}
          >
            Register as a dealer <ArrowRight size={20} />
          </EmberButton>
        </div>
      </div>
    </section>
  );
});

export default DealerSection;
