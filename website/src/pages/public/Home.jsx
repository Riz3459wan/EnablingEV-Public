import Hero from "../../sections/Hero";
import EditorialIntro from "../../sections/EditorialIntro";
import VehiclesShowcase from "../../sections/VehiclesShowcase";
import MissionSection from "../../sections/MissionSection";
import GalleryStrip from "../../sections/GalleryStrip";
import DealerCTA from "../../sections/DealerCTA";
import { useModal } from "../../context/ModalContext";
import scrollToId from "../../utils/scrollToId";

const Home = () => {
  const { openVehicleEnquiry } = useModal();

  return (
    <div className="bg-background text-white">
      <Hero onExplore={() => scrollToId("vehicles")} />
      <EditorialIntro />
      <VehiclesShowcase />
      <MissionSection />
      <GalleryStrip />
      <DealerCTA />
    </div>
  );
};

export default Home;
