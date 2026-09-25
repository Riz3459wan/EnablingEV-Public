import { useCallback, useState } from "react";
import { downloadQuotationPDF, printQuotation } from "./invoice";

// Print / PDF button state shared by the list, the details modal and the builder.
export const useInvoiceActions = () => {
  const [busy, setBusy] = useState(null); // "pdf:12" | "print:12" | null
  const [error, setError] = useState("");

  const run = useCallback(async (kind, quotation) => {
    setBusy(`${kind}:${quotation.id ?? "draft"}`);
    setError("");
    try {
      if (kind === "pdf") {
        await downloadQuotationPDF(quotation);
      } else {
        await printQuotation(quotation);
      }
    } catch (err) {
      console.error("Quotation document failed:", err);
      setError("Couldn't generate the document. Please try again.");
    } finally {
      setBusy(null);
    }
  }, []);

  return { busy, error, run };
};
