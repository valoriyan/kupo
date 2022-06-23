import express from "express";
import { PublishedItemType } from "../../../controllers/publishedItem/models";
import { SecuredHTTPResponse } from "../../../types/httpResponse";
import { checkAuthorization } from "../../auth/utilities";
import { RenderablePost } from "../../publishedItem/post/models";
import {
  constructRenderablePostsFromParts,
  mergeArraysOfUncompiledBasePublishedItem,
} from "../../publishedItem/post/utilities";
import { DiscoverController } from "../discoverController";

export interface SearchForPostsRequestBody {
  query: string;
  pageNumber: number;
  pageSize: number;
}

export enum SearchForPostsFailedReason {
  UnknownCause = "Unknown Cause",
}

export interface SearchForPostsFailed {
  reason: SearchForPostsFailedReason;
}

export interface SearchForPostsSuccess {
  posts: RenderablePost[];
  totalCount: number;
}

export async function handleSearchForPosts({
  controller,
  request,
  requestBody,
}: {
  controller: DiscoverController;
  request: express.Request;
  requestBody: SearchForPostsRequestBody;
}): Promise<SecuredHTTPResponse<SearchForPostsFailed, SearchForPostsSuccess>> {
  const { clientUserId, error } = await checkAuthorization(controller, request);
  if (error) return error;

  const { pageNumber, query, pageSize } = requestBody;
  const lowercaseTrimmedQuery = query.trim().toLowerCase();

  const publishedItemIds =
    await controller.databaseService.tableNameToServicesMap.hashtagTableService.getPublishedItemIdsWithOneOfHashtags(
      { hashtagSubstring: lowercaseTrimmedQuery },
    );

  const unrenderablePostsMatchingHashtag =
    await controller.databaseService.tableNameToServicesMap.publishedItemsTableService.getPublishedItemsByIds(
      { ids: publishedItemIds, restrictedToType: PublishedItemType.POST },
    );

  const unrenderablePostsMatchingCaption =
    await controller.databaseService.tableNameToServicesMap.publishedItemsTableService.getPublishedItemsByCaptionMatchingSubstring(
      { captionSubstring: lowercaseTrimmedQuery, type: PublishedItemType.POST },
    );

  const unrenderablePostsWithoutElementsOrHashtags =
    mergeArraysOfUncompiledBasePublishedItem({
      arrays: [unrenderablePostsMatchingHashtag, unrenderablePostsMatchingCaption],
    });

  if (unrenderablePostsWithoutElementsOrHashtags.length === 0) {
    return {
      success: {
        posts: [],
        totalCount: 0,
      },
    };
  }

  const pageOfUnrenderablePosts = unrenderablePostsWithoutElementsOrHashtags.slice(
    pageSize * pageNumber - pageSize,
    pageSize * pageNumber,
  );

  const renderablePosts = await constructRenderablePostsFromParts({
    blobStorageService: controller.blobStorageService,
    databaseService: controller.databaseService,
    uncompiledBasePublishedItems: pageOfUnrenderablePosts,
    clientUserId,
  });

  return {
    success: {
      posts: renderablePosts,
      totalCount: unrenderablePostsWithoutElementsOrHashtags.length,
    },
  };
}
