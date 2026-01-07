import { useQuery } from "@tanstack/react-query";
import { getHousekeepingTasks } from "../../services/apiHousekeeping";

export function useHousekeepingTasks() {
  const {
    isLoading,
    data: tasks,
    error,
  } = useQuery({
    queryKey: ["housekeeping"],
    queryFn: getHousekeepingTasks,
  });

  return { isLoading, tasks, error };
}
