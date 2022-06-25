import { BlobStorageServiceInterface } from "../../services/blobStorageService/models";
import { DatabaseService } from "../../services/databaseService";
import { BaseRenderablePublishedItem, PublishedItemType, UncompiledBasePublishedItem } from "./models";
import { RenderablePost } from "./post/models";
import { constructRenderablePostFromParts } from "./post/utilities";
import { RenderableShopItem } from "./shopItem/models";
import { constructRenderableShopItemFromParts } from "./shopItem/utilities";
import { Promise as BluebirdPromise } from "bluebird";

export async function constructPublishedItemsFromParts({
  blobStorageService,
  databaseService,
  uncompiledBasePublishedItems,
  clientUserId,
}: {
  blobStorageService: BlobStorageServiceInterface;
  databaseService: DatabaseService;
  uncompiledBasePublishedItems: UncompiledBasePublishedItem[];
  clientUserId: string | undefined;
}): Promise<(RenderablePost | RenderableShopItem)[]> {
  return await BluebirdPromise.map(
    uncompiledBasePublishedItems,
    async (uncompiledBasePublishedItem) =>
      await constructRenderableShopItemFromParts({
        blobStorageService,
        databaseService,
        uncompiledBasePublishedItem,
        clientUserId,
      }),
  );
}

export async function constructPublishedItemFromParts({
  blobStorageService,
  databaseService,
  uncompiledBasePublishedItem,
  clientUserId,
}: {
  blobStorageService: BlobStorageServiceInterface;
  databaseService: DatabaseService;
  uncompiledBasePublishedItem: UncompiledBasePublishedItem;
  clientUserId: string | undefined;
}): Promise<RenderablePost | RenderableShopItem> {

  if (uncompiledBasePublishedItem.type === PublishedItemType.POST) {
    return await constructRenderablePostFromParts({
      blobStorageService,
      databaseService,
      uncompiledBasePublishedItem,
      clientUserId,    
    });
  } else {
    return await constructRenderableShopItemFromParts({
      blobStorageService,
      databaseService,
      uncompiledBasePublishedItem,
      clientUserId,
    });
  }
}

export async function assembleBaseRenderablePublishedItem({
  databaseService,
  uncompiledBasePublishedItem,
  clientUserId,
}: {
  databaseService: DatabaseService;
  uncompiledBasePublishedItem: UncompiledBasePublishedItem;
  clientUserId: string | undefined;
}): Promise<BaseRenderablePublishedItem> {
  const {
    type,
    id,
    creationTimestamp,
    authorUserId,
    caption,
    scheduledPublicationTimestamp,
    expirationTimestamp,
  } = uncompiledBasePublishedItem;

  const hashtags =
    await databaseService.tableNameToServicesMap.hashtagTableService.getHashtagsForPublishedItemId(
      { publishedItemId: id },
    );

  const countOfLikesOnPost =
    await databaseService.tableNameToServicesMap.publishedItemLikesTableService.countLikesOnPublishedItemId(
      {
        publishedItemId: id,
      },
    );

  const countOfCommentsOnPost =
    await databaseService.tableNameToServicesMap.postCommentsTableService.countCommentsOnPostId(
      {
        postId: id,
      },
    );

  const isLikedByClient =
    !!clientUserId &&
    (await databaseService.tableNameToServicesMap.publishedItemLikesTableService.doesUserIdLikePublishedItemId(
      {
        userId: clientUserId,
        publishedItemId: id,
      },
    ));

  const isSavedByClient =
    !!clientUserId &&
    (await databaseService.tableNameToServicesMap.savedItemsTableService.doesUserIdSavePublishedItemId(
      {
        userId: clientUserId,
        publishedItemId: id,
      },
    ));

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
  };

  return baseRenderablePublishedItem;
}
