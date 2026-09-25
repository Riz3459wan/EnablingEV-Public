import { useState, useEffect } from "react";
import api from "../../api/client";
import Modal from "../../components/ui/Modal";
import Field, { Select } from "../../components/ui/Field";
import { PrimaryButton } from "../../components/ui/Button";
import DashboardLayout from "../../components/dashboard/DashboardLayout";
import { Plus } from "lucide-react";
import { MOCK_DEALERS } from "../../data/mockData";

// ─── Toggle: set to false to use REAL API ────────────────────
const USE_MOCK = true;

const FIXED_PART_1 = "ME9EBCR";
const FIXED_PART_2 = "H268";

const OPTIONS = {
  bodyType: ["SS", "MS"],
  color: ["RED", "BLUE", "SKY BLUE", "SEA GREEN", "GRAY"],
  model: ["F1", "F2", "JIO FINE"],
  batteryVolt: ["48", "60"],
  batteryCompany: ["EASTMAN", "LEADER", "LIV GUARD"],
  batteryAH: ["130", "135", "140", "145", "150"],
  batteryWarranty: ["12", "15", "18", "24"],
  charger: ["UTL", "EASTMAN", "LIV GUARD"],
};

const initialSelections = {
  bodyType: "",
  color: "",
  model: "",
  batteryVolt: "",
  batteryCompany: "",
  batteryAH: "",
  batteryWarranty: "",
  charger: "",
};

const VehicleInfo = () => {
  const [open, setOpen] = useState(false);
  const [dealerCode, setDealerCode] = useState("");
  const [dealerOptions, setDealerOptions] = useState([]);
  const [chassisMid1, setChassisMid1] = useState("");
  const [chassisMid2, setChassisMid2] = useState("");
  const [selections, setSelections] = useState(initialSelections);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    // ══════════════════════════════════════════════════════════
    // MOCK DATA
    // ══════════════════════════════════════════════════════════
    if (USE_MOCK) {
      setDealerOptions(
        MOCK_DEALERS.map((d) => ({
          dealerName: d.name,
          dealerCode: d.dealerCode,
        })),
      );
      return;
    }

    // ══════════════════════════════════════════════════════════
    // REAL API
    // ══════════════════════════════════════════════════════════
    api
      .get("/dealer")
      .then((res) => {
        setDealerOptions(
          res.data.map((d) => ({
            dealerName: d.name,
            dealerCode: d.dealerCode,
          })),
        );
      })
      .catch(() => {});
  }, []);

  const chassisPartChange = (setter) => (e) => {
    setter(
      e.target.value
        .toUpperCase()
        .replace(/[^0-9A-Z]/g, "")
        .slice(0, 3),
    );
    setErrors((err) => ({ ...err, chassisMid1: "", chassisMid2: "" }));
  };

  const handleClose = () => {
    setOpen(false);
    setDealerCode("");
    setChassisMid1("");
    setChassisMid2("");
    setSelections(initialSelections);
    setErrors({});
  };

  const validate = () => {
    const e = {};
    if (!dealerCode) e.dealerCode = "Dealer code is required.";
    if (chassisMid1.length < 3)
      e.chassisMid1 = "First part must be 3 characters.";
    if (chassisMid2.length < 3)
      e.chassisMid2 = "Second part must be 3 characters.";
    Object.entries(selections).forEach(([key, value]) => {
      if (!value) e[key] = "This field is required.";
    });
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validate()) return;

    const chassisNumber = `${FIXED_PART_1}${chassisMid1}${FIXED_PART_2}${chassisMid2}`;
    setSubmitting(true);

    try {
      // ══════════════════════════════════════════════════════════
      // MOCK DATA
      // ══════════════════════════════════════════════════════════
      if (USE_MOCK) {
        await new Promise((r) => setTimeout(r, 600));
        setSubmitted(true);
        handleClose();
        return;
      }

      // ══════════════════════════════════════════════════════════
      // REAL API
      // ══════════════════════════════════════════════════════════
      const res = await api.post("/VehicleTable", {
        dealerNameDealerCode: dealerCode,
        chassisNumber,
        bodyType: selections.bodyType,
        color: selections.color,
        model: selections.model,
        batteryVolt: selections.batteryVolt,
        batteryCompany: selections.batteryCompany,
        batteryAH: selections.batteryAH,
        batteryWarranty: selections.batteryWarranty,
        charger: selections.charger,
      });
      if (res.status === 201) {
        setSubmitted(true);
        handleClose();
      }
    } catch {
      alert(
        "Please fill correct chassis number — make sure it isn't a duplicate.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <DashboardLayout dealerName="Sub Admin">
      <div className="w-full max-w-7xl mx-auto">
        <div className="mb-6">
          <span className="text-[10px] uppercase tracking-[0.28em] font-semibold text-primary mb-2 inline-block font-rr">
            Sub Admin
          </span>
          <h1 className="font-display uppercase text-white text-2xl sm:text-3xl leading-[1.05] tracking-[-0.01em]">
            Add Vehicle
          </h1>
          <p className="text-white/50 text-sm mt-2 max-w-2xl">
            Register a new vehicle chassis against a dealer.
          </p>
        </div>

        {submitted && (
          <div className="mb-6 px-4 py-3 rounded-lg text-sm border bg-primary/[0.08] border-primary/30 text-primary">
            Vehicle registered successfully.
          </div>
        )}

        <div className="bg-white/[0.02] border border-white/[0.08] rounded-xl p-6 sm:p-10 text-center max-w-md mx-auto">
          <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/25 flex items-center justify-center mx-auto mb-5">
            <Plus size={22} className="text-primary" strokeWidth={1.75} />
          </div>
          <h2 className="font-display uppercase text-white text-lg tracking-[-0.01em] mb-2">
            Register New Vehicle
          </h2>
          <p className="text-xs text-white/45 mb-6 max-w-xs mx-auto leading-relaxed">
            Fill in chassis, model, battery, and dealer details
          </p>
          <PrimaryButton
            onClick={() => setOpen(true)}
            className="!bg-primary !text-ink hover:!brightness-110 !rounded-full !px-7 !py-3 !text-[11px] !uppercase !tracking-[0.16em] !font-bold"
          >
            <Plus size={14} />
            Open Form
          </PrimaryButton>
        </div>

        <Modal open={open} onClose={handleClose} title="Vehicle Information">
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <Field label="Dealer Name | Code" error={errors.dealerCode}>
              <Select
                value={dealerCode}
                onChange={(e) => setDealerCode(e.target.value)}
                error={!!errors.dealerCode}
              >
                <option value="">Select</option>
                {dealerOptions.map((o) => (
                  <option
                    key={o.dealerCode}
                    value={`${o.dealerName} | ${o.dealerCode}`}
                  >
                    {o.dealerName} | {o.dealerCode}
                  </option>
                ))}
              </Select>
            </Field>

            <Field
              label="Chassis Number"
              error={errors.chassisMid1 || errors.chassisMid2}
            >
              <div className="flex items-center gap-2 justify-center text-sm text-white/60 font-mono bg-white/[0.03] border border-white/[0.08] rounded-lg p-3">
                <span>{FIXED_PART_1}</span>
                <input
                  maxLength={3}
                  value={chassisMid1}
                  onChange={chassisPartChange(setChassisMid1)}
                  className="w-14 bg-ink border border-white/[0.1] rounded-md text-center text-white outline-none focus:border-primary/60 py-2 font-bold uppercase text-sm"
                />
                <span>{FIXED_PART_2}</span>
                <input
                  maxLength={3}
                  value={chassisMid2}
                  onChange={chassisPartChange(setChassisMid2)}
                  className="w-14 bg-ink border border-white/[0.1] rounded-md text-center text-white outline-none focus:border-primary/60 py-2 font-bold uppercase text-sm"
                />
              </div>
            </Field>

            {Object.entries(OPTIONS).map(([key, values]) => (
              <Field
                key={key}
                label={key.replace(/([A-Z])/g, " $1")}
                error={errors[key]}
              >
                <Select
                  value={selections[key]}
                  onChange={(e) =>
                    setSelections((s) => ({ ...s, [key]: e.target.value }))
                  }
                  error={!!errors[key]}
                >
                  <option value="">Select</option>
                  {values.map((v) => (
                    <option key={v} value={v}>
                      {v}
                    </option>
                  ))}
                </Select>
              </Field>
            ))}

            <PrimaryButton
              type="submit"
              disabled={submitting}
              className="w-full justify-center !bg-primary !text-ink hover:!brightness-110 !rounded-full !py-3 !text-[11px] !uppercase !tracking-[0.16em] !font-bold"
            >
              {submitting ? "Submitting..." : "Submit"}
            </PrimaryButton>
          </form>
        </Modal>
      </div>
    </DashboardLayout>
  );
};

export default VehicleInfo;
