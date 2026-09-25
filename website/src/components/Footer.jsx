import { memo, useState } from "react";
import { Link } from "react-router";
import { ArrowRight, MapPin, Phone, Mail } from "lucide-react";
import BrandMark from "./ui/BrandMark";
import { SocialIcon } from "./ui/SocialIcons";
import { PHONES, EMAIL, OFFICES, SOCIALS } from "../data/company";

const FOOTER_OFFICE = OFFICES.find((o) => o.label === "Bihar Office");

const Footer = memo(() => {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email) return;
    setSubscribed(true);
    setEmail("");
    setTimeout(() => setSubscribed(false), 3000);
  };

  return (
    <footer className="relative bg-ink text-white overflow-hidden border-t border-white/[0.06]">
      <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full bg-primary/[0.03] blur-[160px]" />

      <div className="relative max-w-[1600px] mx-auto px-4 sm:px-6 md:px-10 lg:px-16">
        {/* ─── Top: Wordmark + Newsletter ──────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20 py-14 sm:py-16 lg:py-24 border-b border-white/[0.06]">
          {/* Left — Brand wordmark */}
          <div>
            <div className="flex items-center gap-2.5 sm:gap-3 mb-4">
              <BrandMark className="h-7 sm:h-9 w-auto" />
              <span className="font-display text-2xl sm:text-3xl lg:text-4xl tracking-tight text-white">
                Enabling<span className="text-primary">EV</span>
              </span>
            </div>
            <p className="text-white/55 text-sm sm:text-base leading-relaxed max-w-md">
              Practical electric vehicles for the people who keep India moving.
              Dependable engineering, economical ownership, and support that
              lasts beyond the sale.
            </p>
          </div>

          {/* Right — Newsletter */}
          <div className="lg:max-w-md lg:ml-auto w-full">
            <p className="text-eyebrow text-white/50 mb-4 sm:mb-5">
              Stay in the loop
            </p>
            <h3 className="font-display text-lg sm:text-xl lg:text-2xl text-white mb-5 sm:mb-6 tracking-[-0.01em] leading-snug">
              New models, dealer updates, and stories from the road.
            </h3>

            {subscribed ? (
              <p className="text-primary text-sm">
                Thanks — you're on the list.
              </p>
            ) : (
              <form
                onSubmit={handleSubscribe}
                className="flex items-center gap-3 border-b border-white/20 focus-within:border-primary transition-colors duration-300 pb-3"
              >
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="flex-1 min-w-0 bg-transparent text-white placeholder:text-white/35 outline-none text-sm sm:text-base py-2"
                  required
                />
                <button
                  type="submit"
                  aria-label="Subscribe"
                  className="shrink-0 text-white/70 hover:text-primary transition-colors duration-300 p-2"
                >
                  <ArrowRight size={18} />
                </button>
              </form>
            )}
          </div>
        </div>

        {/* ─── Middle: Link columns ─────────────────────────────────── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 sm:gap-10 lg:gap-16 py-12 sm:py-16 lg:py-20 border-b border-white/[0.06]">
          {/* Vehicles */}
          <div>
            <h4 className="text-eyebrow text-white/40 mb-5 sm:mb-6">
              Vehicles
            </h4>
            <ul className="space-y-3 sm:space-y-4">
              {[
                { label: "Passenger EV", to: "/product" },
                { label: "Cargo / Loader", to: "/product" },
                { label: "All Models", to: "/product" },
                { label: "Gallery", to: "/gallery" },
              ].map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    className="link-luxe text-white/70 hover:text-white transition-colors duration-300 text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-eyebrow text-white/40 mb-5 sm:mb-6">Company</h4>
            <ul className="space-y-3 sm:space-y-4">
              {[
                { label: "About Us", to: "/about" },
                { label: "Our Mission", to: "/mission" },
                { label: "Dealer Network", to: "/DealerForm" },
                { label: "Contact", to: "/contact" },
              ].map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    className="link-luxe text-white/70 hover:text-white transition-colors duration-300 text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-eyebrow text-white/40 mb-5 sm:mb-6">Support</h4>
            <ul className="space-y-3 sm:space-y-4">
              {[
                { label: "Dealer Login", to: "/dealerLogin" },
                { label: "Dealer Status", to: "/dealerStatus" },
                { label: "Activate Account", to: "/dealerActivate" },
                { label: "Form 22", to: "/form_22" },
              ].map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    className="link-luxe text-white/70 hover:text-white transition-colors duration-300 text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="col-span-2 md:col-span-1">
            <h4 className="text-eyebrow text-white/40 mb-5 sm:mb-6">Contact</h4>
            <ul className="space-y-4 sm:space-y-5 text-sm text-white/70">
              <li className="flex items-start gap-3">
                <MapPin size={15} className="text-primary/70 shrink-0 mt-0.5" />
                <span className="leading-relaxed break-words">
                  {FOOTER_OFFICE.address}
                </span>
              </li>
              <li className="flex items-start gap-3">
                <Phone size={15} className="text-primary/70 shrink-0 mt-0.5" />
                <span className="flex flex-col gap-1">
                  {PHONES.map((p) => (
                    <a
                      key={p.href}
                      href={p.href}
                      className="link-luxe hover:text-white transition-colors duration-300 break-all"
                    >
                      {p.display}
                    </a>
                  ))}
                </span>
              </li>
              <li className="flex items-start gap-3">
                <Mail size={15} className="text-primary/70 shrink-0 mt-0.5" />
                <a
                  href={`mailto:${EMAIL}`}
                  className="link-luxe hover:text-white transition-colors duration-300 break-all"
                >
                  {EMAIL}
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* ─── Bottom bar: Copyright + Social ───────────────────────── */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-6 sm:gap-4 py-8 sm:py-10">
          <div className="flex flex-col sm:flex-row sm:items-center items-center gap-3 sm:gap-8 text-center sm:text-left">
            <p className="text-white/40 text-xs">
              © 2026 Enabling E-Vehicle Pvt. Ltd.
            </p>
            <div className="flex items-center gap-6 text-xs text-white/40">
              <a
                href="#"
                className="link-luxe hover:text-white/70 transition-colors duration-300"
              >
                Privacy
              </a>
              <a
                href="#"
                className="link-luxe hover:text-white/70 transition-colors duration-300"
              >
                Terms
              </a>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {SOCIALS.map(({ name, href, label }) => (
              <a
                key={name}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-white/15 hover:border-primary/60 text-white/50 hover:text-primary transition-all duration-300 flex items-center justify-center"
              >
                <SocialIcon name={name} size={15} />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
});

export default Footer;
