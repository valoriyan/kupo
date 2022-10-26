import { useMutation, useQueryClient } from "react-query";
import { Api, RenderablePublishingChannel } from "#/api";
import { CacheKeys } from "#/contexts/queryClient";

export const useUpdateCommunityProfilePicture = () => {
  const queryClient = useQueryClient();

  return useMutation(
    async ({ id, file }: { id: string; file: File }) => {
      return await Api.updatePublishingChannelProfilePicture(file, id);
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
