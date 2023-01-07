import { useMutation } from "react-query";
import { Api, VerifyUserEmailRequestBody } from "../..";

export const useVerifyUserEmail = () => {
  return useMutation(async (args: VerifyUserEmailRequestBody) => {
    return await Api.verifyUserEmail(args);
  });
};
