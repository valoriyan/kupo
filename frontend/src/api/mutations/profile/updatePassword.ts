import { useMutation } from "react-query";
import { toast } from "react-toastify";
import { Api } from "#/api";

export const useUpdatePassword = () => {
  return useMutation(
    async ({ updatedPassword }: { updatedPassword: string }) => {
      return await Api.updatePassword({ updatedPassword });
    },
    {
      onSuccess: (data) => {
        if (data.data.success) {
          toast.success("Successfully updated password");
        }
      },
    },
  );
};
