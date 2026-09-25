import { useCallback, useMemo, useState } from "react";
import { Plus, Search } from "lucide-react";
import api from "../../api/client";
import useAsyncData from "../../hooks/useAsyncData";
import { Input, Select } from "../../components/ui/Field";
import { PrimaryButton } from "../../components/ui/Button";
import DataTable from "../../components/ui/DataTable";
import {
  Banner,
  ErrorCard,
  LoadingCard,
} from "../../components/ui/AsyncStates";
import StatusBadge from "./StatusBadge";
import QuotationDetailsModal from "./QuotationDetailsModal";
import { useInvoiceActions } from "./useInvoiceActions";
import { STATUS, brandFor } from "./constants";
import { formatDate, formatINR } from "./calc";
import { MOCK_QUOTATIONS } from "../../data/mockData";

// ─── Toggle: set to false to use REAL API ────────────────────
const USE_MOCK = true;

const PAGE_SIZE = 25;
const MIN_DEALER_CODE_LENGTH = 7;
const LOAD_ERROR = "Couldn't load quotations. Please try again.";

const actionBtn =
  "text-xs font-semibold px-3 py-1.5 rounded-full border border-white/10 text-white/60 hover:text-white hover:border-primary/50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:text-white/60 disabled:hover:border-white/10";

const newestFirst = (a, b) =>
  (new Date(b.createdAt).getTime() || 0) -
  (new Date(a.createdAt).getTime() || 0);

const QuotationList = ({ role, dealerCode, onCreate, onEdit }) => {
  const isDealer = role === "dealer";
  const isSubAdmin = role === "subadmin";
  const canEdit = isSubAdmin || role === "admin";
  const canLoad = USE_MOCK
    ? true
    : !isDealer || dealerCode.length >= MIN_DEALER_CODE_LENGTH;

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [limit, setLimit] = useState(PAGE_SIZE);
  const [detailsId, setDetailsId] = useState(null);
  const { busy, error: docError, run } = useInvoiceActions();

  const loader = useCallback(async () => {
    // ══════════════════════════════════════════════════════════
    // MOCK DATA
    // ══════════════════════════════════════════════════════════
    if (USE_MOCK) {
      await new Promise((r) => setTimeout(r, 400));
      const list = isDealer
        ? MOCK_QUOTATIONS.filter((q) => q.dealerCode === dealerCode)
        : MOCK_QUOTATIONS;
      return [...list].sort(newestFirst);
    }

    // ══════════════════════════════════════════════════════════
    // REAL API
    // ══════════════════════════════════════════════════════════
    if (!canLoad) return [];
    const res = await api.get("/QuotationTable", {
      params: isDealer ? { dealerCode } : undefined,
    });
    return (Array.isArray(res.data) ? res.data : []).sort(newestFirst);
  }, [canLoad, isDealer, dealerCode]);

  const { data, error, loading, reload, setData } = useAsyncData(
    ["quotations", isDealer ? dealerCode : "all"],
    loader,
    LOAD_ERROR,
  );

  const statuses = useMemo(
    () => [...new Set((data ?? []).map((q) => q.status || "Pending"))].sort(),
    [data],
  );

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return (data ?? []).filter((q) => {
      if (statusFilter !== "all" && (q.status || "Pending") !== statusFilter) {
        return false;
      }
      if (!term) return true;
      return [
        q.dealerName,
        q.dealerCode,
        q.chassisNumber,
        q.modelName,
        q.bodyTypeName,
        q.colorName,
        q.status,
        q.billNumber,
        q.totalAmount,
      ].some((f) => f?.toString().toLowerCase().includes(term));
    });
  }, [data, search, statusFilter]);

  const visible = filtered.slice(0, limit);
  const details =
    detailsId != null ? data?.find((q) => q.id === detailsId) : null;

  const columns = useMemo(
    () => [
      ...(isDealer
        ? []
        : [
            {
              key: "dealerName",
              label: "Dealer",
              render: (q) => (
                <span>
                  {q.dealerName || "—"}
                  <span className="block text-xs text-white/40 font-mono">
                    {q.dealerCode}
                  </span>
                </span>
              ),
            },
          ]),
      {
        key: "model",
        label: "Model",
        render: (q) => `${brandFor(q.vehicleType)} ${q.modelName ?? ""}`,
      },
      {
        key: "totalAmount",
        label: "Total",
        render: (q) => formatINR(q.totalAmount),
      },
      {
        key: "createdAt",
        label: "Created",
        render: (q) => formatDate(q.createdAt),
      },
      {
        key: "chassisNumber",
        label: "Chassis Number",
        className: "font-mono",
        render: (q) =>
          q.chassisNumber || <span className="text-white/30">Pending</span>,
      },
      {
        key: "status",
        label: "Status",
        render: (q) => <StatusBadge status={q.status} />,
      },
      {
        key: "actions",
        label: "Actions",
        render: (q) => (
          <div className="flex flex-wrap gap-1.5">
            <button className={actionBtn} onClick={() => setDetailsId(q.id)}>
              Details
            </button>
            {canEdit && (
              <button
                className={actionBtn}
                onClick={() => onEdit(q)}
                disabled={
                  isSubAdmin &&
                  (q.status || "").toLowerCase() ===
                    STATUS.DISPATCHED.toLowerCase()
                }
              >
                Edit
              </button>
            )}
            <button
              className={actionBtn}
              onClick={() => run("print", q)}
              disabled={!!busy}
            >
              Print
            </button>
            <button
              className={actionBtn}
              onClick={() => run("pdf", q)}
              disabled={!!busy}
            >
              {busy === `pdf:${q.id}` ? "Preparing..." : "PDF"}
            </button>
          </div>
        ),
      },
    ],
    [isDealer, isSubAdmin, canEdit, onEdit, run, busy],
  );

  if (!canLoad && !USE_MOCK) {
    return (
      <ErrorCard message="Dealer code not found for this session. Please log out and sign in again." />
    );
  }

  return (
    <>
      {docError && <Banner type="error">{docError}</Banner>}

      {loading ? (
        <LoadingCard />
      ) : error ? (
        <ErrorCard message={error} onRetry={reload} />
      ) : (
        <>
          <div className="flex flex-col lg:flex-row lg:items-center gap-3 mb-4">
            <div className="relative w-full lg:max-w-sm">
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
                placeholder="Search by dealer, chassis, model, amount..."
                className="!pl-10"
                aria-label="Search quotations"
              />
            </div>
            <Select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setLimit(PAGE_SIZE);
              }}
              className="lg:max-w-[12rem]"
              aria-label="Filter by status"
            >
              <option value="all">All statuses</option>
              {statuses.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </Select>
            <p className="text-xs text-white/40 lg:ml-auto lg:mr-3 font-rr tracking-[0.02em]">
              Showing {visible.length} of {filtered.length}
            </p>
            <PrimaryButton
              onClick={onCreate}
              className="text-sm justify-center !bg-primary !text-ink hover:!brightness-110 !rounded-full !text-[11px] !uppercase !tracking-[0.16em] !font-bold"
            >
              <Plus size={15} /> New Quotation
            </PrimaryButton>
          </div>

          <DataTable
            columns={columns}
            rows={visible}
            rowKey={(q) => q.id ?? q.chassisNumber}
            emptyText={
              data.length === 0
                ? "No quotations yet. Create your first one."
                : "No quotations match your filters."
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

      {details && (
        <QuotationDetailsModal
          key={details.id}
          quotation={details}
          canApprove={isSubAdmin}
          busy={busy}
          onClose={() => setDetailsId(null)}
          onApproved={(updated) =>
            setData((list) =>
              list.map((q) => (q.id === updated.id ? updated : q)),
            )
          }
          onPrint={(q) => run("print", q)}
          onPdf={(q) => run("pdf", q)}
        />
      )}
    </>
  );
};

export default QuotationList;
