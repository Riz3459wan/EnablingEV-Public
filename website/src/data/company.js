// Single source of truth for company contact details, offices and social
// links (used by the Footer, Contact page and Gallery page).

export const COMPANY_NAME = "Enabling E-Vehicle Private Limited";
export const BRAND_NAME = "EnablingEV";

export const PHONES = [
  { display: "+91 9334616939", href: "tel:+919334616939" },
  { display: "+91 9911713590", href: "tel:+919911713590" },
];

export const EMAIL = "enablingev@gmail.com";

export const OFFICES = [
  {
    coords: [28.6692, 77.4538],
    label: "Registered Office",
    address: "10A/21, Vasundhara, Ghaziabad, Uttar Pradesh (201012)",
    // structured form of the same address (used for search-engine schema)
    street: "10A/21, Vasundhara",
    city: "Ghaziabad",
    region: "Uttar Pradesh",
    postalCode: "201012",
  },
  {
    coords: [28.6762, 77.4126],
    label: "Factory",
    address:
      "3/1/11, Site 4, Sahibabad Industrial Area, Ghaziabad, Uttar Pradesh (201012)",
    street: "3/1/11, Site 4, Sahibabad Industrial Area",
    city: "Ghaziabad",
    region: "Uttar Pradesh",
    postalCode: "201012",
  },
  {
    coords: [25.611, 85.104],
    label: "Bihar Office",
    address:
      "Alam Plaza, Opposite Bharat Petrol Pump, Beside St. Xavier's College Gate no. 2, Digha Ashiana Road, Patna, Bihar (800011)",
    street:
      "Alam Plaza, Opposite Bharat Petrol Pump, Beside St. Xavier's College Gate no. 2, Digha Ashiana Road",
    city: "Patna",
    region: "Bihar",
    postalCode: "800011",
  },
];

// `name` picks the icon in components/ui/SocialIcons.jsx
export const SOCIALS = [
  {
    name: "facebook",
    label: "Facebook",
    href: "https://www.facebook.com/share/171BKSxw9w/",
  },
  { name: "x", label: "X (Twitter)", href: "https://x.com/enablingEV" },
  {
    name: "instagram",
    label: "Instagram",
    href: "https://www.instagram.com/jhatpatjio/",
  },
  {
    name: "youtube",
    label: "YouTube",
    href: "https://youtube.com/@enablingev?si=pX6iAwoFkHfv2LkR",
  },
];
