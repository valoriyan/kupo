import { useMutation } from "react-query";
import { Api } from "#/api";

export const useResendVerificationEmail = () => {
  return useMutation(async () => {
    return await Api.getVerifyUserEmail();
  });
};
