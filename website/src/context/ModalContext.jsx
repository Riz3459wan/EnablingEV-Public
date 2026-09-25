import { createContext, useContext, useState, useCallback, useMemo } from "react";

const ModalContext = createContext(null);

export const ModalProvider = ({ children }) => {
  const [enquiry, setEnquiry] = useState({ open: false, type: "product", vehicle: "" });
  const [enquirySeq, setEnquirySeq] = useState(0);

  const openDealerEnquiry = useCallback(() => {
    setEnquiry({ open: true, type: "dealer", vehicle: "" });
    setEnquirySeq((s) => s + 1);
  }, []);

  const openProductEnquiry = useCallback(() => {
    setEnquiry({ open: true, type: "product", vehicle: "" });
    setEnquirySeq((s) => s + 1);
  }, []);

  const openVehicleEnquiry = useCallback((vehicleName) => {
    setEnquiry({ open: true, type: "product", vehicle: vehicleName });
    setEnquirySeq((s) => s + 1);
  }, []);

  const closeEnquiry = useCallback(() => setEnquiry((e) => ({ ...e, open: false })), []);

  const value = useMemo(
    () => ({
      enquiry,
      enquirySeq,
      openDealerEnquiry,
      openProductEnquiry,
      openVehicleEnquiry,
      closeEnquiry,
    }),
    [enquiry, enquirySeq, openDealerEnquiry, openProductEnquiry, openVehicleEnquiry, closeEnquiry],
  );

  return <ModalContext.Provider value={value}>{children}</ModalContext.Provider>;
};

// eslint-disable-next-line react-refresh/only-export-components
export const useModal = () => {
  const ctx = useContext(ModalContext);
  if (!ctx) throw new Error("useModal must be used inside ModalProvider");
  return ctx;
};
