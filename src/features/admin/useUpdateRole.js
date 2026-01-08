import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateRolePermissions } from "../../services/apiAdmin";
import { toast } from "react-toastify";

export function useUpdateRole() {
  const queryClient = useQueryClient();

  const { mutate: updateRole, isLoading: isUpdating } = useMutation({
    mutationFn: ({ id, permissions }) => updateRolePermissions(id, permissions),
    onSuccess: () => {
      toast.success("Permissions updated successfully");
      queryClient.invalidateQueries({ queryKey: ["roles"] });
    },
    onError: (err) => toast.error(err.message),
  });

  return { updateRole, isUpdating };
}
