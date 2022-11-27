import Router from "next/router";
import { useMutation, useQueryClient } from "react-query";
import { Promise as BluebirdPromise } from "bluebird";
import { useCurrentUserId } from "#/contexts/auth";
import { useFormState } from "#/templates/AddContent/FormContext";
import { Api, UploadableKupoFile } from "../..";
import { resetPostFeeds } from "./utilities";
import { fileToBase64 } from "#/utils/fileToBase64";

export const useCreatePost = (publishingChannelId: string | undefined) => {
  const queryClient = useQueryClient();
  const userId = useCurrentUserId();
  const formState = useFormState();

  return useMutation(
    async () => {
      const mediaFiles: File[] = formState.mediaFiles.map((media) => media.file);

      const scheduledPublicationTimestamp = formState.publicationDate
        ? parseInt(formState.publicationDate.valueOf().toString())
        : undefined;
      const expirationTimestamp = formState.expirationDate
        ? parseInt(formState.expirationDate.valueOf().toString())
        : undefined;

      const uploadableKupoFiles = await BluebirdPromise.map(
        mediaFiles,
        async (mediaFile: File): Promise<UploadableKupoFile> => ({
          blobSize: mediaFile.size,
          blobText: await fileToBase64(mediaFile),
          mimetype: mediaFile.type,
        }),
      );

      const res = await Api.createPost({
        mediaFiles: uploadableKupoFiles,
        caption: formState.caption,
        hashtags: formState.hashTags,
        scheduledPublicationTimestamp,
        expirationTimestamp,
      });

      // const res = await Api.createPost(
      //   formState.mediaFiles.map((media) => media.file),
      //   formState.caption,
      //   JSON.stringify(formState.hashTags),
      //   formState.publicationDate?.valueOf().toString(),
      //   formState.expirationDate?.valueOf().toString(),
      // );

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
