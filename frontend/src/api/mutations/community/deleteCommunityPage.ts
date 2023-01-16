import { useMutation, useQueryClient } from "react-query";
import Router from "next/router";
import { Api } from "#/api";
import { CacheKeys } from "#/contexts/queryClient";

export interface DeleteCommunityPageArgs {
  publishingChannelId: string;
  communityName: string;
}

export const useDeleteCommunityPage = ({
  publishingChannelId,
  communityName,
}: DeleteCommunityPageArgs) => {
  const queryClient = useQueryClient();

  return useMutation(
    async () => {
      return await Api.deletePublishingChannel({ publishingChannelId });
    },
    {
      onSuccess: () => {
        queryClient.removeQueries([CacheKeys.CommunityByName, communityName]);
        Router.push(`/feed`);
      },
    },
  );
};
