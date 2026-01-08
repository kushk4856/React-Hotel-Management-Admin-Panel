/* eslint-disable react/prop-types */
import { useUser } from "../features/authentication/useUser";
import Spinner from "./Spinner";
import RoleBasedRedirect from "./RoleBasedRedirect";

function RestrictedTo({ allowedRole, requiredPermission, children }) {
  const { role, permissions, isLoading } = useUser();

  if (isLoading) return <Spinner />;

  // 1. Check if allowedRole matches the user's role
  let isAllowed = true;
  if (allowedRole) {
     isAllowed = Array.isArray(allowedRole) 
      ? allowedRole.includes(role) 
      : role === allowedRole;
  }

  // 2. Check Permission (Strict Check if requiredPermission is present)
  if (requiredPermission && isAllowed) {
      // Admins usually have implied access, but let's stick to explicit if permission requested?
      // Or auto-grant for admin? 
      // For now, explicit check. (Assuming Admin HAS 'audit.read' assigned in DB)
      isAllowed = permissions?.includes(requiredPermission);
  }

  // 3. If allowed, render children
  if (isAllowed) return children;

  // 4. If restricted, redirect to their safe home page
  return <RoleBasedRedirect />;
}

export default RestrictedTo;
