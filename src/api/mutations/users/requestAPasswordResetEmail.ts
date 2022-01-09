import { useMutation } from "react-query";
import { Api } from "../..";

export const useRequestAPasswordResetEmail = () => {
  return useMutation(async ({ email }: { email: string }) => {
    return await Api.requestPasswordReset({ email });
  }, {});
};
