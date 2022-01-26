import { useMutation } from "react-query";
import Router from "next/router";
import { Api } from "../..";

export const useSharePost = ({ sharedPostId }: { sharedPostId: string }) => {
  return useMutation(
    async ({ caption, hashtags }: { caption: string; hashtags: string[] }) => {
      return await Api.sharePost({
        sharedPostId,
        caption,
        hashtags,
      });
    },
    {
      onSuccess: (data) => {
        if (data.data.success) {
          Router.push("/feed");
        }
      },
    },
  );
};
