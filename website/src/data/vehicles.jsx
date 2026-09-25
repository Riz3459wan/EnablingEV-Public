import { Users, Gauge } from "lucide-react";

const vehicles = [
  {
    id: "01",
    title: "Electric Passenger",
    category: "PASSENGER MOBILITY",
    desc: "Comfortable daily movement for shared and urban routes.",
    icon: (
      <div className="w-12 h-12 rounded-xl bg-surface border border-line flex items-center justify-center">
        <Users size={22} className="text-accent" />
      </div>
    ),
  },
  {
    id: "02",
    title: "Electric Cargo",
    category: "COMMERCIAL MOBILITY",
    desc: "Practical load movement for growing local businesses.",
    icon: (
      <div className="w-12 h-12 rounded-xl bg-surface border border-line flex items-center justify-center">
        <Gauge size={22} className="text-accent" />
      </div>
    ),
  },
];

export default vehicles;
