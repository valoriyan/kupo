import { useMutation, useQueryClient } from "react-query";
import { Api, FileDescriptor, GetClientUserProfileSuccess } from "#/api";
import { CacheKeys } from "#/contexts/queryClient";

export const useUpdateOwnProfilePicture = () => {
  const queryClient = useQueryClient();

  return useMutation(
    async (fileDescriptor: FileDescriptor) => {
      return await Api.updateUserProfilePicture({
        profilePicture: fileDescriptor,
      });
    },
    {
      onSuccess: (data) => {
        if (!!data.data.success) {
          const cacheKey = [CacheKeys.ClientProfile];
          const cachedData: GetClientUserProfileSuccess | undefined =
            queryClient.getQueryData(cacheKey);
          if (cachedData) {
            queryClient.setQueryData(cacheKey, {
              ...cachedData,
              profilePictureTemporaryUrl: data.data.success.profilePictureTemporaryUrl,
            });
          }
        }
      },
    },
  );
};
