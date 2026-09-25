import { useCallback, useMemo, useState } from "react";
import { Link } from "react-router";
import { ArrowLeft, Search, Trash2 } from "lucide-react";
import api from "../../api/client";
import { useAuth } from "../../auth/AuthContext";
import { useDealerInfo } from "../../auth/useDealerInfo";
import { ROLE_DASH, ROLE_LABEL } from "../../auth/roleConfig";
import useAsyncData from "../../hooks/useAsyncData";
import { Input } from "../../components/ui/Field";
import DataTable from "../../components/ui/DataTable";
import ConfirmModal from "../../components/ui/ConfirmModal";
import { Banner, ErrorCard, LoadingCard } from "../../components/ui/AsyncStates";

// Replaces the old app's DealerCustomerInfo.jsx (dealer) and
// DisplayCustomerInfo.jsx (admin) — they were the same table with a different
// endpoint, so it's one role-aware page now, served on both routes:
//   dealer -> GET /CustomerTable?dealerCode=...   (only their customers)
//   admin  -> GET /CustomerTable/admin            (everyone, can delete)
const PAGE_SIZE = 25;
const MIN_DEALER_CODE_LENGTH = 7; // same guard the old dealer screen had
const LOAD_ERROR = "Couldn't load customers. Please try again.";

const CustomerInfo = () => {
  const { role } = useAuth();
  const { dealerCode } = useDealerInfo();
  const isAdmin = role === "admin";
  const canLoad = isAdmin || dealerCode.length >= MIN_DEALER_CODE_LENGTH;

  const [search, setSearch] = useState("");
  const [limit, setLimit] = useState(PAGE_SIZE);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [banner, setBanner] = useState(null); // { type, text }

  const loader = useCallback(async () => {
    if (!canLoad) return [];
    const res = isAdmin
      ? await api.get("/CustomerTable/admin")
      : await api.get("/CustomerTable", { params: { dealerCode } });
    return Array.isArray(res.data) ? res.data : [];
  }, [isAdmin, canLoad, dealerCode]);

  const { data, error, loading, reload, setData } = useAsyncData(
    ["customers", isAdmin ? "all" : dealerCode],
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
      await api.delete(`/CustomerTable/${encodeURIComponent(deleteTarget.id)}`);
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
      { key: "chassisNumber", label: "Chassis Number" },
      ...(isAdmin ? [{ key: "dealerCode", label: "Dealer Code" }] : []),
      { key: "name", label: "Name" },
      { key: "mobileNumber", label: "Mobile" },
      { key: "emailId", label: "Email" },
      { key: "address", label: "Address", wrap: true },
      { key: "pincode", label: "Pincode" },
      { key: "state", label: "State" },
      { key: "dist", label: "District" },
      ...(isAdmin
        ? [
            {
              key: "actions",
              label: "",
              render: (row) => (
                <button
                  onClick={() => setDeleteTarget(row)}
                  className="text-muted-foreground hover:text-red-400 transition-colors"
                  aria-label={`Delete customer ${row.chassisNumber}`}
                >
                  <Trash2 size={16} />
                </button>
              ),
            },
          ]
        : []),
    ],
    [isAdmin],
  );

  const title = isAdmin ? "Customer Info" : "My Customers";

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
            {title}
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base mt-2">
            {isAdmin
              ? "Every customer registered against a vehicle, across all dealers."
              : "Customers registered against vehicles from your dealership."}
          </p>
        </div>

        {banner && <Banner type={banner.type}>{banner.text}</Banner>}

        {!canLoad ? (
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
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-placeholder"
                />
                <Input
                  value={search}
                  onChange={handleSearch}
                  placeholder="Search by chassis, name, mobile, state..."
                  className="!pl-10"
                  aria-label="Search customers"
                />
              </div>
              <p className="text-xs text-muted-foreground">
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

      <ConfirmModal
        open={!!deleteTarget}
        title="Delete customer record?"
        message={`This permanently removes the customer record for chassis ${deleteTarget?.chassisNumber ?? ""}${deleteTarget?.name ? ` (${deleteTarget.name})` : ""}. This can't be undone.`}
        busy={deleting}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </section>
  );
};

export default CustomerInfo;
