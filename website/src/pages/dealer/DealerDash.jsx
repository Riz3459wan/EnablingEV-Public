import { Link } from "react-router";
import {
  UserPlus,
  FileText,
  FileCheck2,
  Truck,
  Users,
  TrendingUp,
  CheckCircle2,
  Clock,
  MapPin,
  ArrowRight,
} from "lucide-react";
import { useDealerInfo } from "../../auth/useDealerInfo";
import DashboardLayout from "../../components/dashboard/DashboardLayout";

const stats = [
  {
    label: "My Customers",
    value: "128",
    change: "+12%",
    icon: Users,
    color: "text-blue-600 bg-blue-50",
  },
  {
    label: "My Vehicles",
    value: "46",
    change: "+8%",
    icon: Truck,
    color: "text-purple-600 bg-purple-50",
  },
  {
    label: "My Quotations",
    value: "32",
    change: "+15%",
    icon: FileText,
    color: "text-green-600 bg-green-50",
  },
  {
    label: "Pending Quotations",
    value: "7",
    change: "-5%",
    icon: Clock,
    color: "text-orange-600 bg-orange-50",
  },
];

const quickActions = [
  {
    to: "/customerForm",
    icon: UserPlus,
    label: "Add Customer",
    desc: "Register a new customer",
  },
  {
    to: "/createQuotation",
    icon: FileText,
    label: "Create Quotation",
    desc: "Generate new quotation",
  },
  {
    to: "/form_22",
    icon: FileCheck2,
    label: "Generate Form 22",
    desc: "Vehicle document",
  },
  {
    to: "/displayVehicleInfo",
    icon: Truck,
    label: "View Vehicles",
    desc: "Check your inventory",
  },
];

const recentCustomers = [
  {
    name: "Rahul Kumar",
    phone: "+91 98765 43210",
    vehicle: "E-Rickshaw",
    date: "Today, 10:24 AM",
    initial: "RK",
    color: "bg-orange-500",
  },
  {
    name: "Amit Singh",
    phone: "+91 87654 32109",
    vehicle: "Loader",
    date: "Today, 09:15 AM",
    initial: "AS",
    color: "bg-gray-700",
  },
  {
    name: "Pooja Sharma",
    phone: "+91 91234 56789",
    vehicle: "E-Auto",
    date: "Yesterday, 05:32 PM",
    initial: "PS",
    color: "bg-orange-500",
  },
  {
    name: "Mohit Kumar",
    phone: "+91 99887 77665",
    vehicle: "E-Rickshaw",
    date: "Yesterday, 02:17 PM",
    initial: "MK",
    color: "bg-purple-600",
  },
];

const recentQuotations = [
  {
    customer: "Rahul Kumar",
    vehicle: "E-Rickshaw",
    amount: "2,45,000",
    status: "Approved",
    statusColor: "bg-green-100 text-green-700",
  },
  {
    customer: "Amit Singh",
    vehicle: "E-Loader",
    amount: "3,10,000",
    status: "Pending",
    statusColor: "bg-orange-100 text-orange-700",
  },
  {
    customer: "Pooja Sharma",
    vehicle: "E-Auto",
    amount: "4,50,000",
    status: "Pending",
    statusColor: "bg-orange-100 text-orange-700",
  },
  {
    customer: "Mohit Kumar",
    vehicle: "E-Rickshaw",
    amount: "2,30,000",
    status: "Approved",
    statusColor: "bg-green-100 text-green-700",
  },
];

const DealerDash = () => {
  const { dealerInfo, dealerCode } = useDealerInfo();
  const name = dealerInfo?.name || "Dealer";

  return (
    <DashboardLayout dealerName={name} dealerCode={dealerCode}>
      {/* Welcome Banner */}
      <div className="relative bg-gradient-to-r from-[#0f172a] via-[#134e4a] to-[#0f766e] rounded-2xl p-6 sm:p-8 mb-6 text-white overflow-hidden">
        <div className="relative z-10">
          <p className="text-sm text-white/70 mb-1">Good Morning, {name} 👋</p>
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">
            Welcome to Your Dealer Portal
          </h1>
          <p className="text-sm text-white/80 max-w-lg mb-4">
            Manage your customers, vehicles, quotations and grow your business —
            all in one place.
          </p>
          <div className="flex flex-wrap items-center gap-4 text-xs">
            <span className="flex items-center gap-1.5">
              <MapPin size={12} /> {dealerInfo?.dist || "Patna"},{" "}
              {dealerInfo?.state || "Bihar"}
            </span>
            <span className="bg-green-500/20 border border-green-400/30 rounded-full px-2.5 py-1 text-green-300 font-semibold">
              Active
            </span>
          </div>
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

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Quick Actions */}
          <div className="bg-white border border-border rounded-xl p-6">
            <h2 className="font-bold text-foreground mb-1">Quick Actions</h2>
            <p className="text-xs text-muted-foreground mb-4">
              Jump into your key business tasks
            </p>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              {quickActions.map(({ to, icon: Icon, label, desc }) => (
                <Link
                  key={label}
                  to={to}
                  className="group border border-border rounded-lg p-4 hover:border-primary hover:bg-primary/5 transition-all"
                >
                  <Icon size={20} className="text-primary mb-2" />
                  <p className="text-sm font-semibold text-foreground mb-0.5">
                    {label}
                  </p>
                  <p className="text-xs text-muted-foreground">{desc}</p>
                </Link>
              ))}
            </div>
          </div>

          {/* Recent Customers */}
          <div className="bg-white border border-border rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-foreground">Recent Customers</h2>
              <Link
                to="/dealerCustomerInfo"
                className="text-xs text-primary font-semibold hover:underline"
              >
                View all →
              </Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-xs text-muted-foreground border-b border-border">
                    <th className="text-left pb-2 font-medium">Name</th>
                    <th className="text-left pb-2 font-medium">Phone</th>
                    <th className="text-left pb-2 font-medium">Vehicle Type</th>
                    <th className="text-left pb-2 font-medium">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {recentCustomers.map((c) => (
                    <tr key={c.name}>
                      <td className="py-3">
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-8 h-8 rounded-full ${c.color} text-white text-xs font-bold flex items-center justify-center`}
                          >
                            {c.initial}
                          </div>
                          <span className="font-medium text-foreground">
                            {c.name}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 text-muted-foreground">{c.phone}</td>
                      <td className="py-3 text-foreground">{c.vehicle}</td>
                      <td className="py-3 text-muted-foreground text-xs">
                        {c.date}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Recent Quotations */}
          <div className="bg-white border border-border rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-foreground">Recent Quotations</h2>
              <Link
                to="/createQuotation"
                className="text-xs text-primary font-semibold hover:underline"
              >
                View all →
              </Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-xs text-muted-foreground border-b border-border">
                    <th className="text-left pb-2 font-medium">Customer</th>
                    <th className="text-left pb-2 font-medium">Vehicle</th>
                    <th className="text-left pb-2 font-medium">Amount</th>
                    <th className="text-left pb-2 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {recentQuotations.map((q) => (
                    <tr key={q.customer}>
                      <td className="py-3 font-medium text-foreground">
                        {q.customer}
                      </td>
                      <td className="py-3 text-foreground">{q.vehicle}</td>
                      <td className="py-3 text-foreground">₹{q.amount}</td>
                      <td className="py-3">
                        <span
                          className={`text-xs font-semibold px-2 py-1 rounded-full ${q.statusColor}`}
                        >
                          {q.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-6">
          {/* Business Overview */}
          <div className="bg-white border border-border rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-foreground">Business Overview</h2>
              <span className="text-xs text-muted-foreground">
                Last 30 days
              </span>
            </div>
            <div className="space-y-3">
              {[
                { label: "Total Sales", value: "₹12,45,000", change: "+18%" },
                { label: "Total Quotations", value: "32", change: "+15%" },
                { label: "Dispatched Vehicles", value: "12", change: "+33%" },
                { label: "Active Customers", value: "128", change: "+12%" },
              ].map((item) => (
                <div
                  key={item.label}
                  className="flex items-center justify-between py-2 border-b border-border last:border-b-0"
                >
                  <span className="text-sm text-muted-foreground">
                    {item.label}
                  </span>
                  <div className="text-right">
                    <p className="font-semibold text-foreground text-sm">
                      {item.value}
                    </p>
                    <p className="text-xs text-green-600">{item.change}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Vehicle Stock */}
          <div className="bg-white border border-border rounded-xl p-6">
            <h2 className="font-bold text-foreground mb-4">
              Vehicle Stock Status
            </h2>
            <div className="flex items-center gap-6">
              <div className="relative w-24 h-24">
                <svg viewBox="0 0 36 36" className="w-24 h-24 -rotate-90">
                  <circle
                    cx="18"
                    cy="18"
                    r="15.9"
                    fill="none"
                    stroke="#e5e7eb"
                    strokeWidth="3"
                  />
                  <circle
                    cx="18"
                    cy="18"
                    r="15.9"
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="3"
                    strokeDasharray="40 100"
                  />
                  <circle
                    cx="18"
                    cy="18"
                    r="15.9"
                    fill="none"
                    stroke="#3b82f6"
                    strokeWidth="3"
                    strokeDasharray="26 100"
                    strokeDashoffset="-40"
                  />
                  <circle
                    cx="18"
                    cy="18"
                    r="15.9"
                    fill="none"
                    stroke="#8b5cf6"
                    strokeWidth="3"
                    strokeDasharray="20 100"
                    strokeDashoffset="-66"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <p className="text-xl font-bold text-foreground">46</p>
                  <p className="text-[10px] text-muted-foreground">Total</p>
                </div>
              </div>
              <div className="flex-1 space-y-2 text-xs">
                {[
                  { label: "Available", value: 18, color: "bg-green-500" },
                  { label: "Sold", value: 12, color: "bg-blue-500" },
                  { label: "Dispatched", value: 9, color: "bg-purple-500" },
                  { label: "Hold", value: 7, color: "bg-gray-400" },
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-2">
                    <span
                      className={`w-2.5 h-2.5 rounded-full ${item.color}`}
                    ></span>
                    <span className="flex-1 text-muted-foreground">
                      {item.label}
                    </span>
                    <span className="font-semibold text-foreground">
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="bg-gradient-to-br from-[#0f172a] to-[#0f766e] rounded-xl p-6 text-white">
            <h3 className="font-bold mb-2">Need More Vehicles?</h3>
            <p className="text-xs text-white/70 mb-4">
              Explore our latest EV models and get the best deals for your
              dealership.
            </p>
            <Link
              to="/displayVehicleInfo"
              className="inline-flex items-center gap-1.5 bg-white text-foreground text-xs font-semibold px-4 py-2 rounded-lg hover:bg-white/90 transition-colors"
            >
              View Inventory <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DealerDash;
