import { useMutation } from "react-query";
import { toast } from "react-toastify";
import { Api } from "../..";

export const useUploadFile = () => {
  return useMutation(
    async (args: { file: File; mimeType: string }) => {
      const res = await Api.uploadFile(args.file, args.mimeType);

      if (!res.data.success) {
        throw new Error((res.data.error.reason as string) ?? "Failed to upload file");
      }
      return res.data.success;
    },
    {
      onError: (_, { file }) => {
        toast.error(`Failed to upload file, ${file.name}`);
      },
    },
  );
};
