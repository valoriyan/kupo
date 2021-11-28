import { useQuery } from "react-query";
import { CacheKeys } from "#/contexts/queryClient";
import { Api } from "..";

export interface GetPostsByUserIdArgs {
  userId: string;
}

export const useGetPostsByUserId = ({ userId }: GetPostsByUserIdArgs) => {
  return useQuery(
    [CacheKeys.UserPosts, userId],
    async () => {
      const res = await Api.getPageOfPostsPagination({ userId, pageSize: 25 });
      return res.data;
    },
    { enabled: !!userId },
  );
};
