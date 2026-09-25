import api from "../api/client";
import { CHASSIS_PREFIX } from "../features/quotation/constants";

// Single source of truth for "does this chassis actually exist" — merges
// two tables the backend already has:
//   /VehicleTable    - sub-admin-registered inventory (VehicleInfo.jsx only
//                       ever writes the rikshaw prefix, so this table never
//                       has cargo/loader entries)
//   /QuotationTable  - chassis numbers generated at quotation time, covers
//                       both vehicle types, and is the only record of cargo
//                       chassis at all
// A plain "search VehicleTable" would silently break cargo lookups (zero
// results, always), so both are queried and de-duplicated by chassis
// number. Optionally scoped to one dealer (dealerNameDealerCode /
// dealerCode) for the dealer-facing form.
export async function fetchKnownChassis({ vehicleType, dealerCode } = {}) {
  const prefix = CHASSIS_PREFIX[vehicleType === "cargo" ? "cargo" : "rikshaw"];
  const quoteParams = dealerCode ? { dealerCode } : undefined;

  const [vehiclesRes, quotesRes] = await Promise.allSettled([
    api.get("/VehicleTable"),
    api.get(
      "/QuotationTable",
      quoteParams ? { params: quoteParams } : undefined,
    ),
  ]);

  const vehicles =
    vehiclesRes.status === "fulfilled" && Array.isArray(vehiclesRes.value.data)
      ? vehiclesRes.value.data
      : [];
  const quotes =
    quotesRes.status === "fulfilled" && Array.isArray(quotesRes.value.data)
      ? quotesRes.value.data
      : [];

  const scopedVehicles = dealerCode
    ? vehicles.filter((v) => v.dealerNameDealerCode === dealerCode)
    : vehicles;

  const seen = new Set();
  [...scopedVehicles, ...quotes].forEach((item) => {
    const chassis = item.chassisNumber;
    if (chassis && chassis.startsWith(prefix)) seen.add(chassis);
  });

  return [...seen].sort();
}
