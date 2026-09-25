import { useCallback, useMemo, useState } from "react";
import { Link } from "react-router";
import { ArrowLeft, Search, Trash2, Eye, EyeOff } from "lucide-react";
import api from "../../api/client";
import { useAuth } from "../../auth/AuthContext";
import { ROLE_DASH, ROLE_LABEL } from "../../auth/roleConfig";
import useAsyncData from "../../hooks/useAsyncData";
import { Input } from "../../components/ui/Field";
import DataTable from "../../components/ui/DataTable";
import ConfirmModal from "../../components/ui/ConfirmModal";
import { Banner, ErrorCard, LoadingCard } from "../../components/ui/AsyncStates";

// Migrated from the old app's components/subAdminInfo/SubAdminInfo.jsx.
// Neither AdminDash nor SubAdminDash ever passed the old component's
// userId-scoped lookup (both mounted it with no props), so this always loads
// the full list via GET /CreateProfile/all — no functionality lost.
// AdminDash used the delete-enabled default; SubAdminDash passed
// showDeleteButton=false/showLabel=false (read-only) — same split as
// DealerInfo.jsx, driven by role here instead of props.
// One deliberate change: the old table showed every password in plain text.
// That's masked by default with a per-row reveal toggle — the data is still
// there and still visible on demand, just not exposed by default on screen.
const PAGE_SIZE = 25;
const LOAD_ERROR = "Couldn't load sub-admins. Please try again.";

const PasswordCell = ({ value }) => {
  const [visible, setVisible] = useState(false);
  if (!value) return "—";
  return (
    <span className="inline-flex items-center gap-2 font-mono">
      {visible ? value : "•".repeat(Math.min(value.length, 10))}
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        className="text-muted-foreground hover:text-white transition-colors"
        aria-label={visible ? "Hide password" : "Show password"}
      >
        {visible ? <EyeOff size={14} /> : <Eye size={14} />}
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
  const [banner, setBanner] = useState(null); // { type, text }

  const loader = useCallback(async () => {
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
      await api.delete(`/CreateProfile/${encodeURIComponent(deleteTarget.id)}`);
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

  const columns = useMemo(
    () => [
      { key: "fullName", label: "Full Name" },
      { key: "mobileNumber", label: "Mobile" },
      { key: "email", label: "Email" },
      { key: "address", label: "Address", wrap: true },
      { key: "city", label: "City" },
      { key: "district", label: "District" },
      { key: "pincode", label: "Pincode" },
      { key: "state", label: "State" },
      { key: "userId", label: "User ID", className: "font-mono" },
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
                  className="text-muted-foreground hover:text-red-400 transition-colors"
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
            Sub Admin Info
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base mt-2">
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
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-placeholder"
                />
                <Input
                  value={search}
                  onChange={handleSearch}
                  placeholder="Search by name, user ID, city, state..."
                  className="!pl-10"
                  aria-label="Search sub-admins"
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
    </section>
  );
};

export default SubAdminInfo;
