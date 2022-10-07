import Router from "next/router";
import { useMutation } from "react-query";
import { Api } from "#/api";

interface CreatePublishingChannelArgs {
  publishingChannelName: string;
  publishingChannelDescription: string;
  profilePicture?: File;
  backgroundImage?: File;
  externalUrl1?: string;
  externalUrl2?: string;
  externalUrl3?: string;
  externalUrl4?: string;
  externalUrl5?: string;
  publishingChannelRule1?: string;
  publishingChannelRule2?: string;
  publishingChannelRule3?: string;
  publishingChannelRule4?: string;
  publishingChannelRule5?: string;
}

export const useCreateCommunityPage = () => {
  return useMutation(
    async (args: CreatePublishingChannelArgs) => {
      return await Api.createPublishingChannel(
        args.publishingChannelName,
        args.publishingChannelDescription,
        [args.backgroundImage, args.profilePicture],
        args.externalUrl1,
        args.externalUrl2,
        args.externalUrl3,
        args.externalUrl4,
        args.externalUrl5,
        args.publishingChannelRule1,
        args.publishingChannelRule2,
        args.publishingChannelRule3,
        args.publishingChannelRule4,
        args.publishingChannelRule5,
      );
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
