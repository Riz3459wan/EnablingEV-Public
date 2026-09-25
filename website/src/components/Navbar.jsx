import { useState, useEffect, useRef, memo } from "react";
import { createPortal } from "react-dom";
import {
  Menu,
  X,
  ChevronDown,
  LogOut,
  Globe,
  Headset,
  User,
} from "lucide-react";
import { Link, NavLink, useNavigate, useLocation } from "react-router";
import { roleLinks } from "../data/navLinks";
import { useAuth } from "../auth/AuthContext";
import Wordmark from "./ui/Wordmark";

const ROLE_LABEL = { subadmin: "Sub Admin", dealer: "Dealer" };
const ROLE_DASH = {
  subadmin: "/subAdminDash",
  dealer: "/dealerDash",
};

// Left navigation — Home added, Contact moved to right
const LEFT_LINKS = [
  { label: "Home", to: "/" },
  { label: "Vehicles", to: "/product" },
  { label: "About", to: "/about" },
  { label: "Gallery", to: "/gallery" },
];

const EXPLORE_ITEMS = [
  { label: "JhatPat F2 SS", to: "/product" },
  { label: "JhatPat Fine MS", to: "/product" },
  { label: "All Vehicles", to: "/product" },
  { label: "Gallery", to: "/gallery" },
];

const PAGE_NAMES = {
  "/": "Overview",
  "/product": "Vehicles",
  "/about": "About",
  "/mission": "Mission",
  "/gallery": "Gallery",
  "/contact": "Contact",
};

const formatPathName = (pathname) => {
  const seg = pathname.split("/").filter(Boolean).pop() || "";
  if (!seg) return "Overview";
  return seg
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/^./, (c) => c.toUpperCase());
};

const navLinkBase =
  "font-rr relative text-[12px] uppercase tracking-[0.14em] font-semibold transition-colors duration-300";

// Solid colors — bypass custom utility compilation issues
const INK_BG = "#0d0e10";
const SURFACE_BG = "#1a1d20";
const DROPDOWN_BG = "#16181a";

// ─────────────────────────────────────────────────────────────
// Dropdown that renders into document.body — escapes any parent
// overflow-hidden or stacking-context clipping.
// ─────────────────────────────────────────────────────────────
const PortalDropdown = ({
  open,
  anchorRef,
  align = "right",
  width = 224,
  children,
}) => {
  const [pos, setPos] = useState({ top: 0, left: 0 });

  useEffect(() => {
    if (!open || !anchorRef.current) return;
    const rect = anchorRef.current.getBoundingClientRect();
    const top = rect.bottom + 8;
    const left = align === "right" ? rect.right - width : rect.left;
    setPos({ top, left });
  }, [open, anchorRef, align, width]);

  if (!open) return null;

  return createPortal(
    <div
      style={{
        position: "fixed",
        top: pos.top,
        left: pos.left,
        width,
        backgroundColor: DROPDOWN_BG,
        border: "1px solid rgba(255,255,255,0.12)",
        boxShadow: "0 20px 40px rgba(0,0,0,0.5)",
        zIndex: 10000,
        paddingTop: 6,
        paddingBottom: 6,
      }}
      onClick={(e) => e.stopPropagation()}
    >
      {children}
    </div>,
    document.body,
  );
};

const Navbar = memo(() => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [loginMenuOpen, setLoginMenuOpen] = useState(false);
  const [exploreMenuOpen, setExploreMenuOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  const loginBtnRef = useRef(null);
  const exploreBtnRef = useRef(null);

  const { isLoggedIn, role, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const isPortal = isLoggedIn && !!roleLinks[role];
  const roleLinksList = isPortal ? roleLinks[role] : [];

  const currentPageName =
    PAGE_NAMES[location.pathname] || formatPathName(location.pathname);

  useEffect(() => {
    setMobileOpen(false);
    setLoginMenuOpen(false);
    setExploreMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const onScroll = () => {
      const shouldCollapse = window.scrollY > 60;
      setCollapsed((prev) => (prev === shouldCollapse ? prev : shouldCollapse));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!loginMenuOpen && !exploreMenuOpen) return undefined;
    const close = () => {
      setLoginMenuOpen(false);
      setExploreMenuOpen(false);
    };
    const id = setTimeout(() => document.addEventListener("click", close), 0);
    return () => {
      clearTimeout(id);
      document.removeEventListener("click", close);
    };
  }, [loginMenuOpen, exploreMenuOpen]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const handleLogout = () => {
    const loginPath = { subadmin: "/subAdminLogin", dealer: "/dealerLogin" }[
      role
    ];
    logout();
    setMobileOpen(false);
    navigate(loginPath || "/");
  };

  // ─── PORTAL NAVBAR ───
  if (isPortal) {
    return (
      <>
        <header
          className="fixed w-full z-50 top-0 backdrop-blur-xl"
          style={{
            backgroundColor: "rgba(13, 14, 16, 0.95)",
            borderBottom: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <nav className="max-w-[1600px] mx-auto px-4 sm:px-6 md:px-10 lg:px-16">
            <div className="grid grid-cols-[1fr_auto_1fr] items-center h-14 lg:h-16">
              <div className="flex items-center gap-6 lg:gap-8">
                {roleLinksList.slice(0, 4).map((link) => (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    className={({ isActive }) =>
                      `${navLinkBase} hidden lg:inline ${
                        isActive
                          ? "text-white"
                          : "text-white/70 hover:text-white"
                      }`
                    }
                  >
                    {link.label}
                  </NavLink>
                ))}
                <button
                  className="lg:hidden text-white p-2 -ml-2"
                  onClick={() => setMobileOpen((v) => !v)}
                  aria-label="Toggle menu"
                >
                  {mobileOpen ? <X size={22} /> : <Menu size={22} />}
                </button>
              </div>

              <Link
                to={ROLE_DASH[role]}
                className="flex items-center justify-center text-white"
              >
                <Wordmark size="sm" />
              </Link>

              <div className="flex items-center justify-end gap-4">
                <span className="hidden sm:inline font-rr text-[10px] uppercase tracking-[0.2em] font-semibold text-primary border border-primary/40 rounded-full px-3 py-1.5">
                  {ROLE_LABEL[role]}
                </span>
                <button
                  onClick={handleLogout}
                  className="font-rr flex items-center gap-1.5 text-[11px] uppercase tracking-[0.16em] font-semibold text-white/70 hover:text-white transition-colors duration-300"
                >
                  <LogOut size={13} />
                  <span className="hidden lg:inline">Logout</span>
                </button>
              </div>
            </div>
          </nav>
        </header>

        <div
          className={`fixed inset-0 z-40 transition-all duration-500 lg:hidden ${
            mobileOpen
              ? "opacity-100 pointer-events-auto"
              : "opacity-0 pointer-events-none"
          }`}
          style={{ backgroundColor: INK_BG }}
        >
          <div className="h-full flex flex-col pt-24 pb-8 px-6 overflow-y-auto">
            <span className="font-rr text-[10px] uppercase tracking-[0.2em] font-semibold text-primary mb-6">
              {ROLE_LABEL[role]} Portal
            </span>
            <nav className="flex-1 flex flex-col">
              {roleLinksList.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    `block py-3.5 text-xl font-display tracking-tight border-b border-white/[0.05] ${
                      isActive ? "text-white" : "text-white/60 hover:text-white"
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              ))}
            </nav>
            <div className="pt-8 mt-6 border-t border-white/[0.08] space-y-3">
              <Link
                to="/"
                onClick={() => setMobileOpen(false)}
                className="font-rr flex items-center justify-center gap-2 text-[11px] uppercase tracking-[0.16em] font-semibold text-primary border border-primary/30 rounded-full py-3.5"
              >
                <Globe size={13} /> View Public Site
              </Link>
              <button
                onClick={handleLogout}
                className="font-rr w-full flex items-center justify-center gap-2 text-[11px] uppercase tracking-[0.16em] font-semibold text-white/70 border border-white/20 rounded-full py-3.5"
              >
                <LogOut size={13} /> Logout
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }

  // ─── PUBLIC NAVBAR ───
  return (
    <>
      <header className="fixed w-full z-50 top-0">
        {/* ═══ ROW 1 — Utility message ═══ */}
        <div
          className={`overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
            collapsed ? "max-h-0 opacity-0" : "max-h-9 opacity-100"
          }`}
          style={{
            backgroundColor: INK_BG,
            borderBottom: collapsed
              ? "none"
              : "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <div className="max-w-[1600px] mx-auto px-4 sm:px-6 md:px-10 lg:px-16 py-2 flex justify-center">
            <Link
              to="/product"
              className="font-rr text-[11px] tracking-[0.08em] text-white/70 hover:text-white transition-all duration-300"
            >
              Find your perfect EnablingEV.{" "}
              <span className="underline underline-offset-4 decoration-white/40 hover:decoration-white">
                Search in stock vehicles.
              </span>
            </Link>
          </div>
        </div>

        {/* ═══ ROW 2 — Main nav ═══ */}
        <div
          style={{
            backgroundColor: INK_BG,
            borderBottom: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <nav className="max-w-[1600px] mx-auto px-4 sm:px-6 md:px-10 lg:px-16">
            <div
              className={`grid grid-cols-[1fr_auto_1fr] items-center transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                collapsed ? "h-14 lg:h-16" : "h-16 lg:h-[72px]"
              }`}
            >
              {/* LEFT — Home · Vehicles · About · Gallery */}
              <div className="flex items-center">
                <div className="hidden lg:flex items-center gap-8">
                  {LEFT_LINKS.map((link) => (
                    <NavLink
                      key={link.to}
                      to={link.to}
                      end={link.to === "/"}
                      className={({ isActive }) =>
                        `${navLinkBase} ${
                          isActive
                            ? "text-white"
                            : "text-white/75 hover:text-white"
                        }`
                      }
                    >
                      {link.label}
                    </NavLink>
                  ))}
                </div>
                <button
                  className="lg:hidden text-white p-2 -ml-2"
                  onClick={() => setMobileOpen((v) => !v)}
                  aria-label="Toggle menu"
                >
                  {mobileOpen ? <X size={22} /> : <Menu size={22} />}
                </button>
              </div>

              {/* CENTER — Brand wordmark */}
              <Link
                to="/"
                className="flex items-center justify-center text-white"
              >
                <Wordmark size={collapsed ? "sm" : "md"} />
              </Link>

              {/* RIGHT — Become a Dealer · Contact (icon) · User */}
              <div className="flex items-center justify-end gap-4 lg:gap-6">
                <Link
                  to="/DealerForm"
                  className="font-rr hidden lg:inline text-[11px] uppercase tracking-[0.14em] font-semibold text-white/75 hover:text-white transition-colors duration-300"
                >
                  Become a Dealer
                </Link>

                {/* Contact Us — icon only, no text */}
                <Link
                  to="/contact"
                  aria-label="Contact Us"
                  title="Contact Us"
                  className="hidden lg:inline-flex items-center justify-center text-white/75 hover:text-white transition-colors duration-300 p-1.5"
                >
                  <Headset size={18} strokeWidth={1.5} />
                </Link>

                {/* Login dropdown */}
                <div
                  className="relative hidden lg:block"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    ref={loginBtnRef}
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setLoginMenuOpen((v) => !v);
                    }}
                    aria-label="Login menu"
                    aria-expanded={loginMenuOpen}
                    className="flex items-center gap-1.5 text-white/75 hover:text-white transition-colors duration-300 p-1.5"
                  >
                    <User size={18} strokeWidth={1.5} />
                    <ChevronDown
                      size={11}
                      className={`transition-transform duration-300 ${
                        loginMenuOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  <PortalDropdown
                    open={loginMenuOpen}
                    anchorRef={loginBtnRef}
                    align="right"
                    width={224}
                  >
                    <Link
                      to="/dealerLogin"
                      onClick={() => setLoginMenuOpen(false)}
                      className="font-rr block px-5 py-3 text-[11px] uppercase tracking-[0.16em] font-semibold text-white/70 hover:text-white hover:bg-white/[0.06] transition-colors"
                    >
                      Dealer Login
                    </Link>
                    <Link
                      to="/subAdminLogin"
                      onClick={() => setLoginMenuOpen(false)}
                      className="font-rr block px-5 py-3 text-[11px] uppercase tracking-[0.16em] font-semibold text-white/70 hover:text-white hover:bg-white/[0.06] transition-colors"
                    >
                      Sub Admin Login
                    </Link>
                  </PortalDropdown>
                </div>

                <button
                  onClick={() => navigate("/dealerLogin")}
                  aria-label="Login"
                  className="lg:hidden text-white/75 hover:text-white transition-colors duration-300 p-1.5"
                >
                  <User size={18} strokeWidth={1.5} />
                </button>
              </div>
            </div>
          </nav>
        </div>

        {/* ═══ ROW 3 — Sub-nav ═══ */}
        <div
          className={`hidden lg:block overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
            collapsed ? "max-h-0 opacity-0" : "max-h-11 opacity-100"
          }`}
          style={{
            backgroundColor: INK_BG,
            borderBottom: collapsed
              ? "none"
              : "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <div className="max-w-[1600px] w-full mx-auto px-4 sm:px-6 md:px-10 lg:px-16">
            <div className="flex items-stretch h-11">
              {/* Explore dropdown */}
              <div
                className="relative -ml-5"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  ref={exploreBtnRef}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setExploreMenuOpen((v) => !v);
                  }}
                  aria-expanded={exploreMenuOpen}
                  className={`font-rr flex items-center gap-2 px-5 h-full text-[11px] uppercase tracking-[0.14em] font-semibold transition-colors duration-300 ${
                    exploreMenuOpen
                      ? "text-white bg-white/[0.08]"
                      : "text-white/85 hover:text-white bg-white/[0.04]"
                  }`}
                >
                  Explore EnablingEV
                  <ChevronDown
                    size={12}
                    className={`transition-transform duration-300 ${
                      exploreMenuOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                <PortalDropdown
                  open={exploreMenuOpen}
                  anchorRef={exploreBtnRef}
                  align="left"
                  width={256}
                >
                  {EXPLORE_ITEMS.map((item) => (
                    <Link
                      key={item.label}
                      to={item.to}
                      onClick={() => setExploreMenuOpen(false)}
                      className="font-rr block px-5 py-3 text-[11px] uppercase tracking-[0.16em] font-semibold text-white/70 hover:text-white hover:bg-white/[0.06] transition-colors"
                    >
                      {item.label}
                    </Link>
                  ))}
                </PortalDropdown>
              </div>

              {/* Current page name */}
              <div
                className="flex items-center px-6"
                style={{ borderLeft: "1px solid rgba(255,255,255,0.08)" }}
              >
                <span className="font-rr text-[11px] uppercase tracking-[0.14em] font-semibold text-white/70">
                  {currentPageName}
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile menu */}
      <div
        className={`fixed inset-0 z-40 transition-all duration-500 lg:hidden ${
          mobileOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        style={{ backgroundColor: INK_BG }}
      >
        <div className="h-full flex flex-col pt-24 pb-8 px-6 sm:px-8 overflow-y-auto">
          <nav className="flex-1 flex flex-col">
            {LEFT_LINKS.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === "/"}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `block py-3.5 text-xl font-display tracking-tight border-b border-white/[0.05] ${
                    isActive ? "text-white" : "text-white/60 hover:text-white"
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          <div className="pt-8 mt-6 border-t border-white/[0.08] space-y-3">
            <Link
              to="/contact"
              onClick={() => setMobileOpen(false)}
              className="font-rr flex items-center justify-center gap-2 text-center text-[11px] uppercase tracking-[0.16em] font-semibold text-white/85 hover:text-white border border-white/20 rounded-full py-3.5 transition-colors"
            >
              <Headset size={13} /> Contact Us
            </Link>
            <Link
              to="/DealerForm"
              onClick={() => setMobileOpen(false)}
              className="font-rr block text-center text-[11px] uppercase tracking-[0.16em] font-semibold text-white bg-white/[0.06] hover:bg-white/[0.1] border border-white/20 rounded-full py-3.5 transition-colors"
            >
              Become a Dealer
            </Link>
            <div className="grid grid-cols-2 gap-3">
              <Link
                to="/subAdminLogin"
                onClick={() => setMobileOpen(false)}
                className="font-rr text-center text-[11px] uppercase tracking-[0.16em] font-semibold text-white/70 border border-white/15 rounded-full py-3"
              >
                Sub Admin
              </Link>
              <Link
                to="/dealerLogin"
                onClick={() => setMobileOpen(false)}
                className="font-rr text-center text-[11px] uppercase tracking-[0.16em] font-semibold text-white/70 border border-white/15 rounded-full py-3"
              >
                Dealer
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
});

export default Navbar;
