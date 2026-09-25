import { useLocation, useNavigate } from "react-router";
import jsPDF from "jspdf";
import {
  FileText,
  Download,
  ArrowRight,
  Award,
  User,
  Lock,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import certificateImage from "../../assets/documents/certificate.jpg";
import letterOfIntentImage from "../../assets/documents/letter-of-intent.jpg";
import requestLetterImage from "../../assets/documents/request-letter.jpg";
import { PrimaryButton, SecondaryButton } from "../../components/ui/Button";
import useScrollReveal from "../../hooks/useScrollReveal";

const formatDate = () => {
  const d = new Date();
  return `${String(d.getDate()).padStart(2, "0")}-${String(d.getMonth() + 1).padStart(2, "0")}-${d.getFullYear()}`;
};

const Document = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { submittedData } = location.state || {};
  const cardRef = useScrollReveal({ delay: 100 });

  if (!submittedData) {
    return (
      <section className="min-h-screen pt-32 pb-20 px-4 flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-cyan-500/5" />
        <div
          ref={cardRef}
          className="reveal-scale relative bg-white border border-border rounded-3xl p-8 max-w-md text-center shadow-2xl"
        >
          <div className="w-16 h-16 rounded-2xl bg-amber-100 flex items-center justify-center mx-auto mb-4 animate-bounce-subtle">
            <FileText size={28} className="text-amber-600" />
          </div>
          <h2 className="text-xl font-bold text-foreground mb-2">
            No Data Available
          </h2>
          <p className="text-sm text-muted-foreground mb-6">
            Please submit the dealer form first to access your documents.
          </p>
          <PrimaryButton
            onClick={() => navigate("/")}
            className="shadow-lg shadow-primary/30 shine relative"
          >
            Go to Home
          </PrimaryButton>
        </div>
      </section>
    );
  }

  const { dealerCode, mobileNo } = submittedData;
  const formattedDate = formatDate();

  const loiContent = `This is to certify that M/s ${submittedData.name}, located at ${submittedData.address}, ${submittedData.dist}, ${submittedData.state} - ${submittedData.pinCode}, and GSTIN ${submittedData.gstin}, has been duly authorized for the sale and service of our battery-operated e-Rickshaw model "JHATPAT-JIO." The aforementioned model is manufactured by M/s Enabling E-Vehicle Private Ltd., which has its registered office at 10A/21, Vasundhara, Ghaziabad, Uttar Pradesh 201012, bearing GSTIN 09AAHCE4716B1ZW.

This authorization is granted in accordance with the terms and conditions outlined in our dealer agreement for the JHATPAT-JIO model, as well as for any forthcoming models that may be introduced.

For Enabling E-Vehicle Private Ltd.,
Authorized Signatory`;

  const reqContent = `REF: ${submittedData.RQreferenceId}

To,
The Regional Transport Officer (RTO)
${submittedData.rtoOffice}, ${submittedData.state}

Subject: Authorization for "JHATPAT Jio"

We wish to inform you that M/s ${submittedData.name}, located at ${submittedData.address}, ${submittedData.dist}, ${submittedData.state} - ${submittedData.pinCode}, has been appointed as an authorized dealer for the sales and service of our eRickshaw model "JHATPAT Jio" within the ${submittedData.dist} region.

We kindly request your office to process the registration of the eRickshaw vehicles manufactured by ENABLING E-VEHICLE PRIVATE LIMITED, as presented by our authorized dealer.

Yours sincerely,
ENABLING E-VEHICLE PRIVATE LIMITED`;

  const certContent = `This is to certify that M/S ${submittedData.name}, Address: ${submittedData.address}, GST Number: ${submittedData.gstin}, is an authorized dealer for JhatPat Jio e-rickshaws. The dealer is entitled to sell, promote, and provide after-sales service for JhatPat Jio products in the ${submittedData.dist} region.`;

  const handleGetCertificate = () => {
    const pdf = new jsPDF();

    pdf.addImage(letterOfIntentImage, "JPEG", 0, 0, 210, 297);
    pdf.setFontSize(20);
    pdf.text("LETTER OF INTENT (LOI)", 105, 75, { align: "center" });
    pdf.setFontSize(16);
    pdf.text("TO WHOMSOEVER IT MAY CONCERN", 105, 85, { align: "center" });
    pdf.setFontSize(13);
    pdf.text(`Date: ${formattedDate}`, 163, 50);
    pdf.text(loiContent, 10, 100, { maxWidth: 190 });
    pdf.addPage();

    pdf.addImage(certificateImage, "JPEG", 0, 0, 210, 160);
    pdf.text(formattedDate, 20, 130);
    pdf.text(certContent, 10, 70, { maxWidth: 190 });
    pdf.addPage();

    pdf.addImage(requestLetterImage, "JPEG", 0, 0, 210, 297);
    pdf.text(`Date: ${formattedDate}`, 163, 50);
    pdf.text(reqContent, 10, 70, { maxWidth: 190 });

    pdf.save("certificates.pdf");
    navigate("/");
  };

  return (
    <section className="min-h-screen pt-32 pb-20 px-4 sm:px-6 lg:px-8 flex items-center justify-center relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-cyan-500/5" />
      <div className="absolute inset-0 bg-grid opacity-20" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/15 rounded-full blur-[120px] float-y" />
      <div
        className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/15 rounded-full blur-[120px] float-y"
        style={{ animationDelay: "2s" }}
      />

      <div ref={cardRef} className="reveal-scale relative w-full max-w-lg">
        <div className="bg-white border border-border rounded-3xl p-8 sm:p-10 text-center shadow-2xl shadow-primary/5 relative overflow-hidden">
          {/* Corner accents */}
          <div className="absolute top-0 left-0 w-20 h-20 border-t-2 border-l-2 border-primary/40 rounded-tl-3xl" />
          <div className="absolute bottom-0 right-0 w-20 h-20 border-b-2 border-r-2 border-primary/40 rounded-br-3xl" />

          {/* Decorative blob */}
          <div className="absolute -top-20 -right-20 w-40 h-40 bg-primary/10 rounded-full blur-3xl" />

          {/* Icon */}
          <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-emerald-500 flex items-center justify-center mx-auto mb-5 shadow-lg shadow-primary/30 animate-bounce-subtle">
            <Award size={28} className="text-white" strokeWidth={2.5} />
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
            Welcome Aboard!
          </h1>
          <p className="text-muted-foreground text-sm mb-6 max-w-sm mx-auto">
            Thank you for joining us! Together with a trusted brand, we'll
            create new success stories.
          </p>

          {/* Credentials card */}
          <div className="relative bg-gradient-to-br from-primary/5 to-cyan-500/5 border border-primary/20 rounded-2xl p-5 text-left mb-6 overflow-hidden">
            <div className="absolute -top-8 -right-8 w-24 h-24 bg-primary/10 rounded-full blur-2xl" />

            <div className="relative flex items-center gap-2 mb-3">
              <div className="w-6 h-6 rounded-md bg-primary/20 flex items-center justify-center">
                <Lock size={11} className="text-primary" />
              </div>
              <p className="text-[10px] font-bold text-primary uppercase tracking-wider">
                Your Login Credentials
              </p>
            </div>

            <div className="relative space-y-2.5">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <User size={12} />
                  User ID
                </div>
                <span className="font-mono font-bold text-foreground text-sm bg-white px-2.5 py-1 rounded-md border border-border">
                  {dealerCode}
                </span>
              </div>
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Lock size={12} />
                  Password
                </div>
                <span className="font-mono font-bold text-foreground text-sm bg-white px-2.5 py-1 rounded-md border border-border">
                  {mobileNo}
                </span>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <PrimaryButton
              onClick={handleGetCertificate}
              className="shadow-lg shadow-primary/30 shine relative group"
            >
              <Download size={16} />
              Download Documents
            </PrimaryButton>
            <SecondaryButton onClick={() => navigate("/dealerLogin")}>
              Go to Login
            </SecondaryButton>
          </div>

          {/* Info strip */}
          <div className="mt-5 pt-5 border-t border-border flex items-center justify-center gap-2 text-[10px] text-muted-foreground">
            <CheckCircle2 size={11} className="text-primary" />
            Combined PDF with LOI, Certificate & RTO Request Letter
          </div>
        </div>
      </div>
    </section>
  );
};

export default Document;
