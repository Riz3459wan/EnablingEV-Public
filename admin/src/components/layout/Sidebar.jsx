import { useState, useEffect, useRef, useCallback } from "react";
import { NavLink, useLocation } from "react-router";
import {
  LayoutDashboard,
  Wrench,
  Users,
  FileText,
  ShieldCheck,
  ChevronDown,
  Leaf,
  X,
  PanelLeftClose,
  PanelLeftOpen,
  SlidersHorizontal,
} from "lucide-react";
import BrandMark from "../ui/BrandMark";

const Sidebar = ({ isOpen, onClose, isCollapsed, onToggleCollapse }) => {
  const location = useLocation();
  const sidebarRef = useRef(null);

  const [openSections, setOpenSections] = useState({
    Operations: false,
    Dealers: false,
    Administration: false,
    Reports: false,
    Settings: false,
  });

  const [flyout, setFlyout] = useState(null);
  const buttonRefs = useRef({});

  const menuItems = [
    { title: "Dashboard", icon: LayoutDashboard, path: "/adminDash" },
    {
      title: "Operations",
      icon: Wrench,
      subItems: [
        { title: "Customers", path: "/displayCustomerInfo" },
        { title: "Vehicles", path: "/displayVehicleInfo" },
        { title: "Quotations", path: "/quotations" },
        { title: "Dispatch", path: "/dispatch" },
        { title: "Form 22", path: "/form_22" },
      ],
    },
    {
      title: "Dealers",
      icon: Users,
      subItems: [
        { title: "Dealer List", path: "/dealerInfo" },
        { title: "Pending Requests", path: "/pendingDealerRequests" },
      ],
    },
    {
      title: "Administration",
      icon: ShieldCheck,
      subItems: [
        { title: "Users", path: "/users" },
        { title: "Sub Admins", path: "/subAdminInfo" },
        { title: "Create Sub Admin", path: "/createProfileSubAdmin" },
      ],
    },
    {
      title: "Reports",
      icon: FileText,
      subItems: [
        { title: "Vehicle Reports", path: "/reports/vehicles" },
        { title: "Customer Reports", path: "/reports/customers" },
        { title: "Dealer Reports", path: "/reports/dealers" },
      ],
    },
    {
      title: "Settings",
      icon: SlidersHorizontal,
      subItems: [
        { title: "Profile", path: "/settings/profile" },
        { title: "Security", path: "/settings/security" },
        { title: "Preferences", path: "/settings/preferences" },
      ],
    },
  ];

  const toggleSection = (title) => {
    setOpenSections((prev) => ({ ...prev, [title]: !prev[title] }));
  };

  const handleCollapsedClick = useCallback((item) => {
    setFlyout((prev) => {
      if (prev?.title === item.title) return null;

      const btn = buttonRefs.current[item.title];
      if (!btn) return null;

      const rect = btn.getBoundingClientRect();
      const flyoutEstimatedHeight = 60 + item.subItems.length * 44;
      const viewportHeight = window.innerHeight;

      let top = rect.top;
      if (top + flyoutEstimatedHeight > viewportHeight - 20) {
        top = Math.max(20, viewportHeight - flyoutEstimatedHeight - 20);
      }

      return {
        title: item.title,
        icon: item.icon,
        subItems: item.subItems,
        top,
      };
    });
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (sidebarRef.current && !sidebarRef.current.contains(e.target)) {
        const flyoutEl = document.getElementById("sidebar-flyout");
        if (flyoutEl && flyoutEl.contains(e.target)) return;
        setFlyout(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    setFlyout(null);
  }, [location.pathname]);

  useEffect(() => {
    if (!isCollapsed) setFlyout(null);
  }, [isCollapsed]);

  useEffect(() => {
    const handleScroll = () => setFlyout(null);
    window.addEventListener("scroll", handleScroll, true);
    return () => window.removeEventListener("scroll", handleScroll, true);
  }, []);

  useEffect(() => {
    if (isCollapsed) return;
    const activeSection = menuItems.find((item) =>
      item.subItems?.some(
        (sub) => sub.path !== "#" && location.pathname === sub.path,
      ),
    );
    if (activeSection) {
      setOpenSections((prev) => ({ ...prev, [activeSection.title]: true }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname, isCollapsed]);

  const isParentActive = (item) => {
    if (!item.subItems) return false;
    return item.subItems.some(
      (sub) => sub.path !== "#" && location.pathname === sub.path,
    );
  };

  // ✅ Consistent smooth easing
  const smoothEase = "cubic-bezier(0.4, 0, 0.2, 1)";

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-900/50 z-40 lg:hidden animate-fade-in"
          onClick={onClose}
        />
      )}

      <aside
        ref={sidebarRef}
        style={{
          transitionProperty: "width, transform",
          transitionDuration: "300ms",
          transitionTimingFunction: smoothEase,
        }}
        className={`h-screen bg-[#0f172a] text-slate-300 flex flex-col fixed left-0 top-0 border-r border-slate-800 z-40 ${
          isCollapsed ? "w-20" : "w-64"
        } ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
      >
        {/* ── Header ── */}
        <div
          style={{
            transitionProperty: "padding",
            transitionDuration: "300ms",
            transitionTimingFunction: smoothEase,
          }}
          className={`h-16 sm:h-20 flex items-center border-b border-slate-800 shrink-0 ${
            isCollapsed ? "justify-center px-3" : "justify-between px-6"
          }`}
        >
          <div className="flex items-center gap-2.5 group">
            <BrandMark className="h-8 w-auto shrink-0 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6" />

            {/* ✅ Label: fade + width transition instead of mount/unmount */}
            <span
              style={{
                transitionProperty: "opacity, max-width, margin-left",
                transitionDuration: "300ms",
                transitionTimingFunction: smoothEase,
              }}
              className={`font-semibold text-white text-lg tracking-tight whitespace-nowrap overflow-hidden ${
                isCollapsed
                  ? "opacity-0 max-w-0 ml-0 pointer-events-none"
                  : "opacity-100 max-w-[200px] ml-0"
              }`}
            >
              EVConnect
            </span>
          </div>

          {!isCollapsed && (
            <button
              onClick={onClose}
              style={{
                transitionProperty: "opacity, transform",
                transitionDuration: "200ms",
              }}
              className="lg:hidden p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg active:scale-90"
              aria-label="Close menu"
            >
              <X size={18} />
            </button>
          )}
        </div>

        {/* ── Collapse Toggle Button ── */}
        <button
          onClick={onToggleCollapse}
          className="hidden lg:flex absolute -right-3 top-24 z-10 w-6 h-6 rounded-full bg-blue-600 hover:bg-blue-700 text-white items-center justify-center shadow-lg shadow-blue-500/40 transition-all duration-300 hover:scale-110 active:scale-95"
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? (
            <PanelLeftOpen size={12} />
          ) : (
            <PanelLeftClose size={12} />
          )}
        </button>

        {/* ── Nav ── */}
        <nav
          style={{
            transitionProperty: "padding",
            transitionDuration: "300ms",
            transitionTimingFunction: smoothEase,
          }}
          className={`flex-1 py-4 space-y-1 overflow-y-auto ${
            isCollapsed ? "px-2" : "px-3"
          }`}
        >
          {menuItems.map((item, idx) => {
            const parentActive = isParentActive(item);

            if (item.subItems) {
              const isExpanded = openSections[item.title] && !isCollapsed;
              const isFlyoutOpen = flyout?.title === item.title;

              return (
                <div
                  key={item.title}
                  className="relative"
                  style={{
                    animation: `slide-in-left 0.4s cubic-bezier(0.16, 1, 0.3, 1) ${idx * 60}ms both`,
                  }}
                >
                  <button
                    ref={(el) => {
                      buttonRefs.current[item.title] = el;
                    }}
                    onClick={() =>
                      isCollapsed
                        ? handleCollapsedClick(item)
                        : toggleSection(item.title)
                    }
                    style={{
                      transitionProperty: "background-color, color, padding",
                      transitionDuration: "200ms",
                      transitionTimingFunction: smoothEase,
                    }}
                    className={`relative w-full flex items-center rounded-md group ${
                      isCollapsed
                        ? "justify-center py-2.5 px-2"
                        : "justify-between px-3 py-2.5"
                    } ${
                      parentActive || isFlyoutOpen
                        ? "text-white bg-slate-800/70"
                        : "text-slate-400 hover:text-white hover:bg-slate-800/60"
                    }`}
                    title={isCollapsed ? item.title : ""}
                  >
                    <div
                      className={`flex items-center gap-3 min-w-0 ${
                        isCollapsed ? "justify-center" : ""
                      }`}
                    >
                      <item.icon
                        size={18}
                        className={`shrink-0 transition-all duration-300 ${
                          parentActive || isFlyoutOpen
                            ? "text-blue-400 scale-110"
                            : "group-hover:text-blue-300 group-hover:scale-110"
                        }`}
                      />

                      {/* ✅ Label: fade + max-width transition */}
                      <span
                        style={{
                          transitionProperty: "opacity, max-width, margin-left",
                          transitionDuration: "300ms",
                          transitionTimingFunction: smoothEase,
                        }}
                        className={`truncate whitespace-nowrap overflow-hidden ${
                          isCollapsed
                            ? "opacity-0 max-w-0 ml-0"
                            : "opacity-100 max-w-[200px]"
                        }`}
                      >
                        {item.title}
                      </span>
                    </div>

                    {/* ✅ Chevron: fade + rotate */}
                    <ChevronDown
                      size={14}
                      style={{
                        transitionProperty: "opacity, transform",
                        transitionDuration: "300ms",
                        transitionTimingFunction: smoothEase,
                      }}
                      className={`shrink-0 ${
                        isCollapsed ? "opacity-0 w-0" : "opacity-100"
                      } ${isExpanded ? "rotate-0" : "-rotate-90"} ${
                        parentActive ? "text-blue-400" : ""
                      }`}
                    />

                    {(parentActive || isFlyoutOpen) && (
                      <span
                        style={{
                          transitionProperty: "opacity, transform",
                          transitionDuration: "300ms",
                        }}
                        className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-6 bg-blue-500 rounded-r-full"
                      />
                    )}
                  </button>

                  {/* ── Expanded mode: inline sub-items ── */}
                  <div
                    style={{
                      transitionProperty: "grid-template-rows, opacity, margin",
                      transitionDuration: "300ms",
                      transitionTimingFunction: smoothEase,
                    }}
                    className={`grid ${
                      !isCollapsed && isExpanded
                        ? "grid-rows-[1fr] opacity-100 mt-1"
                        : "grid-rows-[0fr] opacity-0 mt-0"
                    }`}
                  >
                    <div className="overflow-hidden">
                      <div className="ml-4 pl-3 border-l border-slate-800 space-y-1">
                        {item.subItems.map((sub, subIdx) => (
                          <NavLink
                            key={sub.title}
                            to={sub.path}
                            onClick={onClose}
                            style={{
                              animation: isExpanded
                                ? `slide-in-left 0.4s cubic-bezier(0.16, 1, 0.3, 1) ${subIdx * 40}ms both`
                                : "none",
                            }}
                            className={({ isActive }) =>
                              `group relative block px-3 py-2 text-sm rounded-md transition-all duration-200 ${
                                isActive && sub.path !== "#"
                                  ? "bg-blue-600/20 text-blue-400 font-medium translate-x-1"
                                  : "text-slate-400 hover:text-white hover:bg-slate-800 hover:translate-x-1"
                              }`
                            }
                          >
                            <span
                              className={`absolute top-1/2 -translate-y-1/2 w-1 h-1 rounded-full transition-all duration-300 ${
                                sub.path === location.pathname
                                  ? "bg-blue-400 scale-150"
                                  : "bg-slate-600 group-hover:bg-slate-400 group-hover:scale-125"
                              }`}
                              style={{ left: "-7px" }}
                            />
                            {sub.title}
                          </NavLink>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              );
            }

            // ── Single Link (Dashboard) ──
            const isActiveLink = location.pathname === item.path;
            return (
              <NavLink
                key={item.title}
                to={item.path}
                onClick={onClose}
                title={isCollapsed ? item.title : ""}
                style={{
                  transitionProperty: "background-color, color, padding",
                  transitionDuration: "200ms",
                  transitionTimingFunction: smoothEase,
                  animation: `slide-in-left 0.4s cubic-bezier(0.16, 1, 0.3, 1) ${idx * 60}ms both`,
                }}
                className={({ isActive }) =>
                  `relative flex items-center rounded-md group overflow-hidden ${
                    isCollapsed
                      ? "justify-center py-2.5 px-2"
                      : "gap-3 px-3 py-2.5"
                  } ${
                    isActive
                      ? "bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-500/30"
                      : "text-slate-400 hover:text-white hover:bg-slate-800"
                  }`
                }
              >
                <item.icon
                  size={18}
                  className={`shrink-0 transition-all duration-300 ${
                    isActiveLink
                      ? "scale-110"
                      : "group-hover:scale-110 group-hover:rotate-6"
                  }`}
                />

                {/* ✅ Label: fade + max-width */}
                <span
                  style={{
                    transitionProperty: "opacity, max-width",
                    transitionDuration: "300ms",
                    transitionTimingFunction: smoothEase,
                  }}
                  className={`truncate whitespace-nowrap overflow-hidden ${
                    isCollapsed
                      ? "opacity-0 max-w-0"
                      : "opacity-100 max-w-[200px]"
                  }`}
                >
                  {item.title}
                </span>

                {isActiveLink && (
                  <span className="absolute inset-0 -translate-x-full animate-sidebar-shine bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none" />
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* ── Bottom promo ── */}
        <div
          style={{
            transitionProperty: "padding, margin",
            transitionDuration: "300ms",
            transitionTimingFunction: smoothEase,
          }}
          className={`rounded-xl bg-slate-800/50 border border-slate-700/50 shrink-0 group cursor-default hover:bg-slate-800/70 hover:border-slate-600/60 ${
            isCollapsed ? "p-2 m-2 mx-3" : "p-4 m-3"
          }`}
        >
          {isCollapsed ? (
            <div className="flex justify-center">
              <Leaf
                size={16}
                className="text-green-400 transition-transform duration-500 group-hover:rotate-12 group-hover:scale-110"
              />
            </div>
          ) : (
            <>
              <div className="flex items-center gap-2 mb-2">
                <Leaf
                  size={16}
                  className="text-green-400 transition-transform duration-500 group-hover:rotate-12 group-hover:scale-110"
                />
                <span className="text-xs font-semibold text-white whitespace-nowrap">
                  Sustainable Mobility
                </span>
              </div>
              <p className="text-[10px] text-slate-400 whitespace-nowrap">
                A Greener Tomorrow
              </p>
            </>
          )}
        </div>
      </aside>

      {/* ═══════════════════════════════════════════════════ */}
      {/*  FLYOUT — fixed positioning, above everything else */}
      {/* ═══════════════════════════════════════════════════ */}
      {isCollapsed && flyout && (
        <div
          id="sidebar-flyout"
          className="fixed z-[60] animate-slide-in-left"
          style={{
            left: "88px",
            top: `${flyout.top}px`,
          }}
        >
          <div className="min-w-[220px] bg-[#0f172a] border border-slate-700 rounded-xl shadow-2xl shadow-slate-900/60 overflow-hidden">
            <div className="px-4 py-3 border-b border-slate-800 bg-slate-800/60 flex items-center gap-2">
              <flyout.icon size={14} className="text-blue-400" />
              <span className="text-xs font-bold uppercase tracking-widest text-blue-400">
                {flyout.title}
              </span>
            </div>

            <div className="py-1.5 max-h-[60vh] overflow-y-auto">
              {flyout.subItems.map((sub, subIdx) => (
                <NavLink
                  key={sub.title}
                  to={sub.path}
                  onClick={() => {
                    setFlyout(null);
                    onClose();
                  }}
                  style={{
                    animation: `slide-in-left 0.3s cubic-bezier(0.16, 1, 0.3, 1) ${subIdx * 40}ms both`,
                  }}
                  className={({ isActive }) =>
                    `block px-4 py-2.5 text-sm transition-all duration-200 border-l-2 ${
                      isActive && sub.path !== "#"
                        ? "bg-blue-600/20 text-blue-400 font-medium border-blue-500"
                        : "text-slate-400 hover:text-white hover:bg-slate-800 hover:border-blue-400/50 border-transparent"
                    }`
                  }
                >
                  {sub.title}
                </NavLink>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;
