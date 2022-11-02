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

  const combinedMediaFiled = [
    ...formState.mediaFiles.map((media) => media.file),
    ...formState.purchasedMediaFiles.map((media) => media.file),
  ];

  return useMutation(
    async () => {
      const res = await Api.createShopItem(
        // Gonna have to merge these into one array and figure out how to separate them on the back-end
        combinedMediaFiled,
        formState.purchasedMediaFiles.length.toString(),
        formState.caption,
        JSON.stringify(formState.hashTags),
        formState.title,
        formState.price.toString(),
        formState.publicationDate?.valueOf().toString() || Date.now().toString(),
        JSON.stringify(formState.collaboratorUsers.map((user) => user.userId)),
        formState.expirationDate?.valueOf().toString(),
      );

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
