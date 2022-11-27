import { useMutation, useQueryClient } from "react-query";
import { Api, GetClientUserProfileSuccess, UploadableKupoFile } from "#/api";
import { CacheKeys } from "#/contexts/queryClient";
import { fileToBase64 } from "#/utils/fileToBase64";

export const useUpdateOwnProfilePicture = () => {
  const queryClient = useQueryClient();

  return useMutation(
    async (file: File) => {
      const uploadableProfilePicture: UploadableKupoFile = {
        blobSize: file.size,
        blobText: await fileToBase64(file),
        mimetype: file.type,
      };

      return await Api.updateUserProfilePicture({
        profilePicture: uploadableProfilePicture,
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
