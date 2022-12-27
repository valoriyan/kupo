import Router from "next/router";
import { useMutation, useQueryClient } from "react-query";
import { useCurrentUserId } from "#/contexts/auth";
import { useFormState } from "#/templates/AddContent/FormContext";
import { Api } from "../..";
import { resetShopItemFeeds } from "./utilities";

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

      const res = await Api.createShopItem({
        idempotentcyToken: requestId,
        caption: formState.caption,
        hashtags: formState.hashTags,
        title: formState.title,
        price: formState.price,
        collaboratorUserIds: formState.collaboratorUsers.map((user) => user.userId),
        scheduledPublicationTimestamp,
        expirationTimestamp,
        mediaFiles: formState.mediaFiles.map((file) => ({
          blobFileKey: file.blobFileKey,
          mimeType: file.mimeType,
        })),
        purchasedMediaFiles: formState.purchasedMediaFiles.map((file) => ({
          blobFileKey: file.blobFileKey,
          mimeType: file.mimeType,
        })),
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
