import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import supabase from "../../services/supabase";

async function assignTaskApi({ id, userId }) {
  const { data, error } = await supabase
    .from("housekeeping_tasks")
    .update({ assigned_to: userId })
    .eq("id", id)
    .select();

  if (error) throw new Error(error.message);
  return data;
}

export function useAssignTask() {
  const queryClient = useQueryClient();

  const { mutate: assignTask, isLoading: isAssigning } = useMutation({
    mutationFn: assignTaskApi,
    onSuccess: () => {
      toast.success("Task assigned successfully");
      queryClient.invalidateQueries({ queryKey: ["housekeeping"] });
    },
    onError: (err) => toast.error(err.message),
  });

  return { assignTask, isAssigning };
}
