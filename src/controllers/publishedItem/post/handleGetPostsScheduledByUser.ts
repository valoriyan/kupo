import express from "express";
import {
  EitherType,
  ErrorReasonTypes,
  SecuredHTTPResponse,
  Success,
} from "../../../utilities/monads";
import { checkAuthorization } from "../../auth/utilities";
import { RenderablePost } from "./models";
import { PostController } from "./postController";
import { constructRenderablePostsFromParts } from "./utilities";

export interface GetPostsScheduledByUserRequestBody {
  // JS Timestamp
  rangeStartTimestamp: number;
  // JS Timestamp
  rangeEndTimestamp: number;
}

export interface GetPostsScheduledByUserSuccess {
  posts: RenderablePost[];
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface GetPostsScheduledByUserFailed {}

export async function handleGetPostsScheduledByUser({
  controller,
  request,
  requestBody,
}: {
  controller: PostController;
  request: express.Request;
  requestBody: GetPostsScheduledByUserRequestBody;
}): Promise<
  SecuredHTTPResponse<
    ErrorReasonTypes<string | GetPostsScheduledByUserFailed>,
    GetPostsScheduledByUserSuccess
  >
> {
  const { clientUserId, errorResponse: error } = await checkAuthorization(
    controller,
    request,
  );
  if (error) return error;

  const { rangeStartTimestamp, rangeEndTimestamp } = requestBody;

  const getPublishedItemsWithScheduledPublicationTimestampWithinRangeByCreatorUserIdResponse =
    await controller.databaseService.tableNameToServicesMap.publishedItemsTableService.getPublishedItemsWithScheduledPublicationTimestampWithinRangeByCreatorUserId(
      {
        controller,
        creatorUserId: clientUserId,
        rangeEndTimestamp,
        rangeStartTimestamp,
      },
    );
  if (
    getPublishedItemsWithScheduledPublicationTimestampWithinRangeByCreatorUserIdResponse.type ===
    EitherType.failure
  ) {
    return getPublishedItemsWithScheduledPublicationTimestampWithinRangeByCreatorUserIdResponse;
  }
  const { success: uncompiledBasePublishedItem } =
    getPublishedItemsWithScheduledPublicationTimestampWithinRangeByCreatorUserIdResponse;

  const constructRenderablePostsFromPartsResponse =
    await constructRenderablePostsFromParts({
      controller,
      blobStorageService: controller.blobStorageService,
      databaseService: controller.databaseService,
      uncompiledBasePublishedItems: uncompiledBasePublishedItem,
      clientUserId,
    });
  if (constructRenderablePostsFromPartsResponse.type === EitherType.failure) {
    return constructRenderablePostsFromPartsResponse;
  }
  const { success: renderablePosts } = constructRenderablePostsFromPartsResponse;

  return Success({
    posts: renderablePosts,
  });
}
