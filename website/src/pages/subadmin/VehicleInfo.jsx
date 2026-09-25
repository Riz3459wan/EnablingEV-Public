import { useState, useEffect } from "react";
import api from "../../api/client";
import Modal from "../../components/ui/Modal";
import Field, { Select } from "../../components/ui/Field";
import { PrimaryButton } from "../../components/ui/Button";

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
    api
      .get("/dealer")
      .then((res) => {
        setDealerOptions(
          res.data.map((d) => ({ dealerName: d.name, dealerCode: d.dealerCode })),
        );
      })
      .catch(() => {});
  }, []);

  const chassisPartChange = (setter) => (e) => {
    setter(e.target.value.toUpperCase().replace(/[^0-9A-Z]/g, "").slice(0, 3));
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
    if (chassisMid1.length < 3) e.chassisMid1 = "First part must be 3 characters.";
    if (chassisMid2.length < 3) e.chassisMid2 = "Second part must be 3 characters.";
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
      alert("Please fill correct chassis number — make sure it isn't a duplicate.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="pt-32 pb-24 px-4 text-center max-w-md mx-auto">
      <h1 className="text-3xl font-bold text-white mb-2">Vehicle Information</h1>
      <p className="text-muted-foreground mb-8">Register a new vehicle chassis against a dealer.</p>
      {submitted && (
        <p className="text-accent text-sm mb-4">Vehicle registered successfully.</p>
      )}
      <PrimaryButton onClick={() => setOpen(true)}>Click here</PrimaryButton>

      <Modal open={open} onClose={handleClose} title="Vehicle Information">
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <Field label="Dealer Name | Code" error={errors.dealerCode}>
            <Select value={dealerCode} onChange={(e) => setDealerCode(e.target.value)} error={!!errors.dealerCode}>
              <option value="">Select</option>
              {dealerOptions.map((o) => (
                <option key={o.dealerCode} value={`${o.dealerName} | ${o.dealerCode}`}>
                  {o.dealerName} | {o.dealerCode}
                </option>
              ))}
            </Select>
          </Field>

          <Field label="Chassis Number" error={errors.chassisMid1 || errors.chassisMid2}>
            <div className="flex items-center gap-2 justify-center text-sm text-muted-foreground">
              <span>{FIXED_PART_1}</span>
              <input
                maxLength={3}
                value={chassisMid1}
                onChange={chassisPartChange(setChassisMid1)}
                className="w-14 bg-transparent border-b border-line text-center text-white outline-none focus:border-accent"
              />
              <span>{FIXED_PART_2}</span>
              <input
                maxLength={3}
                value={chassisMid2}
                onChange={chassisPartChange(setChassisMid2)}
                className="w-14 bg-transparent border-b border-line text-center text-white outline-none focus:border-accent"
              />
            </div>
          </Field>

          {Object.entries(OPTIONS).map(([key, values]) => (
            <Field key={key} label={key.replace(/([A-Z])/g, " $1")} error={errors[key]}>
              <Select
                value={selections[key]}
                onChange={(e) => setSelections((s) => ({ ...s, [key]: e.target.value }))}
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

          <PrimaryButton type="submit" disabled={submitting} className="w-full justify-center">
            {submitting ? "Submitting..." : "Submit"}
          </PrimaryButton>
        </form>
      </Modal>
    </section>
  );
};

export default VehicleInfo;
