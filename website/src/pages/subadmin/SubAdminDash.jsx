import { Link } from "react-router";
import {
  Truck,
  ListChecks,
  Users,
  ShieldCheck,
  FileText,
  Activity,
  TrendingUp,
  Clock,
} from "lucide-react";
import DashboardLayout from "../../components/dashboard/DashboardLayout";
import { useAuth } from "../../auth/AuthContext";

const stats = [
  {
    label: "Total Vehicles",
    value: "1,248",
    change: "+12%",
    icon: Truck,
    color: "text-blue-600 bg-blue-50",
  },
  {
    label: "Active Dealers",
    value: "86",
    change: "+8%",
    icon: Users,
    color: "text-purple-600 bg-purple-50",
  },
  {
    label: "Quotations",
    value: "432",
    change: "+15%",
    icon: FileText,
    color: "text-green-600 bg-green-50",
  },
  {
    label: "Pending",
    value: "24",
    change: "-5%",
    icon: Clock,
    color: "text-orange-600 bg-orange-50",
  },
];

const tools = [
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
  const { role } = useAuth();

  return (
    <DashboardLayout title="Sub Admin Dashboard">
      {/* Welcome Banner */}
      <div className="relative bg-gradient-to-r from-[#0f172a] via-[#134e4a] to-[#0f766e] rounded-2xl p-6 sm:p-8 mb-6 text-white overflow-hidden">
        <div className="relative z-10">
          <p className="text-sm text-white/70 mb-1">Welcome back 👋</p>
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">
            Sub Admin Portal
          </h1>
          <p className="text-sm text-white/80 max-w-lg">
            Manage vehicles, dealers, and quotations across the entire network.
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map(({ label, value, change, icon: Icon, color }) => (
          <div
            key={label}
            className="bg-white border border-border rounded-xl p-4"
          >
            <div className="flex items-center justify-between mb-3">
              <div
                className={`w-10 h-10 rounded-lg ${color} flex items-center justify-center`}
              >
                <Icon size={20} />
              </div>
              <span
                className={`text-xs font-semibold ${change.startsWith("+") ? "text-green-600" : "text-red-500"}`}
              >
                {change}
              </span>
            </div>
            <p className="text-2xl font-bold text-foreground">{value}</p>
            <p className="text-xs text-muted-foreground">{label}</p>
          </div>
        ))}
      </div>

      {/* Tools Grid */}
      <div className="bg-white border border-border rounded-xl p-6">
        <h2 className="font-bold text-foreground mb-1">Quick Actions</h2>
        <p className="text-xs text-muted-foreground mb-4">
          Jump into your key business tasks
        </p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {tools.map(({ to, icon: Icon, title, description }) => (
            <Link
              key={to}
              to={to}
              className="group border border-border rounded-lg p-5 hover:border-primary hover:bg-primary/5 transition-all"
            >
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-3 group-hover:bg-primary/20 transition-colors">
                <Icon size={20} className="text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-1 text-sm">
                {title}
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {description}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default SubAdminDash;
