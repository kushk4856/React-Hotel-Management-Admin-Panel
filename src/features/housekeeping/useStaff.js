import { useQuery } from "@tanstack/react-query";
import { getStaff } from "../../services/apiStaff";

export function useStaff() {
  const {
    isLoading,
    data: staff,
    error,
  } = useQuery({
    queryKey: ["staff"],
    queryFn: getStaff,
  });

  return { isLoading, staff, error };
}
