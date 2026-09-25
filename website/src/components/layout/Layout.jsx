import { Outlet } from "react-router";
import Navbar from "../Navbar";
import Footer from "../Footer";
import SeoManager from "../../seo/SeoManager";
import EnquiryModal from "../EnquiryModal";
import { useModal } from "../../context/ModalContext";

// Layout — wraps every public page with Navbar + main + Footer.
// A single `pt-` on <main> clears the fixed 3-row navbar height (~164px desktop,
// ~104px mobile). Pages below should NOT add their own top padding for the
// navbar — they only add internal section padding.
//
// Navbar height (approx):
//   Row 1:  40px  (thin centered message)
//   Row 2:  64-80px (main nav)
//   Row 3:  44px  (sub-nav — desktop only)
//   ─────────────
//   Desktop: ~164px
//   Mobile:  ~104px (Row 3 hidden)

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

      {/* Single source of truth for "start below the fixed navbar" */}
      <main className="flex flex-col pt-[104px] lg:pt-[164px]">
        <Outlet />
      </main>

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
