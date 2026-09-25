import { Routes, Route } from "react-router";
import { lazy, Suspense } from "react";
import Layout from "../components/layout/Layout";
import ComingSoon from "../components/layout/ComingSoon";
import ErrorBoundary from "../components/ui/ErrorBoundary";
import ProtectedRoute from "../auth/ProtectedRoute";

const Home = lazy(() => import("../pages/public/Home"));
const About = lazy(() => import("../pages/public/About"));
const Mission = lazy(() => import("../pages/public/Mission"));
const Gallery = lazy(() => import("../pages/public/Gallery"));
const Product = lazy(() => import("../pages/public/Product"));
const Contact = lazy(() => import("../pages/public/Contact"));
const DealerForm = lazy(() => import("../pages/forms/DealerForm"));
const CustomerForm = lazy(() => import("../pages/forms/CustomerForm"));
const VehicleInfo = lazy(() => import("../pages/subadmin/VehicleInfo"));
const Document = lazy(() => import("../pages/forms/Document"));
const Form22 = lazy(() => import("../pages/forms/Form22"));
const SubAdminLogin = lazy(() => import("../pages/auth/SubAdminLogin"));
const DealerLogin = lazy(() => import("../pages/auth/DealerLogin"));
const DealerActivate = lazy(() => import("../pages/auth/DealerActivate"));
const DealerStatus = lazy(() => import("../pages/auth/DealerStatus"));
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

const PageFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-ink">
    <div className="w-8 h-8 border-2 border-white/10 border-t-primary rounded-full animate-spin" />
  </div>
);

const AppRoutes = () => {
  return (
    <Suspense fallback={<PageFallback />}>
      <Routes>
        {/* ═══ Auth pages — standalone, no Navbar/Footer ═══════════ */}
        <Route path="/subAdminLogin" element={<SubAdminLogin />} />
        <Route path="/dealerLogin" element={<DealerLogin />} />
        <Route path="/dealerActivate" element={<DealerActivate />} />
        <Route path="/dealerStatus" element={<DealerStatus />} />

        {/* ═══ Public pages — with Navbar + Footer ════════════════ */}
        <Route element={<Layout />}>
          {/* Public marketing pages */}
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/product" element={<Product />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/mission" element={<Mission />} />

          {/* Public forms (no auth) */}
          <Route path="/DealerForm" element={<DealerForm />} />
          <Route path="/customerForm" element={<CustomerForm />} />
          <Route path="/form_22" element={<Form22 />} />
          <Route path="/document" element={<Document />} />

          {/* Dealer (protected) */}
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
            path="/dealerInfo"
            element={
              <ProtectedRoute allow={["subadmin"]}>
                <DealerInfo />
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
          <Route
            path="/displayVehicleInfo"
            element={
              <ProtectedRoute allow={["dealer", "subadmin"]}>
                <DisplayVehicleInfo />
              </ProtectedRoute>
            }
          />

          {/* Sub Admin (protected) */}
          <Route
            path="/VehicleInfo"
            element={
              <ProtectedRoute allow={["subadmin"]}>
                <VehicleInfo />
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
            path="/subAdminInfo"
            element={
              <ProtectedRoute allow={["subadmin"]}>
                <SubAdminInfo />
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

          <Route path="*" element={<ComingSoon title="Page not found" />} />
        </Route>
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
