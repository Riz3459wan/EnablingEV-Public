import { Outlet } from "react-router";
import Navbar from "../Navbar";
import Footer from "../Footer";
import SeoManager from "../../seo/SeoManager";
import EnquiryModal from "../EnquiryModal";
import { useModal } from "../../context/ModalContext";

const Layout = () => {
  const {
    enquiry,
    enquirySeq,
    openDealerEnquiry,
    openProductEnquiry,
    closeEnquiry,
  } = useModal();

  return (
    <div className="min-h-screen bg-background text-white selection:bg-primary selection:text-background font-sans antialiased overflow-x-hidden">
      <SeoManager />
      <Navbar onOpenDealer={openDealerEnquiry} />

      <main className="flex flex-col">
        <Outlet />
      </main>

      {/* Footer no longer takes props — CTAs route to /DealerForm directly */}
      <Footer />

      <EnquiryModal
        key={enquirySeq}
        isOpen={enquiry.open}
        onClose={closeEnquiry}
        type={enquiry.type}
        presetVehicle={enquiry.vehicle}
      />
    </div>
  );
};

export default Layout;
