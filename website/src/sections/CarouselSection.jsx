import { memo } from "react";
import Carousel from "../components/Carousel";
import r1 from "../assets/gallery/Rikshaw1.webp";
import r3 from "../assets/gallery/Rikshaw3.webp";
import r4 from "../assets/gallery/Rikshaw4.webp";
import r5 from "../assets/gallery/Rikshaw5.webp";
import r6 from "../assets/gallery/Rikshaw6.webp";

const slides = [
  {
    src: r4,
    alt: "JhatPat Jio electric rickshaw on the road",
    caption: {
      eyebrow: "On the road",
      title: "Every route, reimagined.",
    },
  },
  {
    src: r1,
    alt: "EnablingEV electric rickshaw",
    caption: {
      eyebrow: "The JhatPat Jio",
      title: "Built for the everyday.",
    },
  },
  {
    src: r5,
    alt: "Electric rickshaw fleet",
    caption: {
      eyebrow: "Fleet scale",
      title: "One decision. Many journeys.",
    },
  },
  {
    src: r3,
    alt: "JhatPat Jio in service",
    caption: {
      eyebrow: "In service",
      title: "Dependability, proven daily.",
    },
  },
  {
    src: r6,
    alt: "EnablingEV vehicle showcase",
    caption: {
      eyebrow: "Crafted",
      title: "Purpose in every detail.",
    },
  },
];

// Full-bleed cinematic strip — sits flush under the navbar, above the hero.
// No max-width: it belongs to the atmosphere, not the content column.
const CarouselSection = memo(() => (
  <section className="w-full pt-24 sm:pt-28">
    <Carousel slides={slides} />
  </section>
));

export default CarouselSection;
