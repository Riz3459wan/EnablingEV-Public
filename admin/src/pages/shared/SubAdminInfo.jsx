import { useMemo, useState } from "react";
import { Link } from "react-router";
import { ArrowLeft, Search, Trash2, Eye, EyeOff } from "lucide-react";
import { useAuth } from "../../auth/AuthContext";
import { ROLE_DASH, ROLE_LABEL } from "../../auth/roleConfig";
import { Input } from "../../components/ui/Field";
import DataTable from "../../components/ui/DataTable";
import ConfirmModal from "../../components/ui/ConfirmModal";
import {
  Banner,
  ErrorCard,
  LoadingCard,
} from "../../components/ui/AsyncStates";

const PAGE_SIZE = 25;

// ═══════════════════════════════════════════════════════════
//  MOCK DATA
// ═══════════════════════════════════════════════════════════
const MOCK_SUBADMINS = [
  {
    id: 1,
    fullName: "Rakesh Kumar",
    mobileNumber: "9876543210",
    email: "rakesh@example.com",
    address: "Karol Bagh",
    city: "New Delhi",
    district: "New Delhi",
    pincode: "110005",
    state: "Delhi",
    userId: "rakesh01",
    password: "pass1234",
  },
  {
    id: 2,
    fullName: "Priya Sharma",
    mobileNumber: "9876543211",
    email: "priya@example.com",
    address: "MI Road",
    city: "Jaipur",
    district: "Jaipur",
    pincode: "302001",
    state: "Rajasthan",
    userId: "priya02",
    password: "pass5678",
  },
  {
    id: 3,
    fullName: "Amit Singh",
    mobileNumber: "9876543212",
    email: "amit@example.com",
    address: "Hazratganj",
    city: "Lucknow",
    district: "Lucknow",
    pincode: "226001",
    state: "Uttar Pradesh",
    userId: "amit03",
    password: "pass9012",
  },
  {
    id: 4,
    fullName: "Suresh Yadav",
    mobileNumber: "9876543213",
    email: "suresh@example.com",
    address: "Sector 14",
    city: "Gurgaon",
    district: "Gurgaon",
    pincode: "122001",
    state: "Haryana",
    userId: "suresh04",
    password: "pass3456",
  },
  {
    id: 5,
    fullName: "Neha Gupta",
    mobileNumber: "9876543214",
    email: "neha@example.com",
    address: "Andheri West",
    city: "Mumbai",
    district: "Mumbai",
    pincode: "400058",
    state: "Maharashtra",
    userId: "neha05",
    password: "pass7890",
  },
  {
    id: 6,
    fullName: "Vijay Patel",
    mobileNumber: "9876543215",
    email: "vijay@example.com",
    address: "Lajpat Nagar",
    city: "New Delhi",
    district: "New Delhi",
    pincode: "110024",
    state: "Delhi",
    userId: "vijay06",
    password: "pass2345",
  },
  {
    id: 7,
    fullName: "Anita Verma",
    mobileNumber: "9876543216",
    email: "anita@example.com",
    address: "Civil Lines",
    city: "Jaipur",
    district: "Jaipur",
    pincode: "302006",
    state: "Rajasthan",
    userId: "anita07",
    password: "pass6789",
  },
  {
    id: 8,
    fullName: "Rajesh Kumar",
    mobileNumber: "9876543217",
    email: "rajesh@example.com",
    address: "Gomti Nagar",
    city: "Lucknow",
    district: "Lucknow",
    pincode: "226010",
    state: "Uttar Pradesh",
    userId: "rajesh08",
    password: "pass0123",
  },
];

const PasswordCell = ({ value }) => {
  const [visible, setVisible] = useState(false);
  if (!value) return "—";
  return (
    <span className="inline-flex items-center gap-2 font-mono text-xs">
      {visible ? value : "•".repeat(Math.min(value.length, 10))}
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        className="text-slate-400 hover:text-slate-700 transition-colors"
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
  const [banner, setBanner] = useState(null);
  const [data, setData] = useState(MOCK_SUBADMINS);
  const loading = false;
  const error = "";

  // ═══════════════════════════════════════════════════════════
  //  API — COMMENTED
  // ═══════════════════════════════════════════════════════════
  // const loader = useCallback(async () => {
  //   const res = await api.get("/CreateProfile/all");
  //   return Array.isArray(res.data) ? res.data : [];
  // }, []);

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
    setTimeout(() => {
      setData((list) => list.filter((s) => s.id !== deleteTarget.id));
      setBanner({
        type: "success",
        text: `Deleted sub-admin profile for ${deleteTarget.fullName || deleteTarget.userId}.`,
      });
      setDeleting(false);
      setDeleteTarget(null);
    }, 500);
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
      { key: "userId", label: "User ID", className: "font-mono text-xs" },
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
                  className="text-slate-400 hover:text-red-500 transition-colors"
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
          Sub Admin Info
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          All sub-admin accounts on the platform.
        </p>
      </div>

      {banner && <Banner type={banner.type}>{banner.text}</Banner>}

      {loading ? (
        <LoadingCard />
      ) : error ? (
        <ErrorCard message={error} />
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
                placeholder="Search by name, user ID, city, state..."
                className="!pl-10"
                aria-label="Search sub-admins"
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
