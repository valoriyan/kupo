import { useQuery } from "react-query";
import { CacheKeys } from "#/contexts/queryClient";
import { Api, RenderablePost } from "../..";

export interface GetPostByIdArgs {
  postId: string;
}

export const useGetPostById = ({ postId }: GetPostByIdArgs) => {
  return useQuery<RenderablePost, Error>(
    [CacheKeys.PostById, postId],
    async () => {
      const res = await Api.getPublishedItemById({ publishedItemId: postId });

      if (res.data.success) {
        return res.data.success.publishedItem as RenderablePost;
      }
      throw new Error(res.data.error?.reason ?? "Failed to fetch post");
    },
    { enabled: !!postId },
  );
};
