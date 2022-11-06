import { AxiosResponse } from "axios";
import { useInfiniteQuery } from "react-query";
import { CacheKeys } from "#/contexts/queryClient";
import {
  Api,
  EitherErrorReasonTypesStringOrGetPublishedItemsInPublishingChannelFailedReasonGetPublishedItemsInPublishingChannelSuccess,
  GetPublishedItemsInPublishingChannelSuccess,
  PublishedItemType,
} from "../..";

export interface GetPublishedItemsInPublishingChannelArgs {
  publishingChannelName: string;
  publishedItemType: PublishedItemType;
}

export const useGetPublishedItemsInPublishingChannel = ({
  publishingChannelName,
  publishedItemType,
}: GetPublishedItemsInPublishingChannelArgs) => {
  return useInfiniteQuery<
    GetPublishedItemsInPublishingChannelSuccess,
    AxiosResponse<EitherErrorReasonTypesStringOrGetPublishedItemsInPublishingChannelFailedReasonGetPublishedItemsInPublishingChannelSuccess>,
    GetPublishedItemsInPublishingChannelSuccess,
    string[]
  >(
    [
      publishedItemType === PublishedItemType.Post
        ? CacheKeys.CommunityPostPages
        : CacheKeys.CommunityShopItemPages,
      publishingChannelName,
    ],
    ({ pageParam }) =>
      fetchPageOfPublishedItem({ pageParam, publishingChannelName, publishedItemType }),
    {
      getNextPageParam: (lastPage) => lastPage.nextPageCursor,
      enabled: !!publishingChannelName,
      retry: (failureCount, error) => {
        if (error.status === 404) return false;
        if (failureCount > 2) return false;
        return true;
      },
    },
  );
};

export async function fetchPageOfPublishedItem({
  pageParam,
  publishingChannelName,
  publishedItemType,
}: {
  pageParam: string | undefined;
  publishingChannelName: string;
  publishedItemType: PublishedItemType;
}) {
  const res = await Api.getPublishedItemsInPublishingChannel(
    {
      publishingChannelName,
      pageSize: 25,
      cursor: pageParam,
      publishedItemType,
    },
    { authStrat: "tryToken" },
  );

  if (res.data && res.data.success) {
    return res.data.success;
  }
  throw res;
}
