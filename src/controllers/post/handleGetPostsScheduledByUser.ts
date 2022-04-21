import express from "express";
import { SecuredHTTPResponse } from "../../types/httpResponse";
import { checkAuthorization } from "../auth/utilities";
import { RenderablePost, UnrenderablePostWithoutElementsOrHashtags } from "./models";
import { PostController } from "./postController";
import { constructRenderablePostsFromParts } from "./utilities";

export interface GetPostsScheduledByUserRequestBody {
  // JS Timestamp
  rangeStartTimestamp: number;
  // JS Timestamp
  rangeEndTimestamp: number;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
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
    GetPostsScheduledByUserFailed,
    GetPostsScheduledByUserSuccess
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
    clientUserId,
  });

  return {
    success: {
      posts: renderablePosts,
    },
  };
}
