/* eslint-disable react/prop-types */
import { useUser } from "../features/authentication/useUser";
import Spinner from "./Spinner";
import RoleBasedRedirect from "./RoleBasedRedirect";

function RestrictedTo({ allowedRole, children }) {
  const { role, isLoading } = useUser();

  if (isLoading) return <Spinner />;

  // 1. Check if allowedRole matches the user's role
  // Support both String ("admin") and Array (["admin", "manager"])
  const isAllowed = Array.isArray(allowedRole) 
    ? allowedRole.includes(role) 
    : role === allowedRole;

  // 2. If allowed, render children
  if (isAllowed) return children;

  // 3. If restricted, redirect to their safe home page
  return <RoleBasedRedirect />;
}

export default RestrictedTo;
