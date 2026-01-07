import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { createMaintenanceTicket as createTicketApi } from "../../services/apiMaintenance";

export function useCreateTicket() {
  const queryClient = useQueryClient();

  const { mutate: createTicket, isLoading: isCreating } = useMutation({
    mutationFn: createTicketApi,
    onSuccess: () => {
      toast.success("Ticket created successfully");
      queryClient.invalidateQueries({ queryKey: ["maintenance_tickets"] });
    },
    onError: (err) => toast.error(err.message),
  });

  return { createTicket, isCreating };
}
