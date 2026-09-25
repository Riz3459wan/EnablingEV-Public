import { useState, useEffect, memo } from "react";
import { Menu, X, ChevronDown, LogOut, Globe } from "lucide-react";
import { Link, NavLink, useNavigate, useLocation } from "react-router";
import { publicLinks, roleLinks } from "../data/navLinks";
import { useAuth } from "../auth/AuthContext";
import BrandMark from "./ui/BrandMark";

const ROLE_LABEL = { subadmin: "Sub Admin", dealer: "Dealer" };
const ROLE_DASH = {
  subadmin: "/subAdminDash",
  dealer: "/dealerDash",
};

const desktopLinkClass = ({ isActive }) =>
  `relative text-[11px] uppercase tracking-luxe font-medium transition-colors duration-300 cursor-pointer py-2
   after:absolute after:left-0 after:bottom-0 after:h-px after:w-full after:origin-right after:scale-x-0
   after:bg-current after:transition-transform after:duration-500 after:ease-[cubic-bezier(0.22,1,0.36,1)]
   hover:after:origin-left hover:after:scale-x-100
   ${isActive ? "text-white after:origin-left after:scale-x-100" : "text-white/70 hover:text-white"}`;

const mobileLinkClass = ({ isActive }) =>
  `block py-3.5 text-xl sm:text-2xl font-display tracking-tight transition-colors duration-300 border-b border-white/[0.05]
   ${isActive ? "text-white" : "text-white/60 hover:text-white"}`;

const Navbar = memo(({ onOpenDealer }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [loginMenuOpen, setLoginMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { isLoggedIn, role, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const isPortal = isLoggedIn && !!roleLinks[role];
  const links = isPortal ? roleLinks[role] : publicLinks;

  // Close mobile menu whenever route changes
  useEffect(() => {
    setMobileOpen(false);
    setLoginMenuOpen(false);
  }, [location.pathname]);

  // Transparent over hero, solid once scrolled
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock body scroll when mobile menu open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const handleLogout = () => {
    const loginPath = {
      subadmin: "/subAdminLogin",
      dealer: "/dealerLogin",
    }[role];
    logout();
    setMobileOpen(false);
    navigate(loginPath || "/");
  };

  return (
    <>
      <header
        className={`fixed w-full z-50 top-0 transition-all duration-500 ease-out ${
          scrolled || isPortal || mobileOpen
            ? "bg-ink/85 backdrop-blur-xl border-b border-white/[0.06]"
            : "bg-transparent border-b border-transparent"
        }`}
      >
        <nav className="max-w-[1600px] mx-auto px-4 sm:px-6 md:px-10 lg:px-16">
          <div className="flex justify-between items-center h-16 sm:h-18 lg:h-24 transition-all duration-500">
            {/* Wordmark */}
            <Link
              to={isPortal ? ROLE_DASH[role] : "/"}
              className="flex items-center gap-2 sm:gap-3 text-white group min-w-0"
            >
              <BrandMark className="h-7 sm:h-8 w-auto transition-transform duration-500 group-hover:scale-105 shrink-0" />
              <span className="font-display text-lg sm:text-xl lg:text-2xl tracking-tight text-white truncate">
                Enabling<span className="text-primary">EV</span>
              </span>
            </Link>

            {/* Desktop links */}
            <div className="hidden lg:flex items-center gap-10">
              {links.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.to === "/"}
                  className={desktopLinkClass}
                >
                  {link.label}
                </NavLink>
              ))}
            </div>

            {/* Right side actions — desktop only */}
            <div className="hidden lg:flex items-center gap-5">
              {isPortal ? (
                <>
                  <span className="text-[10px] uppercase tracking-luxe font-medium text-primary border border-primary/40 rounded-full px-3 py-1.5">
                    {ROLE_LABEL[role]}
                  </span>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 text-[11px] uppercase tracking-luxe font-medium text-white/70 hover:text-white transition-colors duration-300"
                  >
                    <LogOut size={13} /> Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/DealerForm"
                    className="text-[11px] uppercase tracking-luxe font-medium text-white/70 hover:text-white transition-colors duration-300 link-luxe"
                  >
                    Become a Dealer
                  </Link>

                  <div className="relative">
                    <button
                      onClick={() => setLoginMenuOpen((v) => !v)}
                      className="flex items-center gap-2 text-[11px] uppercase tracking-luxe font-medium border border-white/25 hover:border-white text-white rounded-full px-5 py-2.5 transition-all duration-300"
                    >
                      Login{" "}
                      <ChevronDown
                        size={13}
                        className={`transition-transform duration-300 ${
                          loginMenuOpen ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    {loginMenuOpen && (
                      <>
                        <div
                          className="fixed inset-0 z-10"
                          onClick={() => setLoginMenuOpen(false)}
                        />
                        <div className="absolute right-0 mt-3 w-48 bg-ink/95 backdrop-blur-xl border border-white/[0.08] rounded-2xl shadow-2xl overflow-hidden z-20 py-2">
                          {[
                            { label: "Sub Admin", to: "/subAdminLogin" },
                            { label: "Dealer", to: "/dealerLogin" },
                          ].map((item) => (
                            <Link
                              key={item.to}
                              to={item.to}
                              onClick={() => setLoginMenuOpen(false)}
                              className="block px-5 py-3 text-[11px] uppercase tracking-luxe font-medium text-white/70 hover:text-white hover:bg-white/[0.04] transition-colors"
                            >
                              {item.label}
                            </Link>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                </>
              )}
            </div>

            {/* Mobile burger */}
            <button
              className="lg:hidden text-white p-2 -mr-2"
              onClick={() => setMobileOpen((v) => !v)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile full-screen overlay menu */}
      <div
        className={`fixed inset-0 z-40 bg-ink transition-all duration-500 ease-out lg:hidden ${
          mobileOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      >
        <div className="h-full flex flex-col pt-24 sm:pt-28 pb-8 px-6 sm:px-8 overflow-y-auto">
          {isPortal && (
            <span className="text-[10px] uppercase tracking-luxe font-medium text-primary mb-6">
              {ROLE_LABEL[role]} Portal
            </span>
          )}

          <nav className="flex-1 flex flex-col">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === "/"}
                onClick={() => setMobileOpen(false)}
                className={mobileLinkClass}
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          <div className="pt-8 mt-6 border-t border-white/[0.08] space-y-3">
            {isPortal ? (
              <>
                <Link
                  to="/"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-center gap-2 text-[11px] uppercase tracking-luxe font-medium text-primary border border-primary/30 rounded-full py-3.5"
                >
                  <Globe size={13} /> View Public Site
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2 text-[11px] uppercase tracking-luxe font-medium text-white/70 border border-white/20 rounded-full py-3.5"
                >
                  <LogOut size={13} /> Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/DealerForm"
                  onClick={() => setMobileOpen(false)}
                  className="block text-center text-[11px] uppercase tracking-luxe font-medium text-white bg-white/[0.06] hover:bg-white/[0.1] border border-white/20 rounded-full py-3.5 transition-colors"
                >
                  Become a Dealer
                </Link>
                <div className="grid grid-cols-2 gap-3">
                  <Link
                    to="/subAdminLogin"
                    onClick={() => setMobileOpen(false)}
                    className="text-center text-[11px] uppercase tracking-luxe font-medium text-white/70 border border-white/15 rounded-full py-3"
                  >
                    Sub Admin
                  </Link>
                  <Link
                    to="/dealerLogin"
                    onClick={() => setMobileOpen(false)}
                    className="text-center text-[11px] uppercase tracking-luxe font-medium text-white/70 border border-white/15 rounded-full py-3"
                  >
                    Dealer
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
});

export default Navbar;
