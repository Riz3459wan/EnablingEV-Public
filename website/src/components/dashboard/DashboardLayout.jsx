import { Link, useLocation, useNavigate } from "react-router";
import {
  Home,
  Users,
  Truck,
  FileText,
  FileCheck2,
  Settings,
  Shield,
  Bell,
  LogOut,
  Search,
  Menu,
  X,
  ListChecks,
  Activity,
  ShieldCheck,
  UserPlus,
} from "lucide-react";
import { useState } from "react";
import { useAuth } from "../../auth/AuthContext";
import Wordmark from "../ui/Wordmark";

// ─── NAV ITEMS — role-aware ──────────────────────────────────
const DEALER_NAV = [
  { to: "/dealerDash", icon: Home, label: "Dashboard" },
  {
    section: "My Business",
    items: [
      { to: "/customerForm", icon: UserPlus, label: "Add Customer" },
      { to: "/dealerCustomerInfo", icon: Users, label: "My Customers" },
      { to: "/displayVehicleInfo", icon: Truck, label: "Vehicles" },
      { to: "/createQuotation", icon: FileText, label: "Quotations" },
    ],
  },
  {
    section: "Documents",
    items: [
      { to: "/form_22", icon: FileCheck2, label: "Form 22" },
      { to: "/document", icon: FileText, label: "Certificates" },
    ],
  },
  {
    section: "Settings",
    items: [
      { to: "#", icon: Settings, label: "Profile" },
      { to: "#", icon: Shield, label: "Security" },
    ],
  },
];

const SUBADMIN_NAV = [
  { to: "/subAdminDash", icon: Home, label: "Dashboard" },
  {
    section: "Inventory",
    items: [
      { to: "/VehicleInfo", icon: Truck, label: "Add Vehicle" },
      { to: "/displayVehicleInfo", icon: ListChecks, label: "Vehicle Info" },
      { to: "/vehicleStatus", icon: Activity, label: "Vehicle Status" },
    ],
  },
  {
    section: "Network",
    items: [
      { to: "/dealerInfo", icon: Users, label: "Dealer Info" },
      { to: "/subAdminInfo", icon: ShieldCheck, label: "Sub Admin Info" },
      { to: "/allCustomers", icon: Users, label: "All Customers" },
    ],
  },
  {
    section: "Quotations",
    items: [
      { to: "/createQuotation", icon: FileText, label: "Quotations" },
      { to: "/form_22", icon: FileCheck2, label: "Form 22" },
      { to: "/document", icon: FileText, label: "Certificates" },
    ],
  },
  {
    section: "Settings",
    items: [
      { to: "#", icon: Settings, label: "Profile" },
      { to: "#", icon: Shield, label: "Security" },
    ],
  },
];

const DashboardLayout = ({ children, dealerName, dealerCode }) => {
  const { logout, role } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isDealer = role === "dealer";
  const isSubAdmin = role === "subadmin";

  const NAV_ITEMS = isDealer ? DEALER_NAV : SUBADMIN_NAV;
  const homePath = isDealer ? "/dealerDash" : "/subAdminDash";
  const roleLabel = isDealer ? "Dealer" : isSubAdmin ? "Sub Admin" : "User";
  const logoutPath = isDealer ? "/dealerLogin" : "/subAdminLogin";

  const handleLogout = () => {
    logout();
    navigate(logoutPath);
  };

  return (
    <div className="min-h-screen flex bg-[#0d0e10]">
      {/* ─── Sidebar (desktop) ─── */}
      <aside className="hidden lg:flex w-64 bg-[#0a0b0d] text-white flex-col fixed h-full border-r border-white/[0.06]">
        <div className="px-6 py-5 border-b border-white/[0.06]">
          <Link
            to={homePath}
            className="flex items-center text-white hover:opacity-90 transition-opacity duration-300"
          >
            <Wordmark size="sm" />
          </Link>
        </div>

        <nav className="flex-1 overflow-y-auto p-4 space-y-6">
          {NAV_ITEMS.map((item, idx) => {
            if (item.section) {
              return (
                <div key={idx}>
                  <p className="text-[10px] uppercase tracking-[0.28em] text-white/30 font-semibold mb-2.5 px-3 font-rr">
                    {item.section}
                  </p>
                  <ul className="space-y-1">
                    {item.items.map((sub) => {
                      const isActive = location.pathname === sub.to;
                      return (
                        <li key={sub.label}>
                          <Link
                            to={sub.to}
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors font-rr tracking-[0.02em] ${
                              isActive
                                ? "bg-primary text-ink font-semibold"
                                : "text-white/60 hover:bg-white/[0.05] hover:text-white"
                            }`}
                          >
                            <sub.icon size={16} strokeWidth={1.75} />
                            {sub.label}
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              );
            }
            const isActive = location.pathname === item.to;
            return (
              <Link
                key={item.label}
                to={item.to}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors font-rr tracking-[0.02em] ${
                  isActive
                    ? "bg-primary text-ink font-semibold"
                    : "text-white/60 hover:bg-white/[0.05] hover:text-white"
                }`}
              >
                <item.icon size={16} strokeWidth={1.75} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/[0.06]">
          <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-4">
            <p className="font-rr text-[11px] uppercase tracking-[0.14em] font-semibold text-white/80 mb-2">
              {isDealer ? "Grow Your Business" : "Need Help?"}
            </p>
            <p className="text-xs text-white/45 mb-3 leading-relaxed">
              {isDealer
                ? "More customers. More sales."
                : "Contact support for help."}
            </p>
            <button className="w-full bg-primary hover:bg-primary-hover text-ink text-[11px] uppercase tracking-[0.14em] font-semibold py-2.5 rounded-lg transition-colors">
              Get Support
            </button>
          </div>
        </div>
      </aside>

      {/* ─── Mobile sidebar overlay ─── */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-[#0a0b0d] text-white z-50 border-r border-white/[0.06] transform transition-transform duration-300 lg:hidden ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="px-6 py-5 border-b border-white/[0.06] flex items-center justify-between">
          <Link
            to={homePath}
            onClick={() => setMobileOpen(false)}
            className="flex items-center text-white"
          >
            <Wordmark size="sm" />
          </Link>
          <button
            onClick={() => setMobileOpen(false)}
            className="text-white/60 hover:text-white p-1"
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="overflow-y-auto p-4 space-y-6 h-[calc(100%-73px)]">
          {NAV_ITEMS.map((item, idx) => {
            if (item.section) {
              return (
                <div key={idx}>
                  <p className="text-[10px] uppercase tracking-[0.28em] text-white/30 font-semibold mb-2.5 px-3 font-rr">
                    {item.section}
                  </p>
                  <ul className="space-y-1">
                    {item.items.map((sub) => {
                      const isActive = location.pathname === sub.to;
                      return (
                        <li key={sub.label}>
                          <Link
                            to={sub.to}
                            onClick={() => setMobileOpen(false)}
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                              isActive
                                ? "bg-primary text-ink font-semibold"
                                : "text-white/60 hover:bg-white/[0.05] hover:text-white"
                            }`}
                          >
                            <sub.icon size={16} strokeWidth={1.75} />
                            {sub.label}
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              );
            }
            const isActive = location.pathname === item.to;
            return (
              <Link
                key={item.label}
                to={item.to}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                  isActive
                    ? "bg-primary text-ink font-semibold"
                    : "text-white/60 hover:bg-white/[0.05] hover:text-white"
                }`}
              >
                <item.icon size={16} strokeWidth={1.75} />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* ─── Main content ─── */}
      <div className="flex-1 lg:ml-64">
        <header className="bg-[#0d0e10] border-b border-white/[0.06] sticky top-0 z-30">
          <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 h-16">
            <div className="flex items-center gap-3 flex-1">
              <button
                onClick={() => setMobileOpen(true)}
                className="lg:hidden text-white/70 hover:text-white transition-colors p-1"
                aria-label="Open menu"
              >
                <Menu size={20} />
              </button>

              <div className="relative max-w-md flex-1">
                <Search
                  size={16}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none"
                />
                <input
                  type="text"
                  placeholder="Search customers, vehicles, quotations..."
                  className="w-full bg-white/[0.03] border border-white/[0.08] rounded-lg pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-white/30 outline-none focus:border-primary/60 focus:bg-white/[0.05] transition-colors"
                />
              </div>
            </div>

            <div className="flex items-center gap-3 sm:gap-4">
              <button
                className="relative p-2 text-white/60 hover:text-primary transition-colors"
                aria-label="Notifications"
              >
                <Bell size={18} strokeWidth={1.75} />
                <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-red-500 rounded-full"></span>
              </button>

              <div className="hidden sm:flex items-center gap-3 pl-3 border-l border-white/[0.08]">
                <div className="w-9 h-9 rounded-full bg-primary/15 border border-primary/30 flex items-center justify-center text-primary font-bold text-sm font-rr">
                  {(dealerName || roleLabel || "U").charAt(0).toUpperCase()}
                </div>
                <div className="text-left">
                  <p className="text-sm font-semibold text-white leading-tight font-rr tracking-[0.02em]">
                    {dealerName || roleLabel}
                  </p>
                  <p className="text-[10px] uppercase tracking-[0.18em] text-white/40 font-rr mt-0.5">
                    {roleLabel}
                  </p>
                </div>
              </div>

              <button
                onClick={handleLogout}
                className="hidden sm:flex items-center gap-1.5 text-white/60 hover:text-white transition-colors p-2"
                aria-label="Logout"
                title="Logout"
              >
                <LogOut size={16} strokeWidth={1.75} />
              </button>
            </div>
          </div>
        </header>

        <main className="p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
};

export default DashboardLayout;
