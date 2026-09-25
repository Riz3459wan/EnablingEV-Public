// import api from "../api/client"; // ← API commented
import { CHASSIS_PREFIX } from "../features/quotation/constants";

// ═══════════════════════════════════════════════════════════
//  MOCK CHASSIS DATA
// ═══════════════════════════════════════════════════════════
const MOCK_CHASSIS = {
  rikshaw: [
    "ME9EBCR123H268XYZ",
    "ME9EBCR012H268GHI",
    "ME9EBCR345H268JKL",
    "ME9EBCR678H268MNO",
    "ME9EBCR234H268STU",
    "ME9EBCR567H268VWX",
    "ME9EBCR901H268PQR",
    "ME9EBCR111H268BCD",
    "ME9EBCR333H268HIJ",
    "ME9EBCR555H268NOP",
  ],
  cargo: [
    "ME9EBCC456H268ABC",
    "ME9EBCC789H268DEF",
    "ME9EBCC901H268PQR",
    "ME9EBCC234H268STU",
    "ME9EBCC890H268YZA",
    "ME9EBCC222H268EFG",
    "ME9EBCC444H268KLM",
  ],
};

export async function fetchKnownChassis({ vehicleType, dealerCode } = {}) {
  const type = vehicleType === "cargo" ? "cargo" : "rikshaw";

  // ═══════════════════════════════════════════════════════════
  //  API — COMMENTED FOR MOCK
  // ═══════════════════════════════════════════════════════════
  // const prefix = CHASSIS_PREFIX[type];
  // const quoteParams = dealerCode ? { dealerCode } : undefined;
  // const [vehiclesRes, quotesRes] = await Promise.allSettled([...]);
  // ...

  // Mock: return static list after small delay
  await new Promise((r) => setTimeout(r, 300));
  return MOCK_CHASSIS[type] || [];
}
