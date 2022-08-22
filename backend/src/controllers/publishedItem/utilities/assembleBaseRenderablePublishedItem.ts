import { DatabaseService } from "../../../services/databaseService";
import { BaseRenderablePublishedItem, UncompiledBasePublishedItem } from "../models";
import { Controller } from "tsoa";
import {
  EitherType,
  ErrorReasonTypes,
  InternalServiceResponse,
  Success,
} from "../../../utilities/monads";
import { assertViewingRightsOnPublishedItem } from "./viewingRights";

export async function assembleBaseRenderablePublishedItem({
  controller,
  databaseService,
  uncompiledBasePublishedItem,
  requestorUserId,
}: {
  controller: Controller;
  databaseService: DatabaseService;
  uncompiledBasePublishedItem: UncompiledBasePublishedItem;
  requestorUserId?: string;
}): Promise<
  InternalServiceResponse<ErrorReasonTypes<string>, BaseRenderablePublishedItem>
> {
  const assertViewingRightsOnPublishedItemResponse =
    await assertViewingRightsOnPublishedItem({
      controller,
      databaseService,
      uncompiledBasePublishedItem,
      requestorUserId,
    });

  if (assertViewingRightsOnPublishedItemResponse.type === EitherType.failure) {
    return assertViewingRightsOnPublishedItemResponse;
  }

  const {
    type,
    id,
    creationTimestamp,
    authorUserId,
    caption,
    scheduledPublicationTimestamp,
    expirationTimestamp,
    idOfPublishedItemBeingShared,
  } = uncompiledBasePublishedItem;

  const getHashtagsForPublishedItemIdResponse =
    await databaseService.tableNameToServicesMap.hashtagTableService.getHashtagsForPublishedItemId(
      { controller, publishedItemId: id },
    );

  if (getHashtagsForPublishedItemIdResponse.type === EitherType.failure) {
    return getHashtagsForPublishedItemIdResponse;
  }
  const { success: hashtags } = getHashtagsForPublishedItemIdResponse;

  const countLikesOnPublishedItemIdResponse =
    await databaseService.tableNameToServicesMap.publishedItemLikesTableService.countLikesOnPublishedItemId(
      {
        controller,
        publishedItemId: id,
      },
    );
  if (countLikesOnPublishedItemIdResponse.type === EitherType.failure) {
    return countLikesOnPublishedItemIdResponse;
  }
  const { success: countOfLikesOnPost } = countLikesOnPublishedItemIdResponse;

  const countCommentsOnPublishedItemIdResponse =
    await databaseService.tableNameToServicesMap.publishedItemCommentsTableService.countCommentsOnPublishedItemId(
      {
        controller,
        publishedItemId: id,
      },
    );
  if (countCommentsOnPublishedItemIdResponse.type === EitherType.failure) {
    return countCommentsOnPublishedItemIdResponse;
  }
  const { success: countOfCommentsOnPost } = countCommentsOnPublishedItemIdResponse;

  let isLikedByClient = false;
  if (!!requestorUserId) {
    const doesUserIdLikePublishedItemIdResponse =
      await databaseService.tableNameToServicesMap.publishedItemLikesTableService.doesUserIdLikePublishedItemId(
        {
          controller,
          userId: requestorUserId,
          publishedItemId: id,
        },
      );
    if (doesUserIdLikePublishedItemIdResponse.type === EitherType.failure) {
      return doesUserIdLikePublishedItemIdResponse;
    }
    isLikedByClient = doesUserIdLikePublishedItemIdResponse.success;
  }

  let isSavedByClient = false;
  if (!!requestorUserId) {
    const doesUserIdSavePublishedItemIdResponse =
      await databaseService.tableNameToServicesMap.savedItemsTableService.doesUserIdSavePublishedItemId(
        {
          controller,
          userId: requestorUserId,
          publishedItemId: id,
        },
      );
    if (doesUserIdSavePublishedItemIdResponse.type === EitherType.failure) {
      return doesUserIdSavePublishedItemIdResponse;
    }
    isSavedByClient = doesUserIdSavePublishedItemIdResponse.success;
  }

  const baseRenderablePublishedItem: BaseRenderablePublishedItem = {
    type,
    id,
    creationTimestamp,
    authorUserId,
    caption,
    scheduledPublicationTimestamp,
    expirationTimestamp,
    hashtags,
    likes: {
      count: countOfLikesOnPost,
    },
    comments: {
      count: countOfCommentsOnPost,
    },
    isLikedByClient,
    isSavedByClient,
    idOfPublishedItemBeingShared,
  };

  return Success(baseRenderablePublishedItem);
}
