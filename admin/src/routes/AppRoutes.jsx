import { Routes, Route } from "react-router";
import { lazy, Suspense } from "react";
import Layout from "../components/layout/Layout";
import ComingSoon from "../components/layout/ComingSoon";
import ErrorBoundary from "../components/ui/ErrorBoundary";
import ProtectedRoute from "../auth/ProtectedRoute";

// Shared
const Quotations = lazy(() => import("../pages/shared/Quotations"));
const Dispatch = lazy(() => import("../pages/shared/Dispatch"));
const DealerDetails = lazy(() => import("../pages/shared/DealerDetails"));
const AdminLogin = lazy(() => import("../pages/auth/AdminLogin"));
const AdminDash = lazy(() => import("../pages/admin/AdminDash"));
const PendingDealerRequests = lazy(
  () => import("../pages/admin/PendingDealerRequests"),
);
const CreateProfileSubAdmin = lazy(
  () => import("../pages/admin/CreateProfileSubAdmin"),
);
const CustomerInfo = lazy(() => import("../pages/shared/CustomerInfo"));
const DisplayVehicleInfo = lazy(
  () => import("../pages/shared/DisplayVehicleInfo"),
);
const DealerInfo = lazy(() => import("../pages/shared/DealerInfo"));
const SubAdminInfo = lazy(() => import("../pages/shared/SubAdminInfo"));
const Form22 = lazy(() => import("../pages/forms/Form22"));

// Reports
const VehicleReports = lazy(() => import("../pages/reports/VehicleReports"));
const CustomerReports = lazy(() => import("../pages/reports/CustomerReports"));
const DealerReports = lazy(() => import("../pages/reports/DealerReports"));

// ✅ NEW: Users + Settings
const Users = lazy(() => import("../pages/admin/Users"));
const Profile = lazy(() => import("../pages/settings/Profile"));
const Security = lazy(() => import("../pages/settings/Security"));
const Preferences = lazy(() => import("../pages/settings/Preferences"));

const PageFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-slate-50">
    <div className="w-8 h-8 border-2 border-slate-200 border-t-blue-600 rounded-full animate-spin" />
  </div>
);

const AppRoutes = () => {
  return (
    <Suspense fallback={<PageFallback />}>
      <Routes>
        <Route path="/" element={<AdminLogin />} />

        <Route
          element={
            <ProtectedRoute allow={["admin"]}>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route
            path="/adminDash"
            element={
              <ErrorBoundary>
                <AdminDash />
              </ErrorBoundary>
            }
          />
          <Route
            path="/pendingDealerRequests"
            element={<PendingDealerRequests />}
          />
          <Route
            path="/createProfileSubAdmin"
            element={<CreateProfileSubAdmin />}
          />
          <Route path="/displayCustomerInfo" element={<CustomerInfo />} />
          <Route path="/displayVehicleInfo" element={<DisplayVehicleInfo />} />
          <Route path="/dealerInfo" element={<DealerInfo />} />
          <Route path="/dealerDetails/:id" element={<DealerDetails />} />
          <Route path="/subAdminInfo" element={<SubAdminInfo />} />
          <Route path="/form_22" element={<Form22 />} />
          <Route path="/quotations" element={<Quotations />} />
          <Route path="/dispatch" element={<Dispatch />} />

          {/* Reports */}
          <Route path="/reports/vehicles" element={<VehicleReports />} />
          <Route path="/reports/customers" element={<CustomerReports />} />
          <Route path="/reports/dealers" element={<DealerReports />} />

          {/* ✅ NEW: Users + Settings */}
          <Route path="/users" element={<Users />} />
          <Route path="/settings/profile" element={<Profile />} />
          <Route path="/settings/security" element={<Security />} />
          <Route path="/settings/preferences" element={<Preferences />} />

          <Route path="*" element={<ComingSoon title="Page not found" />} />
        </Route>
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
