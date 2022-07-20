import { BlobStorageServiceInterface } from "../../services/blobStorageService/models";
import { DatabaseService } from "../../services/databaseService";
import {
  BaseRenderablePublishedItem,
  PublishedItemType,
  RenderablePublishedItem,
  UncompiledBasePublishedItem,
} from "./models";
import { constructRenderablePostFromParts } from "./post/utilities";
import { constructRenderableShopItemFromParts } from "./shopItem/utilities";
import { Promise as BluebirdPromise } from "bluebird";
import { Controller } from "tsoa";
import {
  collectMappedResponses,
  EitherType,
  ErrorReasonTypes,
  InternalServiceResponse,
  Success,
} from "../../utilities/monads";

export async function constructPublishedItemsFromParts({
  controller,
  blobStorageService,
  databaseService,
  uncompiledBasePublishedItems,
  clientUserId,
}: {
  controller: Controller;
  blobStorageService: BlobStorageServiceInterface;
  databaseService: DatabaseService;
  uncompiledBasePublishedItems: UncompiledBasePublishedItem[];
  clientUserId: string | undefined;
}): Promise<
  InternalServiceResponse<ErrorReasonTypes<string>, RenderablePublishedItem[]>
> {
  const constructPublishedItemFromPartsResponses = await BluebirdPromise.map(
    uncompiledBasePublishedItems,
    async (uncompiledBasePublishedItem) =>
      await constructPublishedItemFromParts({
        controller,
        blobStorageService,
        databaseService,
        uncompiledBasePublishedItem,
        clientUserId,
      }),
  );

  return collectMappedResponses({
    mappedResponses: constructPublishedItemFromPartsResponses,
  });
}

export async function constructPublishedItemFromParts({
  controller,
  blobStorageService,
  databaseService,
  uncompiledBasePublishedItem,
  clientUserId,
}: {
  controller: Controller;
  blobStorageService: BlobStorageServiceInterface;
  databaseService: DatabaseService;
  uncompiledBasePublishedItem: UncompiledBasePublishedItem;
  clientUserId: string | undefined;
}): Promise<InternalServiceResponse<ErrorReasonTypes<string>, RenderablePublishedItem>> {
  if (uncompiledBasePublishedItem.type === PublishedItemType.POST) {
    return await constructRenderablePostFromParts({
      controller,
      blobStorageService,
      databaseService,
      uncompiledBasePublishedItem,
      clientUserId,
    });
  } else {
    return await constructRenderableShopItemFromParts({
      controller,
      blobStorageService,
      databaseService,
      uncompiledBasePublishedItem,
      clientUserId,
    });
  }
}

export async function assembleBaseRenderablePublishedItem({
  controller,
  databaseService,
  uncompiledBasePublishedItem,
  clientUserId,
}: {
  controller: Controller;
  databaseService: DatabaseService;
  uncompiledBasePublishedItem: UncompiledBasePublishedItem;
  clientUserId: string | undefined;
}): Promise<
  InternalServiceResponse<ErrorReasonTypes<string>, BaseRenderablePublishedItem>
> {
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

  const countCommentsOnPostIdResponse =
    await databaseService.tableNameToServicesMap.postCommentsTableService.countCommentsOnPostId(
      {
        controller,
        postId: id,
      },
    );
  if (countCommentsOnPostIdResponse.type === EitherType.failure) {
    return countCommentsOnPostIdResponse;
  }
  const { success: countOfCommentsOnPost } = countCommentsOnPostIdResponse;

  let isLikedByClient = false;
  if (!!clientUserId) {
    const doesUserIdLikePublishedItemIdResponse =
      await databaseService.tableNameToServicesMap.publishedItemLikesTableService.doesUserIdLikePublishedItemId(
        {
          controller,
          userId: clientUserId,
          publishedItemId: id,
        },
      );
    if (doesUserIdLikePublishedItemIdResponse.type === EitherType.failure) {
      return doesUserIdLikePublishedItemIdResponse;
    }
    isLikedByClient = doesUserIdLikePublishedItemIdResponse.success;
  }

  let isSavedByClient = false;
  if (!!clientUserId) {
    const doesUserIdSavePublishedItemIdResponse =
      await databaseService.tableNameToServicesMap.savedItemsTableService.doesUserIdSavePublishedItemId(
        {
          controller,
          userId: clientUserId,
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
