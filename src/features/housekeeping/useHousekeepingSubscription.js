import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import supabase from "../../services/supabase";

export function useHousekeepingSubscription() {
  const queryClient = useQueryClient();

  useEffect(() => {
    const subscription = supabase
      .channel("housekeeping-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "housekeeping_tasks" },
        (payload) => {
          // Invalidate cache to trigger refetch
          queryClient.invalidateQueries(["housekeeping_tasks"]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, [queryClient]);
}
