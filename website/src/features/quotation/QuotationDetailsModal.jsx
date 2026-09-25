import { useEffect, useState } from "react";
import api from "../../api/client";
import Modal from "../../components/ui/Modal";
import { Input } from "../../components/ui/Field";
import { PrimaryButton, SecondaryButton } from "../../components/ui/Button";
import StatusBadge from "./StatusBadge";
import { brandFor, CHASSIS_FIXED_MID, chassisPrefixFor, STATUS, vehicleTypeLabel } from "./constants";
import { buildChassis, formatDateTime, formatINR, sanitizeChassisPart } from "./calc";

const Row = ({ label, children, wide }) => (
  <div className={wide ? "sm:col-span-2" : ""}>
    <dt className="inline text-placeholder">{label}: </dt>
    <dd className="inline text-white">{children ?? "—"}</dd>
  </div>
);

const Section = ({ title, children }) => (
  <div className="mb-6">
    <h3 className="text-sm font-bold text-white mb-3">{title}</h3>
    <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1.5 text-sm">
      {children}
    </dl>
  </div>
);

// Sub-admin flow: a dealer submitted a quotation without a chassis number, the
// sub-admin assigns one here and moves it to "Under Billing".
const QuotationDetailsModal = ({
  quotation: q,
  canApprove,
  onClose,
  onApproved,
  onPrint,
  onPdf,
  busy,
}) => {
  const needsApproval = canApprove && !q.chassisNumber;
  const [mid1, setMid1] = useState("");
  const [mid2, setMid2] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [taken, setTaken] = useState(null);

  useEffect(() => {
    if (!needsApproval) return undefined;
    let cancelled = false;
    api
      .get("/VehicleTable")
      .then((res) => {
        if (cancelled || !Array.isArray(res.data)) return;
        setTaken(
          new Set(
            res.data.map((v) => v.chassisNumber?.toUpperCase()).filter(Boolean),
          ),
        );
      })
      .catch(() => {}); // duplicate check is best-effort; the server enforces it too
    return () => {
      cancelled = true;
    };
  }, [needsApproval]);

  const approve = async () => {
    const chassis = buildChassis(q.vehicleType, mid1, mid2);
    if (!chassis) {
      setError("Please enter both chassis parts with 3 characters.");
      return;
    }
    if (taken?.has(chassis)) {
      setError("This chassis number is already used. Duplicate not allowed.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      const res = await api.put(`/QuotationTable/${q.id}`, {
        chassisNumber: chassis,
        status: STATUS.BILLING,
      });
      const updated =
        res.data && typeof res.data === "object" ? res.data : {};
      onApproved({
        ...q,
        chassisNumber: chassis,
        status: STATUS.BILLING,
        ...updated,
      });
    } catch {
      setError("Failed to approve quotation. Chassis may already be allotted.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal open onClose={onClose} title="Quotation Details" maxWidth="max-w-3xl">
      <Section title="Dealer Information">
        <Row label="Name">{q.dealerName}</Row>
        <Row label="GSTIN">{q.dealerGstin}</Row>
        <Row label="Code">{q.dealerCode}</Row>
        <Row label="Status">
          <StatusBadge status={q.status} />
        </Row>
        <Row label="Address" wide>
          {q.dealerAddress}
        </Row>
        <Row label="State">{q.dealerState}</Row>
        <Row label="District">{q.dealerDistrict}</Row>
        <Row label="Pin Code">{q.dealerPinCode}</Row>
      </Section>

      <Section title="Vehicle Details">
        <Row label="Vehicle Type">{vehicleTypeLabel(q.vehicleType)}</Row>
        <Row label="Chassis Number">{q.chassisNumber || "Pending"}</Row>
        <Row label="Model">
          {brandFor(q.vehicleType)} {q.modelName}
        </Row>
        <Row label="Model Price">{formatINR(q.modelPrice)}</Row>
        {q.bodyTypeName && (
          <>
            <Row label="Body Type">{q.bodyTypeName}</Row>
            <Row label="Body Type Price">{formatINR(q.bodyTypePrice)}</Row>
          </>
        )}
        {q.colorName && <Row label="Color">{q.colorName}</Row>}
        {q.batteryType && (
          <>
            <Row label="Battery Type">{q.batteryType}</Row>
            <Row label="Battery Specs">
              {q.batteryVolt}V, {q.batteryAmpereHours}Ah
            </Row>
            <Row label="Battery Price">{formatINR(q.batteryPrice)}</Row>
          </>
        )}
        {q.billNumber && <Row label="Bill Number">{q.billNumber}</Row>}
      </Section>

      {needsApproval && (
        <div className="mb-6 p-4 rounded-2xl border border-line bg-background/40">
          <p className="text-sm font-semibold text-white mb-3">
            Assign chassis number &amp; approve
          </p>
          <div className="flex flex-wrap items-center gap-2 text-sm">
            <span className="font-mono text-muted-foreground">
              {chassisPrefixFor(q.vehicleType)}
            </span>
            <Input
              value={mid1}
              onChange={(e) => {
                setMid1(sanitizeChassisPart(e.target.value));
                setError("");
              }}
              placeholder="XXX"
              maxLength={3}
              aria-label="Chassis part 1"
              className="!w-20 text-center font-mono"
            />
            <span className="font-mono text-muted-foreground">{CHASSIS_FIXED_MID}</span>
            <Input
              value={mid2}
              onChange={(e) => {
                setMid2(sanitizeChassisPart(e.target.value));
                setError("");
              }}
              placeholder="XXX"
              maxLength={3}
              aria-label="Chassis part 2"
              className="!w-20 text-center font-mono"
            />
            <PrimaryButton onClick={approve} disabled={saving} className="text-sm">
              {saving ? "Saving..." : "Approve"}
            </PrimaryButton>
          </div>
          {error && <p className="text-red-400 text-xs mt-2">{error}</p>}
        </div>
      )}

      <div className="flex flex-wrap items-end justify-between gap-4 pt-4 border-t border-line">
        <div className="text-xs text-muted-foreground space-y-0.5">
          <p>Created: {formatDateTime(q.createdAt)}</p>
          <p>Updated: {formatDateTime(q.updatedAt)}</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-muted-foreground">Total Amount</p>
          <p className="text-2xl font-extrabold text-white">
            {formatINR(q.totalAmount)}
          </p>
        </div>
      </div>

      <div className="flex justify-end gap-2 mt-5">
        <SecondaryButton
          onClick={() => onPrint(q)}
          disabled={!!busy}
          className="text-sm"
        >
          Print
        </SecondaryButton>
        <SecondaryButton
          onClick={() => onPdf(q)}
          disabled={!!busy}
          className="text-sm"
        >
          {busy === `pdf:${q.id}` ? "Preparing..." : "Download PDF"}
        </SecondaryButton>
      </div>
    </Modal>
  );
};

export default QuotationDetailsModal;
