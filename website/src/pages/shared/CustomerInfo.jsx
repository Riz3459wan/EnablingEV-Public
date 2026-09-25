import { useCallback, useMemo, useState } from "react";
import { Search, Trash2 } from "lucide-react";
import api from "../../api/client";
import { useAuth } from "../../auth/AuthContext";
import { useDealerInfo } from "../../auth/useDealerInfo";
import useAsyncData from "../../hooks/useAsyncData";
import { Input } from "../../components/ui/Field";
import DataTable from "../../components/ui/DataTable";
import ConfirmModal from "../../components/ui/ConfirmModal";
import {
  Banner,
  ErrorCard,
  LoadingCard,
} from "../../components/ui/AsyncStates";
import DashboardLayout from "../../components/dashboard/DashboardLayout";
import { MOCK_CUSTOMERS } from "../../data/mockData";

// ─── Toggle: set to false to use REAL API ────────────────────
const USE_MOCK = true;

const PAGE_SIZE = 25;
const MIN_DEALER_CODE_LENGTH = 7;
const LOAD_ERROR = "Couldn't load customers. Please try again.";

const CustomerInfo = () => {
  const { role } = useAuth();
  const { dealerCode, dealerInfo } = useDealerInfo();
  const isSubAdmin = role === "subadmin" || role === "admin";
  const isDealer = role === "dealer";
  const canLoad = isSubAdmin || dealerCode.length >= MIN_DEALER_CODE_LENGTH;

  const [search, setSearch] = useState("");
  const [limit, setLimit] = useState(PAGE_SIZE);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [banner, setBanner] = useState(null);

  const loader = useCallback(async () => {
    // ══════════════════════════════════════════════════════════
    // MOCK DATA
    // ══════════════════════════════════════════════════════════
    if (USE_MOCK) {
      await new Promise((r) => setTimeout(r, 400));
      const list = isDealer
        ? MOCK_CUSTOMERS.filter((c) => c.dealerCode === dealerCode)
        : MOCK_CUSTOMERS;
      return list;
    }

    // ══════════════════════════════════════════════════════════
    // REAL API
    // ══════════════════════════════════════════════════════════
    if (!canLoad) return [];
    const res = isSubAdmin
      ? await api.get("/CustomerTable/admin")
      : await api.get("/CustomerTable", { params: { dealerCode } });
    return Array.isArray(res.data) ? res.data : [];
  }, [isSubAdmin, isDealer, canLoad, dealerCode]);

  const { data, error, loading, reload, setData } = useAsyncData(
    ["customers", isSubAdmin ? "all" : dealerCode],
    loader,
    LOAD_ERROR,
  );

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    const list = data ?? [];
    if (!term) return list;
    return list.filter((c) =>
      [
        c.chassisNumber,
        c.dealerCode,
        c.name,
        c.mobileNumber,
        c.emailId,
        c.address,
        c.pincode,
        c.state,
        c.dist,
      ].some((field) => field?.toString().toLowerCase().includes(term)),
    );
  }, [data, search]);

  const visible = filtered.slice(0, limit);

  const handleSearch = (e) => {
    setSearch(e.target.value);
    setLimit(PAGE_SIZE);
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    setBanner(null);
    try {
      if (!USE_MOCK) {
        await api.delete(
          `/CustomerTable/${encodeURIComponent(deleteTarget.id)}`,
        );
      }
      setData((list) => list.filter((c) => c.id !== deleteTarget.id));
      setBanner({
        type: "success",
        text: `Deleted customer record for chassis ${deleteTarget.chassisNumber}.`,
      });
    } catch {
      setBanner({ type: "error", text: "Delete failed. Please try again." });
    } finally {
      setDeleting(false);
      setDeleteTarget(null);
    }
  };

  const columns = useMemo(
    () => [
      { key: "chassisNumber", label: "Chassis Number", className: "font-mono" },
      ...(isSubAdmin ? [{ key: "dealerCode", label: "Dealer Code" }] : []),
      { key: "name", label: "Name" },
      { key: "mobileNumber", label: "Mobile" },
      { key: "emailId", label: "Email" },
      {
        key: "location",
        label: "Location",
        render: (row) =>
          [row.dist, row.state].filter(Boolean).join(", ") ||
          row.address ||
          "—",
      },
      ...(isSubAdmin
        ? [
            {
              key: "actions",
              label: "",
              render: (row) => (
                <button
                  onClick={() => setDeleteTarget(row)}
                  className="text-white/40 hover:text-red-400 transition-colors"
                  aria-label={`Delete customer ${row.chassisNumber}`}
                >
                  <Trash2 size={16} />
                </button>
              ),
            },
          ]
        : []),
    ],
    [isSubAdmin],
  );

  const title = isDealer ? "My Customers" : "All Customers";

  return (
    <DashboardLayout
      dealerName={isDealer ? dealerInfo?.name : "Sub Admin"}
      dealerCode={isDealer ? dealerCode : null}
    >
      <div className="w-full max-w-7xl mx-auto">
        <div className="mb-6">
          <span className="text-[10px] uppercase tracking-[0.28em] font-semibold text-primary mb-2 inline-block font-rr">
            {isDealer ? "Dealer" : "Sub Admin"}
          </span>
          <h1 className="font-display uppercase text-white text-2xl sm:text-3xl leading-[1.05] tracking-[-0.01em]">
            {title}
          </h1>
          <p className="text-white/50 text-sm mt-2 max-w-2xl">
            {isSubAdmin
              ? "Every customer registered against a vehicle, across all dealers."
              : "Customers registered against vehicles from your dealership."}
          </p>
        </div>

        {banner && <Banner type={banner.type}>{banner.text}</Banner>}

        {!canLoad && !USE_MOCK ? (
          <ErrorCard message="Dealer code not found for this session. Please log out and sign in again." />
        ) : loading ? (
          <LoadingCard />
        ) : error ? (
          <ErrorCard message={error} onRetry={reload} />
        ) : (
          <>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
              <div className="relative w-full sm:max-w-sm">
                <Search
                  size={16}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none"
                />
                <Input
                  value={search}
                  onChange={handleSearch}
                  placeholder="Search by chassis, name, mobile, state..."
                  className="!pl-10"
                  aria-label="Search customers"
                />
              </div>
              <p className="text-xs text-white/40 font-rr tracking-[0.02em]">
                Showing {visible.length} of {filtered.length}
                {filtered.length !== data.length && ` (${data.length} total)`}
              </p>
            </div>

            <DataTable
              columns={columns}
              rows={visible}
              rowKey={(row) => row.id ?? row.chassisNumber}
              emptyText={
                search
                  ? "No customers match your search."
                  : "No customers registered yet."
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

      <ConfirmModal
        open={!!deleteTarget}
        title="Delete customer record?"
        message={`This permanently removes the customer record for chassis ${deleteTarget?.chassisNumber ?? ""}${deleteTarget?.name ? ` (${deleteTarget.name})` : ""}. This can't be undone.`}
        busy={deleting}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </DashboardLayout>
  );
};

export default CustomerInfo;
