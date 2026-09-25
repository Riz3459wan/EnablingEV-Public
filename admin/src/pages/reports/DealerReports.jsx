import { useCallback, useMemo } from "react";
import { Link } from "react-router";
import {
  ArrowLeft,
  Users,
  MapPin,
  TrendingUp,
  CheckCircle2,
  Star,
} from "lucide-react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import api from "../../api/client";
import useAsyncData from "../../hooks/useAsyncData";
import Card from "../../components/ui/Card";
import DataTable from "../../components/ui/DataTable";
import { ErrorCard, LoadingCard } from "../../components/ui/AsyncStates";
import { formatINR } from "../../features/quotation/calc";

const LOAD_ERROR = "Couldn't load dealer reports. Please try again.";
const COLORS = [
  "#3b82f6",
  "#10b981",
  "#8b5cf6",
  "#f59e0b",
  "#ef4444",
  "#06b6d4",
];

const StatCard = ({ icon: Icon, label, value, color = "blue", sub }) => {
  const colors = {
    blue: "bg-blue-50 text-blue-600",
    green: "bg-green-50 text-green-600",
    purple: "bg-purple-50 text-purple-600",
    orange: "bg-orange-50 text-orange-600",
  };
  return (
    <Card className="p-5">
      <div
        className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${colors[color]}`}
      >
        <Icon size={18} />
      </div>
      <p className="text-xs text-slate-500 mb-1">{label}</p>
      <p className="text-2xl font-bold text-slate-800 leading-tight">{value}</p>
      {sub && <p className="text-[11px] text-slate-400 mt-1">{sub}</p>}
    </Card>
  );
};

const DealerReports = () => {
  const loader = useCallback(async () => {
    const [dealersRes, quotationsRes] = await Promise.allSettled([
      api.get("/dealer/full"),
      api.get("/QuotationTable"),
    ]);

    const dealers =
      dealersRes.status === "fulfilled" && Array.isArray(dealersRes.value.data)
        ? dealersRes.value.data
        : [];
    const quotations =
      quotationsRes.status === "fulfilled" &&
      Array.isArray(quotationsRes.value.data)
        ? quotationsRes.value.data
        : [];

    // Enrich each dealer with quotation stats
    const enriched = dealers.map((d) => {
      const dQuotations = quotations.filter(
        (q) => q.dealerCode === d.dealerCode,
      );
      const dispatched = dQuotations.filter(
        (q) => q.status === "Dispatched",
      ).length;
      const totalValue = dQuotations.reduce(
        (sum, q) => sum + (Number(q.totalAmount) || 0),
        0,
      );
      return {
        ...d,
        _totalQuotations: dQuotations.length,
        _dispatched: dispatched,
        _totalValue: totalValue,
      };
    });

    return { dealers: enriched, quotations };
  }, []);

  const { data, error, loading, reload } = useAsyncData(
    ["dealerReports"],
    loader,
    LOAD_ERROR,
  );

  const { dealers = [], quotations = [] } = data ?? {};

  const analytics = useMemo(() => {
    const totalDealers = dealers.length;
    const activeDealers = dealers.filter((d) => d.activationCode).length;
    const pendingDealers = totalDealers - activeDealers;

    // State distribution
    const stateMap = {};
    dealers.forEach((d) => {
      const state = d.state || "Unknown";
      stateMap[state] = (stateMap[state] || 0) + 1;
    });
    const stateData = Object.entries(stateMap)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 8);

    // Top dealers by value
    const topByValue = [...dealers]
      .sort((a, b) => b._totalValue - a._totalValue)
      .slice(0, 5)
      .map((d) => ({
        name: d.name?.split(" ").slice(0, 2).join(" ") || "Dealer",
        value: d._totalValue,
        quotations: d._totalQuotations,
      }));

    // Top dealers by quotations count
    const topByCount = [...dealers]
      .sort((a, b) => b._totalQuotations - a._totalQuotations)
      .slice(0, 8)
      .map((d) => ({
        name: d.name?.split(" ")[0] || "Dealer",
        value: d._totalQuotations,
      }));

    // Top dealers by dispatched count
    const topByDispatched = [...dealers]
      .sort((a, b) => b._dispatched - a._dispatched)
      .slice(0, 8)
      .map((d) => ({
        name: d.name?.split(" ")[0] || "Dealer",
        value: d._dispatched,
      }));

    const totalQuotationValue = dealers.reduce(
      (sum, d) => sum + d._totalValue,
      0,
    );

    return {
      totalDealers,
      activeDealers,
      pendingDealers,
      stateData,
      topByValue,
      topByCount,
      topByDispatched,
      totalQuotationValue,
    };
  }, [dealers]);

  const columns = useMemo(
    () => [
      { key: "dealerCode", label: "Code", className: "font-mono text-xs" },
      {
        key: "name",
        label: "Dealer",
        render: (row) => (
          <Link
            to={`/dealerDetails/${row.id || row.dealerCode}`}
            className="font-medium text-blue-600 hover:underline"
          >
            {row.name || "—"}
          </Link>
        ),
      },
      { key: "state", label: "State" },
      { key: "dist", label: "District" },
      {
        key: "_totalQuotations",
        label: "Quotations",
        render: (r) => (
          <span className="font-semibold text-slate-800">
            {r._totalQuotations}
          </span>
        ),
      },
      {
        key: "_dispatched",
        label: "Dispatched",
        render: (r) => (
          <span className="font-semibold text-green-600">{r._dispatched}</span>
        ),
      },
      {
        key: "_totalValue",
        label: "Total Value",
        render: (r) => (
          <span className="font-semibold text-slate-800">
            {formatINR(r._totalValue)}
          </span>
        ),
      },
    ],
    [],
  );

  return (
    <section className="w-full">
      <div className="mb-6">
        <p className="text-xs font-semibold text-blue-600 uppercase tracking-wider mb-1">
          Reports
        </p>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 tracking-tight">
          Dealer Reports
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          Performance analytics across all registered dealers.
        </p>
      </div>

      {loading ? (
        <LoadingCard rows={6} />
      ) : error ? (
        <ErrorCard message={error} onRetry={reload} />
      ) : (
        <div className="space-y-5">
          {/* Stat Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <StatCard
              icon={Users}
              label="Total Dealers"
              value={analytics.totalDealers}
              color="blue"
            />
            <StatCard
              icon={CheckCircle2}
              label="Active Dealers"
              value={analytics.activeDealers}
              color="green"
              sub={`${analytics.totalDealers > 0 ? Math.round((analytics.activeDealers / analytics.totalDealers) * 100) : 0}% of total`}
            />
            <StatCard
              icon={MapPin}
              label="States Covered"
              value={analytics.stateData.length}
              color="purple"
            />
            <StatCard
              icon={TrendingUp}
              label="Total Business"
              value={formatINR(analytics.totalQuotationValue)}
              color="orange"
            />
          </div>

          {/* Charts Row 1 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* Top Dealers by Value */}
            <Card className="p-5">
              <h2 className="font-bold text-slate-800 mb-4">
                Top Dealers by Value
              </h2>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={analytics.topByValue} layout="vertical">
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#e2e8f0"
                    horizontal={false}
                  />
                  <XAxis
                    type="number"
                    tick={{ fontSize: 10, fill: "#64748b" }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(v) => `₹${(v / 100000).toFixed(1)}L`}
                  />
                  <YAxis
                    type="category"
                    dataKey="name"
                    tick={{ fontSize: 11, fill: "#64748b" }}
                    axisLine={false}
                    tickLine={false}
                    width={90}
                  />
                  <Tooltip
                    formatter={(value) => [formatINR(value), "Total Value"]}
                    contentStyle={{
                      borderRadius: 8,
                      border: "1px solid #e2e8f0",
                      fontSize: 12,
                    }}
                  />
                  <Bar dataKey="value" fill="#10b981" radius={[0, 6, 6, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Card>

            {/* Top Dealers by Quotations */}
            <Card className="p-5">
              <h2 className="font-bold text-slate-800 mb-4">
                Top Dealers by Quotations
              </h2>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={analytics.topByCount}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#e2e8f0"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 11, fill: "#64748b" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 11, fill: "#64748b" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: 8,
                      border: "1px solid #e2e8f0",
                      fontSize: 12,
                    }}
                  />
                  <Bar dataKey="value" fill="#3b82f6" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </div>

          {/* Charts Row 2 */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {/* Top Dispatched */}
            <Card className="lg:col-span-2 p-5">
              <h2 className="font-bold text-slate-800 mb-4">
                Top Dealers by Dispatches
              </h2>
              <ResponsiveContainer width="100%" height={240}>
                <LineChart data={analytics.topByDispatched}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#e2e8f0"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 11, fill: "#64748b" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 11, fill: "#64748b" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: 8,
                      border: "1px solid #e2e8f0",
                      fontSize: 12,
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#8b5cf6"
                    strokeWidth={2.5}
                    dot={{ r: 4, fill: "#8b5cf6" }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </Card>

            {/* State Distribution */}
            <Card className="p-5">
              <h2 className="font-bold text-slate-800 mb-4">
                Dealers by State
              </h2>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={analytics.stateData}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={80}
                    dataKey="value"
                    paddingAngle={3}
                  >
                    {analytics.stateData.map((entry, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      borderRadius: 8,
                      border: "1px solid #e2e8f0",
                      fontSize: 12,
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-1.5 mt-3 max-h-32 overflow-y-auto">
                {analytics.stateData.map((s, i) => (
                  <div
                    key={s.name}
                    className="flex items-center justify-between text-xs"
                  >
                    <span className="flex items-center gap-2 text-slate-600">
                      <span
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: COLORS[i % COLORS.length] }}
                      ></span>
                      {s.name}
                    </span>
                    <span className="font-semibold text-slate-800">
                      {s.value}
                    </span>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Dealer Performance Table */}
          <Card className="p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Star size={16} className="text-orange-500" />
                <h2 className="font-bold text-slate-800">Dealer Performance</h2>
              </div>
              <span className="text-xs text-slate-500">
                {analytics.totalDealers} dealers
              </span>
            </div>
            <DataTable
              columns={columns}
              rows={[...dealers]
                .sort((a, b) => b._totalValue - a._totalValue)
                .slice(0, 20)}
              rowKey={(r) => r.id ?? r.dealerCode}
              emptyText="No dealers registered."
            />
            {dealers.length > 20 && (
              <p className="text-center text-xs text-slate-400 mt-4">
                Showing top 20 of {dealers.length} dealers
              </p>
            )}
          </Card>
        </div>
      )}
    </section>
  );
};

export default DealerReports;
