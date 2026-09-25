import { useLocation, useNavigate } from "react-router";
import jsPDF from "jspdf";
import {
  FileText,
  Download,
  Award,
  User,
  Lock,
  CheckCircle2,
  ArrowLeft,
} from "lucide-react";
import certificateImage from "../../assets/documents/certificate.jpg";
import letterOfIntentImage from "../../assets/documents/letter-of-intent.jpg";
import requestLetterImage from "../../assets/documents/request-letter.jpg";
import { PrimaryButton, SecondaryButton } from "../../components/ui/Button";
import DashboardLayout from "../../components/dashboard/DashboardLayout";

const formatDate = () => {
  const d = new Date();
  return `${String(d.getDate()).padStart(2, "0")}-${String(d.getMonth() + 1).padStart(2, "0")}-${d.getFullYear()}`;
};

const Document = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { submittedData } = location.state || {};

  // No state — show empty state inside dashboard
  if (!submittedData) {
    return (
      <DashboardLayout dealerName="Dealer">
        <div className="w-full max-w-3xl mx-auto">
          <div className="mb-6">
            <span className="text-[10px] uppercase tracking-[0.28em] font-semibold text-primary mb-2 inline-block font-rr">
              Documents
            </span>
            <h1 className="font-display uppercase text-white text-2xl sm:text-3xl leading-[1.05] tracking-[-0.01em]">
              Certificates
            </h1>
            <p className="text-white/50 text-sm mt-2 max-w-2xl">
              Dealer authorization letters, LOI, and RTO request documents.
            </p>
          </div>

          <div className="bg-white/[0.02] border border-white/[0.08] rounded-xl p-8 sm:p-12 text-center">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/25 flex items-center justify-center mx-auto mb-5">
              <FileText
                size={22}
                className="text-amber-400"
                strokeWidth={1.75}
              />
            </div>
            <h2 className="font-display uppercase text-white text-lg tracking-[-0.01em] mb-2">
              No Data Available
            </h2>
            <p className="text-xs text-white/45 mb-6 max-w-xs mx-auto leading-relaxed">
              Please submit the dealer registration form to access your
              documents.
            </p>
            <PrimaryButton
              onClick={() => navigate("/DealerForm")}
              className="!bg-primary !text-ink hover:!brightness-110 !rounded-full !px-7 !py-3 !text-[11px] !uppercase !tracking-[0.16em] !font-bold"
            >
              Go to Dealer Form
            </PrimaryButton>
          </div>
        </div>
      </DashboardLayout>
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
  };

  return (
    <DashboardLayout dealerName={submittedData.name || "Dealer"}>
      <div className="w-full max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <span className="text-[10px] uppercase tracking-[0.28em] font-semibold text-primary mb-2 inline-block font-rr">
            Dealer Documents
          </span>
          <h1 className="font-display uppercase text-white text-2xl sm:text-3xl leading-[1.05] tracking-[-0.01em]">
            Certificates
          </h1>
          <p className="text-white/50 text-sm mt-2 max-w-2xl">
            Download your combined dealer documents — LOI, authorization
            certificate, and RTO request letter.
          </p>
        </div>

        {/* Welcome Card */}
        <div className="bg-white/[0.02] border border-white/[0.08] rounded-xl p-6 sm:p-10 relative overflow-hidden">
          <div className="pointer-events-none absolute -top-24 -right-24 w-64 h-64 rounded-full bg-primary/[0.08] blur-[80px]" />

          <div className="relative">
            {/* Icon */}
            <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/25 flex items-center justify-center mb-5">
              <Award size={22} className="text-primary" strokeWidth={1.75} />
            </div>

            <h2 className="font-display uppercase text-white text-xl sm:text-2xl tracking-[-0.01em] mb-3">
              Welcome Aboard
            </h2>
            <p className="text-white/60 text-sm mb-8 max-w-md leading-relaxed">
              Thank you for joining us. Together with a trusted brand, we'll
              create new success stories.
            </p>

            {/* Credentials card */}
            <div className="bg-white/[0.03] border border-white/[0.08] rounded-xl p-5 mb-8">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-6 h-6 rounded-md bg-primary/20 flex items-center justify-center">
                  <Lock size={11} className="text-primary" />
                </div>
                <p className="text-[10px] uppercase tracking-[0.24em] font-semibold text-primary font-rr">
                  Your Login Credentials
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2 text-xs text-white/50">
                    <User size={12} />
                    User ID
                  </div>
                  <span className="font-mono font-bold text-white text-sm bg-ink px-3 py-1.5 rounded-md border border-white/[0.1]">
                    {dealerCode}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2 text-xs text-white/50">
                    <Lock size={12} />
                    Password
                  </div>
                  <span className="font-mono font-bold text-white text-sm bg-ink px-3 py-1.5 rounded-md border border-white/[0.1]">
                    {mobileNo}
                  </span>
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="flex flex-col sm:flex-row gap-3">
              <PrimaryButton
                onClick={handleGetCertificate}
                className="!bg-primary !text-ink hover:!brightness-110 !rounded-full !px-6 !py-3 !text-[11px] !uppercase !tracking-[0.16em] !font-bold justify-center"
              >
                <Download size={14} />
                Download Documents
              </PrimaryButton>
              <SecondaryButton
                onClick={() => navigate("/dealerLogin")}
                className="!rounded-full !px-6 !py-3 !text-[11px] !uppercase !tracking-[0.16em] !font-bold justify-center"
              >
                Go to Login
              </SecondaryButton>
            </div>

            {/* Info strip */}
            <div className="mt-6 pt-6 border-t border-white/[0.06] flex items-start gap-2 text-[11px] text-white/45">
              <CheckCircle2
                size={12}
                className="text-primary shrink-0 mt-0.5"
              />
              Combined PDF with LOI, Certificate &amp; RTO Request Letter
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Document;
