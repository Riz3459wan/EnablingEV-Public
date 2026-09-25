import { Link } from "react-router";
import {
  Truck,
  ListChecks,
  Users,
  ShieldCheck,
  FileText,
  Activity,
} from "lucide-react";
import DashboardLayout from "../../components/dashboard/DashboardLayout";

const STATS = [
  {
    label: "Total Vehicles",
    value: "1,248",
    change: "+12%",
    icon: Truck,
    accent: "blue",
  },
  {
    label: "Active Dealers",
    value: "86",
    change: "+8%",
    icon: Users,
    accent: "purple",
  },
  {
    label: "Quotations",
    value: "432",
    change: "+15%",
    icon: FileText,
    accent: "green",
  },
  {
    label: "Pending",
    value: "24",
    change: "-5%",
    icon: Activity,
    accent: "orange",
  },
];

const TOOLS = [
  {
    to: "/VehicleInfo",
    icon: Truck,
    title: "Add Vehicle",
    description: "Register a newly manufactured vehicle's chassis and specs.",
  },
  {
    to: "/displayVehicleInfo",
    icon: ListChecks,
    title: "Vehicle Info",
    description: "Browse dispatched vehicles across all dealers.",
  },
  {
    to: "/vehicleStatus",
    icon: Activity,
    title: "Vehicle Status",
    description:
      "Track every vehicle's stage — in stock, assigned, or dispatched.",
  },
  {
    to: "/dealerInfo",
    icon: Users,
    title: "Dealer Info",
    description: "Browse registered dealer records.",
  },
  {
    to: "/subAdminInfo",
    icon: ShieldCheck,
    title: "Sub Admin Info",
    description: "Browse sub-admin accounts.",
  },
  {
    to: "/createQuotation",
    icon: FileText,
    title: "Create Quotation",
    description: "Prepare a quotation on behalf of a dealer.",
  },
];

const SubAdminDash = () => {
  return (
    <DashboardLayout dealerName="Sub Admin">
      {/* Welcome Banner */}
      <div className="relative bg-gradient-to-br from-[#0f172a] via-[#134e4a] to-[#0f766e] rounded-2xl p-6 sm:p-8 mb-6 text-white overflow-hidden border border-white/[0.06]">
        <div className="pointer-events-none absolute -top-20 -right-20 w-64 h-64 rounded-full bg-primary/[0.15] blur-[80px]" />
        <div className="relative z-10">
          <p className="text-[11px] uppercase tracking-[0.2em] font-semibold text-white/60 font-rr mb-2">
            Welcome back
          </p>
          <h1 className="font-display uppercase text-2xl sm:text-3xl leading-[1.05] tracking-[-0.01em] mb-3">
            Sub Admin Portal
          </h1>
          <p className="text-sm text-white/70 max-w-lg leading-relaxed">
            Manage vehicles, dealers, and quotations across the entire network.
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {STATS.map(({ label, value, change, icon: Icon, accent }) => (
          <StatCard
            key={label}
            label={label}
            value={value}
            change={change}
            icon={Icon}
            accent={accent}
          />
        ))}
      </div>

      {/* Tools Grid */}
      <div className="bg-white/[0.02] border border-white/[0.08] rounded-xl p-5 sm:p-6">
        <h2 className="font-display uppercase text-base sm:text-lg tracking-[-0.01em] text-white mb-1">
          Quick Actions
        </h2>
        <p className="text-[11px] text-white/40 mb-5">
          Jump into your key business tasks
        </p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {TOOLS.map(({ to, icon: Icon, title, description }) => (
            <Link
              key={to}
              to={to}
              className="group border border-white/[0.08] rounded-xl p-5 hover:border-primary/40 hover:bg-primary/[0.04] transition-all"
            >
              <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center mb-3 group-hover:bg-primary/20 transition-colors">
                <Icon size={18} className="text-primary" strokeWidth={1.75} />
              </div>
              <h3 className="font-semibold text-white mb-1 text-sm font-rr tracking-[0.02em]">
                {title}
              </h3>
              <p className="text-[11px] text-white/40 leading-relaxed">
                {description}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

const StatCard = ({ label, value, change, icon: Icon, accent }) => {
  const accents = {
    blue: "text-blue-400 bg-blue-500/10 border-blue-500/20",
    purple: "text-purple-400 bg-purple-500/10 border-purple-500/20",
    green: "text-primary bg-primary/10 border-primary/20",
    orange: "text-orange-400 bg-orange-500/10 border-orange-500/20",
  };

  const changePositive = change.startsWith("+");

  return (
    <div className="bg-white/[0.02] border border-white/[0.08] rounded-xl p-4 sm:p-5 hover:border-white/[0.15] transition-colors">
      <div className="flex items-center justify-between mb-3">
        <div
          className={`w-9 h-9 rounded-lg border flex items-center justify-center ${accents[accent]}`}
        >
          <Icon size={16} strokeWidth={1.75} />
        </div>
        <span
          className={`text-[11px] font-semibold font-rr tabular-nums ${
            changePositive ? "text-primary" : "text-red-400"
          }`}
        >
          {change}
        </span>
      </div>
      <p className="text-2xl font-bold text-white font-rr tabular-nums leading-none mb-1.5">
        {value}
      </p>
      <p className="text-[10px] uppercase tracking-[0.18em] font-semibold text-white/40 font-rr">
        {label}
      </p>
    </div>
  );
};

export default SubAdminDash;
