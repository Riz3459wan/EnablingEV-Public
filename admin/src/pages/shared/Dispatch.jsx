import { useMemo, useState } from "react";
import { Link } from "react-router";
import { ArrowLeft, Search, Eye, Truck, CheckCircle2 } from "lucide-react";
import { useAuth } from "../../auth/AuthContext";
import { ROLE_DASH, ROLE_LABEL } from "../../auth/roleConfig";
import { Input, Select } from "../../components/ui/Field";
import DataTable from "../../components/ui/DataTable";
import Modal from "../../components/ui/Modal";
import Card from "../../components/ui/Card";
import { formatINR } from "../../features/quotation/calc";

const PAGE_SIZE = 25;

// ═══════════════════════════════════════════════════════════
//  MOCK DATA (only Dispatched)
// ═══════════════════════════════════════════════════════════
const MOCK_DISPATCH = [
  {
    id: 1,
    chassisNumber: "ME9EBCR123H268XYZ",
    billNumber: "INV-0089",
    dealerName: "Shree Ram Motors",
    dealerCode: "DL01EV001",
    dealerAddress: "Karol Bagh",
    dealerDistrict: "New Delhi",
    dealerState: "Delhi",
    dealerPinCode: "110005",
    vehicleType: "Rikshaw",
    modelName: "F1",
    bodyTypeName: "MS",
    colorName: "Blue",
    batteryType: "Lithium",
    batteryVolt: 60,
    batteryAmpereHours: 100,
    totalAmount: 245000,
    status: "Dispatched",
    dispatchedOn: "Apr 25, 2025",
  },
  {
    id: 2,
    chassisNumber: "ME9EBCR012H268GHI",
    billNumber: "INV-0088",
    dealerName: "Metro EV Dealers",
    dealerCode: "HR04EV004",
    dealerAddress: "Sector 14",
    dealerDistrict: "Gurgaon",
    dealerState: "Haryana",
    dealerPinCode: "122001",
    vehicleType: "Rikshaw",
    modelName: "F2",
    bodyTypeName: "SS",
    colorName: "Red",
    batteryType: "Lithium",
    batteryVolt: 60,
    batteryAmpereHours: 100,
    totalAmount: 230000,
    status: "Dispatched",
    dispatchedOn: "Apr 24, 2025",
  },
  {
    id: 3,
    chassisNumber: "ME9EBCR345H268JKL",
    billNumber: "INV-0087",
    dealerName: "Vijay Sales Corp",
    dealerCode: "MH05EV005",
    dealerAddress: "Andheri West",
    dealerDistrict: "Mumbai",
    dealerState: "Maharashtra",
    dealerPinCode: "400058",
    vehicleType: "Rikshaw",
    modelName: "F3",
    bodyTypeName: "MS",
    colorName: "Yellow",
    batteryType: "Lithium",
    batteryVolt: 60,
    batteryAmpereHours: 100,
    totalAmount: 375000,
    status: "Dispatched",
    dispatchedOn: "Apr 23, 2025",
  },
  {
    id: 4,
    chassisNumber: "ME9EBCR234H268STU",
    billNumber: "INV-0086",
    dealerName: "Green Energy Motors",
    dealerCode: "UP03EV003",
    dealerAddress: "Hazratganj",
    dealerDistrict: "Lucknow",
    dealerState: "Uttar Pradesh",
    dealerPinCode: "226001",
    vehicleType: "Rikshaw",
    modelName: "F4",
    bodyTypeName: "SS",
    colorName: "White",
    batteryType: "Lithium",
    batteryVolt: 60,
    batteryAmpereHours: 100,
    totalAmount: 270000,
    status: "Dispatched",
    dispatchedOn: "Apr 22, 2025",
  },
];

const DispatchDetailModal = ({ quotation, onClose }) => {
  if (!quotation) return null;
  const q = quotation;

  const Row = ({ label, value, mono }) => (
    <div className="flex justify-between py-2 border-b border-slate-100 last:border-0">
      <span className="text-xs text-slate-500">{label}</span>
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
      <div className="flex items-start justify-between mb-5 pb-5 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Truck size={16} className="text-green-600" />
            <span className="text-xs font-semibold text-green-600 uppercase tracking-wider">
              Dispatched
            </span>
          </div>
          <p className="text-lg font-bold text-slate-800 font-mono">
            {q.chassisNumber}
          </p>
        </div>
        <span className="text-[10px] uppercase tracking-wider font-semibold px-2.5 py-1 rounded-full bg-green-50 text-green-700 border border-green-200">
          Dispatched
        </span>
      </div>

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

      <div className="grid sm:grid-cols-2 gap-x-6 mb-5">
        <Row label="Bill Number" value={q.billNumber} mono />
        <Row label="Dispatched On" value={q.dispatchedOn} />
      </div>

      <h3 className="text-sm font-bold text-slate-800 mb-2">
        Dealer Information
      </h3>
      <div className="grid sm:grid-cols-2 gap-x-6 mb-5">
        <Row label="Dealer Name" value={q.dealerName} />
        <Row label="Dealer Code" value={q.dealerCode} mono />
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
          />
        </div>
      </div>

      <h3 className="text-sm font-bold text-slate-800 mb-2">Vehicle Details</h3>
      <div className="grid sm:grid-cols-2 gap-x-6 mb-5">
        <Row label="Vehicle Type" value={q.vehicleType} />
        <Row label="Model" value={q.modelName} />
        <Row label="Body Type" value={q.bodyTypeName} />
        <Row label="Color" value={q.colorName} />
        <Row label="Chassis Number" value={q.chassisNumber} mono />
        <Row
          label="Battery"
          value={[
            q.batteryType,
            q.batteryVolt && `${q.batteryVolt}V`,
            q.batteryAmpereHours && `${q.batteryAmpereHours}Ah`,
          ]
            .filter(Boolean)
            .join(" / ")}
        />
      </div>

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

const Dispatch = () => {
  const { role } = useAuth();
  const isDealer = role === "dealer";

  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [dealerFilter, setDealerFilter] = useState("all");
  const [limit, setLimit] = useState(PAGE_SIZE);
  const [selectedItem, setSelectedItem] = useState(null);
  const data = MOCK_DISPATCH;
  const loading = false;
  const error = "";

  // ═══════════════════════════════════════════════════════════
  //  API — COMMENTED
  // ═══════════════════════════════════════════════════════════
  // const loader = useCallback(async () => {
  //   const params = { status: "Dispatched", ...(isDealer ? { dealerCode } : {}) };
  //   const res = await api.get("/QuotationTable", { params });
  //   return Array.isArray(res.data) ? res.data : [];
  // }, [canLoad, isDealer, dealerCode]);

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
      if (!isDealer && dealerFilter !== "all" && q.dealerCode !== dealerFilter)
        return false;
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

  const stats = useMemo(() => {
    const list = data ?? [];
    const rikshaw = list.filter(
      (q) =>
        String(q.vehicleType || "")
          .toLowerCase()
          .includes("rikshaw") ||
        String(q.vehicleType || "")
          .toLowerCase()
          .includes("rickshaw"),
    ).length;
    const cargo = list.filter(
      (q) =>
        String(q.vehicleType || "")
          .toLowerCase()
          .includes("cargo") ||
        String(q.vehicleType || "")
          .toLowerCase()
          .includes("loader"),
    ).length;
    const totalValue = list.reduce(
      (sum, q) => sum + (Number(q.totalAmount) || 0),
      0,
    );
    return { total: list.length, rikshaw, cargo, totalValue };
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
      <Link
        to={ROLE_DASH[role] || "/adminDash"}
        className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 transition-colors mb-4"
      >
        <ArrowLeft size={15} /> Back to dashboard
      </Link>

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

      {loading ? (
        <LoadingCard />
      ) : error ? (
        <ErrorCard message={error} />
      ) : (
        <>
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
