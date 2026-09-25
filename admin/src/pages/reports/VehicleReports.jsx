import { useCallback, useMemo, useState } from "react";
import { Link } from "react-router";
import {
  ArrowLeft,
  Truck,
  TrendingUp,
  Package,
  CheckCircle2,
  Download,
} from "lucide-react";
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
  Legend,
} from "recharts";
import api from "../../api/client";
import useAsyncData from "../../hooks/useAsyncData";
import Card from "../../components/ui/Card";
import DataTable from "../../components/ui/DataTable";
import { ErrorCard, LoadingCard } from "../../components/ui/AsyncStates";

const LOAD_ERROR = "Couldn't load vehicle reports. Please try again.";

const COLORS = ["#3b82f6", "#10b981", "#8b5cf6", "#f59e0b", "#ef4444"];

// ── Stat Card ──────────────────────────────────────────────
const StatCard = ({ icon: Icon, label, value, color = "blue", sub }) => {
  const colors = {
    blue: "bg-blue-50 text-blue-600",
    green: "bg-green-50 text-green-600",
    purple: "bg-purple-50 text-purple-600",
    orange: "bg-orange-50 text-orange-600",
  };
  return (
    <Card className="p-5">
      <div className="flex items-center justify-between mb-3">
        <div
          className={`w-10 h-10 rounded-xl flex items-center justify-center ${colors[color]}`}
        >
          <Icon size={18} />
        </div>
      </div>
      <p className="text-xs text-slate-500 mb-1">{label}</p>
      <p className="text-2xl font-bold text-slate-800 leading-tight">{value}</p>
      {sub && <p className="text-[11px] text-slate-400 mt-1">{sub}</p>}
    </Card>
  );
};

const VehicleReports = () => {
  // Load both quotations and vehicles
  const loader = useCallback(async () => {
    const [quotationsRes, vehiclesRes] = await Promise.allSettled([
      api.get("/QuotationTable"),
      api.get("/VehicleTable"),
    ]);

    const quotations =
      quotationsRes.status === "fulfilled" &&
      Array.isArray(quotationsRes.value.data)
        ? quotationsRes.value.data
        : [];
    const vehicles =
      vehiclesRes.status === "fulfilled" &&
      Array.isArray(vehiclesRes.value.data)
        ? vehiclesRes.value.data
        : [];

    return { quotations, vehicles };
  }, []);

  const { data, error, loading, reload } = useAsyncData(
    ["vehicleReports"],
    loader,
    LOAD_ERROR,
  );

  const { quotations = [], vehicles = [] } = data ?? {};

  // ── Stats & Charts ─────────────────────────────────────
  const analytics = useMemo(() => {
    const totalQuotations = quotations.length;
    const dispatched = quotations.filter(
      (q) => q.status === "Dispatched",
    ).length;
    const billing = quotations.filter(
      (q) => q.status === "Under Billing",
    ).length;
    const assembling = quotations.filter(
      (q) => q.status === "Under Assembling",
    ).length;

    // Type distribution
    const rikshaw = quotations.filter((q) => {
      const v = String(q.vehicleType || "").toLowerCase();
      return v.includes("rikshaw") || v.includes("rickshaw");
    }).length;
    const cargo = quotations.filter((q) => {
      const v = String(q.vehicleType || "").toLowerCase();
      return v.includes("cargo") || v.includes("loader");
    }).length;

    // Model distribution
    const modelMap = {};
    quotations.forEach((q) => {
      const model = q.modelName || "Unknown";
      modelMap[model] = (modelMap[model] || 0) + 1;
    });
    const modelData = Object.entries(modelMap)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 8);

    // Color distribution
    const colorMap = {};
    quotations.forEach((q) => {
      const color = q.colorName || "Unknown";
      colorMap[color] = (colorMap[color] || 0) + 1;
    });
    const colorData = Object.entries(colorMap)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 6);

    // Status distribution
    const statusData = [
      { name: "Dispatched", value: dispatched, color: "#10b981" },
      { name: "Under Billing", value: billing, color: "#0ea5e9" },
      { name: "Under Assembling", value: assembling, color: "#f59e0b" },
    ].filter((s) => s.value > 0);

    // Used vs Unused
    const usedCount = vehicles.filter((v) => v.isUsed === true).length;
    const unusedCount = vehicles.filter((v) => v.isUsed !== true).length;

    return {
      totalQuotations,
      dispatched,
      billing,
      assembling,
      rikshaw,
      cargo,
      modelData,
      colorData,
      statusData,
      totalVehicles: vehicles.length,
      usedCount,
      unusedCount,
    };
  }, [quotations, vehicles]);

  // ── Table columns ──────────────────────────────────────
  const columns = useMemo(
    () => [
      {
        key: "chassisNumber",
        label: "Chassis No.",
        className: "font-mono text-xs",
      },
      { key: "modelName", label: "Model" },
      { key: "bodyTypeName", label: "Body Type" },
      { key: "colorName", label: "Color" },
      { key: "vehicleType", label: "Type" },
      { key: "dealerName", label: "Dealer" },
      { key: "status", label: "Status" },
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
          Vehicle Reports
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          Analytics and insights on all vehicles and quotations across the
          network.
        </p>
      </div>

      {loading ? (
        <LoadingCard rows={6} />
      ) : error ? (
        <ErrorCard message={error} onRetry={reload} />
      ) : (
        <div className="space-y-5">
          {/* ── Stat Cards ── */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <StatCard
              icon={Truck}
              label="Total Vehicles"
              value={analytics.totalVehicles}
              color="blue"
            />
            <StatCard
              icon={CheckCircle2}
              label="Dispatched"
              value={analytics.dispatched}
              color="green"
              sub={`${analytics.totalQuotations > 0 ? Math.round((analytics.dispatched / analytics.totalQuotations) * 100) : 0}% of quotations`}
            />
            <StatCard
              icon={Package}
              label="In Production"
              value={analytics.billing + analytics.assembling}
              color="orange"
              sub={`${analytics.billing} billing, ${analytics.assembling} assembling`}
            />
            <StatCard
              icon={TrendingUp}
              label="Total Quotations"
              value={analytics.totalQuotations}
              color="purple"
            />
          </div>

          {/* ── Charts Row 1 ── */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {/* Model Distribution */}
            <Card className="lg:col-span-2 p-5">
              <h2 className="font-bold text-slate-800 mb-4">Top Models</h2>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={analytics.modelData}>
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

            {/* Status Distribution */}
            <Card className="p-5">
              <h2 className="font-bold text-slate-800 mb-4">
                Status Distribution
              </h2>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={analytics.statusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {analytics.statusData.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
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
              <div className="space-y-2 mt-2">
                {analytics.statusData.map((d) => (
                  <div
                    key={d.name}
                    className="flex items-center justify-between text-xs"
                  >
                    <span className="flex items-center gap-2 text-slate-600">
                      <span
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: d.color }}
                      ></span>
                      {d.name}
                    </span>
                    <span className="font-semibold text-slate-800">
                      {d.value}
                    </span>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* ── Charts Row 2 ── */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* Vehicle Type */}
            <Card className="p-5">
              <h2 className="font-bold text-slate-800 mb-4">
                Vehicle Type Split
              </h2>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium text-slate-700">
                      Rikshaw
                    </span>
                    <span className="text-sm font-bold text-slate-800">
                      {analytics.rikshaw}
                    </span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500 rounded-full transition-all duration-500"
                      style={{
                        width: `${analytics.totalQuotations > 0 ? (analytics.rikshaw / analytics.totalQuotations) * 100 : 0}%`,
                      }}
                    ></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium text-slate-700">
                      Cargo / Loader
                    </span>
                    <span className="text-sm font-bold text-slate-800">
                      {analytics.cargo}
                    </span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-purple-500 rounded-full transition-all duration-500"
                      style={{
                        width: `${analytics.totalQuotations > 0 ? (analytics.cargo / analytics.totalQuotations) * 100 : 0}%`,
                      }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Color distribution */}
              <h3 className="text-sm font-bold text-slate-800 mt-6 mb-3">
                Top Colors
              </h3>
              <div className="space-y-2">
                {analytics.colorData.slice(0, 4).map((c) => (
                  <div
                    key={c.name}
                    className="flex items-center justify-between text-sm"
                  >
                    <span className="text-slate-600">{c.name}</span>
                    <span className="font-semibold text-slate-800">
                      {c.value}
                    </span>
                  </div>
                ))}
              </div>
            </Card>

            {/* Usage Stats */}
            <Card className="p-5">
              <h2 className="font-bold text-slate-800 mb-4">Vehicle Usage</h2>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-green-50 rounded-xl p-4 text-center">
                  <p className="text-xs text-green-700 font-medium mb-1">
                    In Use
                  </p>
                  <p className="text-3xl font-bold text-green-700">
                    {analytics.usedCount}
                  </p>
                </div>
                <div className="bg-slate-50 rounded-xl p-4 text-center">
                  <p className="text-xs text-slate-600 font-medium mb-1">
                    Available
                  </p>
                  <p className="text-3xl font-bold text-slate-700">
                    {analytics.unusedCount}
                  </p>
                </div>
              </div>
              <div className="pt-4 border-t border-slate-200">
                <p className="text-xs text-slate-500 mb-2">Usage Rate</p>
                <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-green-400 to-green-600 rounded-full transition-all duration-500"
                    style={{
                      width: `${analytics.totalVehicles > 0 ? (analytics.usedCount / analytics.totalVehicles) * 100 : 0}%`,
                    }}
                  ></div>
                </div>
                <p className="text-xs text-slate-500 mt-2">
                  {analytics.totalVehicles > 0
                    ? Math.round(
                        (analytics.usedCount / analytics.totalVehicles) * 100,
                      )
                    : 0}
                  % of vehicles in use
                </p>
              </div>
            </Card>
          </div>

          {/* ── All Vehicles Table ── */}
          <Card className="p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-slate-800">All Quotations</h2>
              <span className="text-xs text-slate-500">
                {analytics.totalQuotations} total
              </span>
            </div>
            <DataTable
              columns={columns}
              rows={quotations.slice(0, 20)}
              rowKey={(r) => r.id ?? r.chassisNumber}
              emptyText="No quotations found."
            />
            {quotations.length > 20 && (
              <p className="text-center text-xs text-slate-400 mt-4">
                Showing first 20 of {quotations.length} records
              </p>
            )}
          </Card>
        </div>
      )}
    </section>
  );
};

export default VehicleReports;
