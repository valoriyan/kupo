import { v4 as uuidv4 } from "uuid";
import {
  EitherType,
  ErrorReasonTypes,
  SecuredHTTPResponse,
  Success,
} from "../../../utilities/monads";
import { PostController } from "./postController";
import express from "express";
import { checkAuthorization } from "../../auth/utilities";
import { RenderablePost, RootRenderablePost } from "./models";
import { constructRenderablePostFromParts } from "./utilities";
import { PublishedItemType } from "../models";

export enum SharePostFailedReason {
  UnknownCause = "Unknown Cause",
  ExpirationTimestampIsInPast = "Expiration Timestamp is in Past",
  ScheduledPublicationTimestampIsInPast = "Scheduled Publication Timestamp is in Past",
}

export interface SharePostSuccess {
  renderablePost: RenderablePost;
}

export interface SharePostRequestBody {
  sharedPostId: string;
  caption: string;
  hashtags: string[];
  scheduledPublicationTimestamp?: number;
  expirationTimestamp?: number;
}

export async function handleSharePost({
  controller,
  request,
  requestBody,
}: {
  controller: PostController;
  request: express.Request;
  requestBody: SharePostRequestBody;
}): Promise<
  SecuredHTTPResponse<ErrorReasonTypes<string | SharePostFailedReason>, SharePostSuccess>
> {
  const {
    sharedPostId,
    caption,
    hashtags,
    scheduledPublicationTimestamp,
    expirationTimestamp,
  } = requestBody;

  const postId: string = uuidv4();

  const { clientUserId, errorResponse: error } = await checkAuthorization(
    controller,
    request,
  );
  if (error) return error;

  const now = Date.now();

  const creationTimestamp = now;

  const getPublishedItemByIdResponse =
    await controller.databaseService.tableNameToServicesMap.publishedItemsTableService.getPublishedItemById(
      { controller, id: sharedPostId },
    );
  if (getPublishedItemByIdResponse.type === EitherType.failure) {
    return getPublishedItemByIdResponse;
  }
  let unrenderableSharedPostWithoutElementsOrHashtags =
    getPublishedItemByIdResponse.success;

  if (!!unrenderableSharedPostWithoutElementsOrHashtags.idOfPublishedItemBeingShared) {
    const getPublishedItemByIdResponse =
      await controller.databaseService.tableNameToServicesMap.publishedItemsTableService.getPublishedItemById(
        {
          controller,
          id: unrenderableSharedPostWithoutElementsOrHashtags.idOfPublishedItemBeingShared,
        },
      );
    if (getPublishedItemByIdResponse.type === EitherType.failure) {
      return getPublishedItemByIdResponse;
    }
    unrenderableSharedPostWithoutElementsOrHashtags =
      getPublishedItemByIdResponse.success;
  }

  const constructRenderablePostFromPartsResponse = await constructRenderablePostFromParts(
    {
      controller,
      blobStorageService: controller.blobStorageService,
      databaseService: controller.databaseService,
      uncompiledBasePublishedItem: unrenderableSharedPostWithoutElementsOrHashtags,
      clientUserId,
    },
  );
  if (constructRenderablePostFromPartsResponse.type === EitherType.failure) {
    return constructRenderablePostFromPartsResponse;
  }
  const { success: renderableSharedPost } = constructRenderablePostFromPartsResponse;

  const lowercaseCaption = caption.toLowerCase();

  const createPublishedItemResponse =
    await controller.databaseService.tableNameToServicesMap.publishedItemsTableService.createPublishedItem(
      {
        controller,
        publishedItemId: postId,
        type: PublishedItemType.POST,
        creationTimestamp,
        authorUserId: clientUserId,
        caption: lowercaseCaption,
        scheduledPublicationTimestamp: scheduledPublicationTimestamp ?? now,
        expirationTimestamp,
        idOfPublishedItemBeingShared: sharedPostId,
      },
    );
  if (createPublishedItemResponse.type === EitherType.failure) {
    return createPublishedItemResponse;
  }

  const lowercaseHashtags = hashtags.map((hashtag) => hashtag.toLowerCase());

  const addHashtagsToPublishedItemResponse =
    await controller.databaseService.tableNameToServicesMap.hashtagTableService.addHashtagsToPublishedItem(
      {
        controller,
        hashtags: lowercaseHashtags,
        publishedItemId: postId,
      },
    );
  if (addHashtagsToPublishedItemResponse.type === EitherType.failure) {
    return addHashtagsToPublishedItemResponse;
  }

  return Success({
    renderablePost: {
      id: postId,
      type: PublishedItemType.POST,
      creationTimestamp,
      mediaElements: [],
      authorUserId: clientUserId,
      caption: lowercaseCaption,
      scheduledPublicationTimestamp: scheduledPublicationTimestamp ?? now,
      hashtags: lowercaseHashtags,
      expirationTimestamp,
      likes: {
        count: 0,
      },
      comments: {
        count: 0,
      },
      isLikedByClient: false,
      isSavedByClient: false,
      sharedItem: renderableSharedPost as RootRenderablePost,
    },
  });
}
