import { useMutation, useQueryClient } from "react-query";
import { Api, FileDescriptor, RenderablePublishingChannel } from "#/api";
import { CacheKeys } from "#/contexts/queryClient";

export const useUpdateCommunityBackgroundImage = () => {
  const queryClient = useQueryClient();

  return useMutation(
    async ({ id, file }: { id: string; file: FileDescriptor }) => {
      return await Api.updatePublishingChannelBackgroundImage({
        backgroundImage: file,
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
