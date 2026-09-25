import { useState } from "react";
import { Link, useParams } from "react-router";
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
import Card from "../../components/ui/Card";
import { Input } from "../../components/ui/Field";
import DataTable from "../../components/ui/DataTable";
import { formatINR } from "../../features/quotation/calc";

// ═══════════════════════════════════════════════════════════
//  MOCK DATA
// ═══════════════════════════════════════════════════════════
const MOCK_DEALER = {
  id: 1,
  dealerCode: "DL01EV001",
  name: "Shree Ram Motors",
  emailId: "shreeram@example.com",
  mobileNo: "9876543210",
  gstin: "07AAAAA1234A1Z5",
  address: "Karol Bagh, Main Market",
  state: "Delhi",
  dist: "New Delhi",
  pinCode: "110005",
  rtoOffice: "New Delhi RTO",
  activationCode: "ACT-DL01-1234",
  LOIreferenceId: "LOI-2024-001",
  RQreferenceId: "RQ-2024-001",
};

const MOCK_QUOTATIONS = [
  {
    id: 1,
    chassisNumber: "ME9EBCR123H268XYZ",
    modelName: "F1",
    bodyTypeName: "MS",
    totalAmount: 245000,
    status: "Dispatched",
  },
  {
    id: 2,
    chassisNumber: "ME9EBCR678H268MNO",
    modelName: "F1",
    bodyTypeName: "MS",
    totalAmount: 245000,
    status: "Under Billing",
  },
];

const MOCK_CUSTOMERS = [
  {
    id: 1,
    name: "Rohit Kumar",
    mobileNumber: "9876543210",
    emailId: "rohit@example.com",
    chassisNumber: "ME9EBCR123H268XYZ",
    dist: "New Delhi",
    state: "Delhi",
  },
  {
    id: 2,
    name: "Vijay Patel",
    mobileNumber: "9876543215",
    emailId: "vijay@example.com",
    chassisNumber: "ME9EBCR678H268MNO",
    dist: "New Delhi",
    state: "Delhi",
  },
];

const MOCK_VEHICLES = [
  { id: 1, chassisNumber: "ME9EBCR123H268XYZ", isUsed: false },
  { id: 2, chassisNumber: "ME9EBCR678H268MNO", isUsed: true },
];

const TABS = [
  { key: "overview", label: "Overview", icon: TrendingUp },
  { key: "vehicles", label: "Vehicles", icon: Truck },
  { key: "customers", label: "Customers", icon: Users },
  { key: "quotations", label: "Quotations", icon: FileText },
];

const StatusBadge = ({ status }) => {
  const styles = {
    Approved: "bg-green-50 text-green-600 border-green-200",
    Pending: "bg-orange-50 text-orange-600 border-orange-200",
    Rejected: "bg-red-50 text-red-600 border-red-200",
    Dispatched: "bg-green-50 text-green-700 border-green-200",
    "Under Billing": "bg-sky-50 text-sky-700 border-sky-200",
    "Under Assembling": "bg-yellow-50 text-yellow-700 border-yellow-200",
  };
  return (
    <span
      className={`inline-block px-2.5 py-1 text-[10px] uppercase tracking-wider font-semibold rounded-full border ${styles[status] || "bg-slate-50 text-slate-600 border-slate-200"}`}
    >
      {status || "Pending"}
    </span>
  );
};

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

const DealerDetails = () => {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState("overview");
  const [search, setSearch] = useState("");
  const [limit, setLimit] = useState(25);

  // ═══════════════════════════════════════════════════════════
  //  API — COMMENTED
  // ═══════════════════════════════════════════════════════════
  // const loader = useCallback(async () => {
  //   const [dealerRes, quotationsRes, customersRes, vehiclesRes] = await Promise.allSettled([...]);
  //   ...
  // }, [id]);

  const dealer = MOCK_DEALER;
  const quotations = MOCK_QUOTATIONS;
  const customers = MOCK_CUSTOMERS;
  const vehicles = MOCK_VEHICLES;

  const stats = {
    totalQuotations: quotations.length,
    dispatched: quotations.filter((q) => q.status === "Dispatched").length,
    totalValue: quotations.reduce(
      (sum, q) => sum + (Number(q.totalAmount) || 0),
      0,
    ),
    totalCustomers: customers.length,
    totalVehicles: vehicles.length,
  };

  const filterFn = (item, fields) => {
    const term = search.trim().toLowerCase();
    if (!term) return true;
    return fields.some((f) => item[f]?.toString().toLowerCase().includes(term));
  };

  const filteredQuotations = quotations.filter((q) =>
    filterFn(q, ["chassisNumber", "modelName", "bodyTypeName"]),
  );
  const filteredCustomers = customers.filter((c) =>
    filterFn(c, ["name", "mobileNumber", "emailId", "chassisNumber"]),
  );
  const filteredVehicles = vehicles.filter((v) =>
    filterFn(v, ["chassisNumber"]),
  );

  const quotationColumns = [
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
  ];

  const customerColumns = [
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
  ];

  const vehicleColumns = [
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
  ];

  return (
    <section className="w-full">
      <Link
        to="/dealerInfo"
        className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 transition-colors mb-4"
      >
        <ArrowLeft size={15} /> Back to Dealers
      </Link>

      {/* Header */}
      <Card className="p-6 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-start gap-5">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shrink-0 shadow-lg shadow-blue-500/20">
            <User size={28} className="text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <h1 className="text-2xl font-bold text-slate-800">
                {dealer.name}
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
              <span className="font-mono font-medium text-blue-600">
                {dealer.dealerCode}
              </span>
              <span className="font-mono text-xs">GSTIN: {dealer.gstin}</span>
            </div>
          </div>
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

      {/* Stats */}
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

      {/* Tabs */}
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

      {/* Overview Tab */}
      {activeTab === "overview" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
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
          </div>

          {activeTab === "quotations" && (
            <DataTable
              columns={quotationColumns}
              rows={filteredQuotations.slice(0, limit)}
              rowKey={(r) => r.id ?? r.chassisNumber}
              emptyText="No quotations found."
            />
          )}
          {activeTab === "customers" && (
            <DataTable
              columns={customerColumns}
              rows={filteredCustomers.slice(0, limit)}
              rowKey={(r) => r.id ?? r.chassisNumber}
              emptyText="No customers found."
            />
          )}
          {activeTab === "vehicles" && (
            <DataTable
              columns={vehicleColumns}
              rows={filteredVehicles.slice(0, limit)}
              rowKey={(r) => r.id ?? r.chassisNumber}
              emptyText="No vehicles found."
            />
          )}
        </>
      )}
    </section>
  );
};

export default DealerDetails;
