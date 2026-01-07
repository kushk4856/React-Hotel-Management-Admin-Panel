import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { createHousekeepingTask } from "../../services/apiHousekeeping";

export function useCreateTask() {
  const queryClient = useQueryClient();

  const { mutate: createTask, isLoading: isCreating } = useMutation({
    mutationFn: createHousekeepingTask,
    onSuccess: () => {
      toast.success("New task successfully created");
      queryClient.invalidateQueries({ queryKey: ["housekeeping_tasks"] });
    },
    onError: (err) => toast.error(err.message),
  });

  return { createTask, isCreating };
}
