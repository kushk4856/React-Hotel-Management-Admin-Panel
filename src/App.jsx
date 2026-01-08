import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Suspense, lazy } from "react";
import GlobalStyles from "./styles/GlobalStyles";
import AppLayout from "./ui/AppLayout";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import "react-toastify/dist/ReactToastify.css";
import ProtectedRoute from "./ui/ProtectedRoute";
import RestrictedTo from "./ui/RestrictedTo";
import { DarkModeProvider } from "./context/DarkModeContext";
import Spinner from "./ui/Spinner";
import RoleBasedRedirect from "./ui/RoleBasedRedirect";
import { ROLES, PERMISSIONS } from "./utils/constants";

// Lazy Loading Pages
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Booking = lazy(() => import("./pages/Bookings"));
const Cabins = lazy(() => import("./pages/Cabins"));
const Users = lazy(() => import("./pages/Users"));
const Settings = lazy(() => import("./pages/Settings"));
const Account = lazy(() => import("./pages/Account"));
const Reports = lazy(() => import("./pages/Reports"));
const RolesPermissions = lazy(() => import("./pages/RolesPermissions"));
const AuditLogs = lazy(() => import("./pages/AuditLogs"));
const MyRooms = lazy(() => import("./pages/MyRooms"));
const HousekeepingModule = lazy(() => import("./pages/HousekeepingModule"));
const RoomDetails = lazy(() => import("./pages/RoomDetails"));
const Maintenance = lazy(() => import("./pages/Maintenance"));
const ShiftNotes = lazy(() => import("./pages/ShiftNotes"));
const Login = lazy(() => import("./pages/Login"));
const PageNotFound = lazy(() => import("./pages/PageNotFound"));
const BookingDetailPage = lazy(() => import("./pages/BookingDetailPage"));
const Checkin = lazy(() => import("./pages/Checkin"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 0,
    },
  },
});

const App = () => {
  return (
    <DarkModeProvider>
      <QueryClientProvider client={queryClient}>
        <ReactQueryDevtools />

        <GlobalStyles />
        <BrowserRouter>
          <Suspense fallback={<Spinner />}>
            <Routes>
              <Route
                element={
                  <ProtectedRoute>
                    <AppLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<RoleBasedRedirect />} />
                
                <Route 
                  path="dashboard" 
                  element={
                    <RestrictedTo allowedRole={[ROLES.ADMIN, ROLES.MANAGER]}>
                      <Dashboard />
                    </RestrictedTo>
                  } 
                />
                <Route 
                  path="bookings" 
                  element={
                    <RestrictedTo allowedRole={[ROLES.ADMIN, ROLES.MANAGER, ROLES.RECEPTIONIST]}>
                      <Booking />
                    </RestrictedTo>
                  } 
                />
                <Route
                  path="bookings/:bookingId"
                  element={
                    <RestrictedTo allowedRole={[ROLES.ADMIN, ROLES.MANAGER, ROLES.RECEPTIONIST]}>
                      <BookingDetailPage />
                    </RestrictedTo>
                  }
                />
                <Route 
                   path="checkin/:bookingId" 
                   element={
                    <RestrictedTo allowedRole={[ROLES.ADMIN, ROLES.MANAGER, ROLES.RECEPTIONIST]}>
                       <Checkin />
                    </RestrictedTo>
                   } 
                />
                
                <Route
                  path="users"
                  element={
                    <RestrictedTo allowedRole={ROLES.ADMIN}>
                      <Users />
                    </RestrictedTo>
                  }
                />
                 {/* Admin Only Routes */}
                <Route 
                  path="roles" 
                  element={
                    <RestrictedTo allowedRole={ROLES.ADMIN}>
                      <RolesPermissions />
                    </RestrictedTo>
                  } 
                />
                <Route 
                  path="audit-logs" 
                  element={
                    <RestrictedTo requiredPermission={PERMISSIONS.AUDIT_READ}>
                      <AuditLogs />
                    </RestrictedTo>
                  } 
                />

                <Route 
                  path="cabins" 
                  element={
                    <RestrictedTo allowedRole={[ROLES.ADMIN, ROLES.MANAGER]}>
                      <Cabins />
                    </RestrictedTo>
                  } 
                />
                <Route 
                  path="settings" 
                  element={
                    <RestrictedTo allowedRole={ROLES.ADMIN}>
                      <Settings />
                    </RestrictedTo>
                  } 
                />
                <Route 
                   path="reports" 
                   element={
                    <RestrictedTo allowedRole={[ROLES.ADMIN, ROLES.MANAGER]}>
                      <Reports />
                    </RestrictedTo>
                   } 
                />
                
                {/* Housekeeping Routes - Accessible to all (or specific roles) */}
                {/* Manager/Admin can view. Housekeeping works here. */}
                <Route path="housekeeping" element={<HousekeepingModule />} />
                <Route path="housekeeping/room/:taskId" element={<RoomDetails />} />
                <Route path="my-rooms" element={<MyRooms />} />
                <Route path="maintenance" element={<Maintenance />} />
                <Route path="shift-notes" element={<ShiftNotes />} />

                {/* Account is generic */}
                <Route path="account" element={<Account />} />
              </Route>
              <Route path="login" element={<Login />} />
              <Route path="*" element={<PageNotFound />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </QueryClientProvider>
    </DarkModeProvider>
  );
};

export default App;
