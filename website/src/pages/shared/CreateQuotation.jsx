import { useCallback, useMemo, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useAuth } from "../../auth/AuthContext";
import { useDealerInfo } from "../../auth/useDealerInfo";
import QuotationList from "../../features/quotation/QuotationList";
import QuotationBuilder from "../../features/quotation/QuotationBuilder";
import { dealerFromInfo } from "../../features/quotation/calc";
import DashboardLayout from "../../components/dashboard/DashboardLayout";

const CreateQuotation = () => {
  const { role } = useAuth();
  const { dealerInfo, dealerCode } = useDealerInfo();
  const [builder, setBuilder] = useState(null);

  const isDealer = role === "dealer";
  const dealerObj = useMemo(() => dealerFromInfo(dealerInfo), [dealerInfo]);

  const openNew = useCallback(
    () => setBuilder({ quotation: null, key: Date.now() }),
    [],
  );
  const openEdit = useCallback(
    (quotation) => setBuilder({ quotation, key: quotation.id }),
    [],
  );
  const backToList = useCallback(() => setBuilder(null), []);

  return (
    <DashboardLayout
      dealerName={isDealer ? dealerInfo?.name : "Sub Admin"}
      dealerCode={isDealer ? dealerCode : null}
    >
      <div className="w-full max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <span className="text-[10px] uppercase tracking-[0.28em] font-semibold text-primary mb-2 inline-block font-rr">
            {isDealer ? "Dealer" : "Sub Admin"}
          </span>
          <h1 className="font-display uppercase text-white text-2xl sm:text-3xl leading-[1.05] tracking-[-0.01em]">
            {builder
              ? builder.quotation
                ? "Edit Quotation"
                : "New Quotation"
              : "Quotations"}
          </h1>
          {!builder && (
            <p className="text-white/50 text-sm mt-2 max-w-2xl">
              {isDealer
                ? "Create and track vehicle quotations for your dealership."
                : "Review, edit and approve vehicle quotations from all dealers."}
            </p>
          )}
        </div>

        {builder ? (
          <>
            <button
              onClick={backToList}
              className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-[0.14em] font-semibold text-white/50 hover:text-white transition-colors mb-4 font-rr"
            >
              <ArrowLeft size={13} /> Back to quotations
            </button>
            <QuotationBuilder
              key={builder.key}
              role={role}
              dealerObj={dealerObj}
              quotation={builder.quotation}
              onBack={backToList}
            />
          </>
        ) : (
          <QuotationList
            role={role}
            dealerCode={dealerCode}
            onCreate={openNew}
            onEdit={openEdit}
          />
        )}
      </div>
    </DashboardLayout>
  );
};

export default CreateQuotation;
