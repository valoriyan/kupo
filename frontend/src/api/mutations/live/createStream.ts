import { useMutation } from "react-query";
import { Api } from "#/api";

export const useCreateStream = () => {
  return useMutation(
    async () => {
      return await Api.createLiveStream({});
    },
    {
      onSuccess: (data) => {
        console.log("data");
        console.log(data);
      },
    },
  );
};
