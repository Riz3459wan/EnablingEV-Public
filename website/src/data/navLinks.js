// Public marketing site links (shown to logged-out visitors)
export const publicLinks = [
  { label: "Home", to: "/" },
  { label: "About", to: "/about" },
  { label: "Vehicles", to: "/product" },
  { label: "Mission", to: "/mission" },
  { label: "Gallery", to: "/gallery" },
  { label: "Contact", to: "/contact" },
];

// Portal links, one set per role (shown after login instead of the public links).
// Keep every `to` here in sync with the `allow` list of its route in AppRoutes.jsx,
// otherwise the link will bounce the user back to the login page.
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
    { label: "Download Certificate", to: "/document" },
  ],
};

export default publicLinks;
