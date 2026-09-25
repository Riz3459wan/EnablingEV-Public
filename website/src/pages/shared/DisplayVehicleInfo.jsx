import { useCallback, useMemo, useState } from "react";
import { Link } from "react-router";
import { ArrowLeft, Search } from "lucide-react";
import api from "../../api/client";
import { useAuth } from "../../auth/AuthContext";
import { useDealerInfo } from "../../auth/useDealerInfo";
import { ROLE_DASH, ROLE_LABEL } from "../../auth/roleConfig";
import useAsyncData from "../../hooks/useAsyncData";
import { matchesVehicleType } from "../../utils/vehicleType";
import { Input, Select } from "../../components/ui/Field";
import DataTable from "../../components/ui/DataTable";
import { ErrorCard, LoadingCard } from "../../components/ui/AsyncStates";

// Migrated from the old app's DisplayVehicleInfo.jsx. Shows DISPATCHED
// vehicles (quotations with status=Dispatched), enriched with the vehicle
// record's `isUsed` flag from /VehicleTable.
//   dealer         -> only their own dispatched vehicles
//   admin/subadmin -> all dealers, with a dealer filter (built from the loaded
//                     data, so the old extra /dealer/minimal call isn't needed)
const PAGE_SIZE = 25;
const MIN_DEALER_CODE_LENGTH = 7;
const LOAD_ERROR = "Couldn't load vehicles. Please try again.";

const TYPE_OPTIONS = [
  ["all", "All"],
  ["rikshaw", "Rikshaw"],
  ["cargo", "Cargo / Loader"],
];

const batterySpecs = (q) =>
  [
    q.batteryVolt ? `${q.batteryVolt}V` : "",
    q.batteryAmpereHours ? `${q.batteryAmpereHours}Ah` : "",
  ]
    .filter(Boolean)
    .join(" / ") || "—";

const dealerNameOf = (q) =>
  q.dealerName || q.dealerNameDealerCode?.split("|")[0]?.trim() || "";

const UsedBadge = ({ value }) => {
  if (value === null) return <span className="text-placeholder">—</span>;
  return value ? (
    <span className="text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full bg-yellow-500/10 text-yellow-400 border border-yellow-500/30">
      Yes
    </span>
  ) : (
    <span className="text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full bg-accent/10 text-accent border border-accent/30">
      No
    </span>
  );
};

const DisplayVehicleInfo = () => {
  const { role } = useAuth();
  const { dealerCode } = useDealerInfo();
  const isDealer = role === "dealer";
  const canLoad = !isDealer || dealerCode.length >= MIN_DEALER_CODE_LENGTH;

  const [search, setSearch] = useState("");
  const [type, setType] = useState("all");
  const [dealerFilter, setDealerFilter] = useState("all");
  const [limit, setLimit] = useState(PAGE_SIZE);

  const loader = useCallback(async () => {
    if (!canLoad) return [];
    const params = { status: "Dispatched", ...(isDealer ? { dealerCode } : {}) };
    const [quotes, vehicles] = await Promise.all([
      api.get("/QuotationTable", { params }),
      // isUsed is a nice-to-have: if this call fails the list still loads and
      // the column shows "—" instead of wrongly saying "No".
      api
        .get("/VehicleTable")
        .then((r) => r.data)
        .catch(() => null),
    ]);
    const usedByChassis = Array.isArray(vehicles)
      ? new Map(
          vehicles
            .filter((v) => v.chassisNumber)
            .map((v) => [v.chassisNumber, v.isUsed === true]),
        )
      : null;
    const list = Array.isArray(quotes.data) ? quotes.data : [];
    return list.map((q) => ({
      ...q,
      model: q.modelName || q.model,
      bodyType: q.bodyTypeName || q.bodyType,
      color: q.colorName || q.color,
      specs: batterySpecs(q),
      dealerLabel: dealerNameOf(q),
      isUsed: usedByChassis ? usedByChassis.get(q.chassisNumber) === true : null,
    }));
  }, [canLoad, isDealer, dealerCode]);

  const { data, error, loading, reload } = useAsyncData(
    ["displayVehicles", isDealer ? dealerCode : "all"],
    loader,
    LOAD_ERROR,
  );

  const dealerOptions = useMemo(() => {
    if (isDealer) return [];
    const map = new Map();
    (data ?? []).forEach((q) => {
      if (q.dealerCode && !map.has(q.dealerCode)) {
        map.set(q.dealerCode, `${q.dealerLabel || "Unknown Dealer"} (${q.dealerCode})`);
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
      if (!isDealer && dealerFilter !== "all" && q.dealerCode !== dealerFilter) {
        return false;
      }
      if (!term) return true;
      return [
        q.dealerLabel,
        q.dealerCode,
        q.chassisNumber,
        q.vehicleType,
        q.model,
        q.bodyType,
        q.color,
        q.batteryType,
        q.batteryVolt,
        q.batteryCompany,
        q.batteryAH,
        q.batteryWarranty,
        q.charger,
        q.isUsed === null ? "" : q.isUsed ? "Yes" : "No",
      ].some((field) => field?.toString().toLowerCase().includes(term));
    });
  }, [data, search, type, dealerFilter, isDealer]);

  const visible = filtered.slice(0, limit);

  const columns = useMemo(
    () => [
      { key: "chassisNumber", label: "Chassis Number", className: "font-mono" },
      ...(isDealer
        ? []
        : [
            {
              key: "dealerLabel",
              label: "Dealer",
              render: (row) => (
                <span>
                  {row.dealerLabel || "—"}
                  {row.dealerCode && (
                    <span className="block text-xs text-muted-foreground">
                      {row.dealerCode}
                    </span>
                  )}
                </span>
              ),
            },
          ]),
      { key: "vehicleType", label: "Vehicle Type" },
      { key: "model", label: "Model" },
      { key: "bodyType", label: "Body Type" },
      { key: "color", label: "Color" },
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

  const resetPaging = () => setLimit(PAGE_SIZE);

  return (
    <section className="min-h-screen pt-28 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-7xl mx-auto">
        <Link
          to={ROLE_DASH[role] || "/"}
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-white transition-colors mb-4"
        >
          <ArrowLeft size={15} /> Back to dashboard
        </Link>

        <div className="mb-8">
          <span className="text-xs uppercase tracking-widest font-semibold text-accent mb-1 inline-block">
            {ROLE_LABEL[role]}
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            {isDealer ? "My Vehicles" : "Vehicle Info"}
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base mt-2">
            {isDealer
              ? "Vehicles dispatched to your dealership."
              : "Dispatched vehicles across all dealers."}
          </p>
        </div>

        {!canLoad ? (
          <ErrorCard message="Dealer code not found for this session. Please log out and sign in again." />
        ) : loading ? (
          <LoadingCard />
        ) : error ? (
          <ErrorCard message={error} onRetry={reload} />
        ) : (
          <>
            <div className="flex flex-col lg:flex-row lg:items-center gap-3 mb-4">
              <div className="relative w-full lg:max-w-sm">
                <Search
                  size={16}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-placeholder"
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

              <div className="inline-flex self-start rounded-full border border-line bg-card p-1">
                {TYPE_OPTIONS.map(([value, label]) => (
                  <button
                    key={value}
                    onClick={() => {
                      setType(value);
                      resetPaging();
                    }}
                    aria-pressed={type === value}
                    className={`px-4 py-1.5 text-xs font-semibold rounded-full transition-colors ${
                      type === value
                        ? "bg-primary text-background"
                        : "text-muted-foreground hover:text-white"
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

              <p className="text-xs text-muted-foreground lg:ml-auto">
                Showing {visible.length} of {filtered.length} dispatched
                vehicles
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
                  className="text-sm text-accent hover:underline"
                >
                  Show {Math.min(PAGE_SIZE, filtered.length - visible.length)}{" "}
                  more
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
};

export default DisplayVehicleInfo;
