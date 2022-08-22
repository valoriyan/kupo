import { useMutation } from "react-query";
import Router from "next/router";
import { setAccessToken } from "#/contexts/auth";
import { Api, LoginUserRequestBody } from "../..";

export const useLoginUser = () => {
  return useMutation(
    async (args: LoginUserRequestBody) => {
      return await Api.loginUser(args);
    },
    {
      onSuccess: (data) => {
        if (data.data.success) {
          setAccessToken(data.data.success.accessToken);
          Router.push("/feed");
        }
      },
    },
  );
};
