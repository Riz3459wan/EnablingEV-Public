import { useMemo, useState } from "react";
import { Link } from "react-router";
import { ArrowLeft, Search, Trash2 } from "lucide-react";
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
const MOCK_DEALERS = [
  {
    id: 1,
    dealerCode: "DL01EV001",
    name: "Shree Ram Motors",
    mobileNo: "9876543210",
    emailId: "shreeram@example.com",
    gstin: "07AAAAA1234A1Z5",
    address: "Karol Bagh, Main Market",
    state: "Delhi",
    dist: "New Delhi",
    pinCode: "110005",
    rtoOffice: "New Delhi RTO",
    activationCode: "ACT-DL01-1234",
    LOIreferenceId: "LOI-2024-001",
    RQreferenceId: "RQ-2024-001",
  },
  {
    id: 2,
    dealerCode: "RJ02EV002",
    name: "Rahul Auto Sales",
    mobileNo: "9876543211",
    emailId: "rahul@example.com",
    gstin: "08BBBBB5678B1Z6",
    address: "MI Road",
    state: "Rajasthan",
    dist: "Jaipur",
    pinCode: "302001",
    rtoOffice: "Jaipur RTO",
    activationCode: "ACT-RJ02-5678",
    LOIreferenceId: "LOI-2024-002",
    RQreferenceId: "RQ-2024-002",
  },
  {
    id: 3,
    dealerCode: "UP03EV003",
    name: "Green Energy Motors",
    mobileNo: "9876543212",
    emailId: "green@example.com",
    gstin: "09CCCCC9012C1Z7",
    address: "Hazratganj",
    state: "Uttar Pradesh",
    dist: "Lucknow",
    pinCode: "226001",
    rtoOffice: "Lucknow RTO",
    activationCode: "ACT-UP03-9012",
    LOIreferenceId: "LOI-2024-003",
    RQreferenceId: "RQ-2024-003",
  },
  {
    id: 4,
    dealerCode: "HR04EV004",
    name: "Metro EV Dealers",
    mobileNo: "9876543213",
    emailId: "metro@example.com",
    gstin: "06DDDDD3456D1Z8",
    address: "Sector 14",
    state: "Haryana",
    dist: "Gurgaon",
    pinCode: "122001",
    rtoOffice: "Gurgaon RTO",
    activationCode: "ACT-HR04-3456",
    LOIreferenceId: "LOI-2024-004",
    RQreferenceId: "RQ-2024-004",
  },
  {
    id: 5,
    dealerCode: "MH05EV005",
    name: "Vijay Sales Corporation",
    mobileNo: "9876543214",
    emailId: "vijay@example.com",
    gstin: "27EEEEE7890E1Z9",
    address: "Andheri West",
    state: "Maharashtra",
    dist: "Mumbai",
    pinCode: "400058",
    rtoOffice: "Mumbai RTO",
    activationCode: "ACT-MH05-7890",
    LOIreferenceId: "LOI-2024-005",
    RQreferenceId: "RQ-2024-005",
  },
  {
    id: 6,
    dealerCode: "DL01EV006",
    name: "Capital EV Motors",
    mobileNo: "9876543215",
    emailId: "capital@example.com",
    gstin: "07FFFFF2345F1Z1",
    address: "Lajpat Nagar",
    state: "Delhi",
    dist: "New Delhi",
    pinCode: "110024",
    rtoOffice: "New Delhi RTO",
    activationCode: "ACT-DL01-2345",
    LOIreferenceId: "LOI-2024-006",
    RQreferenceId: "RQ-2024-006",
  },
  {
    id: 7,
    dealerCode: "RJ02EV007",
    name: "Sunrise Motors",
    mobileNo: "9876543216",
    emailId: "sunrise@example.com",
    gstin: "08GGGGG6789G1Z2",
    address: "Civil Lines",
    state: "Rajasthan",
    dist: "Jaipur",
    pinCode: "302006",
    rtoOffice: "Jaipur RTO",
    activationCode: "ACT-RJ02-6789",
    LOIreferenceId: "LOI-2024-007",
    RQreferenceId: "RQ-2024-007",
  },
  {
    id: 8,
    dealerCode: "UP03EV008",
    name: "City Auto Hub",
    mobileNo: "9876543217",
    emailId: "city@example.com",
    gstin: "09HHHHH0123H1Z3",
    address: "Gomti Nagar",
    state: "Uttar Pradesh",
    dist: "Lucknow",
    pinCode: "226010",
    rtoOffice: "Lucknow RTO",
    activationCode: "ACT-UP03-0123",
    LOIreferenceId: "LOI-2024-008",
    RQreferenceId: "RQ-2024-008",
  },
  {
    id: 9,
    dealerCode: "HR04EV009",
    name: "Krishna EV Point",
    mobileNo: "9876543218",
    emailId: "krishna@example.com",
    gstin: "06IIIII4567I1Z4",
    address: "DLF Phase 2",
    state: "Haryana",
    dist: "Gurgaon",
    pinCode: "122002",
    rtoOffice: "Gurgaon RTO",
    activationCode: "ACT-HR04-4567",
    LOIreferenceId: "LOI-2024-009",
    RQreferenceId: "RQ-2024-009",
  },
  {
    id: 10,
    dealerCode: "MH05EV010",
    name: "Prime Auto Sales",
    mobileNo: "9876543219",
    emailId: "prime@example.com",
    gstin: "27JJJJJ8901J1Z5",
    address: "Bandra East",
    state: "Maharashtra",
    dist: "Mumbai",
    pinCode: "400051",
    rtoOffice: "Mumbai RTO",
    activationCode: "ACT-MH05-8901",
    LOIreferenceId: "LOI-2024-010",
    RQreferenceId: "RQ-2024-010",
  },
];

const DealerInfo = () => {
  const { role } = useAuth();
  const isAdmin = role === "admin";

  const [search, setSearch] = useState("");
  const [limit, setLimit] = useState(PAGE_SIZE);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [banner, setBanner] = useState(null);
  const [data, setData] = useState(MOCK_DEALERS);
  const loading = false;
  const error = "";

  // ═══════════════════════════════════════════════════════════
  //  API — COMMENTED FOR MOCK
  // ═══════════════════════════════════════════════════════════
  // const loader = useCallback(async () => {
  //   const res = await api.get("/dealer/full");
  //   return Array.isArray(res.data) ? res.data : [];
  // }, []);
  //
  // const { data, error, loading, reload, setData } = useAsyncData(
  //   ["dealers"], loader, LOAD_ERROR,
  // );

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
    setTimeout(() => {
      setData((list) => list.filter((d) => d.id !== deleteTarget.id));
      setBanner({
        type: "success",
        text: `Deleted dealer record for ${deleteTarget.name || deleteTarget.dealerCode}.`,
      });
      setDeleting(false);
      setDeleteTarget(null);
    }, 500);
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
