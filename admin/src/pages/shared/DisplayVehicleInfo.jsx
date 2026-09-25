import { useMemo, useState } from "react";
import { Link } from "react-router";
import { ArrowLeft, Search } from "lucide-react";
import { useAuth } from "../../auth/AuthContext";
import { ROLE_DASH, ROLE_LABEL } from "../../auth/roleConfig";
import { matchesVehicleType } from "../../utils/vehicleType";
import { Input, Select } from "../../components/ui/Field";
import DataTable from "../../components/ui/DataTable";
import { ErrorCard, LoadingCard } from "../../components/ui/AsyncStates";

const PAGE_SIZE = 25;

// ═══════════════════════════════════════════════════════════
//  MOCK DATA
// ═══════════════════════════════════════════════════════════
const MOCK_VEHICLES = [
  {
    id: 1,
    chassisNumber: "ME9EBCR123H268XYZ",
    dealerName: "Shree Ram Motors",
    dealerCode: "DL01EV001",
    vehicleType: "Rikshaw",
    modelName: "F1",
    bodyTypeName: "MS",
    colorName: "Blue",
    batteryType: "Lithium",
    batteryVolt: 60,
    batteryAmpereHours: 100,
    specs: "60V / 100Ah",
    isUsed: false,
  },
  {
    id: 2,
    chassisNumber: "ME9EBCC456H268ABC",
    dealerName: "Rahul Auto Sales",
    dealerCode: "RJ02EV002",
    vehicleType: "Cargo",
    modelName: "LODER",
    bodyTypeName: "NR",
    colorName: "Green",
    batteryType: "Lithium",
    batteryVolt: 48,
    batteryAmpereHours: 120,
    specs: "48V / 120Ah",
    isUsed: true,
  },
  {
    id: 3,
    chassisNumber: "ME9EBCC789H268DEF",
    dealerName: "Green Energy Motors",
    dealerCode: "UP03EV003",
    vehicleType: "Cargo",
    modelName: "LODER",
    bodyTypeName: "DS",
    colorName: "White",
    batteryType: "Lithium",
    batteryVolt: 60,
    batteryAmpereHours: 100,
    specs: "60V / 100Ah",
    isUsed: false,
  },
  {
    id: 4,
    chassisNumber: "ME9EBCR012H268GHI",
    dealerName: "Metro EV Dealers",
    dealerCode: "HR04EV004",
    vehicleType: "Rikshaw",
    modelName: "F2",
    bodyTypeName: "SS",
    colorName: "Red",
    batteryType: "Lithium",
    batteryVolt: 60,
    batteryAmpereHours: 100,
    specs: "60V / 100Ah",
    isUsed: false,
  },
  {
    id: 5,
    chassisNumber: "ME9EBCR345H268JKL",
    dealerName: "Vijay Sales Corp",
    dealerCode: "MH05EV005",
    vehicleType: "Rikshaw",
    modelName: "F3",
    bodyTypeName: "MS",
    colorName: "Yellow",
    batteryType: "Lithium",
    batteryVolt: 60,
    batteryAmpereHours: 100,
    specs: "60V / 100Ah",
    isUsed: true,
  },
  {
    id: 6,
    chassisNumber: "ME9EBCR678H268MNO",
    dealerName: "Shree Ram Motors",
    dealerCode: "DL01EV001",
    vehicleType: "Rikshaw",
    modelName: "F1",
    bodyTypeName: "MS",
    colorName: "Blue",
    batteryType: "Lithium",
    batteryVolt: 60,
    batteryAmpereHours: 100,
    specs: "60V / 100Ah",
    isUsed: false,
  },
  {
    id: 7,
    chassisNumber: "ME9EBCC901H268PQR",
    dealerName: "Rahul Auto Sales",
    dealerCode: "RJ02EV002",
    vehicleType: "Cargo",
    modelName: "LODER",
    bodyTypeName: "NR",
    colorName: "Green",
    batteryType: "Lithium",
    batteryVolt: 48,
    batteryAmpereHours: 120,
    specs: "48V / 120Ah",
    isUsed: false,
  },
  {
    id: 8,
    chassisNumber: "ME9EBCR234H268STU",
    dealerName: "Green Energy Motors",
    dealerCode: "UP03EV003",
    vehicleType: "Rikshaw",
    modelName: "F4",
    bodyTypeName: "SS",
    colorName: "White",
    batteryType: "Lithium",
    batteryVolt: 60,
    batteryAmpereHours: 100,
    specs: "60V / 100Ah",
    isUsed: true,
  },
  {
    id: 9,
    chassisNumber: "ME9EBCR567H268VWX",
    dealerName: "Metro EV Dealers",
    dealerCode: "HR04EV004",
    vehicleType: "Rikshaw",
    modelName: "DELUX",
    bodyTypeName: "MS",
    colorName: "Blue",
    batteryType: "Lithium",
    batteryVolt: 60,
    batteryAmpereHours: 100,
    specs: "60V / 100Ah",
    isUsed: false,
  },
  {
    id: 10,
    chassisNumber: "ME9EBCC890H268YZA",
    dealerName: "Vijay Sales Corp",
    dealerCode: "MH05EV005",
    vehicleType: "Cargo",
    modelName: "LODER",
    bodyTypeName: "DS",
    colorName: "Red",
    batteryType: "Lithium",
    batteryVolt: 48,
    batteryAmpereHours: 120,
    specs: "48V / 120Ah",
    isUsed: false,
  },
];

const TYPE_OPTIONS = [
  ["all", "All"],
  ["rikshaw", "Rikshaw"],
  ["cargo", "Cargo / Loader"],
];

const UsedBadge = ({ value }) => {
  if (value === null) return <span className="text-slate-400">—</span>;
  return value ? (
    <span className="text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full bg-orange-50 text-orange-600 border border-orange-200">
      Yes
    </span>
  ) : (
    <span className="text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full bg-green-50 text-green-600 border border-green-200">
      No
    </span>
  );
};

const DisplayVehicleInfo = () => {
  const { role } = useAuth();
  const isDealer = role === "dealer";

  const [search, setSearch] = useState("");
  const [type, setType] = useState("all");
  const [dealerFilter, setDealerFilter] = useState("all");
  const [limit, setLimit] = useState(PAGE_SIZE);
  const data = MOCK_VEHICLES;
  const loading = false;
  const error = "";

  // ═══════════════════════════════════════════════════════════
  //  API — COMMENTED
  // ═══════════════════════════════════════════════════════════
  // const loader = useCallback(async () => {
  //   const params = { status: "Dispatched", ...(isDealer ? { dealerCode } : {}) };
  //   const [quotes, vehicles] = await Promise.all([
  //     api.get("/QuotationTable", { params }),
  //     api.get("/VehicleTable").then((r) => r.data).catch(() => null),
  //   ]);
  //   ...
  // }, [canLoad, isDealer, dealerCode]);

  const dealerOptions = useMemo(() => {
    if (isDealer) return [];
    const map = new Map();
    (data ?? []).forEach((q) => {
      if (q.dealerCode && !map.has(q.dealerCode)) {
        map.set(
          q.dealerCode,
          `${q.dealerName || "Unknown Dealer"} (${q.dealerCode})`,
        );
      }
    });
    return [...map.entries()]
      .map(([code, label]) => ({ code, label }))
      .sort((a, b) => a.label.localeCompare(b.label));
  }, [data, isDealer]);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return (data ?? []).filter((q) => {
      if (!matchesVehicleType(q, type)) return false;
      if (!isDealer && dealerFilter !== "all" && q.dealerCode !== dealerFilter)
        return false;
      if (!term) return true;
      return [
        q.dealerName,
        q.dealerCode,
        q.chassisNumber,
        q.vehicleType,
        q.modelName,
        q.bodyTypeName,
        q.colorName,
        q.batteryType,
        q.isUsed === null ? "" : q.isUsed ? "Yes" : "No",
      ].some((field) => field?.toString().toLowerCase().includes(term));
    });
  }, [data, search, type, dealerFilter, isDealer]);

  const visible = filtered.slice(0, limit);
  const resetPaging = () => setLimit(PAGE_SIZE);

  const columns = useMemo(
    () => [
      {
        key: "chassisNumber",
        label: "Chassis Number",
        className: "font-mono text-xs",
      },
      ...(isDealer
        ? []
        : [
            {
              key: "dealerName",
              label: "Dealer",
              render: (row) => (
                <span>
                  {row.dealerName || "—"}
                  {row.dealerCode && (
                    <span className="block text-xs text-slate-500">
                      {row.dealerCode}
                    </span>
                  )}
                </span>
              ),
            },
          ]),
      { key: "vehicleType", label: "Vehicle Type" },
      { key: "modelName", label: "Model" },
      { key: "bodyTypeName", label: "Body Type" },
      { key: "colorName", label: "Color" },
      { key: "batteryType", label: "Battery Type" },
      { key: "specs", label: "Battery Specs" },
      {
        key: "isUsed",
        label: "Used",
        render: (row) => <UsedBadge value={row.isUsed} />,
      },
    ],
    [isDealer],
  );

  return (
    <section className="w-full">
      <Link
        to={ROLE_DASH[role] || "/"}
        className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 transition-colors mb-4"
      >
        <ArrowLeft size={15} /> Back to dashboard
      </Link>

      <div className="mb-6">
        <p className="text-xs font-semibold text-blue-600 uppercase tracking-wider mb-1">
          {ROLE_LABEL[role]}
        </p>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 tracking-tight">
          {isDealer ? "My Vehicles" : "Vehicle Info"}
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          {isDealer
            ? "Vehicles dispatched to your dealership."
            : "Dispatched vehicles across all dealers."}
        </p>
      </div>

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
                placeholder="Search by chassis, model, color..."
                className="!pl-10"
                aria-label="Search vehicles"
              />
            </div>

            <div className="inline-flex self-start rounded-lg border border-slate-300 bg-white p-1">
              {TYPE_OPTIONS.map(([value, label]) => (
                <button
                  key={value}
                  onClick={() => {
                    setType(value);
                    resetPaging();
                  }}
                  aria-pressed={type === value}
                  className={`px-4 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                    type === value
                      ? "bg-blue-600 text-white"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            {dealerOptions.length > 0 && (
              <Select
                value={dealerFilter}
                onChange={(e) => {
                  setDealerFilter(e.target.value);
                  resetPaging();
                }}
                className="lg:max-w-xs"
                aria-label="Filter by dealer"
              >
                <option value="all">All dealers</option>
                {dealerOptions.map((d) => (
                  <option key={d.code} value={d.code}>
                    {d.label}
                  </option>
                ))}
              </Select>
            )}

            <p className="text-xs text-slate-500 lg:ml-auto">
              Showing {visible.length} of {filtered.length} dispatched vehicles
            </p>
          </div>

          <DataTable
            columns={columns}
            rows={visible}
            rowKey={(row) => row.id ?? row.chassisNumber}
            emptyText={
              data.length === 0
                ? "No dispatched vehicles yet."
                : "No vehicles match your filters."
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
    </section>
  );
};

export default DisplayVehicleInfo;
