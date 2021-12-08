import { useQuery } from "react-query";
import { CacheKeys } from "#/contexts/queryClient";
import { Api, SuccessfulGetPageOfPostsPaginationResponse } from "../..";

export interface GetPostsByUserIdArgs {
  userId: string;
}

export const useGetPostsByUserId = ({ userId }: GetPostsByUserIdArgs) => {
  return useQuery<SuccessfulGetPageOfPostsPaginationResponse, Error>(
    [CacheKeys.UserPosts, userId],
    async () => {
      const res = await Api.getPageOfPostsPagination({ userId, pageSize: 25 });

      if (res.data.success) {
        return res.data.success;
      }
      throw new Error(res.data.error?.reason ?? "Failed to fetch posts");
    },
    { enabled: !!userId },
  );
};
