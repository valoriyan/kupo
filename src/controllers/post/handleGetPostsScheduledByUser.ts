import express from "express";
import { SecuredHTTPResponse } from "src/types/httpResponse";
import { getTimestampRangeFromJSMonth } from "src/utilities";
import { checkAuthorization } from "../auth/utilities";
import {
  RenderablePost,
  UnrenderablePostWithoutRenderableDatesTimesElementsOrHashtags,
} from "./models";
import { PostController } from "./postController";
import { constructRenderablePostsFromParts } from "./utilities";

export interface GetPostsScheduledByUserParams {
  // 0 based value
  month: number;
  year: number;
  // Example: 'America/New_York'
  userTimeZone: string;
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

  const { year, month, userTimeZone } = requestBody;

  const {
    lowerTimestamp: scheduledPublicationTimestampMinValue,
    upperTimestamp: scheduledPublicationTimestampMaxValue,
  } = getTimestampRangeFromJSMonth({ year, month, timeZone: userTimeZone });

  const unrenderablePostsWithoutRenderableDatesTimesElementsOrHashtags: UnrenderablePostWithoutRenderableDatesTimesElementsOrHashtags[] =
    await controller.databaseService.tableNameToServicesMap.postsTableService.getPostsWithScheduledPublicationTimestampWithinRangeByCreatorUserId(
      {
        creatorUserId: clientUserId,
        scheduledPublicationTimestampMaxValue,
        scheduledPublicationTimestampMinValue,
      },
    );

  const renderablePosts = await constructRenderablePostsFromParts({
    blobStorageService: controller.blobStorageService,
    databaseService: controller.databaseService,
    posts: unrenderablePostsWithoutRenderableDatesTimesElementsOrHashtags,
    userTimeZone,
  });

  return {
    success: {
      posts: renderablePosts,
    },
  };
}
