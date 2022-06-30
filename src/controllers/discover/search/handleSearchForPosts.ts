import express from "express";
import { GenericResponseFailedReason } from "../../../controllers/models";
import { generateErrorResponse } from "../../../controllers/utilities/generateErrorResponse";
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
  const { clientUserId, errorResponse: error } = await checkAuthorization(
    controller,
    request,
  );
  if (error) return error;

  const { pageNumber, query, pageSize } = requestBody;
  const lowercaseTrimmedQuery = query.trim().toLowerCase();

  try {
    const publishedItemIds =
      await controller.databaseService.tableNameToServicesMap.hashtagTableService.getPublishedItemIdsWithOneOfHashtags(
        { hashtagSubstring: lowercaseTrimmedQuery },
      );

    try {
      const unrenderablePostsMatchingHashtag =
        await controller.databaseService.tableNameToServicesMap.publishedItemsTableService.getPublishedItemsByIds(
          { ids: publishedItemIds, restrictedToType: PublishedItemType.POST },
        );

      try {
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
      } catch (error) {
        return generateErrorResponse({
          controller,
          errorReason: GenericResponseFailedReason.DATABASE_TRANSACTION_ERROR,
          additionalErrorInformation:
            "Error at publishedItemsTableService.getPublishedItemsByCaptionMatchingSubstring",
          error,
          httpStatusCode: 500,
        });
      }
    } catch (error) {
      return generateErrorResponse({
        controller,
        errorReason: GenericResponseFailedReason.DATABASE_TRANSACTION_ERROR,
        additionalErrorInformation:
          "Error at publishedItemsTableService.getPublishedItemsByIds",
        error,
        httpStatusCode: 500,
      });
    }
  } catch {
    return generateErrorResponse({
      controller,
      errorReason: GenericResponseFailedReason.DATABASE_TRANSACTION_ERROR,
      additionalErrorInformation:
        "Error at hashtagTableService.getPublishedItemIdsWithOneOfHashtags",
      error,
      httpStatusCode: 500,
    });
  }
}
