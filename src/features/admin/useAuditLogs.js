import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getAuditLogs } from "../../services/apiAdmin";
import { useSearchParams } from "react-router-dom";
import { PAGE_SIZE } from "../../utils/constants";
import { useEffect } from "react";
import supabase from "../../services/supabase";

export function useAuditLogs() {
  const [searchParams] = useSearchParams();
  const queryClient = useQueryClient();
  const page = !searchParams.get("page") ? 1 : Number(searchParams.get("page"));

  const {
    isLoading,
    data: { data: logs, count } = {},
    error,
  } = useQuery({
    queryKey: ["auditLogs", page],
    queryFn: () => getAuditLogs({ page }),
  });

  // Prefetching
  const pageCount = Math.ceil(count / PAGE_SIZE);
  if (page < pageCount)
    queryClient.prefetchQuery({
      queryKey: ["auditLogs", page + 1],
      queryFn: () => getAuditLogs({ page: page + 1 }),
    });

  if (page > 1)
    queryClient.prefetchQuery({
      queryKey: ["auditLogs", page - 1],
      queryFn: () => getAuditLogs({ page: page - 1 }),
    });

  // Realtime Subscription
  useEffect(() => {
    const channel = supabase
    .channel("audit_logs_realtime")
    .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "audit_logs" },
        () => {
            queryClient.invalidateQueries({ queryKey: ["auditLogs"] });
        }
    )
    .subscribe();

    return () => {
        supabase.removeChannel(channel);
    };
  }, [queryClient]);

  return { isLoading, logs, count, error };
}
