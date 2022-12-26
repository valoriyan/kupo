import Router from "next/router";
import { useMutation, useQueryClient } from "react-query";
import { useCurrentUserId } from "#/contexts/auth";
import { useFormState } from "#/templates/AddContent/FormContext";
import { Api } from "../..";
import { resetPostFeeds } from "./utilities";

export const useCreatePost = (publishingChannelId: string | undefined) => {
  const queryClient = useQueryClient();
  const userId = useCurrentUserId();
  const formState = useFormState();

  return useMutation(
    async () => {
      const scheduledPublicationTimestamp = formState.publicationDate
        ? parseInt(formState.publicationDate.valueOf().toString())
        : undefined;
      const expirationTimestamp = formState.expirationDate
        ? parseInt(formState.expirationDate.valueOf().toString())
        : undefined;

      const res = await Api.createPost({
        contentElementFiles: formState.mediaFiles.map((file) => ({
          blobFileKey: file.blobFileKey,
          mimeType: file.mimeType,
        })),
        caption: formState.caption,
        hashtags: formState.hashTags,
        scheduledPublicationTimestamp,
        expirationTimestamp,
      });

      if (publishingChannelId) {
        const publishedItemId = res.data.success.renderablePost.id;
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
          resetPostFeeds({
            queryClient,
            authorUserId: userId,
          });
          Router.push("/feed");
        }
      },
    },
  );
};
