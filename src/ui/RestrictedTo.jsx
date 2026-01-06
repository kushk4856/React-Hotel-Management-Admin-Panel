import { useUser } from "../features/authentication/useUser";
import { Navigate } from "react-router-dom";
import Spinner from "./Spinner";

/* eslint-disable react/prop-types */
function RestrictedTo({ allowedRole, children }) {
  const { role, isLoading } = useUser();

  if (isLoading) return <Spinner />;

  // If role matches, give access
  // Support both String ("admin") and Array (["admin", "manager"])
  const isAllowed = Array.isArray(allowedRole) 
    ? allowedRole.includes(role) 
    : role === allowedRole;

  if (isAllowed) return children;

  // Otherwise, redirect to dashboard
  return <Navigate to="/dashboard" replace />;
}

export default RestrictedTo;
