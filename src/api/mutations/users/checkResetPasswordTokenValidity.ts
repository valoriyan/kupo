import { useMutation } from "react-query";
import { Api } from "../..";

export const useCheckResetPasswordTokenValidity = ({ token }: { token: string }) => {
  return useMutation(async () => {
    const response = await Api.checkResetPasswordTokenValidity(
      { token },
      { authStrat: "noToken" },
    );
    if (!!response.data.success) {
      return true;
    }
    return false;
  });
};
