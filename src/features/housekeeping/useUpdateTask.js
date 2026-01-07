import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { updateTaskStatus } from "../../services/apiHousekeeping";

export function useUpdateTask() {
  const queryClient = useQueryClient();

  const { mutate: updateTask, isLoading: isUpdating } = useMutation({
    mutationFn: (args) => updateTaskStatus(args),
    onSuccess: () => {
      toast.success("Task status updated");
      queryClient.invalidateQueries({ queryKey: ["housekeeping"] });
    },
    onError: (err) => toast.error(err.message),
  });

  return { updateTask, isUpdating };
}
