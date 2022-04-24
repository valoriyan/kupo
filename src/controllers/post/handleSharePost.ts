import { v4 as uuidv4 } from "uuid";
import { SecuredHTTPResponse } from "../../types/httpResponse";
import { PostController } from "./postController";
import express from "express";
import { checkAuthorization } from "../auth/utilities";
import { RenderablePost, SharedPostType } from "./models";
import { constructRenderablePostFromParts } from "./utilities";

export enum SharePostFailedReason {
  UnknownCause = "Unknown Cause",
  ExpirationTimestampIsInPast = "Expiration Timestamp is in Past",
  ScheduledPublicationTimestampIsInPast = "Scheduled Publication Timestamp is in Past",
}

export interface SharePostFailed {
  reason: SharePostFailedReason;
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
}): Promise<SecuredHTTPResponse<SharePostFailed, SharePostSuccess>> {
  const {
    sharedPostId,
    caption,
    hashtags,
    scheduledPublicationTimestamp,
    expirationTimestamp,
  } = requestBody;

  const postId: string = uuidv4();

  const { clientUserId, error } = await checkAuthorization(controller, request);
  if (error) return error;

  const now = Date.now();

  const creationTimestamp = now;

  try {
    let unrenderableSharedPostWithoutElementsOrHashtags =
      await controller.databaseService.tableNameToServicesMap.postsTableService.getPostByPostId(
        { postId: sharedPostId },
      );

    if (!!unrenderableSharedPostWithoutElementsOrHashtags.sharedPostId) {
      unrenderableSharedPostWithoutElementsOrHashtags =
        await controller.databaseService.tableNameToServicesMap.postsTableService.getPostByPostId(
          { postId: unrenderableSharedPostWithoutElementsOrHashtags.sharedPostId },
        );
    }

    const renderableSharedPost = await constructRenderablePostFromParts({
      blobStorageService: controller.blobStorageService,
      databaseService: controller.databaseService,
      unrenderablePostWithoutElementsOrHashtags:
        unrenderableSharedPostWithoutElementsOrHashtags,
      clientUserId,
    });

    console.log("renderableSharedPost");
    console.log(renderableSharedPost);

    const lowercaseCaption = caption.toLowerCase();

    await controller.databaseService.tableNameToServicesMap.postsTableService.createPost({
      postId,
      creationTimestamp,
      authorUserId: clientUserId,
      caption: lowercaseCaption,
      scheduledPublicationTimestamp: scheduledPublicationTimestamp ?? now,
      expirationTimestamp,
      sharedPostId,
    });

    const lowercaseHashtags = hashtags.map((hashtag) => hashtag.toLowerCase());

    await controller.databaseService.tableNameToServicesMap.hashtagTableService.addHashtagsToPost(
      {
        hashtags: lowercaseHashtags,
        postId,
      },
    );

    return {
      success: {
        renderablePost: {
          postId,
          creationTimestamp,
          contentElements: [],
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
          shared: {
            type: SharedPostType.post,
            post: renderableSharedPost,
          },
        },
      },
    };
  } catch (error) {
    console.log("error", error);
    controller.setStatus(401);
    return { error: { reason: SharePostFailedReason.UnknownCause } };
  }
}
