import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { updateMaintenanceTicket as updateTicketApi } from "../../services/apiMaintenance";

export function useUpdateTicket() {
  const queryClient = useQueryClient();

  const { mutate: updateTicket, isLoading: isUpdating } = useMutation({
    mutationFn: ({ id, ...obj }) => updateTicketApi({ id, obj }),
    onSuccess: () => {
      toast.success("Ticket updated successfully");
      queryClient.invalidateQueries({ queryKey: ["maintenance_tickets"] });
    },
    onError: (err) => toast.error(err.message),
  });

  return { updateTicket, isUpdating };
}
