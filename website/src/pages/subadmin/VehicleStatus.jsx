import { useCallback, useMemo, useState } from "react";
import { Search } from "lucide-react";
import api from "../../api/client";
import useAsyncData from "../../hooks/useAsyncData";
import { Input, Select } from "../../components/ui/Field";
import DataTable from "../../components/ui/DataTable";
import { ErrorCard, LoadingCard } from "../../components/ui/AsyncStates";
import StatusBadge from "../../features/quotation/StatusBadge";
import DashboardLayout from "../../components/dashboard/DashboardLayout";
import { MOCK_VEHICLES, MOCK_QUOTATIONS } from "../../data/mockData";

// ─── Toggle: set to false to use REAL API ────────────────────
const USE_MOCK = true;

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
    // ══════════════════════════════════════════════════════════
    // MOCK DATA
    // ══════════════════════════════════════════════════════════
    if (USE_MOCK) {
      await new Promise((r) => setTimeout(r, 400));
      const statusByChassis = new Map(
        MOCK_QUOTATIONS.filter((q) => q.chassisNumber).map((q) => [
          q.chassisNumber,
          q.status || "Pending",
        ]),
      );
      return MOCK_VEHICLES.map((v) => ({
        ...v,
        derivedStatus: statusByChassis.get(v.chassisNumber) || "In Stock",
      }));
    }

    // ══════════════════════════════════════════════════════════
    // REAL API
    // ══════════════════════════════════════════════════════════
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
            <span className="text-[10px] uppercase tracking-[0.14em] font-semibold px-2.5 py-1 rounded-full bg-white/[0.04] text-white/60 border border-white/10 font-rr">
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
    <DashboardLayout dealerName="Sub Admin">
      <div className="w-full max-w-7xl mx-auto">
        <div className="mb-6">
          <span className="text-[10px] uppercase tracking-[0.28em] font-semibold text-primary mb-2 inline-block font-rr">
            Sub Admin
          </span>
          <h1 className="font-display uppercase text-white text-2xl sm:text-3xl leading-[1.05] tracking-[-0.01em]">
            Vehicle Status
          </h1>
          <p className="text-white/50 text-sm mt-2 max-w-2xl">
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
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none"
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
              <p className="text-xs text-white/40 sm:ml-auto font-rr tracking-[0.02em]">
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
                  className="text-sm text-primary hover:underline"
                >
                  Show {Math.min(PAGE_SIZE, filtered.length - visible.length)}{" "}
                  more
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </DashboardLayout>
  );
};

export default VehicleStatus;
