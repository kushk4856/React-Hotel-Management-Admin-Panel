import { useQuery } from "@tanstack/react-query";
import { getRoles } from "../../services/apiAuth";

export function useRoles() {
  const { isLoading, data: roles } = useQuery({
    queryKey: ["roles"],
    queryFn: getRoles,
  });

  return { isLoading, roles };
}
