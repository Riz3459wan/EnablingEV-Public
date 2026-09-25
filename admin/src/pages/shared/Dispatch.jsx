import { useCallback, useMemo, useState } from "react";
import { Link } from "react-router";
import {
  ArrowLeft,
  Search,
  Eye,
  Truck,
  CheckCircle2,
  Calendar,
  MapPin,
} from "lucide-react";
import api from "../../api/client";
import { useAuth } from "../../auth/AuthContext";
import { useDealerInfo } from "../../auth/useDealerInfo";
import { ROLE_DASH, ROLE_LABEL } from "../../auth/roleConfig";
import useAsyncData from "../../hooks/useAsyncData";
import { Input, Select } from "../../components/ui/Field";
import DataTable from "../../components/ui/DataTable";
import Modal from "../../components/ui/Modal";
import Card from "../../components/ui/Card";
import { ErrorCard, LoadingCard } from "../../components/ui/AsyncStates";
import { formatINR, formatDate } from "../../features/quotation/calc";

const PAGE_SIZE = 25;
const MIN_DEALER_CODE_LENGTH = 7;
const LOAD_ERROR = "Couldn't load dispatched vehicles. Please try again.";

// ── Dispatch Detail Modal ──────────────────────────────────
const DispatchDetailModal = ({ quotation, onClose }) => {
  if (!quotation) return null;
  const q = quotation;

  const Row = ({ label, value, mono, icon: Icon }) => (
    <div className="flex justify-between py-2 border-b border-slate-100 last:border-0">
      <span className="text-xs text-slate-500 flex items-center gap-1.5">
        {Icon && <Icon size={12} className="text-slate-400" />}
        {label}
      </span>
      <span
        className={`text-sm text-slate-800 font-medium text-right ${mono ? "font-mono text-xs" : ""}`}
      >
        {value || "—"}
      </span>
    </div>
  );

  return (
    <Modal
      open={!!quotation}
      onClose={onClose}
      title="Dispatch Details"
      maxWidth="max-w-2xl"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-5 pb-5 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Truck size={16} className="text-green-600" />
            <span className="text-xs font-semibold text-green-600 uppercase tracking-wider">
              Dispatched
            </span>
          </div>
          <p className="text-lg font-bold text-slate-800 font-mono">
            {q.chassisNumber || "—"}
          </p>
        </div>
        <span className="text-[10px] uppercase tracking-wider font-semibold px-2.5 py-1 rounded-full bg-green-50 text-green-700 border border-green-200">
          Dispatched
        </span>
      </div>

      {/* Dispatch Summary Banner */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-xl p-4 mb-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shrink-0">
            <CheckCircle2 size={20} className="text-green-600" />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-800">
              Vehicle Successfully Dispatched
            </p>
            <p className="text-xs text-slate-600">
              {q.dealerName ? `To: ${q.dealerName}` : "Dealer info unavailable"}
            </p>
          </div>
        </div>
      </div>

      {/* Bill & Date */}
      <div className="grid sm:grid-cols-2 gap-x-6 mb-5">
        <Row label="Bill Number" value={q.billNumber} mono />
        <Row
          label="Dispatched On"
          value={
            q.updatedAt
              ? formatDate(q.updatedAt)
              : q.createdAt
                ? formatDate(q.createdAt)
                : null
          }
          icon={Calendar}
        />
      </div>

      {/* Dealer Info */}
      <h3 className="text-sm font-bold text-slate-800 mb-2">
        Dealer Information
      </h3>
      <div className="grid sm:grid-cols-2 gap-x-6 mb-5">
        <Row label="Dealer Name" value={q.dealerName} />
        <Row label="Dealer Code" value={q.dealerCode} mono />
        <Row label="GSTIN" value={q.dealerGstin} mono />
        <Row label="Mobile" value={q.dealerMobile} />
        <div className="sm:col-span-2">
          <Row
            label="Delivery Address"
            value={[
              q.dealerAddress,
              q.dealerDistrict,
              q.dealerState,
              q.dealerPinCode,
            ]
              .filter(Boolean)
              .join(", ")}
            icon={MapPin}
          />
        </div>
      </div>

      {/* Vehicle Info */}
      <h3 className="text-sm font-bold text-slate-800 mb-2">Vehicle Details</h3>
      <div className="grid sm:grid-cols-2 gap-x-6 mb-5">
        <Row label="Vehicle Type" value={q.vehicleType} />
        <Row label="Brand" value={q.brandPrefix} />
        <Row label="Model" value={q.modelName} />
        <Row label="Body Type" value={q.bodyTypeName} />
        <Row label="Color" value={q.colorName} />
        <Row label="Chassis Number" value={q.chassisNumber} mono />
      </div>

      {/* Battery */}
      <h3 className="text-sm font-bold text-slate-800 mb-2">Battery</h3>
      <div className="grid sm:grid-cols-2 gap-x-6 mb-5">
        <Row label="Battery Type" value={q.batteryType} />
        <Row
          label="Specs"
          value={[
            q.batteryVolt && `${q.batteryVolt}V`,
            q.batteryAmpereHours && `${q.batteryAmpereHours}Ah`,
          ]
            .filter(Boolean)
            .join(" / ")}
        />
      </div>

      {/* Amount */}
      <div className="bg-slate-50 rounded-lg p-4 flex justify-between items-center">
        <span className="text-sm font-bold text-slate-800">Invoice Amount</span>
        <span className="text-xl font-bold text-green-600">
          {formatINR(q.totalAmount)}
        </span>
      </div>

      <div className="flex justify-end gap-3 mt-6 pt-5 border-t border-slate-200">
        <button
          onClick={onClose}
          className="px-5 py-2.5 text-sm font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
        >
          Close
        </button>
      </div>
    </Modal>
  );
};

// ── Main Component ─────────────────────────────────────────
const Dispatch = () => {
  const { role } = useAuth();
  const { dealerCode } = useDealerInfo();
  const isDealer = role === "dealer";
  const canLoad = !isDealer || dealerCode.length >= MIN_DEALER_CODE_LENGTH;

  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [dealerFilter, setDealerFilter] = useState("all");
  const [limit, setLimit] = useState(PAGE_SIZE);
  const [selectedItem, setSelectedItem] = useState(null);

  const loader = useCallback(async () => {
    if (!canLoad) return [];
    const params = {
      status: "Dispatched",
      ...(isDealer ? { dealerCode } : {}),
    };
    const res = await api.get("/QuotationTable", { params });
    return Array.isArray(res.data) ? res.data : [];
  }, [canLoad, isDealer, dealerCode]);

  const { data, error, loading, reload } = useAsyncData(
    ["dispatch", isDealer ? dealerCode : "all"],
    loader,
    LOAD_ERROR,
  );

  // Unique dealers for filter (admin only)
  const dealerOptions = useMemo(() => {
    if (isDealer) return [];
    const map = new Map();
    (data ?? []).forEach((q) => {
      if (q.dealerCode && !map.has(q.dealerCode)) {
        map.set(q.dealerCode, `${q.dealerName || "Unknown"} (${q.dealerCode})`);
      }
    });
    return [...map.entries()]
      .map(([code, label]) => ({ code, label }))
      .sort((a, b) => a.label.localeCompare(b.label));
  }, [data, isDealer]);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return (data ?? []).filter((q) => {
      // Type filter
      if (typeFilter !== "all") {
        const vType = String(q.vehicleType || "").toLowerCase();
        if (
          typeFilter === "rikshaw" &&
          !vType.includes("rikshaw") &&
          !vType.includes("rickshaw")
        )
          return false;
        if (
          typeFilter === "cargo" &&
          !vType.includes("cargo") &&
          !vType.includes("loader")
        )
          return false;
      }

      // Dealer filter (admin only)
      if (
        !isDealer &&
        dealerFilter !== "all" &&
        q.dealerCode !== dealerFilter
      ) {
        return false;
      }

      // Search
      if (!term) return true;
      return [
        q.chassisNumber,
        q.dealerName,
        q.dealerCode,
        q.modelName,
        q.bodyTypeName,
        q.billNumber,
        q.colorName,
      ].some((f) => f?.toString().toLowerCase().includes(term));
    });
  }, [data, search, typeFilter, dealerFilter, isDealer]);

  const visible = filtered.slice(0, limit);
  const resetPaging = () => setLimit(PAGE_SIZE);

  // ── Stats ──────────────────────────────────────────────
  const stats = useMemo(() => {
    const list = data ?? [];
    const total = list.length;
    const rikshaw = list.filter((q) => {
      const v = String(q.vehicleType || "").toLowerCase();
      return v.includes("rikshaw") || v.includes("rickshaw");
    }).length;
    const cargo = list.filter((q) => {
      const v = String(q.vehicleType || "").toLowerCase();
      return v.includes("cargo") || v.includes("loader");
    }).length;
    const totalValue = list.reduce(
      (sum, q) => sum + (Number(q.totalAmount) || 0),
      0,
    );
    return { total, rikshaw, cargo, totalValue };
  }, [data]);

  const columns = useMemo(
    () => [
      {
        key: "chassisNumber",
        label: "Chassis No.",
        className: "font-mono text-xs",
      },
      {
        key: "billNumber",
        label: "Bill No.",
        className: "font-mono text-xs",
        render: (row) =>
          row.billNumber ? (
            <span className="px-2 py-0.5 bg-slate-100 rounded text-slate-700">
              {row.billNumber}
            </span>
          ) : (
            <span className="text-slate-400">—</span>
          ),
      },
      ...(isDealer
        ? []
        : [
            {
              key: "dealerName",
              label: "Dealer",
              render: (row) => (
                <div>
                  <p className="font-medium text-slate-800">
                    {row.dealerName || "—"}
                  </p>
                  {row.dealerCode && (
                    <p className="text-[11px] text-slate-500 font-mono">
                      {row.dealerCode}
                    </p>
                  )}
                </div>
              ),
            },
          ]),
      { key: "vehicleType", label: "Type" },
      { key: "modelName", label: "Model" },
      { key: "colorName", label: "Color" },
      {
        key: "totalAmount",
        label: "Amount",
        render: (row) => (
          <span className="font-semibold text-slate-800">
            {formatINR(row.totalAmount)}
          </span>
        ),
      },
      {
        key: "actions",
        label: "",
        render: (row) => (
          <button
            onClick={() => setSelectedItem(row)}
            className="p-1.5 text-slate-400 hover:text-green-600 hover:bg-green-50 rounded-md transition-colors"
            aria-label="View dispatch details"
          >
            <Eye size={16} />
          </button>
        ),
      },
    ],
    [isDealer],
  );

  const typeOptions = [
    ["all", "All Types"],
    ["rikshaw", "Rikshaw"],
    ["cargo", "Cargo / Loader"],
  ];

  return (
    <section className="w-full">
      {/* Header */}
      <div className="mb-6">
        <p className="text-xs font-semibold text-green-600 uppercase tracking-wider mb-1">
          {ROLE_LABEL[role]} · Operations
        </p>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 tracking-tight">
          {isDealer ? "My Dispatches" : "Dispatch Overview"}
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          {isDealer
            ? "Vehicles dispatched to your dealership."
            : "All dispatched vehicles across the network."}
        </p>
      </div>

      {/* Stats Cards */}
      {!loading && !error && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          <Card className="p-4">
            <div className="flex items-center gap-2 mb-1">
              <Truck size={14} className="text-green-600" />
              <p className="text-xs text-slate-500">Total Dispatched</p>
            </div>
            <p className="text-2xl font-bold text-slate-800">{stats.total}</p>
          </Card>
          <Card className="p-4">
            <p className="text-xs text-slate-500 mb-1">Rikshaw</p>
            <p className="text-2xl font-bold text-blue-600">{stats.rikshaw}</p>
          </Card>
          <Card className="p-4">
            <p className="text-xs text-slate-500 mb-1">Cargo / Loader</p>
            <p className="text-2xl font-bold text-purple-600">{stats.cargo}</p>
          </Card>
          <Card className="p-4">
            <p className="text-xs text-slate-500 mb-1">Total Value</p>
            <p className="text-2xl font-bold text-slate-800">
              {formatINR(stats.totalValue)}
            </p>
          </Card>
        </div>
      )}

      {!canLoad ? (
        <ErrorCard message="Dealer code not found for this session. Please log out and sign in again." />
      ) : loading ? (
        <LoadingCard />
      ) : error ? (
        <ErrorCard message={error} onRetry={reload} />
      ) : (
        <>
          {/* Filters */}
          <div className="flex flex-col lg:flex-row lg:items-center gap-3 mb-4">
            <div className="relative w-full lg:max-w-sm">
              <Search
                size={16}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <Input
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  resetPaging();
                }}
                placeholder="Search by chassis, bill, dealer..."
                className="!pl-10"
              />
            </div>

            <Select
              value={typeFilter}
              onChange={(e) => {
                setTypeFilter(e.target.value);
                resetPaging();
              }}
              className="lg:max-w-xs"
            >
              {typeOptions.map(([val, label]) => (
                <option key={val} value={val}>
                  {label}
                </option>
              ))}
            </Select>

            {!isDealer && dealerOptions.length > 0 && (
              <Select
                value={dealerFilter}
                onChange={(e) => {
                  setDealerFilter(e.target.value);
                  resetPaging();
                }}
                className="lg:max-w-xs"
              >
                <option value="all">All Dealers</option>
                {dealerOptions.map((d) => (
                  <option key={d.code} value={d.code}>
                    {d.label}
                  </option>
                ))}
              </Select>
            )}

            <p className="text-xs text-slate-500 lg:ml-auto">
              Showing {visible.length} of {filtered.length}
            </p>
          </div>

          <DataTable
            columns={columns}
            rows={visible}
            rowKey={(row) => row.id ?? row.chassisNumber}
            emptyText={
              data.length === 0
                ? "No dispatched vehicles yet."
                : "No dispatches match your filters."
            }
          />

          {visible.length < filtered.length && (
            <div className="flex justify-center mt-5">
              <button
                onClick={() => setLimit((n) => n + PAGE_SIZE)}
                className="text-sm text-blue-600 hover:underline font-medium"
              >
                Show {Math.min(PAGE_SIZE, filtered.length - visible.length)}{" "}
                more
              </button>
            </div>
          )}
        </>
      )}

      <DispatchDetailModal
        quotation={selectedItem}
        onClose={() => setSelectedItem(null)}
      />
    </section>
  );
};

export default Dispatch;
