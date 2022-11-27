import { useMutation, useQueryClient } from "react-query";
import { Api, RenderablePublishingChannel } from "#/api";
import { CacheKeys } from "#/contexts/queryClient";
import { fileToBase64 } from "#/utils/fileToBase64";

export const useUpdateCommunityBackgroundImage = () => {
  const queryClient = useQueryClient();

  return useMutation(
    async ({ id, file }: { id: string; file: File }) => {
      const uploadableBackgroundImage = {
        blobSize: file.size,
        blobText: await fileToBase64(file),
        mimetype: file.type,
      };

      return await Api.updatePublishingChannelBackgroundImage({
        backgroundImage: uploadableBackgroundImage,
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
              backgroundImageTemporaryUrl:
                data.data.success.publishingChannel.backgroundImageTemporaryUrl,
            });
          }
        }
      },
    },
  );
};
