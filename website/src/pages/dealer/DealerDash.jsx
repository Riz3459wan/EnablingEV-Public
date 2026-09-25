import { Link } from "react-router";
import {
  UserPlus,
  FileText,
  FileCheck2,
  Truck,
  Users,
  Clock,
  MapPin,
  ArrowRight,
  Plus,
} from "lucide-react";
import { useDealerInfo } from "../../auth/useDealerInfo";
import DashboardLayout from "../../components/dashboard/DashboardLayout";
import useAsyncData from "../../hooks/useAsyncData";
import api from "../../api/client";
import { MOCK_DASHBOARD_STATS } from "../../data/mockData";
import { useCallback, useMemo } from "react";

// ─── Toggle: set to false to use REAL API ────────────────────
const USE_MOCK = true;

const QUICK_ACTIONS = [
  {
    to: "/customerForm",
    icon: UserPlus,
    label: "Add Customer",
    desc: "Register a new customer",
  },
  {
    to: "/createQuotation",
    icon: FileText,
    label: "New Quotation",
    desc: "Generate a quotation",
  },
  {
    to: "/form_22",
    icon: FileCheck2,
    label: "Form 22",
    desc: "Vehicle compliance doc",
  },
  {
    to: "/displayVehicleInfo",
    icon: Truck,
    label: "My Vehicles",
    desc: "View dispatched vehicles",
  },
];

const formatCompact = (n) => {
  const num = Number(n) || 0;
  if (num >= 10000000) return `${(num / 10000000).toFixed(1)}Cr`;
  if (num >= 100000) return `${(num / 100000).toFixed(1)}L`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return num.toLocaleString("en-IN");
};

const formatINR = (n) => `₹${Number(n || 0).toLocaleString("en-IN")}`;

const DealerDash = () => {
  const { dealerInfo, dealerCode } = useDealerInfo();
  const name = dealerInfo?.name || "Dealer";
  const canLoad = dealerCode && dealerCode.length >= 7;

  const loader = useCallback(async () => {
    // ══════════════════════════════════════════════════════════
    // MOCK DATA
    // ══════════════════════════════════════════════════════════
    if (USE_MOCK) {
      await new Promise((r) => setTimeout(r, 400));
      return MOCK_DASHBOARD_STATS;
    }

    // ══════════════════════════════════════════════════════════
    // REAL API — used when USE_MOCK = false
    // ══════════════════════════════════════════════════════════
    if (!canLoad) return null;

    const [customersRes, quotesRes, vehiclesRes] = await Promise.all([
      api
        .get("/CustomerTable", { params: { dealerCode } })
        .then((r) => r.data)
        .catch(() => []),
      api
        .get("/QuotationTable", { params: { dealerCode } })
        .then((r) => r.data)
        .catch(() => []),
      api
        .get("/QuotationTable", {
          params: { dealerCode, status: "Dispatched" },
        })
        .then((r) => r.data)
        .catch(() => []),
    ]);

    const customers = Array.isArray(customersRes) ? customersRes : [];
    const quotes = Array.isArray(quotesRes) ? quotesRes : [];
    const vehicles = Array.isArray(vehiclesRes) ? vehiclesRes : [];

    const pendingQuotes = quotes.filter(
      (q) => (q.status || "").toLowerCase() !== "dispatched",
    );

    const totalSales = quotes
      .filter((q) => (q.status || "").toLowerCase() === "dispatched")
      .reduce((sum, q) => sum + (Number(q.totalAmount) || 0), 0);

    const recentCustomers = [...customers]
      .sort(
        (a, b) =>
          (new Date(b.createdAt).getTime() || 0) -
          (new Date(a.createdAt).getTime() || 0),
      )
      .slice(0, 4);

    const recentQuotes = [...quotes]
      .sort(
        (a, b) =>
          (new Date(b.createdAt).getTime() || 0) -
          (new Date(a.createdAt).getTime() || 0),
      )
      .slice(0, 4);

    return {
      stats: {
        customers: customers.length,
        vehicles: vehicles.length,
        quotes: quotes.length,
        pending: pendingQuotes.length,
        totalSales,
      },
      recentCustomers,
      recentQuotes,
    };
  }, [canLoad, dealerCode]);

  const { data, loading } = useAsyncData(
    ["dealerDash", dealerCode],
    loader,
    null,
  );

  const stats = data?.stats || {
    customers: 0,
    vehicles: 0,
    quotes: 0,
    pending: 0,
    totalSales: 0,
  };

  const recentCustomers = data?.recentCustomers || [];
  const recentQuotes = data?.recentQuotes || [];

  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  }, []);

  return (
    <DashboardLayout dealerName={name} dealerCode={dealerCode}>
      {/* Welcome Banner */}
      <div className="relative bg-gradient-to-br from-[#0f172a] via-[#134e4a] to-[#0f766e] rounded-2xl p-6 sm:p-8 mb-6 text-white overflow-hidden border border-white/[0.06]">
        <div className="pointer-events-none absolute -top-20 -right-20 w-64 h-64 rounded-full bg-primary/[0.15] blur-[80px]" />

        <div className="relative z-10">
          <p className="text-[11px] uppercase tracking-[0.2em] font-semibold text-white/60 font-rr mb-2">
            {greeting}
          </p>
          <h1 className="font-display uppercase text-2xl sm:text-3xl leading-[1.05] tracking-[-0.01em] mb-3">
            Welcome, {name.split(" ")[0]}
          </h1>
          <p className="text-sm text-white/70 max-w-lg leading-relaxed mb-5">
            Manage your customers, vehicles, and quotations — everything in one
            place.
          </p>
          <div className="flex flex-wrap items-center gap-4 text-xs">
            {dealerInfo?.dist && (
              <span className="flex items-center gap-1.5 text-white/60">
                <MapPin size={12} />
                {dealerInfo.dist}, {dealerInfo.state || "India"}
              </span>
            )}
            <span className="bg-primary/20 border border-primary/40 rounded-full px-2.5 py-1 text-primary font-semibold text-[10px] uppercase tracking-[0.14em] font-rr">
              Active
            </span>
            {dealerCode && (
              <span className="font-mono text-[10px] text-white/40 tracking-wider">
                {dealerCode}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          label="My Customers"
          value={loading ? "—" : formatCompact(stats.customers)}
          icon={Users}
          accent="blue"
        />
        <StatCard
          label="My Vehicles"
          value={loading ? "—" : formatCompact(stats.vehicles)}
          icon={Truck}
          accent="purple"
        />
        <StatCard
          label="My Quotations"
          value={loading ? "—" : formatCompact(stats.quotes)}
          icon={FileText}
          accent="green"
        />
        <StatCard
          label="Pending"
          value={loading ? "—" : formatCompact(stats.pending)}
          icon={Clock}
          accent="orange"
        />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Quick Actions */}
          <Panel title="Quick Actions" subtitle="Jump into your key tasks">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              {QUICK_ACTIONS.map(({ to, icon: Icon, label, desc }) => (
                <Link
                  key={label}
                  to={to}
                  className="group border border-white/[0.08] rounded-xl p-4 hover:border-primary/40 hover:bg-primary/[0.04] transition-all"
                >
                  <div className="w-9 h-9 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center mb-3 group-hover:bg-primary/20 transition-colors">
                    <Icon
                      size={16}
                      className="text-primary"
                      strokeWidth={1.75}
                    />
                  </div>
                  <p className="text-sm font-semibold text-white mb-0.5 font-rr tracking-[0.02em]">
                    {label}
                  </p>
                  <p className="text-[11px] text-white/40 leading-tight">
                    {desc}
                  </p>
                </Link>
              ))}
            </div>
          </Panel>

          {/* Recent Customers */}
          <Panel
            title="Recent Customers"
            action={{ to: "/dealerCustomerInfo", label: "View all" }}
          >
            {loading ? (
              <LoadingRows rows={3} />
            ) : recentCustomers.length === 0 ? (
              <EmptyState
                icon={Users}
                text="No customers yet. Add your first one."
                cta={{ to: "/customerForm", label: "Add Customer" }}
              />
            ) : (
              <div className="overflow-x-auto -mx-6 px-6">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-[10px] uppercase tracking-[0.18em] text-white/40 font-semibold border-b border-white/[0.06]">
                      <th className="text-left pb-2.5 font-semibold">Name</th>
                      <th className="text-left pb-2.5 font-semibold">Phone</th>
                      <th className="text-left pb-2.5 font-semibold">
                        Chassis
                      </th>
                      <th className="text-left pb-2.5 font-semibold">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/[0.04]">
                    {recentCustomers.map((c) => (
                      <tr key={c.id ?? c.chassisNumber}>
                        <td className="py-3">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-full bg-primary/15 border border-primary/25 text-primary text-[11px] font-bold flex items-center justify-center font-rr">
                              {(c.name || "?").charAt(0).toUpperCase()}
                            </div>
                            <span className="font-medium text-white text-sm">
                              {c.name || "—"}
                            </span>
                          </div>
                        </td>
                        <td className="py-3 text-white/60 text-xs">
                          {c.mobileNumber || "—"}
                        </td>
                        <td className="py-3 text-white/50 text-xs font-mono">
                          {c.chassisNumber || "—"}
                        </td>
                        <td className="py-3 text-white/40 text-xs">
                          {c.createdAt
                            ? new Date(c.createdAt).toLocaleDateString("en-IN")
                            : "—"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Panel>

          {/* Recent Quotations */}
          <Panel
            title="Recent Quotations"
            action={{ to: "/createQuotation", label: "View all" }}
          >
            {loading ? (
              <LoadingRows rows={3} />
            ) : recentQuotes.length === 0 ? (
              <EmptyState
                icon={FileText}
                text="No quotations yet. Create your first."
                cta={{ to: "/createQuotation", label: "New Quotation" }}
              />
            ) : (
              <div className="overflow-x-auto -mx-6 px-6">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-[10px] uppercase tracking-[0.18em] text-white/40 font-semibold border-b border-white/[0.06]">
                      <th className="text-left pb-2.5 font-semibold">Model</th>
                      <th className="text-left pb-2.5 font-semibold">
                        Chassis
                      </th>
                      <th className="text-right pb-2.5 font-semibold">
                        Amount
                      </th>
                      <th className="text-right pb-2.5 font-semibold">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/[0.04]">
                    {recentQuotes.map((q) => {
                      const status = q.status || "Pending";
                      const statusLower = status.toLowerCase();
                      const badgeClass =
                        statusLower === "dispatched"
                          ? "bg-primary/15 text-primary border-primary/30"
                          : statusLower === "under billing"
                            ? "bg-sky-500/10 text-sky-400 border-sky-500/30"
                            : statusLower === "under assembling"
                              ? "bg-amber-500/10 text-amber-400 border-amber-500/30"
                              : "bg-white/[0.05] text-white/60 border-white/10";
                      return (
                        <tr key={q.id ?? q.chassisNumber}>
                          <td className="py-3 text-white text-sm">
                            {q.modelName || q.model || "—"}
                          </td>
                          <td className="py-3 text-white/50 text-xs font-mono">
                            {q.chassisNumber || "Pending"}
                          </td>
                          <td className="py-3 text-right text-white font-medium text-sm tabular-nums">
                            {formatINR(q.totalAmount)}
                          </td>
                          <td className="py-3 text-right">
                            <span
                              className={`inline-block text-[10px] uppercase tracking-[0.14em] font-semibold px-2.5 py-1 rounded-full border font-rr ${badgeClass}`}
                            >
                              {status}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </Panel>
        </div>

        <div className="space-y-6">
          {/* Business Overview */}
          <Panel title="Business Overview" subtitle="All time">
            <div className="space-y-1">
              <StatRow
                label="Total Sales"
                value={loading ? "—" : formatINR(stats.totalSales)}
              />
              <StatRow
                label="Total Quotations"
                value={loading ? "—" : formatCompact(stats.quotes)}
              />
              <StatRow
                label="Dispatched Vehicles"
                value={loading ? "—" : formatCompact(stats.vehicles)}
              />
              <StatRow
                label="Active Customers"
                value={loading ? "—" : formatCompact(stats.customers)}
              />
            </div>
          </Panel>

          {/* New Quotation CTA */}
          <div className="bg-gradient-to-br from-[#0f172a] to-[#0f766e] rounded-xl p-6 text-white border border-white/[0.06] relative overflow-hidden">
            <div className="pointer-events-none absolute -top-16 -right-16 w-48 h-48 rounded-full bg-primary/[0.15] blur-[60px]" />
            <div className="relative">
              <div className="w-10 h-10 rounded-lg bg-primary/20 border border-primary/40 flex items-center justify-center mb-4">
                <Plus size={18} className="text-primary" strokeWidth={2} />
              </div>
              <h3 className="font-display uppercase text-lg tracking-[-0.01em] mb-2">
                New Quotation
              </h3>
              <p className="text-xs text-white/60 mb-5 leading-relaxed">
                Prepare a quotation for your customer in under a minute.
              </p>
              <Link
                to="/createQuotation"
                className="inline-flex items-center gap-1.5 bg-white text-ink hover:bg-primary transition-colors duration-300 text-[11px] uppercase tracking-[0.14em] font-bold px-4 py-2.5 rounded-full"
              >
                Get Started <ArrowRight size={13} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

// ─────────────────────────────────────────────────────────────
// Small presentational helpers (kept local to DealerDash)
// ─────────────────────────────────────────────────────────────

const StatCard = ({ label, value, icon: Icon, accent }) => {
  const accents = {
    blue: "text-blue-400 bg-blue-500/10 border-blue-500/20",
    purple: "text-purple-400 bg-purple-500/10 border-purple-500/20",
    green: "text-primary bg-primary/10 border-primary/20",
    orange: "text-orange-400 bg-orange-500/10 border-orange-500/20",
  };

  return (
    <div className="bg-white/[0.02] border border-white/[0.08] rounded-xl p-4 sm:p-5 hover:border-white/[0.15] transition-colors">
      <div className="flex items-center justify-between mb-3">
        <div
          className={`w-9 h-9 rounded-lg border flex items-center justify-center ${accents[accent]}`}
        >
          <Icon size={16} strokeWidth={1.75} />
        </div>
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

const Panel = ({ title, subtitle, action, children }) => (
  <div className="bg-white/[0.02] border border-white/[0.08] rounded-xl p-5 sm:p-6">
    <div className="flex items-start justify-between mb-5">
      <div>
        <h2 className="font-display uppercase text-base sm:text-lg tracking-[-0.01em] text-white">
          {title}
        </h2>
        {subtitle && (
          <p className="text-[11px] text-white/40 mt-1">{subtitle}</p>
        )}
      </div>
      {action && (
        <Link
          to={action.to}
          className="text-[11px] uppercase tracking-[0.14em] font-semibold text-primary hover:text-primary-hover transition-colors flex items-center gap-1"
        >
          {action.label}
          <ArrowRight size={12} />
        </Link>
      )}
    </div>
    {children}
  </div>
);

const StatRow = ({ label, value }) => (
  <div className="flex items-center justify-between py-3 border-b border-white/[0.06] last:border-b-0">
    <span className="text-xs text-white/50">{label}</span>
    <span className="font-rr font-semibold text-white text-sm tabular-nums">
      {value}
    </span>
  </div>
);

const LoadingRows = ({ rows = 3 }) => (
  <div className="space-y-3 py-1">
    {Array.from({ length: rows }).map((_, i) => (
      <div key={i} className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-white/[0.05] animate-pulse shrink-0" />
        <div className="flex-1 h-3 rounded-full bg-white/[0.05] animate-pulse" />
        <div className="w-20 h-3 rounded-full bg-white/[0.05] animate-pulse" />
      </div>
    ))}
  </div>
);

const EmptyState = ({ icon: Icon, text, cta }) => (
  <div className="py-8 text-center">
    <div className="w-10 h-10 rounded-lg bg-white/[0.04] border border-white/[0.08] flex items-center justify-center mx-auto mb-3">
      <Icon size={18} className="text-white/30" />
    </div>
    <p className="text-xs text-white/40 mb-4">{text}</p>
    {cta && (
      <Link
        to={cta.to}
        className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-[0.14em] font-semibold text-primary hover:text-primary-hover transition-colors"
      >
        {cta.label}
        <ArrowRight size={12} />
      </Link>
    )}
  </div>
);

export default DealerDash;
