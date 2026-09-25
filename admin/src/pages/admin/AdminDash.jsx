import { useEffect, useState } from "react";
import { Link } from "react-router";
import {
  Truck,
  Users,
  TrendingUp,
  TrendingDown,
  ArrowRight,
  ChevronRight,
  Car,
  Package,
  MapPin,
  CheckCircle2,
  Clock,
  XCircle,
  Palette,
  Building2,
  AlertTriangle,
  FileText,
  IndianRupee,
  BarChart3,
  Zap,
  Activity,
  Sparkles,
  Target,
  Crown,
  Flame,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import Card from "../../components/ui/Card";
import Modal from "../../components/ui/Modal";

// ═══════════════════════════════════════════════════════════
//  MOCK DATA
// ═══════════════════════════════════════════════════════════
const VEHICLES = {
  total: 892,
  byType: [
    {
      label: "E-Rickshaw",
      value: 625,
      color: "#3b82f6",
      icon: Car,
      models: ["F1", "F2", "F3", "F4", "DELUX"],
    },
    {
      label: "E-Cargo",
      value: 267,
      color: "#10b981",
      icon: Package,
      models: ["LODER"],
    },
  ],
  byStatus: [
    { label: "Under Assembling", value: 150, color: "#f59e0b", icon: Clock },
    { label: "Under Billing", value: 85, color: "#0ea5e9", icon: FileText },
    { label: "Dispatched", value: 657, color: "#10b981", icon: CheckCircle2 },
    { label: "Active in Fleet", value: 342, color: "#3b82f6", icon: Zap },
  ],
  byModel: [
    { label: "F1", value: 156 },
    { label: "F2", value: 138 },
    { label: "F3", value: 102 },
    { label: "F4", value: 89 },
    { label: "DELUX", value: 68 },
    { label: "LODER", value: 160 },
  ],
  byDispatch: [
    { label: "Ready to Dispatch", value: 45, color: "#f59e0b", icon: Package },
    { label: "In Transit", value: 32, color: "#0ea5e9", icon: Truck },
    { label: "Delivered", value: 580, color: "#10b981", icon: CheckCircle2 },
  ],
  byBrand: [
    { label: "Jhat Pat Jio", sub: "Rikshaw", value: 625, color: "#3b82f6" },
    { label: "Halchal", sub: "Cargo", value: 267, color: "#10b981" },
  ],
  byColor: [
    { label: "Blue", value: 210, hex: "#3b82f6" },
    { label: "Green", value: 180, hex: "#10b981" },
    { label: "White", value: 145, hex: "#e2e8f0" },
    { label: "Red", value: 120, hex: "#ef4444" },
    { label: "Yellow", value: 95, hex: "#fbbf24" },
  ],
};

const DEALERS = {
  total: 124,
  active: 98,
  pending: 26,
  byStatus: [
    { label: "Active", value: 98, color: "#10b981", icon: CheckCircle2 },
    { label: "Pending", value: 26, color: "#f59e0b", icon: Clock },
    { label: "Suspended", value: 0, color: "#ef4444", icon: XCircle },
  ],
  byState: [
    { label: "Delhi", value: 28 },
    { label: "Uttar Pradesh", value: 24 },
    { label: "Maharashtra", value: 18 },
    { label: "Rajasthan", value: 14 },
    { label: "Gujarat", value: 12 },
    { label: "Madhya Pradesh", value: 10 },
  ],
  topByRevenue: [
    { name: "Shree Ram Motors", city: "Delhi", value: 1245000, quotations: 45 },
    { name: "Rahul Auto Sales", city: "Jaipur", value: 987000, quotations: 38 },
    {
      name: "Green Energy Motors",
      city: "Lucknow",
      value: 856000,
      quotations: 32,
    },
    {
      name: "Metro EV Dealers",
      city: "Gurgaon",
      value: 743000,
      quotations: 28,
    },
    { name: "Vijay Sales Corp", city: "Bhopal", value: 612000, quotations: 24 },
  ],
  recentAdditions: 12,
  needsAttention: [
    { name: "Krishna EV Point", city: "Kanpur", days: 12 },
    { name: "Sunrise Motors", city: "Nagpur", days: 9 },
    { name: "City Auto Hub", city: "Indore", days: 8 },
  ],
};

const SALES = {
  thisMonth: 5240000,
  growth: 18,
  trendData: [
    { day: "1", value: 120000 },
    { day: "5", value: 180000 },
    { day: "10", value: 245000 },
    { day: "15", value: 320000 },
    { day: "20", value: 410000 },
    { day: "25", value: 480000 },
    { day: "30", value: 524000 },
  ],
  byTimePeriod: [
    { label: "Today", value: 245000, color: "#8b5cf6" },
    { label: "This Week", value: 890000, color: "#a855f7" },
    { label: "This Month", value: 5240000, color: "#c026d3" },
    { label: "This Quarter", value: 14250000, color: "#db2777" },
    { label: "This Year", value: 48750000, color: "#e11d48" },
  ],
  byVehicleType: [
    { label: "Rikshaw Sales", value: 3450000, count: 145, color: "#3b82f6" },
    { label: "Cargo Sales", value: 1790000, count: 62, color: "#10b981" },
  ],
  byStatus: [
    {
      label: "Approved",
      value: 3850000,
      count: 142,
      color: "#10b981",
      icon: CheckCircle2,
    },
    {
      label: "Pending",
      value: 1050000,
      count: 48,
      color: "#f59e0b",
      icon: Clock,
    },
    {
      label: "Rejected",
      value: 340000,
      count: 17,
      color: "#ef4444",
      icon: XCircle,
    },
  ],
  topQuotations: [
    {
      id: "QTN-0426",
      customer: "Rohit Kumar",
      dealer: "Shree Ram Motors",
      amount: 245000,
      status: "Approved",
      chassis: "ME9EBCR123H268XYZ",
    },
    {
      id: "QTN-0425",
      customer: "Pooja Sharma",
      dealer: "Rahul Auto Sales",
      amount: 310000,
      status: "Pending",
      chassis: "ME9EBCC456H268ABC",
    },
    {
      id: "QTN-0424",
      customer: "Amit Singh",
      dealer: "Green Energy Motors",
      amount: 450000,
      status: "Pending",
      chassis: "ME9EBCC789H268DEF",
    },
    {
      id: "QTN-0423",
      customer: "Suresh Yadav",
      dealer: "Metro EV Dealers",
      amount: 230000,
      status: "Approved",
      chassis: "ME9EBCR012H268GHI",
    },
  ],
  recentInvoices: [
    {
      billNo: "INV-0089",
      dealer: "Shree Ram Motors",
      amount: 245000,
      date: "Apr 25",
    },
    {
      billNo: "INV-0088",
      dealer: "Rahul Auto Sales",
      amount: 310000,
      date: "Apr 24",
    },
    {
      billNo: "INV-0087",
      dealer: "Green Energy Motors",
      amount: 450000,
      date: "Apr 23",
    },
  ],
  funnel: [
    { label: "Quotations", value: 207, color: "#3b82f6" },
    { label: "Approved", value: 142, color: "#06b6d4" },
    { label: "Billed", value: 118, color: "#8b5cf6" },
    { label: "Dispatched", value: 98, color: "#10b981" },
  ],
};

// ═══════════════════════════════════════════════════════════
//  UTILS
// ═══════════════════════════════════════════════════════════
const formatINR = (v) => {
  const n = Number(v) || 0;
  if (n >= 10000000) return `₹${(n / 10000000).toFixed(2)} Cr`;
  if (n >= 100000) return `₹${(n / 100000).toFixed(2)} L`;
  if (n >= 1000) return `₹${(n / 1000).toFixed(1)}K`;
  return `₹${n.toLocaleString("en-IN")}`;
};

const CountUp = ({ end, duration = 1000 }) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let startTime;
    let animationFrame;
    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(end * eased));
      if (progress < 1) animationFrame = requestAnimationFrame(animate);
    };
    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [end, duration]);
  return <>{count.toLocaleString("en-IN")}</>;
};

// ═══════════════════════════════════════════════════════════
//  COMPONENTS
// ═══════════════════════════════════════════════════════════
const SectionHeader = ({
  icon: Icon,
  title,
  subtitle,
  count,
  gradient,
  onViewAll,
}) => (
  <div className="flex items-center justify-between mb-3">
    <div className="flex items-center gap-3">
      <div
        className={`relative w-10 h-10 rounded-xl ${gradient} flex items-center justify-center shadow-md`}
      >
        <div
          className={`absolute inset-0 rounded-xl ${gradient} blur-lg opacity-40 animate-pulse-slow`}
        />
        <Icon size={18} className="text-white relative z-10" />
      </div>
      <div>
        <h2 className="text-lg font-black text-slate-800 tracking-tight flex items-center gap-2">
          {title}
          {count !== undefined && (
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
              {count}
            </span>
          )}
        </h2>
        <p className="text-[11px] text-slate-500">{subtitle}</p>
      </div>
    </div>
    {onViewAll && (
      <button
        onClick={onViewAll}
        className="group flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 text-white text-[11px] font-bold hover:bg-slate-800 transition-all active:scale-95"
      >
        View All
        <ArrowRight
          size={12}
          className="group-hover:translate-x-0.5 transition-transform"
        />
      </button>
    )}
  </div>
);

const HeroCard = ({
  icon: Icon,
  label,
  value,
  trend,
  trendUp,
  gradient,
  onClick,
  delay = 0,
}) => (
  <button
    onClick={onClick}
    className={`group relative overflow-hidden w-full text-left rounded-2xl p-4 ${gradient} text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 active:scale-[0.98] animate-slide-up`}
    style={{ animationDelay: `${delay}ms` }}
  >
    <div className="absolute -top-12 -right-12 w-32 h-32 rounded-full bg-white/20 blur-2xl animate-pulse-slow" />
    <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent" />

    <div className="relative z-10 flex items-center gap-3">
      <div className="w-11 h-11 rounded-xl bg-white/20 backdrop-blur-xl border border-white/30 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
        <Icon size={20} className="text-white" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[10px] font-semibold text-white/80 uppercase tracking-wider">
          {label}
        </p>
        <p className="text-2xl font-black leading-tight tabular">{value}</p>
        <div className="flex items-center gap-1.5 text-[10px] font-bold text-white/90 mt-0.5">
          {trendUp ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
          {trend}
          <span className="text-white/60 font-normal">vs last month</span>
        </div>
      </div>
    </div>
  </button>
);

// ✅ NeonCard — color ALWAYS visible
const NeonCard = ({
  icon: Icon,
  label,
  value,
  color,
  subLabel,
  onClick,
  delay = 0,
}) => (
  <button
    onClick={onClick}
    className="group relative overflow-hidden w-full text-left rounded-xl p-3 bg-white border border-slate-100 hover:border-transparent transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md animate-slide-up"
    style={{ animationDelay: `${delay}ms` }}
  >
    {/* ✅ ALWAYS visible color tint */}
    <div
      className="absolute inset-0 opacity-[0.06] group-hover:opacity-[0.12] transition-opacity duration-300"
      style={{ background: `linear-gradient(135deg, ${color}, transparent)` }}
    />
    {/* ✅ ALWAYS visible top color bar */}
    <div
      className="absolute top-0 left-0 right-0 h-0.5 transition-all duration-300 group-hover:h-1"
      style={{ backgroundColor: color, boxShadow: `0 0 8px ${color}` }}
    />

    <div className="relative z-10 flex items-center gap-2.5">
      <div
        className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 transition-transform group-hover:scale-110"
        style={{
          backgroundColor: `${color}20`,
          color,
          boxShadow: `0 0 0 1px ${color}30`,
        }}
      >
        <Icon size={16} />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[10px] text-slate-500 font-medium truncate">
          {label}
        </p>
        <p className="text-lg font-black text-slate-800 leading-tight tabular">
          <CountUp end={value} duration={800} />
        </p>
        {subLabel && (
          <p className="text-[9px] text-slate-400 truncate">{subLabel}</p>
        )}
      </div>
      <ChevronRight
        size={14}
        className="text-slate-300 group-hover:text-slate-600 group-hover:translate-x-0.5 transition-all shrink-0"
      />
    </div>
  </button>
);

const ProgressRow = ({ label, value, max, color, onClick }) => {
  const pct = (value / max) * 100;
  return (
    <button
      onClick={onClick}
      className="group w-full text-left flex items-center gap-2 py-1.5 px-1.5 -mx-1.5 rounded-md hover:bg-slate-50 transition-colors"
    >
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs font-semibold text-slate-700 truncate">
            {label}
          </span>
          <span className="text-xs font-black text-slate-800 ml-2 tabular">
            {value}
          </span>
        </div>
        <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-1000 ease-out"
            style={{
              width: `${pct}%`,
              background: `linear-gradient(90deg, ${color}, ${color}cc)`,
              boxShadow: `0 0 6px ${color}50`,
            }}
          />
        </div>
      </div>
      <ChevronRight
        size={12}
        className="text-slate-300 group-hover:text-slate-600 group-hover:translate-x-0.5 transition-all shrink-0"
      />
    </button>
  );
};

const TopPerformers = ({ dealers, onClick }) => {
  const maxVal = Math.max(...dealers.map((d) => d.value));
  const medals = ["🥇", "🥈", "🥉", "4", "5"];
  const themes = [
    { bar: "linear-gradient(90deg, #fbbf24, #f59e0b)", glow: "#f59e0b" },
    { bar: "linear-gradient(90deg, #94a3b8, #64748b)", glow: "#64748b" },
    { bar: "linear-gradient(90deg, #fb923c, #ea580c)", glow: "#ea580c" },
    { bar: "linear-gradient(90deg, #60a5fa, #3b82f6)", glow: "#3b82f6" },
    { bar: "linear-gradient(90deg, #a78bfa, #8b5cf6)", glow: "#8b5cf6" },
  ];

  return (
    <div className="space-y-2.5">
      {dealers.slice(0, 5).map((d, i) => {
        const pct = (d.value / maxVal) * 100;
        const theme = themes[i];
        return (
          <button
            key={i}
            onClick={() => onClick(d)}
            className="group w-full text-left p-2 -mx-2 rounded-lg hover:bg-slate-50 transition-colors"
          >
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-2 min-w-0">
                <span
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black shrink-0 ${
                    i < 3 ? "" : "bg-slate-100 text-slate-500"
                  }`}
                  style={
                    i < 3
                      ? {
                          background: `linear-gradient(135deg, ${theme.glow}30, ${theme.glow}60)`,
                          color: theme.glow,
                        }
                      : {}
                  }
                >
                  {medals[i]}
                </span>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-slate-800 truncate">
                    {d.name}
                  </p>
                  <p className="text-[10px] text-slate-500">{d.city}</p>
                </div>
              </div>
              <span className="text-xs font-black text-slate-800 tabular shrink-0 ml-2">
                {formatINR(d.value)}
              </span>
            </div>
            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-1000 ease-out"
                style={{
                  width: `${pct}%`,
                  background: theme.bar,
                  boxShadow: `0 0 8px ${theme.glow}80`,
                }}
              />
            </div>
          </button>
        );
      })}
    </div>
  );
};

// ✅ ListModal with drill-down support
const ListModal = ({
  open,
  onClose,
  title,
  subtitle,
  items = [],
  valueFormatter,
  columns,
  gradient,
  onItemClick,
  breadcrumb,
  onBack,
  onForward,
  canGoBack,
  canGoForward,
}) => (
  <Modal
    open={open}
    onClose={onClose}
    title={title}
    subtitle={subtitle}
    maxWidth="max-w-2xl"
    breadcrumb={breadcrumb}
    onBack={onBack}
    onForward={onForward}
    canGoBack={canGoBack}
    canGoForward={canGoForward}
  >
    {columns ? (
      <div className="overflow-x-auto rounded-xl border border-slate-200">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-slate-600 text-xs uppercase tracking-wider">
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  className="px-3 py-2.5 text-left font-semibold"
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {items.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-3 py-8 text-center text-slate-400 text-sm"
                >
                  No records found
                </td>
              </tr>
            ) : (
              items.map((item, i) => (
                <tr
                  key={i}
                  onClick={() => onItemClick?.(item)}
                  className={`transition-colors ${onItemClick ? "cursor-pointer hover:bg-blue-50/60" : "hover:bg-slate-50/50"}`}
                >
                  {columns.map((col) => (
                    <td key={col.key} className="px-3 py-2.5 text-slate-700">
                      {col.render ? col.render(item) : item[col.key]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    ) : (
      <div className="space-y-1.5">
        {items.length === 0 ? (
          <p className="text-center text-slate-400 text-sm py-8">
            No items to display
          </p>
        ) : (
          items.map((item, i) => (
            <div
              key={i}
              onClick={() => onItemClick?.(item)}
              className={`flex items-center justify-between p-2.5 rounded-lg bg-gradient-to-r from-slate-50 to-white border border-slate-100 transition-all group ${
                onItemClick
                  ? "cursor-pointer hover:border-blue-200 hover:shadow-sm hover:from-blue-50/50"
                  : "hover:bg-slate-100"
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                {item.color && (
                  <div
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{
                      backgroundColor: item.hex || item.color,
                      boxShadow: `0 0 6px ${item.hex || item.color}80`,
                    }}
                  />
                )}
                <div className="min-w-0">
                  <p className="text-sm font-medium text-slate-800 truncate">
                    {item.label || item.name || "Untitled"}
                  </p>
                  {item.sub && (
                    <p className="text-[11px] text-slate-500 truncate">
                      {item.sub}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0 ml-3">
                <span className="text-sm font-black text-slate-800 tabular">
                  {valueFormatter
                    ? valueFormatter(item.value)
                    : (item.value ?? "—")}
                </span>
                {onItemClick && (
                  <ChevronRight
                    size={14}
                    className="text-slate-300 group-hover:text-blue-500 group-hover:translate-x-0.5 transition-all"
                  />
                )}
              </div>
            </div>
          ))
        )}
      </div>
    )}
  </Modal>
);

// ═══════════════════════════════════════════════════════════
//  MODAL CONTENT RESOLVER
// ═══════════════════════════════════════════════════════════
const resolveModal = (modal) => {
  if (!modal) return null;
  const { type, payload } = modal;

  const resolver = {
    // ── VEHICLES ──
    allVehicles: () => ({
      title: "All Vehicles",
      subtitle: `${VEHICLES.total} total vehicles across all types`,
      items: VEHICLES.byType.map((t) => ({
        label: t.label,
        value: t.value,
        color: t.color,
        _type: t,
      })),
      valueFormatter: (v) => `${v} units`,
      drilldown: (item) => ({ type: "vehicleType", payload: item._type }),
    }),
    vehicleType: () => ({
      title: `${payload?.label || ""} Models`,
      subtitle: `${payload?.value || 0} vehicles · ${payload?.models?.length || 0} models`,
      items: (payload?.models || []).map((m) => ({
        label: m,
        value: Math.floor(
          (payload?.value || 0) / (payload?.models?.length || 1),
        ),
        _model: m,
        _color: payload?.color,
      })),
      valueFormatter: (v) => `${v} units`,
      drilldown: (item) => ({
        type: "vehicleModel",
        payload: { label: item._model, value: item.value, color: item._color },
      }),
    }),
    vehicleModel: () => ({
      title: `Model: ${payload?.label || ""}`,
      subtitle: `${payload?.value || 0} vehicles manufactured`,
      items: [
        {
          label: "In Stock",
          value: Math.floor((payload?.value || 0) * 0.4),
          color: "#0ea5e9",
        },
        {
          label: "Dispatched",
          value: Math.floor((payload?.value || 0) * 0.5),
          color: "#10b981",
        },
        {
          label: "In Production",
          value: Math.floor((payload?.value || 0) * 0.1),
          color: "#f59e0b",
        },
      ],
      valueFormatter: (v) => `${v} units`,
    }),
    vehicleStatus: () => ({
      title: payload?.label || "",
      subtitle: `${payload?.value || 0} vehicles in this status`,
      items: [
        { label: "F1", value: 45, color: "#3b82f6", _model: "F1" },
        { label: "F2", value: 38, color: "#06b6d4", _model: "F2" },
        { label: "F3", value: 32, color: "#10b981", _model: "F3" },
        { label: "LODER", value: 35, color: "#8b5cf6", _model: "LODER" },
      ],
      valueFormatter: (v) => `${v} units`,
      drilldown: (item) => ({
        type: "vehicleModel",
        payload: { label: item._model, value: item.value, color: item.color },
      }),
    }),
    vehicleDispatch: () => ({
      title: payload?.label || "",
      subtitle: `${payload?.value || 0} vehicles in this dispatch stage`,
      items: [
        {
          label: "Shree Ram Motors",
          value: 25,
          sub: "Delhi",
          color: "#10b981",
          _dealer: "Shree Ram Motors",
        },
        {
          label: "Rahul Auto Sales",
          value: 18,
          sub: "Jaipur",
          color: "#10b981",
          _dealer: "Rahul Auto Sales",
        },
        {
          label: "Green Energy Motors",
          value: 15,
          sub: "Lucknow",
          color: "#10b981",
          _dealer: "Green Energy Motors",
        },
      ],
      valueFormatter: (v) => `${v} units`,
      drilldown: (item) => ({
        type: "dealerDetail",
        payload: {
          name: item._dealer,
          city: item.sub,
          value: item.value * 50000,
          quotations: item.value,
        },
      }),
    }),
    vehicleBrand: () => ({
      title: payload?.label || "",
      subtitle: `${payload?.value || 0} vehicles under this brand`,
      items:
        payload?.sub === "Rikshaw"
          ? [
              { label: "F1", value: 156, color: payload?.color, _model: "F1" },
              { label: "F2", value: 138, color: payload?.color, _model: "F2" },
              { label: "F3", value: 102, color: payload?.color, _model: "F3" },
              { label: "F4", value: 89, color: payload?.color, _model: "F4" },
              {
                label: "DELUX",
                value: 68,
                color: payload?.color,
                _model: "DELUX",
              },
            ]
          : [
              {
                label: "LODER",
                value: 267,
                color: payload?.color,
                _model: "LODER",
              },
            ],
      valueFormatter: (v) => `${v} units`,
      drilldown: (item) => ({
        type: "vehicleModel",
        payload: { label: item._model, value: item.value, color: item.color },
      }),
    }),
    vehicleColor: () => ({
      title: `Color: ${payload?.label || ""}`,
      subtitle: `${payload?.value || 0} vehicles in this color`,
      items: [
        {
          label: "E-Rickshaw",
          value: Math.floor((payload?.value || 0) * 0.7),
          color: payload?.hex,
        },
        {
          label: "E-Cargo",
          value: Math.floor((payload?.value || 0) * 0.3),
          color: payload?.hex,
        },
      ],
      valueFormatter: (v) => `${v} units`,
    }),

    // ── DEALERS ──
    allDealers: () => ({
      title: "All Dealers",
      subtitle: `${DEALERS.total} total dealers`,
      items: DEALERS.byStatus.map((s) => ({
        label: s.label,
        value: s.value,
        color: s.color,
        _status: s,
      })),
      valueFormatter: (v) => `${v} dealers`,
      drilldown: (item) => ({ type: "dealerStatus", payload: item._status }),
    }),
    dealerStatus: () => ({
      title: `${payload?.label || ""} Dealers`,
      subtitle: `${payload?.value || 0} dealers`,
      columns: [
        { key: "name", label: "Dealer" },
        { key: "city", label: "City" },
        { key: "state", label: "State" },
        { key: "quotations", label: "Qtn" },
      ],
      items: [
        {
          name: "Shree Ram Motors",
          city: "Delhi",
          state: "Delhi",
          quotations: 45,
          value: 1245000,
        },
        {
          name: "Rahul Auto Sales",
          city: "Jaipur",
          state: "Rajasthan",
          quotations: 38,
          value: 987000,
        },
        {
          name: "Green Energy Motors",
          city: "Lucknow",
          state: "UP",
          quotations: 32,
          value: 856000,
        },
        {
          name: "Metro EV Dealers",
          city: "Gurgaon",
          state: "Haryana",
          quotations: 28,
          value: 743000,
        },
      ],
      onItemClick: true,
      drilldown: (item) => ({
        type: "dealerDetail",
        payload: {
          name: item.name,
          city: item.city,
          value: item.value,
          quotations: item.quotations,
        },
      }),
    }),
    dealerState: () => ({
      title: `Dealers in ${payload?.label || ""}`,
      subtitle: `${payload?.value || 0} dealers`,
      items: [
        {
          label: "Shree Ram Motors",
          value: 45,
          sub: "Delhi",
          color: "#3b82f6",
          _dealer: "Shree Ram Motors",
        },
        {
          label: "Metro EV Dealers",
          value: 28,
          sub: "Gurgaon",
          color: "#3b82f6",
          _dealer: "Metro EV Dealers",
        },
        {
          label: "Capital Auto Hub",
          value: 15,
          sub: "New Delhi",
          color: "#3b82f6",
          _dealer: "Capital Auto Hub",
        },
      ],
      valueFormatter: (v) => `${v} qtn`,
      drilldown: (item) => ({
        type: "dealerDetail",
        payload: {
          name: item._dealer,
          city: item.sub,
          value: item.value * 30000,
          quotations: item.value,
        },
      }),
    }),
    dealerRecent: () => ({
      title: "New Dealers (Last 30 Days)",
      subtitle: `${DEALERS.recentAdditions} dealers joined recently`,
      items: [
        {
          label: "Krishna EV Point",
          value: "12d ago",
          sub: "Kanpur",
          color: "#06b6d4",
        },
        {
          label: "Sunrise Motors",
          value: "9d ago",
          sub: "Nagpur",
          color: "#06b6d4",
        },
        {
          label: "City Auto Hub",
          value: "8d ago",
          sub: "Indore",
          color: "#06b6d4",
        },
      ],
    }),
    dealerAttention: () => ({
      title: payload?.name || "",
      subtitle: `${payload?.city} · Pending ${payload?.days} days`,
      items: [
        { label: "Submitted On", value: "Apr 14, 2025" },
        { label: "GSTIN", value: "27AXXXXX1234X1" },
        { label: "Contact", value: "+91 98765 43210" },
        { label: "Pending Since", value: `${payload?.days} days` },
      ],
    }),
    dealerDetail: () => ({
      title: payload?.name || "Dealer",
      subtitle: payload?.city || "",
      items: [
        {
          label: "Total Revenue",
          value: formatINR(payload?.value || 0),
          color: "#10b981",
        },
        {
          label: "Quotations",
          value: payload?.quotations || 0,
          color: "#3b82f6",
        },
        { label: "Status", value: "Active", color: "#10b981" },
        { label: "Joined On", value: "Jan 15, 2024", color: "#8b5cf6" },
      ],
    }),

    // ── SALES ──
    allSales: () => ({
      title: "All Sales",
      subtitle: `${formatINR(SALES.thisMonth)} this month`,
      items: SALES.byTimePeriod.map((p) => ({
        label: p.label,
        value: p.value,
        color: p.color,
        _period: p,
      })),
      valueFormatter: formatINR,
      drilldown: (item) => ({ type: "salesTimePeriod", payload: item._period }),
    }),
    salesTimePeriod: () => ({
      title: payload?.label || "",
      subtitle: `Total: ${formatINR(payload?.value || 0)}`,
      items: [
        {
          label: "Rikshaw Sales",
          value: Math.floor((payload?.value || 0) * 0.66),
          color: "#3b82f6",
          sub: "145 qtn",
        },
        {
          label: "Cargo Sales",
          value: Math.floor((payload?.value || 0) * 0.34),
          color: "#10b981",
          sub: "62 qtn",
        },
      ],
      valueFormatter: formatINR,
    }),
    salesVehicleType: () => ({
      title: payload?.label || "",
      subtitle: `${formatINR(payload?.value || 0)} · ${payload?.count || 0} quotations`,
      items: [
        { label: "F1", value: 850000, sub: "32 qtn", color: "#3b82f6" },
        { label: "F2", value: 720000, sub: "28 qtn", color: "#3b82f6" },
        { label: "LODER", value: 1200000, sub: "35 qtn", color: "#10b981" },
      ],
      valueFormatter: formatINR,
    }),
    salesStatus: () => ({
      title: payload?.label || "",
      subtitle: `${formatINR(payload?.value || 0)} · ${payload?.count || 0} qtn`,
      items: [
        {
          label: "Last 7 days",
          value: Math.floor((payload?.value || 0) * 0.4),
          color: "#10b981",
        },
        {
          label: "Last 30 days",
          value: Math.floor((payload?.value || 0) * 0.7),
          color: "#10b981",
        },
        { label: "This quarter", value: payload?.value || 0, color: "#10b981" },
      ],
      valueFormatter: formatINR,
    }),
    salesFunnel: () => ({
      title: payload?.label || "",
      subtitle: `${payload?.value || 0} total at this stage`,
      items: [
        {
          label: "E-Rickshaw",
          value: Math.floor((payload?.value || 0) * 0.7),
          color: "#3b82f6",
        },
        {
          label: "E-Cargo",
          value: Math.floor((payload?.value || 0) * 0.3),
          color: "#10b981",
        },
      ],
    }),
    quotationDetail: () => ({
      title: payload?.id || "Quotation",
      subtitle: `${payload?.customer} · ${payload?.dealer}`,
      items: [
        {
          label: "Amount",
          value: formatINR(payload?.amount || 0),
          color: "#3b82f6",
        },
        { label: "Status", value: payload?.status, color: "#10b981" },
        { label: "Chassis", value: payload?.chassis, color: "#8b5cf6" },
        { label: "Customer", value: payload?.customer, color: "#06b6d4" },
      ],
    }),
    invoiceDetail: () => ({
      title: payload?.billNo || "Invoice",
      subtitle: payload?.dealer || "",
      items: [
        {
          label: "Amount",
          value: formatINR(payload?.amount || 0),
          color: "#10b981",
        },
        { label: "Date", value: payload?.date, color: "#3b82f6" },
        { label: "Dealer", value: payload?.dealer, color: "#8b5cf6" },
      ],
    }),
  };

  return resolver[type]?.();
};

// ═══════════════════════════════════════════════════════════
//  MAIN DASHBOARD
// ═══════════════════════════════════════════════════════════
const AdminDash = () => {
  // ✅ Modal history for back/forward navigation
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  const currentModal = historyIndex >= 0 ? history[historyIndex] : null;
  const canGoBack = historyIndex > 0;
  const canGoForward = historyIndex < history.length - 1;

  const openModal = (modal) => {
    // If opening new modal, truncate forward history
    const newHistory = [...history.slice(0, historyIndex + 1), modal];
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  const closeModal = () => {
    setHistory([]);
    setHistoryIndex(-1);
  };

  const goBack = () => {
    if (canGoBack) setHistoryIndex(historyIndex - 1);
  };

  const goForward = () => {
    if (canGoForward) setHistoryIndex(historyIndex + 1);
  };

  // Drill down — opens new modal in same window
  const drillDown = (item, resolverData) => {
    if (resolverData?.drilldown) {
      const nextModal = resolverData.drilldown(item);
      if (nextModal) openModal(nextModal);
    }
  };

  const data = resolveModal(currentModal);

  // Breadcrumb from history
  const breadcrumb = history
    .slice(0, historyIndex + 1)
    .map((m) => m.type?.replace(/([A-Z])/g, " $1").trim())
    .slice(-3); // last 3 items

  return (
    <div className="space-y-4 max-w-[1400px] mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">
            Dashboard
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Click any card to explore details
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
            </span>
            <span className="text-[10px] font-bold text-emerald-600">LIVE</span>
          </div>
          <span className="text-[11px] text-slate-500 hidden sm:block">
            Apr 26, 2025 · 10:24 AM
          </span>
        </div>
      </div>

      {/* Hero Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <HeroCard
          icon={Truck}
          label="Total Vehicles"
          value={<CountUp end={VEHICLES.total} />}
          trend="11%"
          trendUp={true}
          gradient="bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-600"
          onClick={() => openModal({ type: "allVehicles" })}
          delay={0}
        />
        <HeroCard
          icon={Users}
          label="Total Dealers"
          value={<CountUp end={DEALERS.total} />}
          trend="12%"
          trendUp={true}
          gradient="bg-gradient-to-br from-emerald-500 via-teal-600 to-cyan-600"
          onClick={() => openModal({ type: "allDealers" })}
          delay={80}
        />
        <HeroCard
          icon={IndianRupee}
          label="Sales This Month"
          value={formatINR(SALES.thisMonth)}
          trend="18%"
          trendUp={true}
          gradient="bg-gradient-to-br from-purple-500 via-fuchsia-600 to-pink-600"
          onClick={() => openModal({ type: "allSales" })}
          delay={160}
        />
      </div>

      {/* ═══════════ VEHICLES ═══════════ */}
      <section className="animate-fade-in-up">
        <SectionHeader
          icon={Truck}
          title="Vehicles"
          subtitle="Everything about your fleet"
          count={VEHICLES.total}
          gradient="bg-gradient-to-br from-blue-500 to-indigo-600"
          onViewAll={() => openModal({ type: "allVehicles" })}
        />

        <div className="grid grid-cols-2 gap-2 mb-3">
          {VEHICLES.byType.map((t, i) => (
            <NeonCard
              key={t.label}
              icon={t.icon}
              label={t.label}
              value={t.value}
              color={t.color}
              subLabel={`${((t.value / VEHICLES.total) * 100).toFixed(0)}% of total`}
              onClick={() => openModal({ type: "vehicleType", payload: t })}
              delay={i * 60}
            />
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
          <Card className="p-4 relative overflow-hidden">
            <div className="absolute -top-16 -right-16 w-32 h-32 rounded-full bg-amber-100 blur-3xl opacity-50" />
            <h3 className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-2 relative z-10">
              <div className="w-6 h-6 rounded-md bg-amber-100 flex items-center justify-center">
                <Activity size={12} className="text-amber-600" />
              </div>
              By Status
            </h3>
            <div className="space-y-2 relative z-10">
              {VEHICLES.byStatus.map((s) => {
                const Icon = s.icon;
                const pct = (s.value / VEHICLES.total) * 100;
                return (
                  <button
                    key={s.label}
                    onClick={() =>
                      openModal({ type: "vehicleStatus", payload: s })
                    }
                    className="group w-full flex items-center gap-2 p-2 rounded-lg bg-white border border-slate-100 hover:border-slate-300 hover:shadow-sm transition-all"
                  >
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform"
                      style={{
                        backgroundColor: `${s.color}20`,
                        color: s.color,
                        boxShadow: `0 0 0 1px ${s.color}30`,
                      }}
                    >
                      <Icon size={14} />
                    </div>
                    <div className="text-left flex-1 min-w-0">
                      <p className="text-[11px] text-slate-500 font-medium truncate">
                        {s.label}
                      </p>
                      <p className="text-base font-black text-slate-800 tabular leading-tight">
                        <CountUp end={s.value} duration={800} />
                      </p>
                    </div>
                    <span className="text-[10px] font-bold text-slate-400 tabular">
                      {pct.toFixed(0)}%
                    </span>
                  </button>
                );
              })}
            </div>
          </Card>

          <Card className="p-4 relative overflow-hidden">
            <div className="absolute -top-16 -right-16 w-32 h-32 rounded-full bg-emerald-100 blur-3xl opacity-50" />
            <h3 className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-2 relative z-10">
              <div className="w-6 h-6 rounded-md bg-emerald-100 flex items-center justify-center">
                <Package size={12} className="text-emerald-600" />
              </div>
              Dispatch Pipeline
            </h3>
            <div className="space-y-2 relative z-10">
              {VEHICLES.byDispatch.map((d) => {
                const Icon = d.icon;
                return (
                  <button
                    key={d.label}
                    onClick={() =>
                      openModal({ type: "vehicleDispatch", payload: d })
                    }
                    className="group w-full flex items-center gap-2 p-2 rounded-lg bg-gradient-to-r from-slate-50 to-white border border-slate-100 hover:border-emerald-300 hover:shadow-sm transition-all"
                  >
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform"
                      style={{
                        backgroundColor: `${d.color}20`,
                        color: d.color,
                        boxShadow: `0 0 0 1px ${d.color}30`,
                      }}
                    >
                      <Icon size={14} />
                    </div>
                    <div className="text-left flex-1 min-w-0">
                      <p className="text-[11px] text-slate-500 font-medium truncate">
                        {d.label}
                      </p>
                      <p className="text-base font-black text-slate-800 tabular leading-tight">
                        <CountUp end={d.value} duration={800} />
                      </p>
                    </div>
                    <ChevronRight
                      size={12}
                      className="text-slate-300 group-hover:text-emerald-600 group-hover:translate-x-0.5 transition-all"
                    />
                  </button>
                );
              })}
            </div>
          </Card>

          <Card className="p-4 relative overflow-hidden">
            <div className="absolute -top-16 -right-16 w-32 h-32 rounded-full bg-cyan-100 blur-3xl opacity-50" />
            <h3 className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-2 relative z-10">
              <div className="w-6 h-6 rounded-md bg-cyan-100 flex items-center justify-center">
                <BarChart3 size={12} className="text-cyan-600" />
              </div>
              Model Distribution
            </h3>
            <div className="grid grid-cols-2 gap-1.5 relative z-10">
              {VEHICLES.byModel.map((m) => (
                <button
                  key={m.label}
                  onClick={() =>
                    openModal({ type: "vehicleModel", payload: m })
                  }
                  className="group p-2 rounded-lg bg-white border border-slate-100 hover:border-cyan-300 hover:bg-cyan-50/30 transition-all text-left"
                >
                  <p className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">
                    {m.label}
                  </p>
                  <p className="text-sm font-black text-slate-800 group-hover:text-cyan-600 transition-colors tabular">
                    <CountUp end={m.value} duration={700} />
                  </p>
                </button>
              ))}
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 mt-3">
          <Card className="p-4">
            <h3 className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-blue-100 flex items-center justify-center">
                <Building2 size={12} className="text-blue-600" />
              </div>
              By Brand
            </h3>
            <div className="space-y-2.5">
              {VEHICLES.byBrand.map((b) => {
                const pct = (b.value / VEHICLES.total) * 100;
                return (
                  <button
                    key={b.label}
                    onClick={() =>
                      openModal({ type: "vehicleBrand", payload: b })
                    }
                    className="group w-full text-left"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <p className="text-xs font-bold text-slate-800">
                          {b.label}
                        </p>
                        <span className="text-[9px] text-slate-400 uppercase tracking-wider">
                          {b.sub}
                        </span>
                      </div>
                      <span className="text-sm font-black text-slate-800 tabular">
                        {b.value}
                      </span>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-1000"
                        style={{
                          width: `${pct}%`,
                          background: `linear-gradient(90deg, ${b.color}, ${b.color}cc)`,
                          boxShadow: `0 0 6px ${b.color}50`,
                        }}
                      />
                    </div>
                  </button>
                );
              })}
            </div>
          </Card>

          <Card className="p-4">
            <h3 className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-pink-100 flex items-center justify-center">
                <Palette size={12} className="text-pink-600" />
              </div>
              Top Colors
            </h3>
            <div className="flex items-end justify-between gap-2 h-20">
              {VEHICLES.byColor.map((c) => {
                const maxVal = Math.max(
                  ...VEHICLES.byColor.map((x) => x.value),
                );
                const heightPct = (c.value / maxVal) * 100;
                return (
                  <button
                    key={c.label}
                    onClick={() =>
                      openModal({ type: "vehicleColor", payload: c })
                    }
                    className="group flex-1 flex flex-col items-center gap-0.5"
                  >
                    <span className="text-[9px] font-black text-slate-800 tabular">
                      {c.value}
                    </span>
                    <div
                      className="w-full rounded-t transition-all duration-500 group-hover:-translate-y-0.5 group-hover:shadow-lg"
                      style={{
                        height: `${heightPct}%`,
                        backgroundColor: c.hex,
                        minHeight: "12px",
                        boxShadow: `0 0 0 1px ${c.hex}40`,
                      }}
                    />
                    <span className="text-[9px] font-semibold text-slate-500 group-hover:text-slate-800 transition-colors">
                      {c.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </Card>
        </div>
      </section>

      {/* ═══════════ DEALERS ═══════════ */}
      <section
        className="animate-fade-in-up"
        style={{ animationDelay: "80ms" }}
      >
        <SectionHeader
          icon={Users}
          title="Dealers"
          subtitle="Your dealer network"
          count={DEALERS.total}
          gradient="bg-gradient-to-br from-emerald-500 to-teal-600"
          onViewAll={() => openModal({ type: "allDealers" })}
        />

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-3">
          {DEALERS.byStatus.map((s, i) => (
            <NeonCard
              key={s.label}
              icon={s.icon}
              label={s.label}
              value={s.value}
              color={s.color}
              subLabel={`${((s.value / DEALERS.total) * 100).toFixed(0)}% of total`}
              onClick={() => openModal({ type: "dealerStatus", payload: s })}
              delay={i * 60}
            />
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
          <Card className="p-4 relative overflow-hidden">
            <div className="absolute -top-16 -right-16 w-32 h-32 rounded-full bg-yellow-100 blur-3xl opacity-60" />
            <h3 className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-2 relative z-10">
              <div className="w-6 h-6 rounded-md bg-gradient-to-br from-yellow-400 to-amber-500 flex items-center justify-center shadow-sm">
                <Crown size={12} className="text-white" />
              </div>
              Top Performers
            </h3>
            <div className="relative z-10">
              <TopPerformers
                dealers={DEALERS.topByRevenue}
                onClick={(d) => openModal({ type: "dealerDetail", payload: d })}
              />
            </div>
            <p className="text-[10px] text-slate-500 mt-3 text-center">
              By revenue this month
            </p>
          </Card>

          <Card className="p-4">
            <h3 className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-blue-100 flex items-center justify-center">
                <MapPin size={12} className="text-blue-600" />
              </div>
              By State
            </h3>
            <div className="space-y-0.5">
              {DEALERS.byState.map((s) => (
                <ProgressRow
                  key={s.label}
                  label={s.label}
                  value={s.value}
                  max={DEALERS.total}
                  color="#10b981"
                  onClick={() => openModal({ type: "dealerState", payload: s })}
                />
              ))}
            </div>
          </Card>

          <div className="space-y-3">
            <button
              onClick={() => openModal({ type: "dealerRecent" })}
              className="group relative overflow-hidden w-full text-left rounded-xl p-4 bg-gradient-to-br from-cyan-500 to-blue-600 text-white shadow-md hover:-translate-y-0.5 hover:shadow-lg transition-all duration-300"
            >
              <div className="absolute -top-8 -right-8 w-24 h-24 rounded-full bg-white/20 blur-2xl animate-pulse-slow" />
              <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
              <div className="relative z-10 flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-white/80">
                    New this month
                  </p>
                  <p className="text-3xl font-black tabular leading-none mt-1">
                    <CountUp end={DEALERS.recentAdditions} />
                  </p>
                  <p className="text-[10px] text-white/70 mt-1">
                    dealers joined
                  </p>
                </div>
                <Sparkles size={20} className="text-white/60" />
              </div>
            </button>

            <Card className="p-4">
              <h3 className="text-sm font-bold text-slate-800 mb-2.5 flex items-center gap-2">
                <div className="w-6 h-6 rounded-md bg-amber-100 flex items-center justify-center">
                  <AlertTriangle size={12} className="text-amber-600" />
                </div>
                Needs Attention
              </h3>
              <div className="space-y-1.5">
                {DEALERS.needsAttention.map((d, i) => (
                  <button
                    key={i}
                    onClick={() =>
                      openModal({ type: "dealerAttention", payload: d })
                    }
                    className="group w-full flex items-center justify-between p-2 rounded-lg hover:bg-amber-50 border border-transparent hover:border-amber-200 transition-all"
                  >
                    <div className="min-w-0 text-left">
                      <p className="text-xs font-medium text-slate-800 truncate">
                        {d.name}
                      </p>
                      <p className="text-[10px] text-slate-500">{d.city}</p>
                    </div>
                    <span className="text-[10px] font-black text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded-full flex items-center gap-1">
                      <Flame size={9} />
                      {d.days}d
                    </span>
                  </button>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* ═══════════ SALES ═══════════ */}
      <section
        className="animate-fade-in-up"
        style={{ animationDelay: "160ms" }}
      >
        <SectionHeader
          icon={IndianRupee}
          title="Sales"
          subtitle="Revenue, quotations & invoices"
          count={formatINR(SALES.thisMonth)}
          gradient="bg-gradient-to-br from-purple-500 to-fuchsia-600"
          onViewAll={() => openModal({ type: "allSales" })}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 mb-3">
          <Card className="lg:col-span-2 p-4 relative overflow-hidden">
            <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full bg-purple-100 blur-3xl opacity-40" />
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                  <div className="w-6 h-6 rounded-md bg-purple-100 flex items-center justify-center">
                    <TrendingUp size={12} className="text-purple-600" />
                  </div>
                  Revenue Trend
                </h3>
                <div className="text-right">
                  <p className="text-lg font-black text-slate-800 tabular">
                    {formatINR(SALES.thisMonth)}
                  </p>
                  <p className="text-[10px] font-bold text-emerald-600 flex items-center gap-1 justify-end">
                    <TrendingUp size={9} /> +{SALES.growth}%
                  </p>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={130}>
                <AreaChart data={SALES.trendData}>
                  <defs>
                    <linearGradient id="salesGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#a855f7" stopOpacity={0.5} />
                      <stop offset="100%" stopColor="#a855f7" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis
                    dataKey="day"
                    tick={{ fontSize: 10, fill: "#94a3b8" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis hide />
                  <Tooltip
                    formatter={(v) => [formatINR(v), "Sales"]}
                    contentStyle={{
                      borderRadius: 10,
                      border: "1px solid #e2e8f0",
                      fontSize: 11,
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="#a855f7"
                    strokeWidth={2.5}
                    fill="url(#salesGrad)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card className="p-4">
            <h3 className="text-sm font-bold text-slate-800 mb-2.5 flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-pink-100 flex items-center justify-center">
                <Clock size={12} className="text-pink-600" />
              </div>
              By Time Period
            </h3>
            <div className="space-y-1.5">
              {SALES.byTimePeriod.map((p) => (
                <button
                  key={p.label}
                  onClick={() =>
                    openModal({ type: "salesTimePeriod", payload: p })
                  }
                  className="group w-full flex items-center justify-between p-2 rounded-lg bg-gradient-to-r from-slate-50 to-white border border-slate-100 hover:border-purple-200 hover:shadow-sm transition-all"
                >
                  <div className="flex items-center gap-2">
                    <div
                      className="w-1 h-5 rounded-full"
                      style={{ backgroundColor: p.color }}
                    />
                    <span className="text-xs font-semibold text-slate-700">
                      {p.label}
                    </span>
                  </div>
                  <span className="text-xs font-black text-slate-800 tabular">
                    {formatINR(p.value)}
                  </span>
                </button>
              ))}
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 mb-3">
          <Card className="p-4">
            <h3 className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-blue-100 flex items-center justify-center">
                <Car size={12} className="text-blue-600" />
              </div>
              By Vehicle Type
            </h3>
            <div className="space-y-2.5">
              {SALES.byVehicleType.map((v) => {
                const pct = (v.value / SALES.thisMonth) * 100;
                return (
                  <button
                    key={v.label}
                    onClick={() =>
                      openModal({ type: "salesVehicleType", payload: v })
                    }
                    className="group w-full text-left"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-slate-700">
                        {v.label}
                      </span>
                      <span className="text-sm font-black text-slate-800 tabular">
                        {formatINR(v.value)}
                      </span>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-1000"
                        style={{
                          width: `${pct}%`,
                          background: `linear-gradient(90deg, ${v.color}, ${v.color}cc)`,
                          boxShadow: `0 0 6px ${v.color}50`,
                        }}
                      />
                    </div>
                    <p className="text-[9px] text-slate-400 mt-0.5">
                      {v.count} quotations · {pct.toFixed(1)}%
                    </p>
                  </button>
                );
              })}
            </div>
          </Card>

          <Card className="p-4">
            <h3 className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-emerald-100 flex items-center justify-center">
                <Activity size={12} className="text-emerald-600" />
              </div>
              By Status
            </h3>
            <div className="space-y-2">
              {SALES.byStatus.map((s) => {
                const Icon = s.icon;
                return (
                  <button
                    key={s.label}
                    onClick={() =>
                      openModal({ type: "salesStatus", payload: s })
                    }
                    className="group w-full flex items-center gap-2 p-2 rounded-lg bg-white border border-slate-100 hover:border-emerald-300 hover:shadow-sm transition-all"
                  >
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform"
                      style={{
                        backgroundColor: `${s.color}20`,
                        color: s.color,
                        boxShadow: `0 0 0 1px ${s.color}30`,
                      }}
                    >
                      <Icon size={14} />
                    </div>
                    <div className="text-left flex-1 min-w-0">
                      <p className="text-[10px] text-slate-500 font-medium">
                        {s.label}
                      </p>
                      <p className="text-sm font-black text-slate-800 tabular leading-tight">
                        {formatINR(s.value)}
                      </p>
                      <p className="text-[9px] text-slate-400">{s.count} qtn</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </Card>

          <Card className="p-4">
            <h3 className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-purple-100 flex items-center justify-center">
                <Target size={12} className="text-purple-600" />
              </div>
              Sales Funnel
            </h3>
            <div className="space-y-2">
              {SALES.funnel.map((f) => {
                const pct = (f.value / SALES.funnel[0].value) * 100;
                return (
                  <button
                    key={f.label}
                    onClick={() =>
                      openModal({ type: "salesFunnel", payload: f })
                    }
                    className="group w-full text-left"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">
                        {f.label}
                      </span>
                      <span className="text-xs font-black text-slate-800 tabular">
                        {f.value}
                      </span>
                    </div>
                    <div className="h-5 bg-slate-50 rounded-md overflow-hidden border border-slate-100">
                      <div
                        className="h-full rounded-md flex items-center justify-end pr-2 transition-all duration-1000"
                        style={{
                          width: `${pct}%`,
                          background: `linear-gradient(90deg, ${f.color}dd, ${f.color})`,
                          boxShadow: `0 0 8px ${f.color}50`,
                        }}
                      >
                        <span className="text-[9px] font-black text-white">
                          {pct.toFixed(0)}%
                        </span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          <Card className="p-4">
            <div className="flex items-center justify-between mb-2.5">
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <div className="w-6 h-6 rounded-md bg-blue-100 flex items-center justify-center">
                  <FileText size={12} className="text-blue-600" />
                </div>
                Recent Quotations
              </h3>
              <Link
                to="/quotations"
                className="text-[10px] font-bold text-blue-600 hover:underline"
              >
                View All →
              </Link>
            </div>
            <div className="space-y-1.5">
              {SALES.topQuotations.map((q, i) => (
                <button
                  key={i}
                  onClick={() =>
                    openModal({ type: "quotationDetail", payload: q })
                  }
                  className="group w-full flex items-center justify-between p-2 rounded-lg bg-gradient-to-r from-slate-50 to-white border border-slate-100 hover:border-blue-200 hover:shadow-sm transition-all"
                >
                  <div className="min-w-0 flex-1 text-left">
                    <p className="text-xs font-bold text-slate-800 truncate">
                      {q.customer}
                    </p>
                    <p className="text-[9px] text-slate-500 truncate font-mono">
                      {q.id} · {q.dealer}
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0 ml-2">
                    <span className="text-xs font-black text-slate-800 tabular">
                      {formatINR(q.amount)}
                    </span>
                    <ChevronRight
                      size={12}
                      className="text-slate-300 group-hover:text-blue-500 group-hover:translate-x-0.5 transition-all"
                    />
                  </div>
                </button>
              ))}
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center justify-between mb-2.5">
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <div className="w-6 h-6 rounded-md bg-emerald-100 flex items-center justify-center">
                  <FileText size={12} className="text-emerald-600" />
                </div>
                Recent Invoices
              </h3>
              <Link
                to="/dispatch"
                className="text-[10px] font-bold text-emerald-600 hover:underline"
              >
                View All →
              </Link>
            </div>
            <div className="space-y-1.5">
              {SALES.recentInvoices.map((inv, i) => (
                <button
                  key={i}
                  onClick={() =>
                    openModal({ type: "invoiceDetail", payload: inv })
                  }
                  className="group w-full flex items-center justify-between p-2 rounded-lg bg-gradient-to-r from-slate-50 to-white border border-slate-100 hover:border-emerald-200 hover:shadow-sm transition-all"
                >
                  <div className="min-w-0 flex-1 text-left">
                    <p className="text-xs font-bold text-slate-800 truncate font-mono">
                      {inv.billNo}
                    </p>
                    <p className="text-[9px] text-slate-500 truncate">
                      {inv.dealer} · {inv.date}
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0 ml-2">
                    <span className="text-xs font-black text-emerald-600 tabular">
                      {formatINR(inv.amount)}
                    </span>
                    <ChevronRight
                      size={12}
                      className="text-slate-300 group-hover:text-emerald-500 group-hover:translate-x-0.5 transition-all"
                    />
                  </div>
                </button>
              ))}
            </div>
          </Card>
        </div>
      </section>

      {/* ✅ SINGLE MODAL with navigation */}
      <ListModal
        open={!!currentModal}
        onClose={closeModal}
        title={data?.title || ""}
        subtitle={data?.subtitle}
        items={data?.items || []}
        columns={data?.columns}
        valueFormatter={data?.valueFormatter}
        onItemClick={
          data?.drilldown
            ? (item) => drillDown(item, data)
            : data?.onItemClick
              ? (item) => drillDown(item, data)
              : undefined
        }
        breadcrumb={breadcrumb}
        onBack={goBack}
        onForward={goForward}
        canGoBack={canGoBack}
        canGoForward={canGoForward}
      />
    </div>
  );
};

export default AdminDash;
