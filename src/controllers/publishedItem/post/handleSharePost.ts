import { v4 as uuidv4 } from "uuid";
import { SecuredHTTPResponse } from "../../../types/httpResponse";
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
}): Promise<SecuredHTTPResponse<SharePostFailedReason, SharePostSuccess>> {
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

  try {
    let unrenderableSharedPostWithoutElementsOrHashtags =
      await controller.databaseService.tableNameToServicesMap.publishedItemsTableService.getPublishedItemById(
        { id: sharedPostId },
      );

    if (!!unrenderableSharedPostWithoutElementsOrHashtags.idOfPublishedItemBeingShared) {
      unrenderableSharedPostWithoutElementsOrHashtags =
        await controller.databaseService.tableNameToServicesMap.publishedItemsTableService.getPublishedItemById(
          {
            id: unrenderableSharedPostWithoutElementsOrHashtags.idOfPublishedItemBeingShared,
          },
        );
    }

    const renderableSharedPost = await constructRenderablePostFromParts({
      blobStorageService: controller.blobStorageService,
      databaseService: controller.databaseService,
      uncompiledBasePublishedItem: unrenderableSharedPostWithoutElementsOrHashtags,
      clientUserId,
    });

    const lowercaseCaption = caption.toLowerCase();

    await controller.databaseService.tableNameToServicesMap.publishedItemsTableService.createPublishedItem(
      {
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

    const lowercaseHashtags = hashtags.map((hashtag) => hashtag.toLowerCase());

    await controller.databaseService.tableNameToServicesMap.hashtagTableService.addHashtagsToPublishedItem(
      {
        hashtags: lowercaseHashtags,
        publishedItemId: postId,
      },
    );

    return {
      success: {
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
      },
    };
  } catch (error) {
    console.log("error", error);
    controller.setStatus(401);
    return { error: { reason: SharePostFailedReason.UnknownCause } };
  }
}
