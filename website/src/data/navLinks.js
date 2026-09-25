// Public marketing site links (shown to logged-out visitors)
// Structure mirrors Range Rover: no "Home" (logo acts as home), no "Mission"
// (old-school marketing term — replaced by editorial About/Gallery pages).
export const publicLinks = [
  { label: "Models", to: "/product" },
  { label: "About", to: "/about" },
  { label: "Gallery", to: "/gallery" },
  { label: "Contact", to: "/contact" },
];

// Top utility bar — small links (Range Rover's "VEHICLES / OWNERS / EXPLORE / SHOP NOW")
export const utilityLinks = [
  { label: "Vehicles", to: "/product" },
  { label: "Dealers", to: "/DealerForm" },
  { label: "Support", to: "/contact" },
  { label: "Shop Now", to: "/product" },
];

export const roleLinks = {
  subadmin: [
    { label: "Dashboard", to: "/subAdminDash" },
    { label: "Add Vehicle", to: "/VehicleInfo" },
    { label: "Vehicles", to: "/displayVehicleInfo" },
    { label: "Dealers", to: "/dealerInfo" },
    { label: "Sub Admins", to: "/subAdminInfo" },
    { label: "Quotation", to: "/createQuotation" },
  ],
  dealer: [
    { label: "Dashboard", to: "/dealerDash" },
    { label: "Add Customer", to: "/customerForm" },
    { label: "My Customers", to: "/dealerCustomerInfo" },
    { label: "Vehicles", to: "/displayVehicleInfo" },
    { label: "Quotation", to: "/createQuotation" },
    { label: "Certificate", to: "/document" },
  ],
};

export default publicLinks;
