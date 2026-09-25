import { useCallback, useMemo, useState } from "react";
import { Link } from "react-router";
import { ArrowLeft, Search, Trash2 } from "lucide-react";
import api from "../../api/client";
import { useAuth } from "../../auth/AuthContext";
import { ROLE_DASH, ROLE_LABEL } from "../../auth/roleConfig";
import useAsyncData from "../../hooks/useAsyncData";
import { Input } from "../../components/ui/Field";
import DataTable from "../../components/ui/DataTable";
import ConfirmModal from "../../components/ui/ConfirmModal";
import {
  Banner,
  ErrorCard,
  LoadingCard,
} from "../../components/ui/AsyncStates";

const PAGE_SIZE = 25;
const LOAD_ERROR = "Couldn't load dealers. Please try again.";

const DealerInfo = () => {
  const { role } = useAuth();
  const isAdmin = role === "admin";

  const [search, setSearch] = useState("");
  const [limit, setLimit] = useState(PAGE_SIZE);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [banner, setBanner] = useState(null);

  const loader = useCallback(async () => {
    const res = await api.get("/dealer/full");
    return Array.isArray(res.data) ? res.data : [];
  }, []);

  const { data, error, loading, reload, setData } = useAsyncData(
    ["dealers"],
    loader,
    LOAD_ERROR,
  );

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    const list = data ?? [];
    if (!term) return list;
    return list.filter((d) =>
      [
        d.LOIreferenceId,
        d.RQreferenceId,
        d.activationCode,
        d.dealerCode,
        d.name,
        d.mobileNo,
        d.emailId,
        d.gstin,
        d.address,
        d.state,
        d.dist,
        d.pinCode,
        d.rtoOffice,
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
      await api.delete(`/dealer/${encodeURIComponent(deleteTarget.id)}`);
      setData((list) => list.filter((d) => d.id !== deleteTarget.id));
      setBanner({
        type: "success",
        text: `Deleted dealer record for ${deleteTarget.name || deleteTarget.dealerCode}.`,
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
      {
        key: "dealerCode",
        label: "Dealer Code",
        className: "font-mono text-xs",
      },
      {
        key: "name",
        label: "Name",
        render: (row) => (
          <Link
            to={`/dealerDetails/${row.id || row.dealerCode}`}
            className="font-medium text-blue-600 hover:underline"
          >
            {row.name || "—"}
          </Link>
        ),
      },
      { key: "mobileNo", label: "Mobile" },
      { key: "emailId", label: "Email" },
      { key: "gstin", label: "GSTIN", className: "font-mono text-xs" },
      { key: "address", label: "Address", wrap: true },
      { key: "state", label: "State" },
      { key: "dist", label: "District" },
      { key: "pinCode", label: "Pincode" },
      { key: "rtoOffice", label: "RTO Office" },
      {
        key: "activationCode",
        label: "Activation Code",
        className: "font-mono text-xs",
      },
      { key: "LOIreferenceId", label: "LOI Ref" },
      { key: "RQreferenceId", label: "RQ Ref" },
      ...(isAdmin
        ? [
            {
              key: "actions",
              label: "",
              render: (row) => (
                <button
                  onClick={() => setDeleteTarget(row)}
                  className="text-slate-400 hover:text-red-500 transition-colors"
                  aria-label={`Delete dealer ${row.name || row.dealerCode}`}
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

  return (
    <section className="w-full">
      <div className="mb-6">
        <p className="text-xs font-semibold text-blue-600 uppercase tracking-wider mb-1">
          {ROLE_LABEL[role]}
        </p>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 tracking-tight">
          Dealer Info
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          All registered dealers across the network. Click a dealer name to view
          full details.
        </p>
      </div>

      {banner && <Banner type={banner.type}>{banner.text}</Banner>}

      {loading ? (
        <LoadingCard />
      ) : error ? (
        <ErrorCard message={error} onRetry={reload} />
      ) : (
        <>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
            <div className="relative w-full sm:max-w-sm">
              <Search
                size={16}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <Input
                value={search}
                onChange={handleSearch}
                placeholder="Search by name, dealer code, GSTIN, state..."
                className="!pl-10"
                aria-label="Search dealers"
              />
            </div>
            <p className="text-xs text-slate-500">
              Showing {visible.length} of {filtered.length}
              {filtered.length !== data.length && ` (${data.length} total)`}
            </p>
          </div>

          <DataTable
            columns={columns}
            rows={visible}
            rowKey={(row) => row.id ?? row.dealerCode}
            emptyText={
              search
                ? "No dealers match your search."
                : "No dealers registered yet."
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

      {isAdmin && (
        <ConfirmModal
          open={!!deleteTarget}
          title="Delete dealer record?"
          message={`This permanently removes the dealer record for ${deleteTarget?.name || deleteTarget?.dealerCode || ""}. This can't be undone.`}
          busy={deleting}
          onConfirm={confirmDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </section>
  );
};

export default DealerInfo;
