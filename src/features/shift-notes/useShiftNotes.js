import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getShiftNotes, createShiftNote, acknowledgeShiftNote } from "../../services/apiShiftNotes";
import { toast } from "react-hot-toast";

export function useShiftNotes() {
  const { isLoading, data: notes, error } = useQuery({
    queryKey: ["shift_notes"],
    queryFn: getShiftNotes,
  });

  return { isLoading, notes, error };
}

export function useCreateShiftNote() {
    const queryClient = useQueryClient();

    const { mutate: createNote, isLoading: isCreating } = useMutation({
        mutationFn: createShiftNote,
        onSuccess: () => {
            toast.success("Shift note created successfully");
            queryClient.invalidateQueries({ queryKey: ["shift_notes"] });
        },
        onError: (err) => toast.error(err.message),
    });

    return { createNote, isCreating };
}

export function useAcknowledgeNote() {
    const queryClient = useQueryClient();

    const { mutate: acknowledge, isLoading: isAcknowledging } = useMutation({
        mutationFn: acknowledgeShiftNote,
        onSuccess: () => {
            toast.success("Note acknowledged");
            queryClient.invalidateQueries({ queryKey: ["shift_notes"] });
        },
        onError: (err) => toast.error(err.message),
    });

    return { acknowledge, isAcknowledging };
}
