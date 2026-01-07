import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import supabase from "../../services/supabase";

export function useMaintenanceSubscription() {
  const queryClient = useQueryClient();

  useEffect(() => {
    const subscription = supabase
      .channel("maintenance-tickets-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "maintenance_tickets" },
        (payload) => {
          // Invalidate cache to trigger refetch
          queryClient.invalidateQueries(["maintenance_tickets"]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, [queryClient]);
}
