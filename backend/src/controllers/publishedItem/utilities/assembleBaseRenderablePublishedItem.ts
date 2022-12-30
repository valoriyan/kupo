import { DatabaseService } from "../../../services/databaseService";
import { BaseRenderablePublishedItem, UnassembledBasePublishedItem } from "../models";
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
  uncompiledBasePublishedItem: UnassembledBasePublishedItem;
  requestorUserId?: string;
}): Promise<
  InternalServiceResponse<ErrorReasonTypes<string>, BaseRenderablePublishedItem>
> {
  //////////////////////////////////////////////////
  // Check Authorization
  //////////////////////////////////////////////////

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

  //////////////////////////////////////////////////
  // Inputs
  //////////////////////////////////////////////////

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

  //////////////////////////////////////////////////
  // Get Hashtags
  //////////////////////////////////////////////////

  const getHashtagsForPublishedItemIdResponse =
    await databaseService.tableNameToServicesMap.publishedItemHashtagsTableService.getHashtagsForPublishedItemId(
      { controller, publishedItemId: id },
    );

  if (getHashtagsForPublishedItemIdResponse.type === EitherType.failure) {
    return getHashtagsForPublishedItemIdResponse;
  }
  const { success: hashtags } = getHashtagsForPublishedItemIdResponse;

  //////////////////////////////////////////////////
  // Count Likes
  //////////////////////////////////////////////////

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

  //////////////////////////////////////////////////
  // Count Comments
  //////////////////////////////////////////////////

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

  //////////////////////////////////////////////////
  // Determine if the Client User Liked the Published Item
  //////////////////////////////////////////////////

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

  //////////////////////////////////////////////////
  // Determine if the Client User Saved the Published Item
  //////////////////////////////////////////////////

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

  //////////////////////////////////////////////////
  // Assemble the Base Renderable Published Item
  //////////////////////////////////////////////////

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

  //////////////////////////////////////////////////
  // Return
  //////////////////////////////////////////////////

  return Success(baseRenderablePublishedItem);
}
