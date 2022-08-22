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
import { PublishedItemType } from "../models";
import { constructPublishedItemFromParts } from "../utilities/constructPublishedItemsFromParts";

export enum SharePostFailedReason {
  UnknownCause = "Unknown Cause",
  ExpirationTimestampIsInPast = "Expiration Timestamp is in Past",
  ScheduledPublicationTimestampIsInPast = "Scheduled Publication Timestamp is in Past",
}

export interface SharePostSuccess {
  renderablePost: RenderablePost;
}

export interface SharePostRequestBody {
  sharedPublishedItemId: string;
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
    sharedPublishedItemId,
    caption,
    hashtags,
    scheduledPublicationTimestamp,
    expirationTimestamp,
  } = requestBody;

  const publishedItemId: string = uuidv4();

  const { clientUserId, errorResponse: error } = await checkAuthorization(
    controller,
    request,
  );
  if (error) return error;

  const now = Date.now();

  const creationTimestamp = now;

  //////////////////////////////////////////////////
  // GET SHARED ITEM ///////////////////////////////
  //////////////////////////////////////////////////

  const getPublishedItemByIdResponse =
    await controller.databaseService.tableNameToServicesMap.publishedItemsTableService.getPublishedItemById(
      { controller, id: sharedPublishedItemId },
    );
  if (getPublishedItemByIdResponse.type === EitherType.failure) {
    return getPublishedItemByIdResponse;
  }
  let uncompiledBasePublishedItemBeingShared = getPublishedItemByIdResponse.success;

  if (!!uncompiledBasePublishedItemBeingShared.idOfPublishedItemBeingShared) {
    const getPublishedItemByIdResponse =
      await controller.databaseService.tableNameToServicesMap.publishedItemsTableService.getPublishedItemById(
        {
          controller,
          id: uncompiledBasePublishedItemBeingShared.idOfPublishedItemBeingShared,
        },
      );
    if (getPublishedItemByIdResponse.type === EitherType.failure) {
      return getPublishedItemByIdResponse;
    }
    uncompiledBasePublishedItemBeingShared = getPublishedItemByIdResponse.success;
  }

  const constructPublishedItemFromPartsResponse = await constructPublishedItemFromParts({
    controller,
    blobStorageService: controller.blobStorageService,
    databaseService: controller.databaseService,
    uncompiledBasePublishedItem: uncompiledBasePublishedItemBeingShared,
    requestorUserId: clientUserId,
  });
  if (constructPublishedItemFromPartsResponse.type === EitherType.failure) {
    return constructPublishedItemFromPartsResponse;
  }
  const { success: sharedRenderablePublishedItem } =
    constructPublishedItemFromPartsResponse;

  //////////////////////////////////////////////////
  // END OF | GET SHARED ITEM //////////////////////
  //////////////////////////////////////////////////

  const lowercaseCaption = caption.toLowerCase();

  const createPublishedItemResponse =
    await controller.databaseService.tableNameToServicesMap.publishedItemsTableService.createPublishedItem(
      {
        controller,
        publishedItemId: publishedItemId,
        type: PublishedItemType.POST,
        creationTimestamp,
        authorUserId: clientUserId,
        caption: lowercaseCaption,
        scheduledPublicationTimestamp: scheduledPublicationTimestamp ?? now,
        expirationTimestamp,
        idOfPublishedItemBeingShared: sharedPublishedItemId,
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
        publishedItemId: publishedItemId,
      },
    );
  if (addHashtagsToPublishedItemResponse.type === EitherType.failure) {
    return addHashtagsToPublishedItemResponse;
  }

  return Success({
    renderablePost: {
      id: publishedItemId,
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
      sharedItem: sharedRenderablePublishedItem as RootRenderablePost,
    },
  });
}
