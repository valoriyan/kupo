import { useMutation, useQueryClient } from "react-query";
import { Api, GetClientUserProfileSuccess, UploadableKupoFile } from "#/api";
import { CacheKeys } from "#/contexts/queryClient";
import { fileToBase64 } from "#/utils/fileToBase64";

export const useUpdateOwnBackgroundImage = () => {
  const queryClient = useQueryClient();

  return useMutation(
    async (file: File) => {
      const uploadableBackgroundImage: UploadableKupoFile = {
        blobSize: file.size,
        blobText: await fileToBase64(file),
        mimetype: file.type,
      };

      return await Api.updateUserBackgroundImage({
        backgroundImage: uploadableBackgroundImage,
      });
    },
    {
      onSuccess: (data) => {
        if (data.data.success) {
          const cacheKey = [CacheKeys.ClientProfile];
          const cachedData: GetClientUserProfileSuccess | undefined =
            queryClient.getQueryData(cacheKey);

          if (cachedData) {
            queryClient.setQueryData(cacheKey, {
              ...cachedData,
              backgroundImageTemporaryUrl: data.data.success.backgroundImageTemporaryUrl,
            });
          }
        }
      },
    },
  );
};
