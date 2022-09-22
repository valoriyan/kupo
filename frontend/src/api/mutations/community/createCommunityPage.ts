import Router from "next/router";
import { useMutation } from "react-query";
import { Api, CreatePublishingChannelRequestBody } from "#/api";

export const useCreateCommunityPage = () => {
  return useMutation(
    async (args: CreatePublishingChannelRequestBody) => {
      return await Api.createPublishingChannel(args);
    },
    {
      onSuccess: (data) => {
        const name = data.data.success.name;
        if (name) {
          Router.push(`/community/${name}`);
        } else {
          Router.push(`/feed`);
        }
      },
    },
  );
};
