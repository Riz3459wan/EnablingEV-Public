import { useCallback, useMemo, useState } from "react";
import { Search, Trash2, Eye, EyeOff } from "lucide-react";
import api from "../../api/client";
import { useAuth } from "../../auth/AuthContext";
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
import { MOCK_SUB_ADMINS } from "../../data/mockData";

// ─── Toggle: set to false to use REAL API ────────────────────
const USE_MOCK = true;

const PAGE_SIZE = 25;
const LOAD_ERROR = "Couldn't load sub-admins. Please try again.";

const PasswordCell = ({ value }) => {
  const [visible, setVisible] = useState(false);
  if (!value) return "—";
  return (
    <span className="inline-flex items-center gap-2 font-mono text-xs">
      {visible ? value : "•".repeat(Math.min(value.length, 8))}
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        className="text-white/40 hover:text-white transition-colors"
        aria-label={visible ? "Hide password" : "Show password"}
      >
        {visible ? <EyeOff size={13} /> : <Eye size={13} />}
      </button>
    </span>
  );
};

const SubAdminInfo = () => {
  const { role } = useAuth();
  const isAdmin = role === "admin";

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
      return MOCK_SUB_ADMINS;
    }

    // ══════════════════════════════════════════════════════════
    // REAL API
    // ══════════════════════════════════════════════════════════
    const res = await api.get("/CreateProfile/all");
    return Array.isArray(res.data) ? res.data : [];
  }, []);

  const { data, error, loading, reload, setData } = useAsyncData(
    ["subAdmins"],
    loader,
    LOAD_ERROR,
  );

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    const list = data ?? [];
    if (!term) return list;
    return list.filter((s) =>
      [
        s.fullName,
        s.mobileNumber,
        s.email,
        s.address,
        s.city,
        s.district,
        s.pincode,
        s.state,
        s.userId,
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
          `/CreateProfile/${encodeURIComponent(deleteTarget.id)}`,
        );
      }
      setData((list) => list.filter((s) => s.id !== deleteTarget.id));
      setBanner({
        type: "success",
        text: `Deleted sub-admin profile for ${deleteTarget.fullName || deleteTarget.userId}.`,
      });
    } catch {
      setBanner({ type: "error", text: "Delete failed. Please try again." });
    } finally {
      setDeleting(false);
      setDeleteTarget(null);
    }
  };

  // ─── Reduced columns — combined Location, no address wrap ───
  const columns = useMemo(
    () => [
      { key: "fullName", label: "Full Name" },
      { key: "userId", label: "User ID", className: "font-mono" },
      { key: "mobileNumber", label: "Mobile" },
      { key: "email", label: "Email" },
      {
        key: "location",
        label: "Location",
        render: (row) =>
          [row.city, row.district, row.state].filter(Boolean).join(", ") || "—",
      },
      {
        key: "password",
        label: "Password",
        render: (row) => <PasswordCell value={row.password} />,
      },
      ...(isAdmin
        ? [
            {
              key: "actions",
              label: "",
              render: (row) => (
                <button
                  onClick={() => setDeleteTarget(row)}
                  className="text-white/40 hover:text-red-400 transition-colors"
                  aria-label={`Delete sub-admin ${row.fullName || row.userId}`}
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
    <DashboardLayout dealerName="Sub Admin">
      <div className="w-full max-w-7xl mx-auto">
        <div className="mb-6">
          <span className="text-[10px] uppercase tracking-[0.28em] font-semibold text-primary mb-2 inline-block font-rr">
            Sub Admin
          </span>
          <h1 className="font-display uppercase text-white text-2xl sm:text-3xl leading-[1.05] tracking-[-0.01em]">
            Sub Admin Info
          </h1>
          <p className="text-white/50 text-sm mt-2 max-w-2xl">
            All sub-admin accounts on the platform.
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
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none"
                />
                <Input
                  value={search}
                  onChange={handleSearch}
                  placeholder="Search by name, user ID, city, state..."
                  className="!pl-10"
                  aria-label="Search sub-admins"
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
              rowKey={(row) => row.id ?? row.userId}
              emptyText={
                search
                  ? "No sub-admins match your search."
                  : "No sub-admins created yet."
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

      {isAdmin && (
        <ConfirmModal
          open={!!deleteTarget}
          title="Delete sub-admin profile?"
          message={`This permanently removes the sub-admin profile for ${deleteTarget?.fullName || deleteTarget?.userId || ""}. This can't be undone.`}
          busy={deleting}
          onConfirm={confirmDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </DashboardLayout>
  );
};

export default SubAdminInfo;
