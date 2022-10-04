import Router from "next/router";
import { useMutation } from "react-query";
import { Api } from "#/api";

export const useCreateCommunityPage = () => {
  return useMutation(
    async (args: {
      publishingChannelName: string;
      publishingChannelDescription: string;
      profilePicture?: string;
      backgroundImage?: string;
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
    }) => {
      return await Api.createPublishingChannel(
        args.publishingChannelName,
        args.publishingChannelDescription,
        args.profilePicture,
        args.backgroundImage,
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
