// Single source of truth for per-page SEO. Used by:
//   - vite-plugins/seo-static.js  -> static <head> per route, sitemap.xml, robots.txt
//   - seo/SeoManager.jsx          -> keeps <head> correct while navigating client-side
// Plain ESM with no imports from React/Vite so Node can load it at build time.

export const DEFAULT_SITE_URL = "https://enablingev.com";
export const OG_IMAGE = "/og-image.png";
export const OG_IMAGE_ALT =
  "EnablingEV — electric rickshaws and cargo vehicles by Enabling E-Vehicle Pvt. Ltd.";

// Titles <= 60 chars, descriptions <= 160 chars (checked by the build).
export const PUBLIC_ROUTES = [
  {
    path: "/",
    title: "Enabling E-Vehicle – Electric Rickshaws & Cargo Vehicles",
    description:
      "Enabling E-Vehicle Pvt. Ltd. builds JhatPat Jio electric rickshaws and cargo loaders for Indian roads. Explore the range or become a dealer.",
    changefreq: "weekly",
    priority: "1.0",
  },
  {
    path: "/about",
    title: "About Us | Enabling E-Vehicle Pvt. Ltd.",
    description:
      "Learn about Enabling E-Vehicle Pvt. Ltd., the company behind the JhatPat Jio electric rickshaw, and our commitment to eco-friendly urban mobility.",
    changefreq: "monthly",
    priority: "0.8",
  },
  {
    path: "/mission",
    title: "Our Mission | Enabling E-Vehicle Pvt. Ltd.",
    description:
      "Practical electric vehicles for the people who keep India moving: dependable engineering, economical ownership and support that lasts beyond the sale.",
    changefreq: "monthly",
    priority: "0.6",
  },
  {
    path: "/product",
    title: "Electric Rickshaw & Cargo Loader Models | EnablingEV",
    description:
      "Explore the electric rickshaw and cargo loader range from Enabling E-Vehicle Pvt. Ltd. — models, colours, features and accessories.",
    changefreq: "monthly",
    priority: "0.9",
  },
  {
    path: "/gallery",
    title: "Gallery | Enabling E-Vehicle Pvt. Ltd.",
    description:
      "Photos and videos of JhatPat Jio electric rickshaws and moments from the road, from Enabling E-Vehicle Pvt. Ltd.",
    changefreq: "monthly",
    priority: "0.5",
  },
  {
    path: "/contact",
    title: "Contact Us | Enabling E-Vehicle Pvt. Ltd.",
    description:
      "Contact Enabling E-Vehicle Pvt. Ltd. — registered office and factory in Ghaziabad, office in Patna. Call, email or send an enquiry.",
    changefreq: "yearly",
    priority: "0.7",
  },
  {
    path: "/DealerForm",
    title: "Become a Dealer | Enabling E-Vehicle Pvt. Ltd.",
    description:
      "Apply to become an authorised Enabling E-Vehicle dealer and bring JhatPat Jio electric vehicles to your city.",
    changefreq: "monthly",
    priority: "0.8",
  },
];

// Working pages (logins, dashboards, forms). Static HTML is still generated
// for them so they get the right <title>, but they are marked noindex.
export const PRIVATE_PATHS = [
  "/customerForm",
  "/dealerStatus",
  "/dealerActivate",
  "/subAdminLogin",
  "/dealerLogin",
  "/subAdminDash",
  "/dealerDash",
  "/dealerInfo",
  "/subAdminInfo",
  "/createQuotation",
  "/dealerCustomerInfo",
  "/displayCustomerInfo",
  "/displayVehicleInfo",
  "/VehicleInfo",
  "/vehicleStatus",
  "/form_22",
  "/document",
];

const PRIVATE_TITLES = {
  "/customerForm": "Customer Registration",
  "/dealerStatus": "Dealer Application Status",
  "/dealerActivate": "Activate Dealer Account",
  "/subAdminLogin": "Sub Admin Login",
  "/dealerLogin": "Dealer Login",
  "/subAdminDash": "Sub Admin Dashboard",
  "/dealerDash": "Dealer Dashboard",
  "/dealerInfo": "Dealer Info",
  "/subAdminInfo": "Sub Admin Info",
  "/createQuotation": "Quotations",
  "/dealerCustomerInfo": "My Customers",
  "/displayCustomerInfo": "Customer Info",
  "/displayVehicleInfo": "Vehicle Info",
  "/VehicleInfo": "Add Vehicle",
  "/vehicleStatus": "Vehicle Status",
  "/form_22": "Form 22",
  "/document": "Dealer Documents",
};

export const SITE_TITLE_SUFFIX = "EnablingEV";
const PRIVATE_DESCRIPTION =
  "Enabling E-Vehicle Pvt. Ltd. portal for dealers and sub admins.";

export const NOT_FOUND_ROUTE = {
  path: null,
  title: `Page not found | ${SITE_TITLE_SUFFIX}`,
  description: PRIVATE_DESCRIPTION,
  noindex: true,
};

export const ROUTES = [
  ...PUBLIC_ROUTES.map((r) => ({ ...r, noindex: false })),
  ...PRIVATE_PATHS.map((path) => ({
    path,
    title: `${PRIVATE_TITLES[path]} | ${SITE_TITLE_SUFFIX}`,
    description: PRIVATE_DESCRIPTION,
    noindex: true,
  })),
];

// React Router matches case-insensitively and ignores a trailing slash, so do the same.
const norm = (p) => (p.length > 1 ? p.replace(/\/+$/, "") : p).toLowerCase();
const BY_PATH = new Map(ROUTES.map((r) => [norm(r.path), r]));

export const routeFor = (pathname) => BY_PATH.get(norm(pathname)) ?? NOT_FOUND_ROUTE;
