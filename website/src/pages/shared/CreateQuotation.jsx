import { useCallback, useMemo, useState } from "react";
import { Link } from "react-router";
import { ArrowLeft } from "lucide-react";
import { useAuth } from "../../auth/AuthContext";
import { useDealerInfo } from "../../auth/useDealerInfo";
import { ROLE_DASH, ROLE_LABEL } from "../../auth/roleConfig";
import QuotationList from "../../features/quotation/QuotationList";
import QuotationBuilder from "../../features/quotation/QuotationBuilder";
import { dealerFromInfo } from "../../features/quotation/calc";

// Migrated from the old app's components/quotation/createQuotation.jsx (1400
// lines: a stack of MUI dialogs inside one component). Now one page with two
// views — the quotation list and the builder — plus a details modal.
//   dealer   -> creates quotations for themselves, sees only their own
//   subadmin -> sees all, edits, assigns chassis numbers ("approve")
const CreateQuotation = () => {
  const { role } = useAuth();
  const { dealerInfo, dealerCode } = useDealerInfo();
  // view: null = list, { quotation: obj|null } = builder (null quotation = new)
  const [builder, setBuilder] = useState(null);

  const dealerObj = useMemo(() => dealerFromInfo(dealerInfo), [dealerInfo]);
  const openNew = useCallback(() => setBuilder({ quotation: null, key: Date.now() }), []);
  const openEdit = useCallback(
    (quotation) => setBuilder({ quotation, key: quotation.id }),
    [],
  );
  const backToList = useCallback(() => setBuilder(null), []);

  return (
    <section className="min-h-screen pt-28 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-7xl mx-auto">
        {builder ? (
          <button
            onClick={backToList}
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-white transition-colors mb-4"
          >
            <ArrowLeft size={15} /> Back to quotations
          </button>
        ) : (
          <Link
            to={ROLE_DASH[role] || "/"}
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-white transition-colors mb-4"
          >
            <ArrowLeft size={15} /> Back to dashboard
          </Link>
        )}

        <div className="mb-8">
          <span className="text-xs uppercase tracking-widest font-semibold text-accent mb-1 inline-block">
            {ROLE_LABEL[role]}
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            {builder
              ? builder.quotation
                ? "Edit Quotation"
                : "New Quotation"
              : "Quotations"}
          </h1>
          {!builder && (
            <p className="text-muted-foreground text-sm sm:text-base mt-2">
              {role === "dealer"
                ? "Create and track vehicle quotations for your dealership."
                : "Review, edit and approve vehicle quotations from all dealers."}
            </p>
          )}
        </div>

        {builder ? (
          <QuotationBuilder
            key={builder.key}
            role={role}
            dealerObj={dealerObj}
            quotation={builder.quotation}
            onBack={backToList}
          />
        ) : (
          <QuotationList
            role={role}
            dealerCode={dealerCode}
            onCreate={openNew}
            onEdit={openEdit}
          />
        )}
      </div>
    </section>
  );
};

export default CreateQuotation;
