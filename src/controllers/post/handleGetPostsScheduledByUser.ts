import express from "express";
import { SecuredHTTPResponse } from "../../types/httpResponse";
import { checkAuthorization } from "../auth/utilities";
import { RenderablePost, UnrenderablePostWithoutElementsOrHashtags } from "./models";
import { PostController } from "./postController";
import { constructRenderablePostsFromParts } from "./utilities";

export interface GetPostsScheduledByUserParams {
  // JS Timestamp
  rangeStartTimestamp: number;
  // JS Timestamp
  rangeEndTimestamp: number;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface SuccessfulGetPostsScheduledByUserResponse {
  posts: RenderablePost[];
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface FailedToGetPostsScheduledByUserResponse {}

export async function handleGetPostsScheduledByUser({
  controller,
  request,
  requestBody,
}: {
  controller: PostController;
  request: express.Request;
  requestBody: GetPostsScheduledByUserParams;
}): Promise<
  SecuredHTTPResponse<
    FailedToGetPostsScheduledByUserResponse,
    SuccessfulGetPostsScheduledByUserResponse
  >
> {
  const { clientUserId, error } = await checkAuthorization(controller, request);
  if (error) return error;

  const { rangeStartTimestamp, rangeEndTimestamp } = requestBody;

  const unrenderablePostsWithoutRenderableDatesTimesElementsOrHashtags: UnrenderablePostWithoutElementsOrHashtags[] =
    await controller.databaseService.tableNameToServicesMap.postsTableService.getPostsWithScheduledPublicationTimestampWithinRangeByCreatorUserId(
      {
        creatorUserId: clientUserId,
        rangeEndTimestamp,
        rangeStartTimestamp,
      },
    );

  const renderablePosts = await constructRenderablePostsFromParts({
    blobStorageService: controller.blobStorageService,
    databaseService: controller.databaseService,
    posts: unrenderablePostsWithoutRenderableDatesTimesElementsOrHashtags,
  });

  return {
    success: {
      posts: renderablePosts,
    },
  };
}
