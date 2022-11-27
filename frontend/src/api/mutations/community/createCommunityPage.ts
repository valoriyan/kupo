import Router from "next/router";
import { useMutation } from "react-query";
import { Api } from "#/api";
import { fileToBase64 } from "#/utils/fileToBase64";

interface CreatePublishingChannelArgs {
  publishingChannelName: string;
  publishingChannelDescription: string;
  profilePicture?: File;
  backgroundImage?: File;
  moderatorUserIds: string[];
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
      const {
        backgroundImage,
        profilePicture,
        publishingChannelName,
        publishingChannelDescription,
        externalUrl1,
        externalUrl2,
        externalUrl3,
        externalUrl4,
        externalUrl5,
        publishingChannelRule1,
        publishingChannelRule2,
        publishingChannelRule3,
        publishingChannelRule4,
        publishingChannelRule5,
        moderatorUserIds,
      } = args;

      const uploadableBackgroundImage = backgroundImage
        ? {
            blobSize: backgroundImage.size,
            blobText: await fileToBase64(backgroundImage),
            mimetype: backgroundImage.type,
          }
        : undefined;

      const uploadableProfilePicture = profilePicture
        ? {
            blobSize: profilePicture.size,
            blobText: await fileToBase64(profilePicture),
            mimetype: profilePicture.type,
          }
        : undefined;

      const externalUrls: string[] = [];
      if (!!externalUrl1) {
        externalUrls.push(externalUrl1);
      }
      if (!!externalUrl2) {
        externalUrls.push(externalUrl2);
      }
      if (!!externalUrl3) {
        externalUrls.push(externalUrl3);
      }
      if (!!externalUrl4) {
        externalUrls.push(externalUrl4);
      }
      if (!!externalUrl5) {
        externalUrls.push(externalUrl5);
      }

      const publishingChannelRules: string[] = [];
      if (!!publishingChannelRule1) {
        publishingChannelRules.push(publishingChannelRule1);
      }
      if (!!publishingChannelRule2) {
        publishingChannelRules.push(publishingChannelRule2);
      }
      if (!!publishingChannelRule3) {
        publishingChannelRules.push(publishingChannelRule3);
      }
      if (!!publishingChannelRule4) {
        publishingChannelRules.push(publishingChannelRule4);
      }
      if (!!publishingChannelRule5) {
        publishingChannelRules.push(publishingChannelRule5);
      }

      return await Api.createPublishingChannel({
        backgroundImage: uploadableBackgroundImage,
        profilePicture: uploadableProfilePicture,
        publishingChannelName,
        publishingChannelDescription,
        externalUrls,
        publishingChannelRules,
        moderatorUserIds,
      });
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
