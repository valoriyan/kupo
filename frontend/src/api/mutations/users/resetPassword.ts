import { useMutation } from "react-query";
import { Api, ResetPasswordRequestBody } from "../..";

export const useResetPassword = () => {
  return useMutation(async (args: ResetPasswordRequestBody) => {
    return await Api.resetPassword(args);
  });
};
