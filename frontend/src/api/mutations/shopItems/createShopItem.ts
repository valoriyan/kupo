import Router from "next/router";
import { useMutation, useQueryClient } from "react-query";
import { Promise as BluebirdPromise } from "bluebird";
import { useCurrentUserId } from "#/contexts/auth";
import { useFormState } from "#/templates/AddContent/FormContext";
import { Api, UploadableKupoFile } from "../..";
import { resetShopItemFeeds } from "./utilities";
import { fileToBase64 } from "#/utils/fileToBase64";

export const useCreateShopItem = (publishingChannelId: string | undefined) => {
  const queryClient = useQueryClient();
  const userId = useCurrentUserId();
  const formState = useFormState();

  return useMutation(
    async (requestId: string) => {
      const scheduledPublicationTimestamp = formState.publicationDate
        ? formState.publicationDate.valueOf()
        : Date.now();

      const expirationTimestamp = formState.publicationDate
        ? formState.publicationDate.valueOf()
        : Date.now();

      const uploadableKupoMediaFiles: UploadableKupoFile[] = await BluebirdPromise.map(
        formState.mediaFiles.map((media) => media.file),
        async (mediaFile: File): Promise<UploadableKupoFile> => ({
          blobSize: mediaFile.size,
          blobText: await fileToBase64(mediaFile),
          mimetype: mediaFile.type,
        }),
      );

      const uploadablePurchasedKupoMediaFiles: UploadableKupoFile[] =
        await BluebirdPromise.map(
          formState.purchasedMediaFiles.map((media) => media.file),
          async (mediaFile: File): Promise<UploadableKupoFile> => ({
            blobSize: mediaFile.size,
            blobText: await fileToBase64(mediaFile),
            mimetype: mediaFile.type,
          }),
        );

      const res = await Api.createShopItem({
        idempotentcyToken: requestId,
        caption: formState.caption,
        hashtags: formState.hashTags,
        title: formState.title,
        price: formState.price,
        collaboratorUserIds: formState.collaboratorUsers.map((user) => user.userId),
        scheduledPublicationTimestamp,
        expirationTimestamp,
        mediaFiles: uploadableKupoMediaFiles,
        purchasedMediaFiles: uploadablePurchasedKupoMediaFiles,
      });

      if (publishingChannelId) {
        const publishedItemId = res.data.success.renderableShopItem.id;
        await Api.submitPublishedItemToPublishingChannel({
          publishingChannelId,
          publishedItemId,
        });
      }

      return res;
    },
    {
      onSuccess: (data) => {
        if (data.data.success) {
          resetShopItemFeeds({
            queryClient,
            authorUserId: userId,
          });
          Router.push("/feed");
        }
      },
    },
  );
};
