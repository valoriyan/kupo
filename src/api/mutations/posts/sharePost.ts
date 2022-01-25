import { useMutation } from "react-query";
import Router from "next/router";
import { Api } from "../..";

export const useSharePost = ({
  sharedPostId,
  caption,
  hashtags,
}: {
  sharedPostId: string;
  caption: string;
  hashtags: string[];
}) => {
  return useMutation(
    async () => {
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
