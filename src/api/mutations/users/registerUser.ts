import Router from "next/router";
import { useMutation } from "react-query";
import { setAccessToken } from "#/contexts/auth";
import { Api, RegisterUserRequestBody } from "../..";

export const useRegisterUser = () => {
  return useMutation(
    async (args: RegisterUserRequestBody) => {
      return await Api.registerUser(args);
    },
    {
      onSuccess: (data) => {
        if (data.data.success) {
          setAccessToken(data.data.success.accessToken);
          Router.push("/");
        }
      },
    },
  );
};
