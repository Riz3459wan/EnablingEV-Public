import { useState, useEffect } from "react";
import jsPDF from "jspdf";
import { Car, Truck, FileCheck2 } from "lucide-react";
import letterheadImage from "../../assets/documents/Form_22.jpg";
import { fetchKnownChassis } from "../../utils/chassisLookup";
import { splitChassis } from "../../features/quotation/calc";
import Modal from "../ui/Modal";
import { Select } from "../ui/Field";
import { PrimaryButton } from "../ui/Button";

// Dealer-dashboard variant of Form22.jsx (migrated from the old app's
// components/form_22/DealerForm22.jsx). Same certificate output as
// Form22.jsx, scoped to this dealer's own chassis numbers.
//
// Two changes from the first migrated version, both per the agreed
// "single source of truth" redesign:
//  1. Source widened from "QuotationTable, status=Dispatched only" to the
//     merged VehicleTable + QuotationTable lookup (utils/chassisLookup.js),
//     still scoped to this dealer — so a dealer can generate Form 22 for
//     any chassis registered/assigned to them, not only fully-dispatched
//     ones.
//  2. Fixed the engine-number derivation: it was slicing the wrong part of
//     the chassis string (chars 2-5, mostly the fixed prefix) instead of
//     the actual editable mid1/mid2 segments — same bug already caught and
//     fixed in features/quotation/calc.js's splitChassis, now reused here
//     instead of the ad-hoc slice.
const DealerForm22 = ({ dealerCode }) => {
  const [typeSelectorOpen, setTypeSelectorOpen] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [formType, setFormType] = useState(null); // 'rikshaw' | 'cargo'
  const [selectedChassis, setSelectedChassis] = useState("");
  // One result object per dealerCode; loading/error/lists are derived from it,
  // so the effect only sets state once the requests have finished.
  const [result, setResult] = useState({
    key: null,
    rikshaw: [],
    cargo: [],
    error: "",
  });

  useEffect(() => {
    if (!dealerCode) return undefined;
    let cancelled = false;
    Promise.all([
      fetchKnownChassis({ vehicleType: "rikshaw", dealerCode }),
      fetchKnownChassis({ vehicleType: "cargo", dealerCode }),
    ])
      .then(([rikshaw, cargo]) => {
        if (!cancelled) {
          setResult({ key: dealerCode, rikshaw, cargo, error: "" });
        }
      })
      .catch(() => {
        if (!cancelled) {
          setResult({
            key: dealerCode,
            rikshaw: [],
            cargo: [],
            error: "Unable to load chassis numbers. Please try again.",
          });
        }
      });
    return () => {
      cancelled = true;
    };
  }, [dealerCode]);

  const loading = !!dealerCode && result.key !== dealerCode;
  const error = dealerCode ? result.error : "Dealer code is not available.";
  const rikshawChassis = result.key === dealerCode ? result.rikshaw : [];
  const cargoChassis = result.key === dealerCode ? result.cargo : [];

  const filteredChassis = formType === "cargo" ? cargoChassis : rikshawChassis;

  const brandName = formType === "rikshaw" ? "JHATPAT JIO" : "HALCHAL";
  const vehiclePrefix = formType === "rikshaw" ? "ME" : "MC";
  const isValidSelection = !!selectedChassis;

  const handleTypeSelect = (type) => {
    setFormType(type);
    setSelectedChassis("");
    setTypeSelectorOpen(false);
    setFormOpen(true);
  };

  const handleDownload = () => {
    if (!formType || !selectedChassis) return;

    const { mid1, mid2 } = splitChassis(selectedChassis);
    const paragraphContent = `
Certified  that ${brandName} ( Brand  name  of vehicle )  bearing  chassis no.
${selectedChassis}  and  engine number or  motor  number  in  case of  battery
operated vehicles ${vehiclePrefix}${mid1}${mid2} complies with the provision of motor vehicle acts 1998
and rules made there under.






ENABLING E-VEHICLE PRIVATE LTD



Authorized Signatory

Form-22  shall be issued  with the signature  of the manufacturer  /ENABLING  
E-VEHICLE PRIVATE LTD duly printed in the form itself by affixing facsimile signature in ink under the hand and seal of manufacturer/ ENABLING E-VEHICLE PRIVATE LTD.
`;

    const pdf = new jsPDF("p", "mm", "a4");
    const img = new Image();
    img.src = letterheadImage;
    img.onload = () => {
      const pdfWidth = pdf.internal.pageSize.getWidth();
      pdf.addImage(
        img,
        "JPEG",
        0,
        0,
        pdfWidth,
        pdf.internal.pageSize.getHeight(),
      );
      pdf.setFontSize(13.5);
      pdf.text("FORM 22", pdfWidth / 2, 70, { align: "center" });
      pdf.text(
        "[See rules 47(g), 115(2), 115(6), 115(1), 124, 126(A) and 127]",
        pdfWidth / 2,
        80,
        { align: "center" },
      );
      pdf.text(
        "INITIAL CERTIFICATE OF COMPLIANCE WIITH POLLUTION, STANDARDS,",
        pdfWidth / 2,
        90,
        { align: "center" },
      );
      pdf.text(
        "SAFETY STANDARDS OF COMPONENT AND ROAD WORTHINESS",
        pdfWidth / 2,
        100,
        { align: "center" },
      );

      const lines = pdf.splitTextToSize(paragraphContent, pdfWidth - 20);
      pdf.text(lines, 13, 130);
      pdf.save(
        formType === "rikshaw" ? "form_22_rikshaw.pdf" : "form_22_cargo.pdf",
      );

      setFormOpen(false);
      setSelectedChassis("");
    };
  };

  return (
    <div className="text-center">
      <div className="mx-auto mb-4 w-12 h-12 rounded-full bg-accent/10 border border-accent/30 flex items-center justify-center">
        <FileCheck2 className="text-accent" size={22} />
      </div>
      <h2 className="text-lg font-bold text-white mb-1">Dealer Form 22</h2>
      <p className="text-muted-foreground text-sm mb-5">
        Chassis numbers registered or assigned to your dealership.
      </p>
      <PrimaryButton
        onClick={() => setTypeSelectorOpen(true)}
        className="mx-auto"
      >
        Select Type &amp; Download
      </PrimaryButton>

      {/* Step 1: choose Rikshaw or Cargo */}
      <Modal
        open={typeSelectorOpen}
        onClose={() => setTypeSelectorOpen(false)}
        title="Select Form Type"
      >
        <div className="grid sm:grid-cols-2 gap-4">
          <button
            onClick={() => handleTypeSelect("rikshaw")}
            className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-accent/50 hover:bg-white/[0.05] transition-all text-center"
          >
            <Car className="mx-auto mb-2 text-accent" size={30} />
            <p className="font-semibold text-white text-sm">Rikshaw</p>
            <p className="text-xs text-muted-foreground mt-1">
              {rikshawChassis.length} valid chassis
            </p>
          </button>
          <button
            onClick={() => handleTypeSelect("cargo")}
            className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-accent/50 hover:bg-white/[0.05] transition-all text-center"
          >
            <Truck className="mx-auto mb-2 text-accent" size={30} />
            <p className="font-semibold text-white text-sm">Cargo / Loader</p>
            <p className="text-xs text-muted-foreground mt-1">
              {cargoChassis.length} valid chassis
            </p>
          </button>
        </div>
      </Modal>

      {/* Step 2: pick a chassis */}
      <Modal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        title={`Form 22 - ${formType === "rikshaw" ? "Rikshaw" : "Cargo / Loader"}`}
      >
        {loading ? (
          <div className="flex justify-center py-6">
            <div className="w-6 h-6 border-2 border-line border-t-accent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="space-y-4 text-left">
            <div>
              <label className="block text-sm font-medium mb-1.5 text-gray-200">
                Chassis Number
              </label>
              <Select
                value={selectedChassis}
                onChange={(e) => setSelectedChassis(e.target.value)}
              >
                <option value="" disabled>
                  {filteredChassis.length > 0
                    ? "Select a chassis number"
                    : "No chassis available"}
                </option>
                {filteredChassis.map((chassis) => (
                  <option key={chassis} value={chassis}>
                    {chassis}
                  </option>
                ))}
              </Select>
            </div>

            {error && <p className="text-red-400 text-xs">{error}</p>}

            <PrimaryButton
              onClick={handleDownload}
              disabled={!isValidSelection}
              className="w-full justify-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Download Form 22
            </PrimaryButton>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default DealerForm22;
