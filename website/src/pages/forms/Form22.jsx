import { useCallback, useState } from "react";
import jsPDF from "jspdf";
import {
  Car,
  Truck,
  FileCheck2,
  Loader2,
  Download,
  CheckCircle2,
  Plus,
} from "lucide-react";
import letterheadImage from "../../assets/documents/Form_22.jpg";
import { fetchKnownChassis } from "../../utils/chassisLookup";
import { splitChassis } from "../../features/quotation/calc";
import Modal from "../../components/ui/Modal";
import { Input } from "../../components/ui/Field";
import { PrimaryButton } from "../../components/ui/Button";
import DashboardLayout from "../../components/dashboard/DashboardLayout";

const Form22 = () => {
  const [typeSelectorOpen, setTypeSelectorOpen] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [formType, setFormType] = useState(null);
  const [chassisOptions, setChassisOptions] = useState([]);
  const [selectedChassis, setSelectedChassis] = useState("");
  const [chassisInput, setChassisInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [downloaded, setDownloaded] = useState(null);

  const brandName = formType === "rikshaw" ? "JHATPAT JIO" : "HALCHAL";
  const vehiclePrefix = formType === "rikshaw" ? "ME" : "MC";
  const isValidSelection =
    !!selectedChassis && chassisOptions.includes(selectedChassis);

  const loadChassis = useCallback(async (type) => {
    setLoading(true);
    setError("");
    try {
      const list = await fetchKnownChassis({ vehicleType: type });
      setChassisOptions(list);
      if (list.length === 0) {
        setError(
          "No registered chassis numbers found for this vehicle type yet.",
        );
      }
    } catch {
      setError("Unable to load chassis numbers. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  const handleTypeSelect = (type) => {
    setFormType(type);
    setSelectedChassis("");
    setChassisInput("");
    setDownloaded(null);
    setTypeSelectorOpen(false);
    setFormOpen(true);
    loadChassis(type);
  };

  const handleChassisInput = (e) => {
    const value = e.target.value.toUpperCase();
    setChassisInput(value);
    setSelectedChassis(chassisOptions.includes(value) ? value : "");
  };

  const handleDownload = () => {
    if (!isValidSelection) return;

    const { mid1, mid2 } = splitChassis(selectedChassis);
    const paragraphContent = `
Certified  that ${brandName} ( Brand  name  of vehicle )  bearing  chassis no.
${selectedChassis}  and  engine number or  motor  number  in  case  of  battery
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

      setDownloaded(selectedChassis);
      setSelectedChassis("");
      setChassisInput("");
      setFormOpen(false);
    };
  };

  return (
    <DashboardLayout dealerName="Sub Admin">
      <div className="w-full max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <span className="text-[10px] uppercase tracking-[0.28em] font-semibold text-primary mb-2 inline-block font-rr">
            RTO Compliance
          </span>
          <h1 className="font-display uppercase text-white text-2xl sm:text-3xl leading-[1.05] tracking-[-0.01em]">
            Form 22
          </h1>
          <p className="text-white/50 text-sm mt-2 max-w-2xl">
            Initial certificate of compliance with pollution, safety and
            road-worthiness standards.
          </p>
        </div>

        {downloaded && (
          <div className="mb-6 px-4 py-3 rounded-lg text-sm border bg-primary/[0.08] border-primary/30 text-primary flex items-center gap-2">
            <CheckCircle2 size={14} />
            Form 22 generated for chassis {downloaded}
          </div>
        )}

        {/* Card */}
        <div className="bg-white/[0.02] border border-white/[0.08] rounded-xl p-6 sm:p-10 text-center max-w-md mx-auto">
          <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/25 flex items-center justify-center mx-auto mb-5">
            <FileCheck2 size={22} className="text-primary" strokeWidth={1.75} />
          </div>
          <h2 className="font-display uppercase text-white text-lg tracking-[-0.01em] mb-2">
            Generate Certificate
          </h2>
          <p className="text-xs text-white/45 mb-6 max-w-xs mx-auto leading-relaxed">
            Select vehicle type and search a registered chassis number to
            download your signed certificate.
          </p>
          <PrimaryButton
            onClick={() => setTypeSelectorOpen(true)}
            className="!bg-primary !text-ink hover:!brightness-110 !rounded-full !px-7 !py-3 !text-[11px] !uppercase !tracking-[0.16em] !font-bold"
          >
            <Plus size={14} />
            Start Generation
          </PrimaryButton>
        </div>

        {/* Step 1 — Type selector */}
        <Modal
          open={typeSelectorOpen}
          onClose={() => setTypeSelectorOpen(false)}
          title="Select Vehicle Type"
          maxWidth="max-w-lg"
        >
          <div className="grid sm:grid-cols-2 gap-4">
            <button
              onClick={() => handleTypeSelect("rikshaw")}
              className="group relative p-5 rounded-2xl bg-white/[0.02] border border-white/[0.08] hover:border-primary/50 transition-all text-center"
            >
              <div className="w-14 h-14 rounded-2xl bg-primary/15 border border-primary/30 flex items-center justify-center mx-auto mb-3 group-hover:scale-105 transition-transform">
                <Car size={24} className="text-primary" strokeWidth={1.75} />
              </div>
              <p className="font-bold text-white text-sm mb-1 font-rr tracking-[0.02em]">
                Rikshaw
              </p>
              <p className="text-[10px] uppercase tracking-[0.18em] text-white/40 font-rr">
                Form 22 · JHATPAT JIO
              </p>
            </button>

            <button
              onClick={() => handleTypeSelect("cargo")}
              className="group relative p-5 rounded-2xl bg-white/[0.02] border border-white/[0.08] hover:border-primary/50 transition-all text-center"
            >
              <div className="w-14 h-14 rounded-2xl bg-sky-500/15 border border-sky-500/30 flex items-center justify-center mx-auto mb-3 group-hover:scale-105 transition-transform">
                <Truck size={24} className="text-sky-400" strokeWidth={1.75} />
              </div>
              <p className="font-bold text-white text-sm mb-1 font-rr tracking-[0.02em]">
                Cargo / Loader
              </p>
              <p className="text-[10px] uppercase tracking-[0.18em] text-white/40 font-rr">
                Form 22 · HALCHAL
              </p>
            </button>
          </div>
        </Modal>

        {/* Step 2 — Chassis search */}
        <Modal
          open={formOpen}
          onClose={() => setFormOpen(false)}
          title={`Form 22 — ${formType === "rikshaw" ? "Rikshaw" : "Cargo"}`}
          maxWidth="max-w-lg"
        >
          {loading ? (
            <div className="flex flex-col items-center justify-center py-8 gap-3">
              <Loader2 size={24} className="animate-spin text-primary" />
              <p className="text-xs text-white/50">
                Loading chassis numbers...
              </p>
            </div>
          ) : (
            <div className="space-y-5">
              <div>
                <label className="block text-[10px] sm:text-[11px] uppercase tracking-[0.24em] font-semibold text-white/45 mb-2.5 font-rr">
                  Chassis Number
                </label>
                <Input
                  value={chassisInput}
                  onChange={handleChassisInput}
                  list="form22-chassis-options"
                  placeholder="Start typing to search..."
                  autoComplete="off"
                  className="font-mono"
                />
                <datalist id="form22-chassis-options">
                  {chassisOptions.map((c) => (
                    <option key={c} value={c} />
                  ))}
                </datalist>

                {isValidSelection && (
                  <div className="flex items-center gap-2 text-primary text-xs mt-2">
                    <CheckCircle2 size={12} />
                    Valid registered chassis
                  </div>
                )}
                {chassisInput && !isValidSelection && (
                  <p className="text-amber-300 text-xs mt-2 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                    Not a registered chassis number for this vehicle type.
                  </p>
                )}
              </div>
              {error && (
                <p className="text-red-400 text-xs bg-red-500/[0.08] border border-red-500/25 rounded-lg px-3 py-2">
                  {error}
                </p>
              )}
              <PrimaryButton
                onClick={handleDownload}
                disabled={!isValidSelection}
                className="w-full justify-center !bg-primary !text-ink hover:!brightness-110 !rounded-full !py-3 !text-[11px] !uppercase !tracking-[0.16em] !font-bold disabled:opacity-50"
              >
                <Download size={14} />
                Download Form 22
              </PrimaryButton>
            </div>
          )}
        </Modal>
      </div>
    </DashboardLayout>
  );
};

export default Form22;
