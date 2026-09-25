import { Routes, Route } from "react-router";
import { lazy, Suspense } from "react";
import Layout from "../components/layout/Layout";
import ComingSoon from "../components/layout/ComingSoon";
import ErrorBoundary from "../components/ui/ErrorBoundary";
import ProtectedRoute from "../auth/ProtectedRoute";

// Public pages
const Home = lazy(() => import("../pages/public/Home"));
const About = lazy(() => import("../pages/public/About"));
const Mission = lazy(() => import("../pages/public/Mission"));
const Gallery = lazy(() => import("../pages/public/Gallery"));
const Product = lazy(() => import("../pages/public/Product"));
const Contact = lazy(() => import("../pages/public/Contact"));

// Public forms
const DealerForm = lazy(() => import("../pages/forms/DealerForm"));

// Auth pages
const SubAdminLogin = lazy(() => import("../pages/auth/SubAdminLogin"));
const DealerLogin = lazy(() => import("../pages/auth/DealerLogin"));
const DealerActivate = lazy(() => import("../pages/auth/DealerActivate"));
const DealerStatus = lazy(() => import("../pages/auth/DealerStatus"));

// Dashboard pages
const DealerDash = lazy(() => import("../pages/dealer/DealerDash"));
const SubAdminDash = lazy(() => import("../pages/subadmin/SubAdminDash"));
const CustomerInfo = lazy(() => import("../pages/shared/CustomerInfo"));
const DisplayVehicleInfo = lazy(
  () => import("../pages/shared/DisplayVehicleInfo"),
);
const DealerInfo = lazy(() => import("../pages/shared/DealerInfo"));
const SubAdminInfo = lazy(() => import("../pages/shared/SubAdminInfo"));
const VehicleStatus = lazy(() => import("../pages/subadmin/VehicleStatus"));
const CreateQuotation = lazy(() => import("../pages/shared/CreateQuotation"));
const VehicleInfo = lazy(() => import("../pages/subadmin/VehicleInfo"));
const CustomerForm = lazy(() => import("../pages/forms/CustomerForm"));
const Form22 = lazy(() => import("../pages/forms/Form22"));
const Document = lazy(() => import("../pages/forms/Document"));

const PageFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-ink">
    <div className="w-8 h-8 border-2 border-white/10 border-t-primary rounded-full animate-spin" />
  </div>
);

const AppRoutes = () => {
  return (
    <Suspense fallback={<PageFallback />}>
      <Routes>
        {/* ═══ Auth pages — standalone ═══════════════════════════ */}
        <Route path="/subAdminLogin" element={<SubAdminLogin />} />
        <Route path="/dealerLogin" element={<DealerLogin />} />
        <Route path="/dealerActivate" element={<DealerActivate />} />
        <Route path="/dealerStatus" element={<DealerStatus />} />

        {/* ═══ Dashboard pages — standalone ═════════════════════ */}
        <Route
          path="/dealerDash"
          element={
            <ProtectedRoute allow={["dealer"]}>
              <ErrorBoundary>
                <DealerDash />
              </ErrorBoundary>
            </ProtectedRoute>
          }
        />
        <Route
          path="/subAdminDash"
          element={
            <ProtectedRoute allow={["subadmin"]}>
              <ErrorBoundary>
                <SubAdminDash />
              </ErrorBoundary>
            </ProtectedRoute>
          }
        />
        <Route
          path="/dealerInfo"
          element={
            <ProtectedRoute allow={["subadmin"]}>
              <DealerInfo />
            </ProtectedRoute>
          }
        />
        <Route
          path="/subAdminInfo"
          element={
            <ProtectedRoute allow={["subadmin"]}>
              <SubAdminInfo />
            </ProtectedRoute>
          }
        />
        <Route
          path="/createQuotation"
          element={
            <ProtectedRoute allow={["dealer", "subadmin"]}>
              <CreateQuotation />
            </ProtectedRoute>
          }
        />

        {/* ─── Dealer-only pages ─── */}
        <Route
          path="/dealerCustomerInfo"
          element={
            <ProtectedRoute allow={["dealer"]}>
              <CustomerInfo />
            </ProtectedRoute>
          }
        />
        <Route
          path="/displayCustomerInfo"
          element={
            <ProtectedRoute allow={["dealer"]}>
              <CustomerInfo />
            </ProtectedRoute>
          }
        />

        {/* ─── Sub-admin customers (all dealers) ─── */}
        <Route
          path="/allCustomers"
          element={
            <ProtectedRoute allow={["subadmin"]}>
              <CustomerInfo />
            </ProtectedRoute>
          }
        />

        <Route
          path="/displayVehicleInfo"
          element={
            <ProtectedRoute allow={["dealer", "subadmin"]}>
              <DisplayVehicleInfo />
            </ProtectedRoute>
          }
        />
        <Route
          path="/VehicleInfo"
          element={
            <ProtectedRoute allow={["subadmin"]}>
              <VehicleInfo />
            </ProtectedRoute>
          }
        />
        <Route
          path="/vehicleStatus"
          element={
            <ProtectedRoute allow={["subadmin"]}>
              <VehicleStatus />
            </ProtectedRoute>
          }
        />

        {/* ═══ Dashboard-style forms — standalone ═══════════════ */}
        <Route
          path="/customerForm"
          element={
            <ProtectedRoute allow={["dealer"]}>
              <CustomerForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/form_22"
          element={
            <ProtectedRoute allow={["dealer", "subadmin"]}>
              <Form22 />
            </ProtectedRoute>
          }
        />
        <Route
          path="/document"
          element={
            <ProtectedRoute allow={["dealer", "subadmin"]}>
              <Document />
            </ProtectedRoute>
          }
        />

        {/* ═══ Public pages — with Navbar + Footer ═════════════ */}
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/product" element={<Product />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/mission" element={<Mission />} />
          <Route path="/DealerForm" element={<DealerForm />} />

          <Route path="*" element={<ComingSoon title="Page not found" />} />
        </Route>
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
