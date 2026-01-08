import { useQuery } from "@tanstack/react-query";
import { getRoles } from "../../services/apiAdmin";

export function useRoles() {
  const {
    isLoading,
    data: roles,
    error,
  } = useQuery({
    queryKey: ["roles"],
    queryFn: getRoles,
  });

  return { isLoading, roles, error };
}
