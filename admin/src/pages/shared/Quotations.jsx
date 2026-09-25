import { useMemo, useState } from "react";
import { Link } from "react-router";
import { ArrowLeft, Search, Eye, FileText } from "lucide-react";
import { useAuth } from "../../auth/AuthContext";
import { ROLE_DASH, ROLE_LABEL } from "../../auth/roleConfig";
import { Input, Select } from "../../components/ui/Field";
import DataTable from "../../components/ui/DataTable";
import Modal from "../../components/ui/Modal";
import Card from "../../components/ui/Card";
import { ErrorCard, LoadingCard } from "../../components/ui/AsyncStates";
import { statusBadgeClass } from "../../features/quotation/constants";
import { formatINR, gstBreakdown } from "../../features/quotation/calc";

const PAGE_SIZE = 25;

// ═══════════════════════════════════════════════════════════
//  MOCK DATA
// ═══════════════════════════════════════════════════════════
const MOCK_QUOTATIONS = [
  {
    id: 1,
    chassisNumber: "ME9EBCR123H268XYZ",
    dealerName: "Shree Ram Motors",
    dealerCode: "DL01EV001",
    dealerGstin: "07AAAAA1234A1Z5",
    dealerState: "Delhi",
    dealerDistrict: "New Delhi",
    dealerPinCode: "110005",
    dealerAddress: "Karol Bagh",
    vehicleType: "Rikshaw",
    brandPrefix: "Jhat Pat Jio",
    modelName: "F1",
    bodyTypeName: "MS",
    colorName: "Blue",
    batteryType: "Lithium",
    batteryVolt: 60,
    batteryAmpereHours: 100,
    modelPrice: 150000,
    bodyTypePrice: 30000,
    batteryPrice: 45000,
    totalAmount: 245000,
    status: "Dispatched",
    billNumber: "INV-0089",
  },
  {
    id: 2,
    chassisNumber: "ME9EBCC456H268ABC",
    dealerName: "Rahul Auto Sales",
    dealerCode: "RJ02EV002",
    dealerGstin: "08BBBBB5678B1Z6",
    dealerState: "Rajasthan",
    dealerDistrict: "Jaipur",
    dealerPinCode: "302001",
    dealerAddress: "MI Road",
    vehicleType: "Cargo",
    brandPrefix: "Halchal",
    modelName: "LODER",
    bodyTypeName: "NR",
    colorName: "Green",
    batteryType: "Lithium",
    batteryVolt: 48,
    batteryAmpereHours: 120,
    modelPrice: 200000,
    bodyTypePrice: 50000,
    batteryPrice: 60000,
    totalAmount: 310000,
    status: "Under Billing",
    billNumber: null,
  },
  {
    id: 3,
    chassisNumber: "ME9EBCC789H268DEF",
    dealerName: "Green Energy Motors",
    dealerCode: "UP03EV003",
    dealerGstin: "09CCCCC9012C1Z7",
    dealerState: "Uttar Pradesh",
    dealerDistrict: "Lucknow",
    dealerPinCode: "226001",
    dealerAddress: "Hazratganj",
    vehicleType: "Cargo",
    brandPrefix: "Halchal",
    modelName: "LODER",
    bodyTypeName: "DS",
    colorName: "White",
    batteryType: "Lithium",
    batteryVolt: 60,
    batteryAmpereHours: 100,
    modelPrice: 300000,
    bodyTypePrice: 60000,
    batteryPrice: 90000,
    totalAmount: 450000,
    status: "Under Assembling",
    billNumber: null,
  },
  {
    id: 4,
    chassisNumber: "ME9EBCR012H268GHI",
    dealerName: "Metro EV Dealers",
    dealerCode: "HR04EV004",
    dealerGstin: "06DDDDD3456D1Z8",
    dealerState: "Haryana",
    dealerDistrict: "Gurgaon",
    dealerPinCode: "122001",
    dealerAddress: "Sector 14",
    vehicleType: "Rikshaw",
    brandPrefix: "Jhat Pat Jio",
    modelName: "F2",
    bodyTypeName: "SS",
    colorName: "Red",
    batteryType: "Lithium",
    batteryVolt: 60,
    batteryAmpereHours: 100,
    modelPrice: 140000,
    bodyTypePrice: 45000,
    batteryPrice: 45000,
    totalAmount: 230000,
    status: "Dispatched",
    billNumber: "INV-0088",
  },
  {
    id: 5,
    chassisNumber: "ME9EBCR345H268JKL",
    dealerName: "Vijay Sales Corp",
    dealerCode: "MH05EV005",
    dealerGstin: "27EEEEE7890E1Z9",
    dealerState: "Maharashtra",
    dealerDistrict: "Mumbai",
    dealerPinCode: "400058",
    dealerAddress: "Andheri West",
    vehicleType: "Rikshaw",
    brandPrefix: "Jhat Pat Jio",
    modelName: "F3",
    bodyTypeName: "MS",
    colorName: "Yellow",
    batteryType: "Lithium",
    batteryVolt: 60,
    batteryAmpereHours: 100,
    modelPrice: 240000,
    bodyTypePrice: 45000,
    batteryPrice: 90000,
    totalAmount: 375000,
    status: "Dispatched",
    billNumber: "INV-0087",
  },
  {
    id: 6,
    chassisNumber: "ME9EBCR678H268MNO",
    dealerName: "Shree Ram Motors",
    dealerCode: "DL01EV001",
    dealerGstin: "07AAAAA1234A1Z5",
    dealerState: "Delhi",
    dealerDistrict: "New Delhi",
    dealerPinCode: "110005",
    dealerAddress: "Karol Bagh",
    vehicleType: "Rikshaw",
    brandPrefix: "Jhat Pat Jio",
    modelName: "F1",
    bodyTypeName: "MS",
    colorName: "Blue",
    batteryType: "Lithium",
    batteryVolt: 60,
    batteryAmpereHours: 100,
    modelPrice: 150000,
    bodyTypePrice: 30000,
    batteryPrice: 45000,
    totalAmount: 245000,
    status: "Under Billing",
    billNumber: null,
  },
  {
    id: 7,
    chassisNumber: "ME9EBCC901H268PQR",
    dealerName: "Rahul Auto Sales",
    dealerCode: "RJ02EV002",
    dealerGstin: "08BBBBB5678B1Z6",
    dealerState: "Rajasthan",
    dealerDistrict: "Jaipur",
    dealerPinCode: "302001",
    dealerAddress: "MI Road",
    vehicleType: "Cargo",
    brandPrefix: "Halchal",
    modelName: "LODER",
    bodyTypeName: "NR",
    colorName: "Green",
    batteryType: "Lithium",
    batteryVolt: 48,
    batteryAmpereHours: 120,
    modelPrice: 200000,
    bodyTypePrice: 50000,
    batteryPrice: 60000,
    totalAmount: 310000,
    status: "Under Assembling",
    billNumber: null,
  },
  {
    id: 8,
    chassisNumber: "ME9EBCR234H268STU",
    dealerName: "Green Energy Motors",
    dealerCode: "UP03EV003",
    dealerGstin: "09CCCCC9012C1Z7",
    dealerState: "Uttar Pradesh",
    dealerDistrict: "Lucknow",
    dealerPinCode: "226001",
    dealerAddress: "Hazratganj",
    vehicleType: "Rikshaw",
    brandPrefix: "Jhat Pat Jio",
    modelName: "F4",
    bodyTypeName: "SS",
    colorName: "White",
    batteryType: "Lithium",
    batteryVolt: 60,
    batteryAmpereHours: 100,
    modelPrice: 180000,
    bodyTypePrice: 40000,
    batteryPrice: 50000,
    totalAmount: 270000,
    status: "Dispatched",
    billNumber: "INV-0086",
  },
];

const StatusBadge = ({ status }) => (
  <span
    className={`inline-block px-2.5 py-1 text-[10px] uppercase tracking-wider font-semibold rounded-full border ${statusBadgeClass(status)}`}
  >
    {status || "Pending"}
  </span>
);

const QuotationDetailModal = ({ quotation, onClose }) => {
  if (!quotation) return null;
  const q = quotation;
  const gst = gstBreakdown(q.totalAmount);

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
      title="Quotation Details"
      maxWidth="max-w-2xl"
    >
      <div className="flex items-start justify-between mb-5 pb-5 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <FileText size={16} className="text-blue-600" />
            <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">
              Quotation
            </span>
          </div>
          <p className="text-lg font-bold text-slate-800 font-mono">
            {q.chassisNumber || "—"}
          </p>
        </div>
        <StatusBadge status={q.status} />
      </div>

      <h3 className="text-sm font-bold text-slate-800 mb-2">
        Dealer Information
      </h3>
      <div className="grid sm:grid-cols-2 gap-x-6 mb-5">
        <Row label="Dealer Name" value={q.dealerName} />
        <Row label="Dealer Code" value={q.dealerCode} mono />
        <Row label="GSTIN" value={q.dealerGstin} mono />
        <Row label="State" value={q.dealerState} />
        <Row label="District" value={q.dealerDistrict} />
        <Row label="Pin Code" value={q.dealerPinCode} />
        <div className="sm:col-span-2">
          <Row label="Address" value={q.dealerAddress} />
        </div>
      </div>

      <h3 className="text-sm font-bold text-slate-800 mb-2">Vehicle Details</h3>
      <div className="grid sm:grid-cols-2 gap-x-6 mb-5">
        <Row label="Vehicle Type" value={q.vehicleType} />
        <Row label="Brand Prefix" value={q.brandPrefix} />
        <Row label="Model" value={q.modelName} />
        <Row label="Body Type" value={q.bodyTypeName} />
        <Row label="Color" value={q.colorName} />
        <Row label="Bill Number" value={q.billNumber} mono />
      </div>

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

      <h3 className="text-sm font-bold text-slate-800 mb-2">Price Breakdown</h3>
      <div className="bg-slate-50 rounded-lg p-4">
        <Row label="Model Price" value={formatINR(q.modelPrice)} />
        <Row label="Body Type Price" value={formatINR(q.bodyTypePrice)} />
        <Row label="Battery Price" value={formatINR(q.batteryPrice)} />
        <div className="my-2 border-t border-slate-200" />
        <Row label="Subtotal (excl. GST)" value={formatINR(gst.subtotal)} />
        <Row label="CGST (2.5%)" value={formatINR(gst.cgst)} />
        <Row label="SGST (2.5%)" value={formatINR(gst.sgst)} />
        <div className="my-2 border-t-2 border-slate-300" />
        <div className="flex justify-between py-2">
          <span className="text-sm font-bold text-slate-800">Total Amount</span>
          <span className="text-lg font-bold text-blue-600">
            {formatINR(q.totalAmount)}
          </span>
        </div>
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

const Quotations = () => {
  const { role } = useAuth();
  const isDealer = role === "dealer";

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [limit, setLimit] = useState(PAGE_SIZE);
  const [selectedQuotation, setSelectedQuotation] = useState(null);
  const data = MOCK_QUOTATIONS;
  const loading = false;
  const error = "";

  // ═══════════════════════════════════════════════════════════
  //  API — COMMENTED
  // ═══════════════════════════════════════════════════════════
  // const loader = useCallback(async () => {
  //   const params = isDealer ? { dealerCode } : undefined;
  //   const res = await api.get("/QuotationTable", { params });
  //   return Array.isArray(res.data) ? res.data : [];
  // }, [canLoad, isDealer, dealerCode]);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return (data ?? []).filter((q) => {
      if (statusFilter !== "all" && q.status !== statusFilter) return false;
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
      if (!term) return true;
      return [
        q.chassisNumber,
        q.dealerName,
        q.dealerCode,
        q.modelName,
        q.bodyTypeName,
        q.colorName,
        q.billNumber,
        q.status,
      ].some((f) => f?.toString().toLowerCase().includes(term));
    });
  }, [data, search, statusFilter, typeFilter]);

  const visible = filtered.slice(0, limit);
  const resetPaging = () => setLimit(PAGE_SIZE);

  const stats = useMemo(() => {
    const list = data ?? [];
    return {
      total: list.length,
      dispatched: list.filter((q) => q.status === "Dispatched").length,
      billing: list.filter((q) => q.status === "Under Billing").length,
      totalValue: list.reduce(
        (sum, q) => sum + (Number(q.totalAmount) || 0),
        0,
      ),
    };
  }, [data]);

  const columns = useMemo(
    () => [
      {
        key: "chassisNumber",
        label: "Chassis No.",
        className: "font-mono text-xs",
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
      { key: "modelName", label: "Model" },
      { key: "bodyTypeName", label: "Body Type" },
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
        key: "status",
        label: "Status",
        render: (row) => <StatusBadge status={row.status} />,
      },
      {
        key: "actions",
        label: "",
        render: (row) => (
          <button
            onClick={() => setSelectedQuotation(row)}
            className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
            aria-label="View details"
          >
            <Eye size={16} />
          </button>
        ),
      },
    ],
    [isDealer],
  );

  const statusOptions = [
    ["all", "All Status"],
    ["Dispatched", "Dispatched"],
    ["Under Billing", "Under Billing"],
    ["Under Assembling", "Under Assembling"],
  ];

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
        <p className="text-xs font-semibold text-blue-600 uppercase tracking-wider mb-1">
          {ROLE_LABEL[role]} · Operations
        </p>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 tracking-tight">
          {isDealer ? "My Quotations" : "All Quotations"}
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          {isDealer
            ? "Quotations created for your dealership."
            : "Every quotation generated across all dealers."}
        </p>
      </div>

      {!loading && !error && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          <Card className="p-4">
            <p className="text-xs text-slate-500 mb-1">Total Quotations</p>
            <p className="text-2xl font-bold text-slate-800">{stats.total}</p>
          </Card>
          <Card className="p-4">
            <p className="text-xs text-slate-500 mb-1">Dispatched</p>
            <p className="text-2xl font-bold text-green-600">
              {stats.dispatched}
            </p>
          </Card>
          <Card className="p-4">
            <p className="text-xs text-slate-500 mb-1">Under Billing</p>
            <p className="text-2xl font-bold text-sky-600">{stats.billing}</p>
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
                placeholder="Search by chassis, dealer, model..."
                className="!pl-10"
              />
            </div>

            <Select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                resetPaging();
              }}
              className="lg:max-w-xs"
            >
              {statusOptions.map(([val, label]) => (
                <option key={val} value={val}>
                  {label}
                </option>
              ))}
            </Select>

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
                ? "No quotations found yet."
                : "No quotations match your filters."
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

      <QuotationDetailModal
        quotation={selectedQuotation}
        onClose={() => setSelectedQuotation(null)}
      />
    </section>
  );
};

export default Quotations;
