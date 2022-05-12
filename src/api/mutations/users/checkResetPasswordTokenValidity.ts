import { Api } from "../..";
import { useMutation } from "react-query";

export const useCheckResetPasswordTokenValidity = ({ token }: { token: string }) => {
  return useMutation(async () => {
    const response = await Api.checkResetPasswordTokenValidity({ token });
    if (!!response.data.success) {
      return true;
    }
    return false;
  });
};
