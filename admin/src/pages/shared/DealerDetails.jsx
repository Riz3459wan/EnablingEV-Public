import { useCallback, useMemo, useState } from "react";
import { Link, useParams, useNavigate } from "react-router";
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  MapPin,
  Building2,
  FileText,
  Users,
  Truck,
  TrendingUp,
  Search,
  Eye,
  Key,
  CheckCircle2,
  Clock,
} from "lucide-react";
import api from "../../api/client";
import useAsyncData from "../../hooks/useAsyncData";
import Card from "../../components/ui/Card";
import { Input } from "../../components/ui/Field";
import DataTable from "../../components/ui/DataTable";
import Modal from "../../components/ui/Modal";
import { ErrorCard, LoadingCard } from "../../components/ui/AsyncStates";
import {
  formatINR,
  formatDate,
  gstBreakdown,
} from "../../features/quotation/calc";
import { statusBadgeClass } from "../../features/quotation/constants";

const LOAD_ERROR = "Couldn't load dealer details. Please try again.";

// ── Tabs ───────────────────────────────────────────────────
const TABS = [
  { key: "overview", label: "Overview", icon: TrendingUp },
  { key: "vehicles", label: "Vehicles", icon: Truck },
  { key: "customers", label: "Customers", icon: Users },
  { key: "quotations", label: "Quotations", icon: FileText },
];

// ── Status Badge ───────────────────────────────────────────
const StatusBadge = ({ status }) => (
  <span
    className={`inline-block px-2.5 py-1 text-[10px] uppercase tracking-wider font-semibold rounded-full border ${statusBadgeClass(status)}`}
  >
    {status || "Pending"}
  </span>
);

// ── Info Row ───────────────────────────────────────────────
const InfoRow = ({ icon: Icon, label, value, mono }) => (
  <div className="flex items-start gap-3 py-2.5 border-b border-slate-100 last:border-0">
    {Icon && (
      <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
        <Icon size={14} className="text-slate-500" />
      </div>
    )}
    <div className="flex-1 min-w-0">
      <p className="text-[11px] uppercase tracking-wider text-slate-400 font-medium mb-0.5">
        {label}
      </p>
      <p
        className={`text-sm text-slate-800 font-medium break-words ${mono ? "font-mono text-xs" : ""}`}
      >
        {value || "—"}
      </p>
    </div>
  </div>
);

// ── Stat Card ──────────────────────────────────────────────
const StatCard = ({ icon: Icon, label, value, color = "blue" }) => {
  const colors = {
    blue: "bg-blue-50 text-blue-600",
    green: "bg-green-50 text-green-600",
    purple: "bg-purple-50 text-purple-600",
    orange: "bg-orange-50 text-orange-600",
  };
  return (
    <Card className="p-4">
      <div className="flex items-center gap-3">
        <div
          className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${colors[color]}`}
        >
          <Icon size={18} />
        </div>
        <div className="min-w-0">
          <p className="text-xs text-slate-500 mb-0.5">{label}</p>
          <p className="text-xl font-bold text-slate-800 leading-tight">
            {value}
          </p>
        </div>
      </div>
    </Card>
  );
};

// ── Quotation Detail Modal (reused pattern) ────────────────
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

      <h3 className="text-sm font-bold text-slate-800 mb-2">Vehicle Details</h3>
      <div className="grid sm:grid-cols-2 gap-x-6 mb-5">
        <Row label="Vehicle Type" value={q.vehicleType} />
        <Row label="Model" value={q.modelName} />
        <Row label="Body Type" value={q.bodyTypeName} />
        <Row label="Color" value={q.colorName} />
        <Row label="Bill Number" value={q.billNumber} mono />
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

// ── Main Component ─────────────────────────────────────────
const DealerDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [search, setSearch] = useState("");
  const [limit, setLimit] = useState(25);
  const [selectedQuotation, setSelectedQuotation] = useState(null);

  // Load dealer + their vehicles + customers + quotations in parallel
  const loader = useCallback(async () => {
    const [dealerRes, quotationsRes, customersRes, vehiclesRes] =
      await Promise.allSettled([
        api.get("/dealer/full"),
        api.get("/QuotationTable"),
        api.get("/CustomerTable/admin"),
        api.get("/VehicleTable"),
      ]);

    const dealers =
      dealerRes.status === "fulfilled" && Array.isArray(dealerRes.value.data)
        ? dealerRes.value.data
        : [];
    const dealer = dealers.find(
      (d) => String(d.id) === String(id) || d.dealerCode === id,
    );

    if (!dealer) {
      throw new Error("Dealer not found");
    }

    const dealerCode = dealer.dealerCode;

    const allQuotations =
      quotationsRes.status === "fulfilled" &&
      Array.isArray(quotationsRes.value.data)
        ? quotationsRes.value.data
        : [];
    const quotations = allQuotations.filter((q) => q.dealerCode === dealerCode);

    const allCustomers =
      customersRes.status === "fulfilled" &&
      Array.isArray(customersRes.value.data)
        ? customersRes.value.data
        : [];
    const customers = allCustomers.filter((c) => c.dealerCode === dealerCode);

    const allVehicles =
      vehiclesRes.status === "fulfilled" &&
      Array.isArray(vehiclesRes.value.data)
        ? vehiclesRes.value.data
        : [];
    const vehicles = allVehicles.filter((v) => {
      const vDealer = v.dealerNameDealerCode || "";
      return vDealer.includes(dealerCode);
    });

    return { dealer, quotations, customers, vehicles };
  }, [id]);

  const { data, error, loading, reload } = useAsyncData(
    ["dealerDetails", id],
    loader,
    LOAD_ERROR,
  );

  const { dealer, quotations = [], customers = [], vehicles = [] } = data ?? {};

  // ── Stats ──────────────────────────────────────────────
  const stats = useMemo(() => {
    if (!data) return {};
    const totalQuotations = quotations.length;
    const dispatched = quotations.filter(
      (q) => q.status === "Dispatched",
    ).length;
    const totalValue = quotations.reduce(
      (sum, q) => sum + (Number(q.totalAmount) || 0),
      0,
    );
    return {
      totalQuotations,
      dispatched,
      totalValue,
      totalCustomers: customers.length,
      totalVehicles: vehicles.length,
    };
  }, [data, quotations, customers, vehicles]);

  // ── Filtered lists ─────────────────────────────────────
  const filterFn = (item, fields) => {
    const term = search.trim().toLowerCase();
    if (!term) return true;
    return fields.some((f) => item[f]?.toString().toLowerCase().includes(term));
  };

  const filteredQuotations = useMemo(
    () =>
      quotations.filter((q) =>
        filterFn(q, [
          "chassisNumber",
          "modelName",
          "bodyTypeName",
          "colorName",
          "billNumber",
        ]),
      ),
    [quotations, search],
  );

  const filteredCustomers = useMemo(
    () =>
      customers.filter((c) =>
        filterFn(c, [
          "name",
          "mobileNumber",
          "emailId",
          "chassisNumber",
          "dist",
          "state",
        ]),
      ),
    [customers, search],
  );

  const filteredVehicles = useMemo(
    () => vehicles.filter((v) => filterFn(v, ["chassisNumber", "isUsed"])),
    [vehicles, search],
  );

  // ── Table columns ──────────────────────────────────────
  const quotationColumns = useMemo(
    () => [
      {
        key: "chassisNumber",
        label: "Chassis No.",
        className: "font-mono text-xs",
      },
      { key: "modelName", label: "Model" },
      { key: "bodyTypeName", label: "Body Type" },
      {
        key: "totalAmount",
        label: "Amount",
        render: (r) => (
          <span className="font-semibold">{formatINR(r.totalAmount)}</span>
        ),
      },
      {
        key: "status",
        label: "Status",
        render: (r) => <StatusBadge status={r.status} />,
      },
      {
        key: "actions",
        label: "",
        render: (r) => (
          <button
            onClick={() => setSelectedQuotation(r)}
            className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
          >
            <Eye size={16} />
          </button>
        ),
      },
    ],
    [],
  );

  const customerColumns = useMemo(
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
    ],
    [],
  );

  const vehicleColumns = useMemo(
    () => [
      {
        key: "chassisNumber",
        label: "Chassis No.",
        className: "font-mono text-xs",
      },
      {
        key: "isUsed",
        label: "Used",
        render: (r) =>
          r.isUsed ? (
            <span className="px-2 py-0.5 text-[10px] font-semibold rounded-full bg-orange-50 text-orange-600 border border-orange-200">
              Yes
            </span>
          ) : (
            <span className="px-2 py-0.5 text-[10px] font-semibold rounded-full bg-green-50 text-green-600 border border-green-200">
              No
            </span>
          ),
      },
    ],
    [],
  );

  // ── Error / Loading ────────────────────────────────────
  if (loading) {
    return (
      <section className="w-full">
        <LoadingCard rows={8} />
      </section>
    );
  }

  if (error || !dealer) {
    return (
      <section className="w-full">
        <ErrorCard
          message={error || "Dealer not found. Please check the dealer ID."}
          onRetry={reload}
        />
        <div className="mt-4 flex justify-center">
          <Link
            to="/dealerInfo"
            className="inline-flex items-center gap-1.5 text-sm text-blue-600 hover:underline"
          >
            <ArrowLeft size={14} /> Back to Dealers
          </Link>
        </div>
      </section>
    );
  }

  // ── Render ─────────────────────────────────────────────
  return (
    <section className="w-full">
      {/* ── Header Card ── */}
      <Card className="p-6 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-start gap-5">
          {/* Avatar */}
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shrink-0 shadow-lg shadow-blue-500/20">
            <User size={28} className="text-white" />
          </div>

          {/* Dealer Info */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <h1 className="text-2xl font-bold text-slate-800">
                {dealer.name || "Unnamed Dealer"}
              </h1>
              {dealer.activationCode ? (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-semibold rounded-full bg-green-50 text-green-700 border border-green-200">
                  <CheckCircle2 size={10} /> Active
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-semibold rounded-full bg-orange-50 text-orange-700 border border-orange-200">
                  <Clock size={10} /> Pending
                </span>
              )}
            </div>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-slate-500">
              {dealer.dealerCode && (
                <span className="font-mono font-medium text-blue-600">
                  {dealer.dealerCode}
                </span>
              )}
              {dealer.gstin && (
                <span className="font-mono text-xs">GSTIN: {dealer.gstin}</span>
              )}
            </div>
          </div>

          {/* Activation Code */}
          {dealer.activationCode && (
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 shrink-0">
              <div className="flex items-center gap-1.5 mb-1">
                <Key size={12} className="text-slate-500" />
                <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-500">
                  Activation Code
                </span>
              </div>
              <p className="font-mono font-bold text-slate-800">
                {dealer.activationCode}
              </p>
            </div>
          )}
        </div>
      </Card>

      {/* ── Stats Cards ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <StatCard
          icon={FileText}
          label="Total Quotations"
          value={stats.totalQuotations}
          color="blue"
        />
        <StatCard
          icon={Truck}
          label="Dispatched"
          value={stats.dispatched}
          color="green"
        />
        <StatCard
          icon={Users}
          label="Customers"
          value={stats.totalCustomers}
          color="purple"
        />
        <StatCard
          icon={TrendingUp}
          label="Total Value"
          value={formatINR(stats.totalValue)}
          color="orange"
        />
      </div>

      {/* ── Tabs ── */}
      <div className="flex border-b border-slate-200 mb-6 overflow-x-auto">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => {
                setActiveTab(tab.key);
                setSearch("");
                setLimit(25);
              }}
              className={`flex items-center gap-2 px-5 py-3 text-sm font-semibold border-b-2 transition-colors whitespace-nowrap ${
                isActive
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-slate-500 hover:text-slate-800"
              }`}
            >
              <Icon size={16} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* ── Tab Content ── */}
      {activeTab === "overview" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Contact Information */}
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                <User size={16} className="text-blue-600" />
              </div>
              <h3 className="font-bold text-slate-800">Contact Information</h3>
            </div>
            <div>
              <InfoRow icon={User} label="Contact Name" value={dealer.name} />
              <InfoRow icon={Phone} label="Mobile" value={dealer.mobileNo} />
              <InfoRow icon={Mail} label="Email" value={dealer.emailId} />
            </div>
          </Card>

          {/* Business Information */}
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center">
                <Building2 size={16} className="text-purple-600" />
              </div>
              <h3 className="font-bold text-slate-800">Business Information</h3>
            </div>
            <div>
              <InfoRow
                icon={Key}
                label="Dealer Code"
                value={dealer.dealerCode}
                mono
              />
              <InfoRow icon={Key} label="GSTIN" value={dealer.gstin} mono />
              <InfoRow
                icon={Key}
                label="Activation Code"
                value={dealer.activationCode}
                mono
              />
              <InfoRow
                icon={Key}
                label="LOI Reference"
                value={dealer.LOIreferenceId}
                mono
              />
              <InfoRow
                icon={Key}
                label="RQ Reference"
                value={dealer.RQreferenceId}
                mono
              />
            </div>
          </Card>

          {/* Location */}
          <Card className="p-6 lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center">
                <MapPin size={16} className="text-green-600" />
              </div>
              <h3 className="font-bold text-slate-800">Location & RTO</h3>
            </div>
            <div className="grid sm:grid-cols-2 gap-x-8">
              <div>
                <InfoRow icon={MapPin} label="Address" value={dealer.address} />
                <InfoRow icon={MapPin} label="District" value={dealer.dist} />
                <InfoRow icon={MapPin} label="State" value={dealer.state} />
                <InfoRow
                  icon={MapPin}
                  label="Pin Code"
                  value={dealer.pinCode}
                />
              </div>
              <div>
                <InfoRow
                  icon={Building2}
                  label="RTO Office"
                  value={dealer.rtoOffice}
                />
              </div>
            </div>
          </Card>
        </div>
      )}

      {activeTab !== "overview" && (
        <>
          {/* Search Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
            <div className="relative w-full sm:max-w-sm">
              <Search
                size={16}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <Input
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setLimit(25);
                }}
                placeholder={`Search ${activeTab}...`}
                className="!pl-10"
              />
            </div>
            <p className="text-xs text-slate-500">
              {activeTab === "quotations" &&
                `Showing ${Math.min(limit, filteredQuotations.length)} of ${filteredQuotations.length}`}
              {activeTab === "customers" &&
                `Showing ${Math.min(limit, filteredCustomers.length)} of ${filteredCustomers.length}`}
              {activeTab === "vehicles" &&
                `Showing ${Math.min(limit, filteredVehicles.length)} of ${filteredVehicles.length}`}
            </p>
          </div>

          {/* Tables */}
          {activeTab === "quotations" && (
            <>
              <DataTable
                columns={quotationColumns}
                rows={filteredQuotations.slice(0, limit)}
                rowKey={(r) => r.id ?? r.chassisNumber}
                emptyText={
                  quotations.length === 0
                    ? "No quotations created yet."
                    : "No quotations match your search."
                }
              />
              {limit < filteredQuotations.length && (
                <div className="flex justify-center mt-5">
                  <button
                    onClick={() => setLimit((n) => n + 25)}
                    className="text-sm text-blue-600 hover:underline font-medium"
                  >
                    Show 25 more
                  </button>
                </div>
              )}
            </>
          )}

          {activeTab === "customers" && (
            <>
              <DataTable
                columns={customerColumns}
                rows={filteredCustomers.slice(0, limit)}
                rowKey={(r) => r.id ?? r.chassisNumber}
                emptyText={
                  customers.length === 0
                    ? "No customers registered yet."
                    : "No customers match your search."
                }
              />
              {limit < filteredCustomers.length && (
                <div className="flex justify-center mt-5">
                  <button
                    onClick={() => setLimit((n) => n + 25)}
                    className="text-sm text-blue-600 hover:underline font-medium"
                  >
                    Show 25 more
                  </button>
                </div>
              )}
            </>
          )}

          {activeTab === "vehicles" && (
            <>
              <DataTable
                columns={vehicleColumns}
                rows={filteredVehicles.slice(0, limit)}
                rowKey={(r) => r.id ?? r.chassisNumber}
                emptyText={
                  vehicles.length === 0
                    ? "No vehicles registered yet."
                    : "No vehicles match your search."
                }
              />
              {limit < filteredVehicles.length && (
                <div className="flex justify-center mt-5">
                  <button
                    onClick={() => setLimit((n) => n + 25)}
                    className="text-sm text-blue-600 hover:underline font-medium"
                  >
                    Show 25 more
                  </button>
                </div>
              )}
            </>
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

export default DealerDetails;
