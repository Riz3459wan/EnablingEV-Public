import { useCallback, useMemo, useState } from "react";
import { Link } from "react-router";
import { ArrowLeft, Search } from "lucide-react";
import api from "../../api/client";
import useAsyncData from "../../hooks/useAsyncData";
import { Input, Select } from "../../components/ui/Field";
import DataTable from "../../components/ui/DataTable";
import { ErrorCard, LoadingCard } from "../../components/ui/AsyncStates";
import StatusBadge from "../../features/quotation/StatusBadge";

// NEW page — additive only. Does not touch DisplayVehicleInfo.jsx, which
// stays exactly as-is for Admin/Dealer/Sub-Admin (hardcoded to dispatched
// vehicles). This is a separate, Sub-Admin-only view answering a different
// question: "what's the current state of every registered vehicle?" —
// derived entirely from data that already exists (/VehicleTable +
// /QuotationTable), no backend changes.
//   Not in any quotation yet -> "In Stock"
//   In a quotation           -> that quotation's status (StatusBadge, same
//                                component used in Create Quotation)
const PAGE_SIZE = 25;
const LOAD_ERROR = "Couldn't load vehicle status. Please try again.";

const STATUS_FILTERS = [
  ["all", "All statuses"],
  ["in stock", "In Stock"],
  ["under assembling", "Under Assembling"],
  ["under billing", "Under Billing"],
  ["dispatched", "Dispatched"],
  ["pending", "Pending / Approved"],
];

const VehicleStatus = () => {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [limit, setLimit] = useState(PAGE_SIZE);

  const loader = useCallback(async () => {
    const [vehiclesRes, quotesRes] = await Promise.all([
      api.get("/VehicleTable"),
      api.get("/QuotationTable"),
    ]);
    const vehicles = Array.isArray(vehiclesRes.data) ? vehiclesRes.data : [];
    const quotes = Array.isArray(quotesRes.data) ? quotesRes.data : [];
    const statusByChassis = new Map(
      quotes
        .filter((q) => q.chassisNumber)
        .map((q) => [q.chassisNumber, q.status || "Pending"]),
    );
    return vehicles.map((v) => ({
      ...v,
      derivedStatus: statusByChassis.get(v.chassisNumber) || "In Stock",
    }));
  }, []);

  const { data, error, loading, reload } = useAsyncData(
    ["vehicleStatus"],
    loader,
    LOAD_ERROR,
  );

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    const list = data ?? [];
    return list.filter((v) => {
      const statusLower = v.derivedStatus.toLowerCase();
      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "pending"
          ? ![
              "in stock",
              "under assembling",
              "under billing",
              "dispatched",
            ].includes(statusLower)
          : statusLower === statusFilter);
      if (!matchesStatus) return false;
      if (!term) return true;
      return [
        v.chassisNumber,
        v.model,
        v.color,
        v.dealerNameDealerCode,
        v.derivedStatus,
      ].some((f) => f?.toString().toLowerCase().includes(term));
    });
  }, [data, search, statusFilter]);

  const visible = filtered.slice(0, limit);

  const columns = useMemo(
    () => [
      { key: "chassisNumber", label: "Chassis Number", className: "font-mono" },
      { key: "model", label: "Model" },
      { key: "color", label: "Color" },
      { key: "dealerNameDealerCode", label: "Assigned Dealer" },
      {
        key: "derivedStatus",
        label: "Status",
        render: (v) =>
          v.derivedStatus === "In Stock" ? (
            <span className="text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full bg-white/5 text-muted-foreground border border-line">
              In Stock
            </span>
          ) : (
            <StatusBadge status={v.derivedStatus} />
          ),
      },
    ],
    [],
  );

  return (
    <section className="min-h-screen pt-28 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-7xl mx-auto">
        <Link
          to="/subAdminDash"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-white transition-colors mb-4"
        >
          <ArrowLeft size={15} /> Back to dashboard
        </Link>

        <div className="mb-8">
          <span className="text-xs uppercase tracking-widest font-semibold text-accent mb-1 inline-block">
            Sub Admin
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Vehicle Status
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base mt-2">
            Every registered vehicle's current stage — in stock, assigned to a
            quotation, or dispatched.
          </p>
        </div>

        {loading ? (
          <LoadingCard />
        ) : error ? (
          <ErrorCard message={error} onRetry={reload} />
        ) : (
          <>
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4">
              <div className="relative w-full sm:max-w-sm">
                <Search
                  size={16}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-placeholder"
                />
                <Input
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setLimit(PAGE_SIZE);
                  }}
                  placeholder="Search by chassis, model, dealer..."
                  className="!pl-10"
                  aria-label="Search vehicles"
                />
              </div>
              <Select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setLimit(PAGE_SIZE);
                }}
                className="sm:w-56"
                aria-label="Filter by status"
              >
                {STATUS_FILTERS.map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </Select>
              <p className="text-xs text-muted-foreground sm:ml-auto">
                Showing {visible.length} of {filtered.length}
              </p>
            </div>

            <DataTable
              columns={columns}
              rows={visible}
              rowKey={(row) => row.id ?? row.chassisNumber}
              emptyText={
                search || statusFilter !== "all"
                  ? "No vehicles match your filters."
                  : "No vehicles registered yet."
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

export default VehicleStatus;
