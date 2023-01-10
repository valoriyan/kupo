import { v4 as uuidv4 } from "uuid";
import {
  EitherType,
  ErrorReasonTypes,
  SecuredHTTPResponse,
  Success,
} from "../../../utilities/monads";
import { PostController } from "./postController";
import express from "express";
import { checkAuthentication } from "../../auth/utilities";
import { RenderablePost, RootRenderablePost } from "./models";
import { PublishedItemType } from "../models";
import { assemblePublishedItemFromCachedComponents } from "../utilities/assemblePublishedItems";
import { assembleRecordAndSendNewShareOfPublishedItemNotification } from "../../../controllers/notification/notificationSenders/assembleRecordAndSendNewShareOfPublishedItemNotification";

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
  //////////////////////////////////////////////////
  // Inputs & Authentication
  //////////////////////////////////////////////////

  const {
    sharedPublishedItemId,
    caption,
    hashtags,
    scheduledPublicationTimestamp,
    expirationTimestamp,
  } = requestBody;

  const publishedItemId: string = uuidv4();

  const { clientUserId, errorResponse: error } = await checkAuthentication(
    controller,
    request,
  );
  if (error) return error;

  const now = Date.now();

  const creationTimestamp = now;

  //////////////////////////////////////////////////
  // Get Shared Published Item
  //////////////////////////////////////////////////

  const getPublishedItemByIdResponse =
    await controller.databaseService.tableNameToServicesMap.publishedItemsTableService.getPublishedItemById(
      { controller, id: sharedPublishedItemId },
    );
  if (getPublishedItemByIdResponse.type === EitherType.failure) {
    return getPublishedItemByIdResponse;
  }
  let uncompiledBasePublishedItemBeingShared = getPublishedItemByIdResponse.success;

  //////////////////////////////////////////////////
  // If the Shared Published Item is Itself Sharing a Published Item
  // Move Pointer to What Is Actually Being Shared
  //////////////////////////////////////////////////

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

  //////////////////////////////////////////////////
  // Construct the Renderable Item Being Shared
  //////////////////////////////////////////////////

  const constructPublishedItemFromPartsResponse =
    await assemblePublishedItemFromCachedComponents({
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
  // Write to DB
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

  //////////////////////////////////////////////////
  // Write Hashtags to DB
  //////////////////////////////////////////////////

  const lowercaseHashtags = hashtags.map((hashtag) => hashtag.toLowerCase());

  const addHashtagsToPublishedItemResponse =
    await controller.databaseService.tableNameToServicesMap.publishedItemHashtagsTableService.addHashtagsToPublishedItem(
      {
        controller,
        hashtags: lowercaseHashtags,
        publishedItemId: publishedItemId,
      },
    );
  if (addHashtagsToPublishedItemResponse.type === EitherType.failure) {
    return addHashtagsToPublishedItemResponse;
  }

  //////////////////////////////////////////////////
  // Assemble Renderable Post
  //////////////////////////////////////////////////

  const renderablePost: RenderablePost = {
    host: "user-self-hosted",
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
  };

  //////////////////////////////////////////////////
  // Handle Notifications
  //////////////////////////////////////////////////

  assembleRecordAndSendNewShareOfPublishedItemNotification({
    controller,
    sourcePublishedItemId: sharedPublishedItemId,
    newPublishedItemId: publishedItemId,
    userIdSharingPublishedItem: clientUserId,
    recipientUserId: uncompiledBasePublishedItemBeingShared.authorUserId,
    databaseService: controller.databaseService,
    blobStorageService: controller.blobStorageService,
    webSocketService: controller.webSocketService,
  });

  //////////////////////////////////////////////////
  // Return
  //////////////////////////////////////////////////

  return Success({
    renderablePost,
  });
}
