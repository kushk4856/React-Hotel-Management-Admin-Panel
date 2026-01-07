import { Navigate } from "react-router-dom";
import { useUser } from "../features/authentication/useUser";
import Spinner from "./Spinner";

/**
 * Intelligent Redirect Component
 * Redirects the user to their appropriate landing page based on role.
 */
function RoleBasedRedirect() {
  const { role, isLoading } = useUser();

  if (isLoading) return <Spinner />;

  // Strategy Pattern for Redirects
  const redirectMap = {
    admin: "/dashboard",
    manager: "/dashboard",
    receptionist: "/bookings",  
    housekeeping: "/housekeeping", 
  };

  const targetPath = redirectMap[role] || "/dashboard";

  return <Navigate replace to={targetPath} />;
}

export default RoleBasedRedirect;
