import { useMutation, useQueryClient } from "react-query";
import { Api, RenderablePublishingChannel, UploadableKupoFile } from "#/api";
import { CacheKeys } from "#/contexts/queryClient";
import { fileToBase64 } from "#/utils/fileToBase64";

export const useUpdateCommunityProfilePicture = () => {
  const queryClient = useQueryClient();

  return useMutation(
    async ({ id, file }: { id: string; file: File }) => {
      const uploadableProfilePicture: UploadableKupoFile = {
        blobSize: file.size,
        blobText: await fileToBase64(file),
        mimetype: file.type,
      };

      return await Api.updatePublishingChannelProfilePicture({
        profilePicture: uploadableProfilePicture,
        publishingChannelId: id,
      });
    },
    {
      onSuccess: (data) => {
        if (!!data.data.success) {
          const cacheKey = [CacheKeys.CommunityByName];
          const cachedData: RenderablePublishingChannel | undefined =
            queryClient.getQueryData(cacheKey);
          if (cachedData) {
            queryClient.setQueryData<RenderablePublishingChannel>(cacheKey, {
              ...cachedData,
              profilePictureTemporaryUrl:
                data.data.success.publishingChannel.profilePictureTemporaryUrl,
            });
          }
        }
      },
    },
  );
};
