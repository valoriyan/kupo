import express from "express";
import { PublishedItemType } from "../../../controllers/publishedItem/models";
import {
  EitherType,
  ErrorReasonTypes,
  SecuredHTTPResponse,
  Success,
} from "../../../utilities/monads";
import { checkAuthentication } from "../../auth/utilities";
import { RenderablePost } from "../../publishedItem/post/models";
import { assembleRenderablePostsFromCachedComponents } from "../../publishedItem/post/utilities";
import { mergeArraysOfUncompiledBasePublishedItem } from "../../publishedItem/utilities/mergeArraysOfUncompiledBasePublishedItem";
import { DiscoverController } from "../discoverController";

export interface SearchForPostsRequestBody {
  query: string;
  pageNumber: number;
  pageSize: number;
}

export enum SearchForPostsFailedReason {
  UnknownCause = "Unknown Cause",
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
}): Promise<
  SecuredHTTPResponse<
    ErrorReasonTypes<string | SearchForPostsFailedReason>,
    SearchForPostsSuccess
  >
> {
  //////////////////////////////////////////////////
  // Inputs & Authentication
  //////////////////////////////////////////////////

  const { clientUserId, errorResponse: error } = await checkAuthentication(
    controller,
    request,
  );
  if (error) return error;

  const { pageNumber, query, pageSize } = requestBody;
  const lowercaseTrimmedQuery = query.trim().toLowerCase();

  //////////////////////////////////////////////////
  // Get Published Item Ids With Hashtag Matching Search
  //////////////////////////////////////////////////

  const getPublishedItemIdsWithOneOfHashtagsResponse =
    await controller.databaseService.tableNameToServicesMap.publishedItemHashtagsTableService.getPublishedItemIdsWithOneOfHashtags(
      { controller, hashtagSubstring: lowercaseTrimmedQuery },
    );
  if (getPublishedItemIdsWithOneOfHashtagsResponse.type === EitherType.failure) {
    return getPublishedItemIdsWithOneOfHashtagsResponse;
  }
  const { success: publishedItemIds } = getPublishedItemIdsWithOneOfHashtagsResponse;

  //////////////////////////////////////////////////
  // Get Published Items With Hashtag Matching Search
  //////////////////////////////////////////////////

  const getPublishedItemsByIdsResponse =
    await controller.databaseService.tableNameToServicesMap.publishedItemsTableService.getPublishedItemsByIds(
      { controller, ids: publishedItemIds, restrictedToType: PublishedItemType.POST },
    );
  if (getPublishedItemsByIdsResponse.type === EitherType.failure) {
    return getPublishedItemsByIdsResponse;
  }
  const { success: unrenderablePostsMatchingHashtag } = getPublishedItemsByIdsResponse;

  //////////////////////////////////////////////////
  // Get Published Items With Caption Matching Search
  //////////////////////////////////////////////////

  const getPublishedItemsByCaptionMatchingSubstringResponse =
    await controller.databaseService.tableNameToServicesMap.publishedItemsTableService.getPublishedItemsByCaptionMatchingSubstring(
      {
        controller,
        captionSubstring: lowercaseTrimmedQuery,
        type: PublishedItemType.POST,
        filterOutExpiredAndUnscheduledPublishedItems: true,
      },
    );
  if (getPublishedItemsByCaptionMatchingSubstringResponse.type === EitherType.failure) {
    return getPublishedItemsByCaptionMatchingSubstringResponse;
  }
  const { success: unrenderablePostsMatchingCaption } =
    getPublishedItemsByCaptionMatchingSubstringResponse;

  //////////////////////////////////////////////////
  // Merge Search Results
  //////////////////////////////////////////////////

  const unrenderablePostsWithoutElementsOrHashtags =
    mergeArraysOfUncompiledBasePublishedItem({
      arrays: [unrenderablePostsMatchingHashtag, unrenderablePostsMatchingCaption],
    });

  if (unrenderablePostsWithoutElementsOrHashtags.length === 0) {
    return Success({
      posts: [],
      totalCount: 0,
    });
  }

  //////////////////////////////////////////////////
  // Create Page of Results
  //////////////////////////////////////////////////

  const pageOfUnrenderablePosts = unrenderablePostsWithoutElementsOrHashtags.slice(
    pageSize * pageNumber - pageSize,
    pageSize * pageNumber,
  );

  //////////////////////////////////////////////////
  // Get Renderable Published Items
  //////////////////////////////////////////////////

  const assembleRenderablePostsFromCachedComponentsResponse =
    await assembleRenderablePostsFromCachedComponents({
      controller,
      blobStorageService: controller.blobStorageService,
      databaseService: controller.databaseService,
      uncompiledBasePublishedItems: pageOfUnrenderablePosts,
      requestorUserId: clientUserId,
    });
  if (assembleRenderablePostsFromCachedComponentsResponse.type === EitherType.failure) {
    return assembleRenderablePostsFromCachedComponentsResponse;
  }
  const { success: renderablePosts } =
    assembleRenderablePostsFromCachedComponentsResponse;

  //////////////////////////////////////////////////
  // Return
  //////////////////////////////////////////////////

  return Success({
    posts: renderablePosts,
    totalCount: unrenderablePostsWithoutElementsOrHashtags.length,
  });
}
