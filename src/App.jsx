import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
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

// Lazy Loading Pages
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Booking = lazy(() => import("./pages/Bookings"));
const Cabins = lazy(() => import("./pages/Cabins"));
const Users = lazy(() => import("./pages/Users"));
const Settings = lazy(() => import("./pages/Settings"));
const Account = lazy(() => import("./pages/Account"));
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
                <Route index element={<Navigate replace to="dashboard" />} />
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="bookings" element={<Booking />} />
                <Route
                  path="bookings/:bookingId"
                  element={<BookingDetailPage />}
                />
                <Route path="checkin/:bookingId" element={<Checkin />} />
                <Route
                  path="users"
                  element={
                    <RestrictedTo allowedRole="admin">
                      <Users />
                    </RestrictedTo>
                  }
                />
                <Route path="cabins" element={<Cabins />} />
                <Route path="settings" element={<Settings />} />
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
