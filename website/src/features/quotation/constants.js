// Business constants copied from the old createQuotation.jsx.

export const CHASSIS_PREFIX = { cargo: "ME9EBCC", rikshaw: "ME9EBCR" };
export const CHASSIS_FIXED_MID = "H268";
export const CHASSIS_PART_LENGTH = 3;

// Models whose body type is picked automatically (always "MS").
export const MODEL_BODYTYPE_DEFAULT_MS = ["F1", "T1"];

// Which body types each model may use. Models not listed can use any.
export const MODEL_BODYTYPE_MAP = {
  F1: ["MS"],
  T1: ["MS"],
  F3: ["MS"],
  LODER: ["NR", "DS"],
  F2: ["MS", "SS"],
  F4: ["MS", "SS"],
  FINE: ["MS", "SS"],
  DELUX: ["MS", "SS"],
};

export const STATUS = {
  ASSEMBLING: "Under Assembling",
  BILLING: "Under Billing",
  DISPATCHED: "Dispatched",
};

// Prices are GST-inclusive; GST is split evenly into CGST + SGST.
export const GST_RATE = 0.05;

export const chassisPrefixFor = (vehicleType) =>
  vehicleType === "cargo" ? CHASSIS_PREFIX.cargo : CHASSIS_PREFIX.rikshaw;

export const brandFor = (vehicleType) =>
  vehicleType === "cargo" ? "Halchal" : "Jhat Pat Jio";

export const vehicleTypeLabel = (vehicleType) =>
  vehicleType === "cargo" ? "Cargo / Loader" : "Rikshaw";

const BADGE = {
  "under assembling": "bg-yellow-500/10 text-yellow-400 border-yellow-500/30",
  "under billing": "bg-sky-500/10 text-sky-400 border-sky-500/30",
  dispatched: "bg-accent/10 text-accent border-accent/30",
  approved: "bg-purple-500/10 text-purple-400 border-purple-500/30",
};

export const statusBadgeClass = (status) =>
  BADGE[(status || "Pending").toLowerCase()] ||
  "bg-white/5 text-muted-foreground border-white/10";
