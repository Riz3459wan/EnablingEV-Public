import f2ss1 from "../assets/products/F2SS1.webp";
import f2ss2 from "../assets/products/F2SS2.webp";
import f2ss3 from "../assets/products/F2SS3.webp";
import f2ss4 from "../assets/products/F2SS4.webp";
import ms1 from "../assets/products/MS1.webp";
import ms2 from "../assets/products/MS2.webp";
import ms3 from "../assets/products/MS3.webp";
import ms4 from "../assets/products/MS4.webp";

export const colorMap = {
  red: "#e53935",
  blue: "#1976d2",
  skyblue: "#4fc3f7",
  grey: "#757575",
  green: "#43a047",
};

const products = [
  {
    name: "JHATPAT F2 SS",
    images: [f2ss1, f2ss2, f2ss3, f2ss4],
    features: [
      "Iron Body",
      "CY Body Differential Big System 33''",
      "Better Paint Quality",
      "Motor - 12 Months Warranty",
      "Premium Controller 12 month warranty",
      "Wiring 12 mm - fire proof, joint less",
      "Digital Meter",
      "Paints Types - ED Paints Triple Coating",
      "Shocker - Heavy Duty:43''",
      "Iron Roof",
      "LED Indicator Light",
      "Foldable & Adjustable Backrest",
    ],
    batteryOptions: ["135AH", "145AH", "150AH", "160AH"],
    colors: [
      { label: "RED", value: "red" },
      { label: "BLUE", value: "blue" },
      { label: "SKY BLUE", value: "skyblue" },
      { label: "GREY", value: "grey" },
      { label: "GREEN", value: "green" },
    ],
    accessories: [
      "Jack",
      "ToolKit",
      "Stepney Cover",
      "Fire Stop",
      "Side Stop",
      "Wheel Cap",
      "Cabin Light & Fan",
      "FM Music System",
      "Fog Lamp",
      "Luggage Carrier",
    ],
  },
  {
    name: "JHATPAT FINE MS",
    images: [ms1, ms2, ms3, ms4],
    features: [
      "Steel Body",
      "Heavy Duty Differential",
      "Premium Paint Finish",
      "Motor - 18 Months Warranty",
      "Advanced Controller 18 month warranty",
      "Fireproof Wiring",
      "Digital Dashboard",
      "ED Paints Double Coating",
      "Heavy Duty Shocker",
      "Steel Roof",
      "LED Headlights",
      "Luxury Seats",
    ],
    batteryOptions: ["135AH", "145AH", "150AH", "160AH"],
    colors: [
      { label: "BLACK", value: "grey" },
      { label: "WHITE", value: "skyblue" },
      { label: "RED", value: "red" },
    ],
    accessories: [
      "Jack",
      "ToolKit",
      "Stepney Cover",
      "Fire Stop",
      "Side Stop",
      "Wheel Cap",
      "Cabin Light & Fan",
      "Bluetooth Music System",
      "Fog Lamp",
      "Roof Carrier",
    ],
  },
];

export default products;
