import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateBooking } from "../../services/apiBookings";
import { updateCabinState } from "../../services/apiCabins";
import { createHousekeepingTask } from "../../services/apiHousekeeping";
import { toast } from "react-toastify";

export function useCheckout() {
  const queryClient = useQueryClient();

  const { mutate: checkout, isLoading: isCheckingOut } = useMutation({
    mutationFn: async (bookingId) => {
        // 1. Update Booking
        const booking = await updateBooking(bookingId, {
            status: "checked-out",
        });

        // 2. Update Cabin Status (Vacant + Dirty)
        const cabinId = booking.cabinId;
        if (cabinId) {
            await updateCabinState(cabinId, {
                occupancy_status: 'vacant',
                clean_status: 'dirty'
            });

            // 3. Create Housekeeping Task
            await createHousekeepingTask({
                cabin_id: cabinId,
                status: 'todo',
                task_type: 'checkout_clean',
                priority: 'high', // Checkout cleans are usually high priority
                notes: 'Auto-generated from checkout'
            });
        }
        return booking;
    },

    onSuccess: (data) => {
      toast.success(`Booking #${data.id} successfully checked out. Room marked Dirty.`);
      queryClient.invalidateQueries({ active: true });
    },

    onError: (err) => {
        console.error(err);
        toast.error("There was an error while checking out");
    },
  });

  return { checkout, isCheckingOut };
}
