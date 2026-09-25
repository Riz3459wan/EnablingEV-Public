import axios from "axios";
import Cookies from "js-cookie";
import { ROLE_LOGIN } from "../auth/roleConfig";

// Single source of truth for API base URL (old app duplicated this in 15+ files)
const BASE_URL = import.meta.env.PROD
  ? "https://api.enablingev.com"
  : "http://localhost:5001";

const api = axios.create({
  baseURL: BASE_URL,
});

// Attach auth token automatically instead of every call doing it manually
api.interceptors.request.use((config) => {
  const token = Cookies.get("authToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Endpoints where a 401 means "wrong credentials / bad code", NOT "your session
// expired". The page itself shows the error message, so we must not redirect.
const AUTH_ENDPOINTS = [
  "/admin/login",
  "/CreateProfile/login",
  "/dealer/login",
  "/dealer/activate",
];

const isAuthEndpoint = (url) => {
  const path = String(url || "").split("?")[0].replace(/\/+$/, "");
  return AUTH_ENDPOINTS.some((endpoint) => path.endsWith(endpoint));
};

// Central 401 handling -> bounce to the right login instead of silently
// failing per-page. Only acts when there actually was a logged-in session
// (token cookie or stored role) and the request wasn't a login/activation
// attempt. Without those guards a wrong password (or a 401 from a public
// form) would clear storage and hard-redirect away, and the page's own
// "Invalid credentials" message would never be shown.
// Clearing storage alone isn't enough: AuthContext's in-memory session state
// doesn't know a 401 happened (this interceptor runs outside React), so we do a
// full navigation to force AuthContext to re-read a clean (logged-out) session.
api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401 && !isAuthEndpoint(error.config?.url)) {
      const role = localStorage.getItem("authRole");
      const hadSession = !!(Cookies.get("authToken") || role);

      if (hadSession) {
        Cookies.remove("authToken");
        localStorage.removeItem("authRole");
        localStorage.removeItem("dealerInfo");
        localStorage.removeItem("CreateProfile");

        const loginPath = ROLE_LOGIN[role] || "/";
        if (window.location.pathname !== loginPath) {
          window.location.assign(loginPath);
        }
      }
    }
    return Promise.reject(error);
  },
);

export default api;
