import Router from "next/router";
import { useMutation } from "react-query";
import { setAccessToken } from "#/contexts/auth";
import { Api, RegisterUserParams } from "..";

export const useRegisterUser = () => {
  return useMutation(
    async (args: RegisterUserParams) => {
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
