import { useCallback, useState } from "react";
import { Link } from "react-router";
import jsPDF from "jspdf";
import {
  Car,
  Truck,
  FileCheck2,
  Loader2,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Search,
  Download,
  XCircle,
  Sparkles,
  Shield,
  AlertCircle,
  PartyPopper,
  RotateCcw,
} from "lucide-react";
import letterheadImage from "../../assets/documents/Form_22.jpg";
import { fetchKnownChassis } from "../../utils/chassisLookup";
import { splitChassis } from "../../features/quotation/calc";
import Card from "../../components/ui/Card";
import { Input } from "../../components/ui/Field";
import { PrimaryButton } from "../../components/ui/Button";

// ── Progress Steps ─────────────────────────────────────────
const STEPS = [
  { id: 1, label: "Vehicle Type", icon: Truck },
  { id: 2, label: "Chassis Number", icon: Search },
  { id: 3, label: "Download", icon: Download },
];

const ProgressBar = ({ currentStep }) => (
  <div className="flex items-center justify-between mb-10 max-w-2xl mx-auto">
    {STEPS.map((step, idx) => {
      const Icon = step.icon;
      const isActive = currentStep === step.id;
      const isCompleted = currentStep > step.id;

      return (
        <div key={step.id} className="flex items-center flex-1">
          <div className="flex flex-col items-center">
            <div
              className={`relative w-12 h-12 rounded-full flex items-center justify-center transition-all duration-500 ${
                isActive
                  ? "bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/40 scale-110"
                  : isCompleted
                    ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/30"
                    : "bg-slate-100 text-slate-400 border-2 border-slate-200"
              }`}
            >
              {isCompleted ? (
                <CheckCircle2 size={20} className="animate-scale-in" />
              ) : (
                <Icon size={20} className={isActive ? "animate-pulse" : ""} />
              )}

              {isActive && (
                <span className="absolute inset-0 rounded-full bg-blue-500 animate-ping opacity-30" />
              )}
            </div>
            <p
              className={`text-xs font-semibold mt-2 transition-colors whitespace-nowrap ${
                isActive
                  ? "text-blue-600"
                  : isCompleted
                    ? "text-emerald-600"
                    : "text-slate-400"
              }`}
            >
              {step.label}
            </p>
          </div>

          {idx < STEPS.length - 1 && (
            <div className="flex-1 h-0.5 mx-3 rounded-full overflow-hidden bg-slate-200">
              <div
                className={`h-full rounded-full transition-all duration-700 ${
                  isCompleted
                    ? "w-full bg-emerald-500"
                    : isActive
                      ? "w-1/2 bg-blue-500"
                      : "w-0"
                }`}
              />
            </div>
          )}
        </div>
      );
    })}
  </div>
);

// ── Main Component ─────────────────────────────────────────
const Form22 = () => {
  const [step, setStep] = useState(1);
  const [formType, setFormType] = useState(null); // 'rikshaw' | 'cargo'
  const [chassisOptions, setChassisOptions] = useState([]);
  const [selectedChassis, setSelectedChassis] = useState("");
  const [chassisInput, setChassisInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

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
    setError("");
    // Small delay for nice transition
    setTimeout(() => {
      setStep(2);
      loadChassis(type);
    }, 250);
  };

  const handleChassisInput = (e) => {
    const value = e.target.value.toUpperCase();
    setChassisInput(value);
    setSelectedChassis(chassisOptions.includes(value) ? value : "");
  };

  const handleBack = () => {
    if (step === 2) {
      setStep(1);
      setFormType(null);
      setChassisInput("");
      setSelectedChassis("");
      setError("");
    }
  };

  const handleReset = () => {
    setStep(1);
    setFormType(null);
    setChassisInput("");
    setSelectedChassis("");
    setChassisOptions([]);
    setError("");
    setSuccess(false);
  };

  const handleDownload = () => {
    if (!isValidSelection) return;

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

      setSuccess(true);
    };
  };

  // ── Success State ───────────────────────────────────────
  if (success) {
    return (
      <section className="w-full min-h-[80vh] flex items-center justify-center">
        <Card className="max-w-lg w-full p-8 sm:p-12 text-center animate-scale-in">
          {/* Success illustration */}
          <div className="relative w-24 h-24 mx-auto mb-6">
            <div className="absolute inset-0 rounded-full bg-emerald-100 animate-ping opacity-40" />
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-2xl shadow-emerald-500/40 animate-bounce-in">
              <PartyPopper size={40} className="text-white" />
            </div>
          </div>

          <h1 className="text-3xl font-bold text-slate-800 mb-3 animate-fade-in-up">
            Certificate Downloaded!
          </h1>
          <p
            className="text-slate-500 mb-8 animate-fade-in-up"
            style={{ animationDelay: "100ms" }}
          >
            Form 22 for chassis{" "}
            <span className="font-mono font-semibold text-slate-800">
              {selectedChassis}
            </span>{" "}
            has been saved to your device.
          </p>

          <div
            className="flex flex-col sm:flex-row gap-3 justify-center animate-fade-in-up"
            style={{ animationDelay: "200ms" }}
          >
            <PrimaryButton onClick={handleReset} className="gap-2">
              <RotateCcw size={16} />
              Generate Another
            </PrimaryButton>
            <Link
              to="/adminDash"
              className="inline-flex items-center justify-center px-6 py-2.5 rounded-lg font-semibold text-sm border border-slate-300 text-slate-700 hover:bg-slate-50 transition-colors"
            >
              Back to Dashboard
            </Link>
          </div>
        </Card>
      </section>
    );
  }

  // ── Main Flow ───────────────────────────────────────────
  return (
    <section className="w-full max-w-4xl mx-auto">
      {/* Header */}

      <div className="text-center mb-8 animate-fade-in-up">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-200 mb-4">
          <Shield size={12} className="text-blue-600" />
          <span className="text-[10px] uppercase tracking-widest font-bold text-blue-600">
            RTO Compliance
          </span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-800 tracking-tight mb-2">
          Generate Form 22
        </h1>
        <p className="text-slate-500 text-sm max-w-md mx-auto">
          Initial certificate of compliance with pollution, safety and
          road-worthiness standards.
        </p>
      </div>

      {/* Progress Bar */}
      <ProgressBar currentStep={step} />

      {/* ── Step 1: Vehicle Type ── */}
      {step === 1 && (
        <div className="animate-fade-in-up">
          <Card className="p-6 sm:p-8">
            <div className="text-center mb-8">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-500/30 animate-bounce-in">
                <FileCheck2 size={28} className="text-white" />
              </div>
              <h2 className="text-xl font-bold text-slate-800 mb-1">
                Choose Vehicle Type
              </h2>
              <p className="text-sm text-slate-500">
                Select the type of vehicle for which you want to generate Form
                22
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
              {/* Rikshaw Card */}
              <button
                onClick={() => handleTypeSelect("rikshaw")}
                className="group relative p-6 rounded-2xl border-2 border-slate-200 bg-white hover:border-blue-500 hover:bg-blue-50/30 hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300 hover:-translate-y-1 text-left overflow-hidden"
              >
                {/* Background decoration */}
                <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-blue-100/50 group-hover:bg-blue-200/60 transition-colors" />

                <div className="relative">
                  <div className="w-14 h-14 rounded-2xl bg-blue-50 group-hover:bg-blue-100 flex items-center justify-center mb-4 transition-all group-hover:scale-110 group-hover:rotate-6">
                    <Car size={26} className="text-blue-600" />
                  </div>
                  <h3 className="font-bold text-lg text-slate-800 mb-1">
                    Rikshaw
                  </h3>
                  <p className="text-xs text-slate-500 mb-3">
                    Passenger vehicle for urban transport
                  </p>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-slate-400">Brand:</span>
                    <span className="font-semibold text-slate-700">
                      JHATPAT JIO
                    </span>
                  </div>
                </div>

                {/* Hover arrow */}
                <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 -translate-x-2 transition-all duration-300">
                  <ArrowRight size={20} className="text-blue-600" />
                </div>
              </button>

              {/* Cargo Card */}
              <button
                onClick={() => handleTypeSelect("cargo")}
                className="group relative p-6 rounded-2xl border-2 border-slate-200 bg-white hover:border-emerald-500 hover:bg-emerald-50/30 hover:shadow-xl hover:shadow-emerald-500/10 transition-all duration-300 hover:-translate-y-1 text-left overflow-hidden"
              >
                <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-emerald-100/50 group-hover:bg-emerald-200/60 transition-colors" />

                <div className="relative">
                  <div className="w-14 h-14 rounded-2xl bg-emerald-50 group-hover:bg-emerald-100 flex items-center justify-center mb-4 transition-all group-hover:scale-110 group-hover:rotate-6">
                    <Truck size={26} className="text-emerald-600" />
                  </div>
                  <h3 className="font-bold text-lg text-slate-800 mb-1">
                    Cargo / Loader
                  </h3>
                  <p className="text-xs text-slate-500 mb-3">
                    Commercial vehicle for goods transport
                  </p>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-slate-400">Brand:</span>
                    <span className="font-semibold text-slate-700">
                      HALCHAL
                    </span>
                  </div>
                </div>

                <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 -translate-x-2 transition-all duration-300">
                  <ArrowRight size={20} className="text-emerald-600" />
                </div>
              </button>
            </div>
          </Card>
        </div>
      )}

      {/* ── Step 2: Chassis Search ── */}
      {step === 2 && (
        <div className="animate-fade-in-up">
          <Card className="p-6 sm:p-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <button
                onClick={handleBack}
                className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 transition-colors group"
              >
                <ArrowLeft
                  size={15}
                  className="group-hover:-translate-x-1 transition-transform"
                />
                Change type
              </button>

              <div
                className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-semibold ${
                  formType === "rikshaw"
                    ? "bg-blue-50 text-blue-700 border-blue-200"
                    : "bg-emerald-50 text-emerald-700 border-emerald-200"
                }`}
              >
                {formType === "rikshaw" ? (
                  <Car size={12} />
                ) : (
                  <Truck size={12} />
                )}
                {formType === "rikshaw" ? "Rikshaw" : "Cargo / Loader"}
              </div>
            </div>

            {loading ? (
              // Loading State
              <div className="flex flex-col items-center py-16 animate-fade-in">
                <div className="relative w-16 h-16 mb-4">
                  <div className="absolute inset-0 rounded-full border-4 border-slate-100" />
                  <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-600 animate-spin" />
                </div>
                <p className="text-sm text-slate-500 animate-pulse">
                  Loading registered chassis numbers...
                </p>
              </div>
            ) : (
              <div className="max-w-2xl mx-auto">
                {/* Title */}
                <div className="text-center mb-8">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-500/30 animate-bounce-in">
                    <Search size={26} className="text-white" />
                  </div>
                  <h2 className="text-xl font-bold text-slate-800 mb-1">
                    Search Chassis Number
                  </h2>
                  <p className="text-sm text-slate-500">
                    Start typing to find a registered chassis number
                  </p>
                </div>

                {/* Input */}
                <div className="relative mb-6">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10 pointer-events-none">
                    <Search
                      size={18}
                      className={`transition-colors ${
                        isValidSelection ? "text-emerald-500" : "text-slate-400"
                      }`}
                    />
                  </div>
                  <input
                    autoFocus
                    value={chassisInput}
                    onChange={handleChassisInput}
                    list="form22-chassis-options"
                    placeholder="e.g. ME9EBCRABC H268XYZ"
                    autoComplete="off"
                    className={`w-full pl-12 pr-12 py-4 bg-slate-50 border-2 rounded-2xl text-sm font-mono tracking-wider text-slate-800 placeholder:text-slate-400 placeholder:font-sans placeholder:tracking-normal outline-none transition-all duration-300 ${
                      isValidSelection
                        ? "border-emerald-500 bg-emerald-50/30 focus:shadow-lg focus:shadow-emerald-500/20"
                        : chassisInput && !isValidSelection
                          ? "border-orange-400 bg-orange-50/30"
                          : "border-slate-200 focus:border-blue-500 focus:bg-white focus:shadow-lg focus:shadow-blue-500/10"
                    }`}
                  />
                  <datalist id="form22-chassis-options">
                    {chassisOptions.map((c) => (
                      <option key={c} value={c} />
                    ))}
                  </datalist>

                  {/* Right icon */}
                  <div className="absolute right-4 top-1/2 -translate-y-1/2">
                    {isValidSelection && (
                      <CheckCircle2
                        size={20}
                        className="text-emerald-500 animate-scale-in"
                      />
                    )}
                    {chassisInput && !isValidSelection && (
                      <XCircle
                        size={20}
                        className="text-orange-500 animate-scale-in"
                      />
                    )}
                  </div>
                </div>

                {/* Validation messages */}
                {isValidSelection && (
                  <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 animate-fade-in-up">
                    <div className="flex items-start gap-3">
                      <CheckCircle2
                        size={18}
                        className="text-emerald-600 shrink-0 mt-0.5"
                      />
                      <div>
                        <p className="text-sm font-semibold text-emerald-800">
                          Valid chassis number found
                        </p>
                        <p className="text-xs text-emerald-600 mt-0.5 font-mono">
                          {selectedChassis}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {chassisInput && !isValidSelection && (
                  <div className="mb-6 p-4 rounded-2xl bg-orange-50 border border-orange-200 animate-fade-in-up">
                    <div className="flex items-start gap-3">
                      <AlertCircle
                        size={18}
                        className="text-orange-600 shrink-0 mt-0.5"
                      />
                      <div>
                        <p className="text-sm font-semibold text-orange-800">
                          Not a registered chassis number
                        </p>
                        <p className="text-xs text-orange-600 mt-0.5">
                          Please check and try again, or pick from the dropdown.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {error && !isValidSelection && (
                  <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-200 animate-fade-in-up">
                    <div className="flex items-start gap-3">
                      <AlertCircle
                        size={18}
                        className="text-red-600 shrink-0 mt-0.5"
                      />
                      <p className="text-sm text-red-700">{error}</p>
                    </div>
                  </div>
                )}

                {/* Available count */}
                {chassisOptions.length > 0 && (
                  <div className="flex items-center justify-between mb-6 px-1">
                    <p className="text-xs text-slate-500">
                      <span className="font-semibold text-slate-800">
                        {chassisOptions.length}
                      </span>{" "}
                      registered chassis available
                    </p>
                    <button
                      onClick={() => {
                        setChassisInput("");
                        setSelectedChassis("");
                      }}
                      className="text-xs text-blue-600 hover:underline font-medium"
                    >
                      Clear
                    </button>
                  </div>
                )}

                {/* Download Button */}
                <button
                  onClick={handleDownload}
                  disabled={!isValidSelection}
                  className={`group relative w-full py-4 rounded-2xl font-semibold text-sm transition-all duration-300 flex items-center justify-center gap-2 overflow-hidden ${
                    isValidSelection
                      ? "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 active:scale-[0.98]"
                      : "bg-slate-100 text-slate-400 cursor-not-allowed"
                  }`}
                >
                  {isValidSelection && (
                    <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                  )}
                  {isValidSelection ? (
                    <>
                      <Download
                        size={18}
                        className="group-hover:translate-y-0.5 transition-transform"
                      />
                      Download Certificate
                    </>
                  ) : (
                    <>
                      <Download size={18} />
                      Select a chassis to download
                    </>
                  )}
                </button>
              </div>
            )}
          </Card>
        </div>
      )}

      {/* ── Step 3: Info footer ── */}
      {step === 2 && (
        <div
          className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3 animate-fade-in-up"
          style={{ animationDelay: "200ms" }}
        >
          <div className="flex items-center gap-3 p-4 rounded-xl bg-white border border-slate-200">
            <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
              <Shield size={16} className="text-blue-600" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-800">Verified</p>
              <p className="text-[10px] text-slate-500">RTO-compliant data</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 rounded-xl bg-white border border-slate-200">
            <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center shrink-0">
              <Sparkles size={16} className="text-emerald-600" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-800">Instant</p>
              <p className="text-[10px] text-slate-500">
                PDF generated on the fly
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 rounded-xl bg-white border border-slate-200">
            <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center shrink-0">
              <FileCheck2 size={16} className="text-purple-600" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-800">Official</p>
              <p className="text-[10px] text-slate-500">
                Signed by authorized signatory
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Form22;
