import express from "express";
import { EitherType, SecuredHTTPResponse } from "../../../types/monads";
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
  SecuredHTTPResponse<GetPostsScheduledByUserFailed, GetPostsScheduledByUserSuccess>
> {
  const { clientUserId, errorResponse: error } = await checkAuthorization(
    controller,
    request,
  );
  if (error) return error;

  const { rangeStartTimestamp, rangeEndTimestamp } = requestBody;

  const uncompiledBasePublishedItem =
    await controller.databaseService.tableNameToServicesMap.publishedItemsTableService.getPublishedItemsWithScheduledPublicationTimestampWithinRangeByCreatorUserId(
      {
        creatorUserId: clientUserId,
        rangeEndTimestamp,
        rangeStartTimestamp,
      },
    );

  const renderablePosts = await constructRenderablePostsFromParts({
    blobStorageService: controller.blobStorageService,
    databaseService: controller.databaseService,
    uncompiledBasePublishedItems: uncompiledBasePublishedItem,
    clientUserId,
  });

  return {
    type: EitherType.success,
    success: {
      posts: renderablePosts,
    },
  };
}
