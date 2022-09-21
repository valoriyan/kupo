import { useQuery } from "react-query";
import { CacheKeys } from "#/contexts/queryClient";
import { Api, RenderablePublishingChannel } from "../..";

export const useGetCommunityByName = ({ name }: { name: string }) => {
  return useQuery<RenderablePublishingChannel, Error>(
    [CacheKeys.CommunityByName, name],
    async () => {
      const res = await Api.getPublishingChannelByName(
        { publishingChannelName: name },
        { authStrat: "tryToken" },
      );

      if (res.data.success) {
        return res.data.success.publishingChannel;
      }
      throw new Error((res.data.error.reason as string) ?? "Failed to community page");
    },
    { enabled: !!name },
  );
};
