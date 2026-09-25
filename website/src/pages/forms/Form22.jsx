import { useCallback, useState } from "react";
import jsPDF from "jspdf";
import {
  Car,
  Truck,
  FileCheck2,
  Loader2,
  Download,
  Sparkles,
  CheckCircle2,
} from "lucide-react";
import letterheadImage from "../../assets/documents/Form_22.jpg";
import { fetchKnownChassis } from "../../utils/chassisLookup";
import { splitChassis } from "../../features/quotation/calc";
import Modal from "../../components/ui/Modal";
import { Input } from "../../components/ui/Field";
import { PrimaryButton } from "../../components/ui/Button";
import useScrollReveal from "../../hooks/useScrollReveal";

const Form22 = () => {
  const [typeSelectorOpen, setTypeSelectorOpen] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [formType, setFormType] = useState(null);
  const [chassisOptions, setChassisOptions] = useState([]);
  const [selectedChassis, setSelectedChassis] = useState("");
  const [chassisInput, setChassisInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const headerRef = useScrollReveal({ delay: 100 });
  const cardRef = useScrollReveal({ delay: 200 });

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

      setSelectedChassis("");
      setChassisInput("");
      setFormOpen(false);
    };
  };

  return (
    <section className="min-h-screen pt-32 pb-20 px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-cyan-500/5" />
      <div className="absolute inset-0 bg-grid opacity-20" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/15 rounded-full blur-[120px] float-y" />
      <div
        className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/15 rounded-full blur-[120px] float-y"
        style={{ animationDelay: "2s" }}
      />

      <div
        ref={headerRef}
        className="reveal relative text-center mb-8 max-w-lg"
      >
        <span className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-3 py-1.5 text-[11px] font-semibold text-primary mb-4">
          <FileCheck2 size={11} />
          RTO Compliance
          <span className="w-1.5 h-1.5 rounded-full bg-primary pulse-dot" />
        </span>
        <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-3">
          Generate <span className="text-gradient">Form 22</span>
        </h1>
        <p className="text-muted-foreground text-sm max-w-md mx-auto">
          Initial certificate of compliance with pollution, safety and
          road-worthiness standards.
        </p>
      </div>

      <div
        ref={cardRef}
        className="reveal-scale relative bg-white border border-border rounded-3xl p-8 sm:p-10 text-center max-w-md shadow-2xl shadow-primary/5 hover-lift"
      >
        {/* Corner accents */}
        <div className="absolute top-0 left-0 w-16 h-16 border-t-2 border-l-2 border-primary/40 rounded-tl-3xl" />
        <div className="absolute bottom-0 right-0 w-16 h-16 border-b-2 border-r-2 border-primary/40 rounded-br-3xl" />

        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-emerald-500 flex items-center justify-center mx-auto mb-5 shadow-lg shadow-primary/30 animate-bounce-subtle">
          <FileCheck2 size={28} className="text-white" strokeWidth={2.5} />
        </div>
        <h2 className="font-bold text-foreground text-lg mb-2">
          Generate Certificate
        </h2>
        <p className="text-xs text-muted-foreground mb-6 max-w-xs mx-auto">
          Select vehicle type and search a registered chassis number to download
          your signed certificate.
        </p>
        <PrimaryButton
          onClick={() => setTypeSelectorOpen(true)}
          className="shadow-lg shadow-primary/30 shine relative group"
        >
          <Sparkles size={16} />
          Start Generation
        </PrimaryButton>

        {/* Info strip */}
        <div className="mt-6 pt-5 border-t border-border">
          <div className="flex items-center justify-center gap-2 text-[10px] text-muted-foreground">
            <CheckCircle2 size={11} className="text-primary" />
            Government-approved format
          </div>
        </div>
      </div>

      {/* Step 1 */}
      <Modal
        open={typeSelectorOpen}
        onClose={() => setTypeSelectorOpen(false)}
        title="Select Vehicle Type"
        maxWidth="max-w-lg"
      >
        <div className="grid sm:grid-cols-2 gap-4">
          <button
            onClick={() => handleTypeSelect("rikshaw")}
            className="group relative p-5 rounded-2xl bg-gradient-to-br from-primary/5 to-emerald-500/5 border border-border hover:border-primary transition-all text-center overflow-hidden magnetic"
          >
            <div className="absolute -top-12 -right-12 w-32 h-32 rounded-full bg-gradient-to-br from-primary to-emerald-500 opacity-0 group-hover:opacity-20 blur-2xl transition-all duration-700" />
            <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-emerald-500 flex items-center justify-center mx-auto mb-3 shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all">
              <Car size={26} className="text-white" strokeWidth={2.5} />
            </div>
            <p className="relative font-bold text-foreground text-sm mb-1">
              Rikshaw
            </p>
            <p className="relative text-[11px] text-muted-foreground">
              Form 22 · JHATPAT JIO
            </p>
          </button>
          <button
            onClick={() => handleTypeSelect("cargo")}
            className="group relative p-5 rounded-2xl bg-gradient-to-br from-blue-500/5 to-cyan-500/5 border border-border hover:border-primary transition-all text-center overflow-hidden magnetic"
          >
            <div className="absolute -top-12 -right-12 w-32 h-32 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 opacity-0 group-hover:opacity-20 blur-2xl transition-all duration-700" />
            <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center mx-auto mb-3 shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all">
              <Truck size={26} className="text-white" strokeWidth={2.5} />
            </div>
            <p className="relative font-bold text-foreground text-sm mb-1">
              Cargo / Loader
            </p>
            <p className="relative text-[11px] text-muted-foreground">
              Form 22 · HALCHAL
            </p>
          </button>
        </div>
      </Modal>

      {/* Step 2 */}
      <Modal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        title={`Form 22 — ${formType === "rikshaw" ? "Rikshaw" : "Cargo"}`}
        maxWidth="max-w-lg"
      >
        {loading ? (
          <div className="flex flex-col items-center justify-center py-8 gap-3">
            <Loader2 size={24} className="animate-spin text-primary" />
            <p className="text-xs text-muted-foreground">
              Loading chassis numbers...
            </p>
          </div>
        ) : (
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium mb-2 text-foreground">
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
                <div className="flex items-center gap-2 text-emerald-600 text-xs mt-2 animate-fade-in">
                  <CheckCircle2 size={12} />
                  Valid registered chassis
                </div>
              )}
              {chassisInput && !isValidSelection && (
                <p className="text-amber-600 text-xs mt-2 flex items-center gap-1.5 animate-fade-in">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                  Not a registered chassis number for this vehicle type.
                </p>
              )}
            </div>
            {error && (
              <p className="text-red-500 text-xs bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                {error}
              </p>
            )}
            <PrimaryButton
              onClick={handleDownload}
              disabled={!isValidSelection}
              className="w-full justify-center shadow-lg shadow-primary/30 shine relative disabled:opacity-50 disabled:shadow-none"
            >
              <Download size={16} />
              Download Form 22
            </PrimaryButton>
          </div>
        )}
      </Modal>
    </section>
  );
};

export default Form22;
