import { useMutation } from "@tanstack/react-query";
import { singup } from "../../services/apiAuth";
import { toast } from "react-toastify";

export function useSingUp() {
  const { mutate: singUp, isLoading } = useMutation({
    mutationFn: singup,
    onSuccess: (user) => {
      toast.success(
        "Account successfully created!, Please verify the new account from the user's email address"
      );
    },
  });

  return { singUp, isLoading };
}
