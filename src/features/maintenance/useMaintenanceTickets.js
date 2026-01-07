import { useQuery } from "@tanstack/react-query";
import { getMaintenanceTickets } from "../../services/apiMaintenance";

export function useMaintenanceTickets() {
  const { isLoading, data: tickets, error } = useQuery({
    queryKey: ["maintenance_tickets"],
    queryFn: getMaintenanceTickets,
  });

  return { isLoading, error, tickets };
}
