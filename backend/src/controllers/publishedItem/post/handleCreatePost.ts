import { v4 as uuidv4 } from "uuid";
import {
  EitherType,
  ErrorReasonTypes,
  Failure,
  InternalServiceResponse,
  SecuredHTTPResponse,
  Success,
} from "../../../utilities/monads";
import {
  unwrapListOfEitherResponses,
  UnwrapListOfEitherResponsesFailureHandlingMethod,
} from "../../../utilities/monads/unwrapListOfResponses";
import { PostController } from "./postController";
import express from "express";
import { Promise as BluebirdPromise } from "bluebird";
import { checkAuthorization } from "../../auth/utilities";
import { RenderablePost } from "./models";
import { uploadMediaFile } from "../../utilities/mediaFiles/uploadMediaFile";
import { checkValidityOfMediaFiles } from "../../utilities/mediaFiles/checkValidityOfMediaFiles";
import { GenericResponseFailedReason, MediaElement } from "../../models";
import { PublishedItemType, RenderablePublishedItem } from "../models";
import { Controller } from "tsoa";
import { collectTagsFromText } from "../../../controllers/utilities/collectTagsFromText";
import { DatabaseService } from "../../../services/databaseService";
import { BlobStorageServiceInterface } from "../../../services/blobStorageService/models";
import { WebSocketService } from "../../../services/webSocketService";
import { assembleRecordAndSendNewTagInPublishedItemCaptionNotification } from "../../../controllers/notification/notificationSenders/assembleRecordAndSendNewTagInPublishedItemCaptionNotification";

export enum CreatePostFailedReason {
  UnknownCause = "Unknown Cause",
  ExpirationTimestampIsInPast = "Expiration Timestamp is in Past",
  ScheduledPublicationTimestampIsInPast = "Scheduled Publication Timestamp is in Past",
}

export interface CreatePostSuccess {
  renderablePost: RenderablePost;
}

interface HandlerRequestBody {
  mediaFiles: Express.Multer.File[];
  caption: string;
  hashtags: string[];
  scheduledPublicationTimestamp?: number;
  expirationTimestamp?: number;
}

export async function handleCreatePost({
  controller,
  request,
  requestBody,
}: {
  controller: PostController;
  request: express.Request;
  requestBody: HandlerRequestBody;
}): Promise<
  SecuredHTTPResponse<
    ErrorReasonTypes<string | CreatePostFailedReason>,
    CreatePostSuccess
  >
> {
  //////////////////////////////////////////////////
  // Inputs & Authentication
  //////////////////////////////////////////////////
  const {
    caption,
    scheduledPublicationTimestamp,
    hashtags,
    mediaFiles,
    expirationTimestamp,
  } = requestBody;

  const { clientUserId, errorResponse: error } = await checkAuthorization(
    controller,
    request,
  );
  if (error) return error;

  const publishedItemId: string = uuidv4();
  const now = Date.now();

  const creationTimestamp = now;

  //////////////////////////////////////////////////
  // Write to db
  //////////////////////////////////////////////////

  const createPublishedItemResponse =
    await controller.databaseService.tableNameToServicesMap.publishedItemsTableService.createPublishedItem(
      {
        controller,
        publishedItemId,
        type: PublishedItemType.POST,
        creationTimestamp,
        authorUserId: clientUserId,
        caption,
        scheduledPublicationTimestamp: scheduledPublicationTimestamp ?? now,
        expirationTimestamp,
      },
    );
  if (createPublishedItemResponse.type === EitherType.failure) {
    return createPublishedItemResponse;
  }

  //////////////////////////////////////////////////
  // Upload media files
  //////////////////////////////////////////////////
  const mediaFileErrors = await checkValidityOfMediaFiles({ files: mediaFiles });
  if (mediaFileErrors.length > 0) {
    return {
      type: EitherType.failure,
      error: { reason: CreatePostFailedReason.UnknownCause },
    };
  }

  const uploadMediaFileResponses = await BluebirdPromise.map(mediaFiles, async (file) =>
    uploadMediaFile({
      controller,
      file,
      blobStorageService: controller.blobStorageService,
    }),
  );
  const mappedUploadMediaFileResponses = unwrapListOfEitherResponses({
    eitherResponses: uploadMediaFileResponses,
    failureHandlingMethod:
      UnwrapListOfEitherResponsesFailureHandlingMethod.SUCCEED_WITH_ANY_SUCCESSES_ELSE_RETURN_FIRST_FAILURE,
  });
  if (mappedUploadMediaFileResponses.type === EitherType.failure) {
    return mappedUploadMediaFileResponses;
  }
  const { success: filedAndRenderablePostMediaElements } = mappedUploadMediaFileResponses;

  const mediaElements: MediaElement[] = filedAndRenderablePostMediaElements.map(
    (filedAndRenderablePostMediaElement) => ({
      temporaryUrl: filedAndRenderablePostMediaElement.fileTemporaryUrl,
      mimeType: filedAndRenderablePostMediaElement.mimetype,
    }),
  );

  const mediaElementTemporaryUrls = filedAndRenderablePostMediaElements.map(
    (filedAndRenderablePostMediaElement) =>
      filedAndRenderablePostMediaElement.fileTemporaryUrl,
  );

  if (filedAndRenderablePostMediaElements.length > 0) {
    await controller.databaseService.tableNameToServicesMap.postContentElementsTableService.createPostContentElements(
      {
        controller,
        postContentElements: filedAndRenderablePostMediaElements.map(
          ({ blobFileKey, mimetype }, index) => ({
            publishedItemId,
            postContentElementIndex: index,
            blobFileKey,
            mimetype,
          }),
        ),
      },
    );
  }

  //////////////////////////////////////////////////
  // Add hashtags
  //////////////////////////////////////////////////

  const lowerCaseHashtags = hashtags.map((hashtag) => hashtag.toLowerCase());

  const addHashtagsToPublishedItemResponse =
    await controller.databaseService.tableNameToServicesMap.publishedItemHashtagsTableService.addHashtagsToPublishedItem(
      {
        controller,
        hashtags: lowerCaseHashtags,
        publishedItemId: publishedItemId,
      },
    );
  if (addHashtagsToPublishedItemResponse.type === EitherType.failure) {
    return addHashtagsToPublishedItemResponse;
  }

  //////////////////////////////////////////////////
  // Add hashtags
  //////////////////////////////////////////////////

  const selectMaybeUserByUserIdResponse =
    await controller.databaseService.tableNameToServicesMap.usersTableService.selectMaybeUserByUserId(
      { controller, userId: clientUserId },
    );
  if (selectMaybeUserByUserIdResponse.type === EitherType.failure) {
    return selectMaybeUserByUserIdResponse;
  }
  const { success: maybeUser } = selectMaybeUserByUserIdResponse;

  if (!maybeUser) {
    return Failure({
      controller,
      httpStatusCode: 404,
      reason: GenericResponseFailedReason.DATABASE_TRANSACTION_ERROR,
      error: "User not found at handleCreatePost",
      additionalErrorInformation: "User not found at handleCreatePost",
    });
  }
  const unrenderableUser = maybeUser;

  //////////////////////////////////////////////////
  // Compile Post
  //////////////////////////////////////////////////

  const renderablePost: RenderablePost = {
    type: PublishedItemType.POST,
    id: publishedItemId,
    authorUserId: clientUserId,
    caption,
    creationTimestamp,
    scheduledPublicationTimestamp: scheduledPublicationTimestamp ?? now,
    expirationTimestamp,
    mediaElements,
    hashtags: lowerCaseHashtags,
    likes: {
      count: 0,
    },
    comments: {
      count: 0,
    },
    isLikedByClient: false,
    isSavedByClient: false,
  };

  //////////////////////////////////////////////////
  // Send out relevant notifications
  //////////////////////////////////////////////////

  const considerAndExecuteNotificationsResponse = await considerAndExecuteNotifications({
    controller,
    renderablePublishedItem: renderablePost,
    databaseService: controller.databaseService,
    blobStorageService: controller.blobStorageService,
    webSocketService: controller.webSocketService,
  });
  if (considerAndExecuteNotificationsResponse.type === EitherType.failure) {
    return considerAndExecuteNotificationsResponse;
  }

  await controller.webSocketService.notifyOfNewPublishedItem({
    recipientUserId: clientUserId,
    previewTemporaryUrl: mediaElementTemporaryUrls[0],
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    username: unrenderableUser!.username,
  });

  //////////////////////////////////////////////////
  // Return
  //////////////////////////////////////////////////

  return Success({
    renderablePost,
  });
}

async function considerAndExecuteNotifications({
  controller,
  renderablePublishedItem,
  databaseService,
  blobStorageService,
  webSocketService,
}: {
  controller: Controller;
  renderablePublishedItem: RenderablePublishedItem;
  databaseService: DatabaseService;
  blobStorageService: BlobStorageServiceInterface;
  webSocketService: WebSocketService;
}): Promise<InternalServiceResponse<ErrorReasonTypes<string>, {}>> {
  //////////////////////////////////////////////////
  // Get usernames tagged in caption
  //////////////////////////////////////////////////
  const { caption, authorUserId } = renderablePublishedItem;

  const tags = collectTagsFromText({ text: caption });

  //////////////////////////////////////////////////
  // Get user ids associated with tagged usernames
  //////////////////////////////////////////////////

  const selectUsersByUsernamesResponse =
    await databaseService.tableNameToServicesMap.usersTableService.selectUsersByUsernames(
      { controller, usernames: tags },
    );
  if (selectUsersByUsernamesResponse.type === EitherType.failure) {
    return selectUsersByUsernamesResponse;
  }
  const { success: foundUnrenderableUsersMatchingTags } = selectUsersByUsernamesResponse;

  const foundUserIdsMatchingTags = foundUnrenderableUsersMatchingTags
    .map(({ userId }) => userId)
    .filter((userId) => userId !== authorUserId);

  //////////////////////////////////////////////////
  // Send tagged caption notifications to everyone tagged
  //////////////////////////////////////////////////
  const assembleRecordAndSendNewTagInPublishedItemCaptionNotificationResponses =
    await BluebirdPromise.map(
      foundUserIdsMatchingTags,
      async (taggedUserId) =>
        await assembleRecordAndSendNewTagInPublishedItemCaptionNotification({
          controller,
          publishedItemId: renderablePublishedItem.id,
          recipientUserId: taggedUserId,
          databaseService,
          blobStorageService,
          webSocketService,
        }),
    );

  const mappedResponse = unwrapListOfEitherResponses({
    eitherResponses:
      assembleRecordAndSendNewTagInPublishedItemCaptionNotificationResponses,
    failureHandlingMethod:
      UnwrapListOfEitherResponsesFailureHandlingMethod.SUCCEED_WITH_ANY_SUCCESSES_ELSE_RETURN_FIRST_FAILURE,
  });
  if (mappedResponse.type === EitherType.failure) {
    return mappedResponse;
  }

  //////////////////////////////////////////////////
  // Return
  //////////////////////////////////////////////////
  return Success({});
}
