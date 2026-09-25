import { useCallback, useMemo } from "react";
import { Link } from "react-router";
import { ArrowLeft, Users, MapPin, TrendingUp, UserCheck } from "lucide-react";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import api from "../../api/client";
import useAsyncData from "../../hooks/useAsyncData";
import Card from "../../components/ui/Card";
import DataTable from "../../components/ui/DataTable";
import { ErrorCard, LoadingCard } from "../../components/ui/AsyncStates";

const LOAD_ERROR = "Couldn't load customer reports. Please try again.";
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

const CustomerReports = () => {
  const loader = useCallback(async () => {
    const res = await api.get("/CustomerTable/admin");
    return Array.isArray(res.data) ? res.data : [];
  }, []);

  const { data, error, loading, reload } = useAsyncData(
    ["customerReports"],
    loader,
    LOAD_ERROR,
  );

  const customers = data ?? [];

  const analytics = useMemo(() => {
    const total = customers.length;

    // State distribution
    const stateMap = {};
    customers.forEach((c) => {
      const state = c.state || "Unknown";
      stateMap[state] = (stateMap[state] || 0) + 1;
    });
    const stateData = Object.entries(stateMap)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 8);

    // District distribution (top 6)
    const distMap = {};
    customers.forEach((c) => {
      const dist = c.dist || "Unknown";
      distMap[dist] = (distMap[dist] || 0) + 1;
    });
    const distData = Object.entries(distMap)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 6);

    // Unique states & districts
    const uniqueStates = new Set(customers.map((c) => c.state).filter(Boolean))
      .size;
    const uniqueDistricts = new Set(
      customers.map((c) => c.dist).filter(Boolean),
    ).size;

    // Recent customers (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const recent = customers.filter((c) => {
      if (!c.createdAt) return false;
      return new Date(c.createdAt) >= thirtyDaysAgo;
    }).length;

    return {
      total,
      uniqueStates,
      uniqueDistricts,
      recent,
      stateData,
      distData,
    };
  }, [customers]);

  const columns = useMemo(
    () => [
      { key: "name", label: "Name" },
      { key: "mobileNumber", label: "Mobile" },
      { key: "emailId", label: "Email" },
      {
        key: "chassisNumber",
        label: "Chassis No.",
        className: "font-mono text-xs",
      },
      { key: "dist", label: "District" },
      { key: "state", label: "State" },
      { key: "pincode", label: "Pincode" },
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
          Customer Reports
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          Analytics on customer distribution and geographic reach.
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
              label="Total Customers"
              value={analytics.total}
              color="blue"
            />
            <StatCard
              icon={MapPin}
              label="States Covered"
              value={analytics.uniqueStates}
              color="green"
            />
            <StatCard
              icon={MapPin}
              label="Districts Covered"
              value={analytics.uniqueDistricts}
              color="purple"
            />
            <StatCard
              icon={UserCheck}
              label="New (30 days)"
              value={analytics.recent}
              color="orange"
            />
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* Top States */}
            <Card className="p-5">
              <h2 className="font-bold text-slate-800 mb-4">Top States</h2>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={analytics.stateData} layout="vertical">
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#e2e8f0"
                    horizontal={false}
                  />
                  <XAxis
                    type="number"
                    tick={{ fontSize: 11, fill: "#64748b" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    type="category"
                    dataKey="name"
                    tick={{ fontSize: 11, fill: "#64748b" }}
                    axisLine={false}
                    tickLine={false}
                    width={80}
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: 8,
                      border: "1px solid #e2e8f0",
                      fontSize: 12,
                    }}
                  />
                  <Bar dataKey="value" fill="#3b82f6" radius={[0, 6, 6, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Card>

            {/* Top Districts Pie */}
            <Card className="p-5">
              <h2 className="font-bold text-slate-800 mb-4">Top Districts</h2>
              <ResponsiveContainer width="100%" height={240}>
                <PieChart>
                  <Pie
                    data={analytics.distData}
                    cx="50%"
                    cy="50%"
                    outerRadius={90}
                    dataKey="value"
                    label={({ name, percent }) =>
                      `${name} ${(percent * 100).toFixed(0)}%`
                    }
                    labelLine={false}
                  >
                    {analytics.distData.map((entry, i) => (
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
            </Card>
          </div>

          {/* All Customers Table */}
          <Card className="p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-slate-800">All Customers</h2>
              <span className="text-xs text-slate-500">
                {analytics.total} total
              </span>
            </div>
            <DataTable
              columns={columns}
              rows={customers.slice(0, 20)}
              rowKey={(r) => r.id ?? r.chassisNumber}
              emptyText="No customers registered."
            />
            {customers.length > 20 && (
              <p className="text-center text-xs text-slate-400 mt-4">
                Showing first 20 of {customers.length} records
              </p>
            )}
          </Card>
        </div>
      )}
    </section>
  );
};

export default CustomerReports;
