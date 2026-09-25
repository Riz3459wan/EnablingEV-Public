import { useCallback, useMemo, useState } from "react";
import { Link } from "react-router";
import { ArrowLeft, Search, Trash2 } from "lucide-react";
// import api from "../../api/client"; // ← API commented
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
const LOAD_ERROR = "Couldn't load customers. Please try again.";

// ═══════════════════════════════════════════════════════════
//  MOCK DATA
// ═══════════════════════════════════════════════════════════
const MOCK_CUSTOMERS = [
  {
    id: 1,
    chassisNumber: "ME9EBCR123H268XYZ",
    dealerCode: "DL01EV001",
    name: "Rohit Kumar",
    mobileNumber: "9876543210",
    emailId: "rohit@example.com",
    address: "123 Karol Bagh",
    pincode: "110005",
    state: "Delhi",
    dist: "New Delhi",
  },
  {
    id: 2,
    chassisNumber: "ME9EBCC456H268ABC",
    dealerCode: "RJ02EV002",
    name: "Pooja Sharma",
    mobileNumber: "9876543211",
    emailId: "pooja@example.com",
    address: "45 MG Road",
    pincode: "302001",
    state: "Rajasthan",
    dist: "Jaipur",
  },
  {
    id: 3,
    chassisNumber: "ME9EBCC789H268DEF",
    dealerCode: "UP03EV003",
    name: "Amit Singh",
    mobileNumber: "9876543212",
    emailId: "amit@example.com",
    address: "78 Hazratganj",
    pincode: "226001",
    state: "Uttar Pradesh",
    dist: "Lucknow",
  },
  {
    id: 4,
    chassisNumber: "ME9EBCR012H268GHI",
    dealerCode: "HR04EV004",
    name: "Suresh Yadav",
    mobileNumber: "9876543213",
    emailId: "suresh@example.com",
    address: "Sector 14",
    pincode: "122001",
    state: "Haryana",
    dist: "Gurgaon",
  },
  {
    id: 5,
    chassisNumber: "ME9EBCR345H268JKL",
    dealerCode: "MH05EV005",
    name: "Neha Gupta",
    mobileNumber: "9876543214",
    emailId: "neha@example.com",
    address: "Andheri West",
    pincode: "400058",
    state: "Maharashtra",
    dist: "Mumbai",
  },
  {
    id: 6,
    chassisNumber: "ME9EBCC678H268MNO",
    dealerCode: "DL01EV001",
    name: "Vijay Patel",
    mobileNumber: "9876543215",
    emailId: "vijay@example.com",
    address: "Lajpat Nagar",
    pincode: "110024",
    state: "Delhi",
    dist: "New Delhi",
  },
  {
    id: 7,
    chassisNumber: "ME9EBCR901H268PQR",
    dealerCode: "RJ02EV002",
    name: "Anita Verma",
    mobileNumber: "9876543216",
    emailId: "anita@example.com",
    address: "Civil Lines",
    pincode: "302006",
    state: "Rajasthan",
    dist: "Jaipur",
  },
  {
    id: 8,
    chassisNumber: "ME9EBCC234H268STU",
    dealerCode: "UP03EV003",
    name: "Rajesh Kumar",
    mobileNumber: "9876543217",
    emailId: "rajesh@example.com",
    address: "Gomti Nagar",
    pincode: "226010",
    state: "Uttar Pradesh",
    dist: "Lucknow",
  },
  {
    id: 9,
    chassisNumber: "ME9EBCR567H268VWX",
    dealerCode: "HR04EV004",
    name: "Meena Joshi",
    mobileNumber: "9876543218",
    emailId: "meena@example.com",
    address: "DLF Phase 2",
    pincode: "122002",
    state: "Haryana",
    dist: "Gurgaon",
  },
  {
    id: 10,
    chassisNumber: "ME9EBCC890H268YZA",
    dealerCode: "MH05EV005",
    name: "Karan Mehta",
    mobileNumber: "9876543219",
    emailId: "karan@example.com",
    address: "Bandra East",
    pincode: "400051",
    state: "Maharashtra",
    dist: "Mumbai",
  },
  {
    id: 11,
    chassisNumber: "ME9EBCR111H268BCD",
    dealerCode: "DL01EV001",
    name: "Sunita Devi",
    mobileNumber: "9876543220",
    emailId: "sunita@example.com",
    address: "Rohini Sector 5",
    pincode: "110085",
    state: "Delhi",
    dist: "New Delhi",
  },
  {
    id: 12,
    chassisNumber: "ME9EBCC222H268EFG",
    dealerCode: "RJ02EV002",
    name: "Manish Agarwal",
    mobileNumber: "9876543221",
    emailId: "manish@example.com",
    address: "Vaishali Nagar",
    pincode: "302021",
    state: "Rajasthan",
    dist: "Jaipur",
  },
  {
    id: 13,
    chassisNumber: "ME9EBCR333H268HIJ",
    dealerCode: "UP03EV003",
    name: "Priya Sharma",
    mobileNumber: "9876543222",
    emailId: "priya@example.com",
    address: "Aliganj",
    pincode: "226024",
    state: "Uttar Pradesh",
    dist: "Lucknow",
  },
  {
    id: 14,
    chassisNumber: "ME9EBCC444H268KLM",
    dealerCode: "HR04EV004",
    name: "Anil Chauhan",
    mobileNumber: "9876543223",
    emailId: "anil@example.com",
    address: "Sohna Road",
    pincode: "122018",
    state: "Haryana",
    dist: "Gurgaon",
  },
  {
    id: 15,
    chassisNumber: "ME9EBCR555H268NOP",
    dealerCode: "MH05EV005",
    name: "Ritu Singh",
    mobileNumber: "9876543224",
    emailId: "ritu@example.com",
    address: "Powai",
    pincode: "400076",
    state: "Maharashtra",
    dist: "Mumbai",
  },
];

const CustomerInfo = () => {
  const { role } = useAuth();
  const isAdmin = role === "admin";

  const [search, setSearch] = useState("");
  const [limit, setLimit] = useState(PAGE_SIZE);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [banner, setBanner] = useState(null);
  const [data, setData] = useState(MOCK_CUSTOMERS);
  const loading = false;
  const error = "";

  // ═══════════════════════════════════════════════════════════
  //  API — COMMENTED FOR MOCK
  // ═══════════════════════════════════════════════════════════
  // const loader = useCallback(async () => {
  //   const res = isAdmin
  //     ? await api.get("/CustomerTable/admin")
  //     : await api.get("/CustomerTable", { params: { dealerCode } });
  //   return Array.isArray(res.data) ? res.data : [];
  // }, [isAdmin, dealerCode]);
  //
  // const { data, error, loading, reload, setData } = useAsyncData(
  //   ["customers", isAdmin ? "all" : dealerCode],
  //   loader,
  //   LOAD_ERROR,
  // );

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
    // Mock delete
    setTimeout(() => {
      setData((list) => list.filter((c) => c.id !== deleteTarget.id));
      setBanner({
        type: "success",
        text: `Deleted customer record for chassis ${deleteTarget.chassisNumber}.`,
      });
      setDeleting(false);
      setDeleteTarget(null);
    }, 500);
    // API — COMMENTED
    // try {
    //   await api.delete(`/CustomerTable/${encodeURIComponent(deleteTarget.id)}`);
    //   setData((list) => list.filter((c) => c.id !== deleteTarget.id));
    // } catch { ... }
  };

  const columns = useMemo(
    () => [
      {
        key: "chassisNumber",
        label: "Chassis Number",
        className: "font-mono text-xs",
      },
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
                  className="text-slate-400 hover:text-red-500 transition-colors"
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
          {title}
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          {isAdmin
            ? "Every customer registered against a vehicle, across all dealers."
            : "Customers registered against vehicles from your dealership."}
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
                placeholder="Search by chassis, name, mobile, state..."
                className="!pl-10"
                aria-label="Search customers"
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
                className="text-sm text-blue-600 hover:underline font-medium"
              >
                Show {Math.min(PAGE_SIZE, filtered.length - visible.length)}{" "}
                more
              </button>
            </div>
          )}
        </>
      )}

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
