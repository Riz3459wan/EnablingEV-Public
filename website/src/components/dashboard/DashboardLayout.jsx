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
} from "lucide-react";
import { useAuth } from "../../auth/AuthContext";
import BrandMark from "../ui/BrandMark";

const NAV_ITEMS = [
  { to: "/dealerDash", icon: Home, label: "Dashboard" },
  {
    section: "My Business",
    items: [
      { to: "/dealerCustomerInfo", icon: Users, label: "Customers" },
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

const DashboardLayout = ({
  children,
  title,
  subtitle,
  dealerName,
  dealerCode,
}) => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/dealerLogin");
  };

  return (
    <div className="min-h-screen flex bg-[#f8fafc]">
      {/* Sidebar */}
      <aside className="hidden lg:flex w-64 bg-[#0f172a] text-white flex-col fixed h-full">
        {/* Logo */}
        <div className="p-5 border-b border-white/10">
          <Link to="/dealerDash" className="flex items-center gap-2">
            <BrandMark className="h-8 w-8" />
            <span className="font-display font-bold text-lg">
              EV<span className="text-primary">Connect</span>
            </span>
          </Link>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-6">
          {NAV_ITEMS.map((item, idx) => {
            if (item.section) {
              return (
                <div key={idx}>
                  <p className="text-xs uppercase tracking-wider text-white/40 font-semibold mb-2 px-3">
                    {item.section}
                  </p>
                  <ul className="space-y-1">
                    {item.items.map((sub) => {
                      const isActive = location.pathname === sub.to;
                      return (
                        <li key={sub.label}>
                          <Link
                            to={sub.to}
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                              isActive
                                ? "bg-primary text-white"
                                : "text-white/70 hover:bg-white/5 hover:text-white"
                            }`}
                          >
                            <sub.icon size={18} />
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
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                  isActive
                    ? "bg-primary text-white"
                    : "text-white/70 hover:bg-white/5 hover:text-white"
                }`}
              >
                <item.icon size={18} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Grow business card */}
        <div className="p-4 border-t border-white/10">
          <div className="bg-white/5 rounded-xl p-4 text-center">
            <p className="font-semibold text-sm mb-1">Grow Your Business</p>
            <p className="text-xs text-white/60 mb-3">
              More customers. More sales.
            </p>
            <button className="w-full bg-primary hover:bg-primary-hover text-white text-xs font-semibold py-2 rounded-lg transition-colors">
              Get Support
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 lg:ml-64">
        {/* Top bar */}
        <header className="bg-white border-b border-border sticky top-0 z-40">
          <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 h-16">
            <div className="flex items-center gap-3 flex-1">
              <button className="lg:hidden text-foreground">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
              <div className="relative max-w-md flex-1">
                <Search
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                />
                <input
                  type="text"
                  placeholder="Search customers, vehicles, quotations..."
                  className="w-full bg-gray-50 border border-border rounded-lg pl-10 pr-4 py-2 text-sm outline-none focus:border-primary"
                />
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button className="relative p-2 text-muted-foreground hover:text-primary transition-colors">
                <Bell size={20} />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                  {(dealerName || "D").charAt(0).toUpperCase()}
                </div>
                <div className="hidden sm:block">
                  <p className="text-sm font-semibold text-foreground leading-tight">
                    {dealerName || "Dealer"}
                  </p>
                  <p className="text-xs text-muted-foreground">Dealer</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
};

export default DashboardLayout;
