import { BlobStorageServiceInterface } from "../../../services/blobStorageService/models";
import { DatabaseService } from "../../../services/databaseService";
import { Promise as BluebirdPromise } from "bluebird";
import {
  RenderableShopItem,
  RenderableShopItemType,
  RootShopItemPreview,
} from "./models";
import { MediaElement } from "../../models";
import { PublishedItemType, UncompiledBasePublishedItem } from "../models";
import { DBShopItemElementType } from "../../../services/databaseService/tableServices/shopItemMediaElementsTableService";

export async function constructRenderableShopItemsFromParts({
  blobStorageService,
  databaseService,
  uncompiledBasePublishedItems: uncompiledBasePublishedItems,
  clientUserId,
}: {
  blobStorageService: BlobStorageServiceInterface;
  databaseService: DatabaseService;
  uncompiledBasePublishedItems: UncompiledBasePublishedItem[];
  clientUserId: string | undefined;
}): Promise<RenderableShopItem[]> {
  const renderablePosts = await BluebirdPromise.map(
    uncompiledBasePublishedItems,
    async (uncompiledBasePublishedItem) =>
      await constructRenderableShopItemFromParts({
        blobStorageService,
        databaseService,
        uncompiledBasePublishedItem,
        clientUserId,
      }),
  );

  return renderablePosts;
}

export async function constructRenderableShopItemFromParts({
  blobStorageService,
  databaseService,
  uncompiledBasePublishedItem,
}: // clientUserId,
{
  blobStorageService: BlobStorageServiceInterface;
  databaseService: DatabaseService;
  uncompiledBasePublishedItem: UncompiledBasePublishedItem;
  clientUserId: string | undefined;
}): Promise<RenderableShopItem> {
  const {
    id: publishedItemId,
    authorUserId,
    caption,
    creationTimestamp,
    scheduledPublicationTimestamp,
    expirationTimestamp,
  } = uncompiledBasePublishedItem;

  const dbShopItem =
    await databaseService.tableNameToServicesMap.shopItemTableService.getShopItemByPublishedItemId(
      {
        publishedItemId,
      },
    );

  const filedShopItemMediaElements =
    await databaseService.tableNameToServicesMap.shopItemMediaElementTableService.getShopItemMediaElementsByPublishedItemId(
      {
        publishedItemId,
        shopItemType: DBShopItemElementType.PREVIEW_MEDIA_ELEMENT,
      },
    );

  const previewMediaElements: MediaElement[] = await BluebirdPromise.map(
    filedShopItemMediaElements,
    async (filedShopItemMediaElement): Promise<MediaElement> => {
      const { blobFileKey, mimeType } = filedShopItemMediaElement;

      const fileTemporaryUrl = await blobStorageService.getTemporaryImageUrl({
        blobItemPointer: {
          fileKey: blobFileKey,
        },
      });

      return {
        temporaryUrl: fileTemporaryUrl,
        mimeType: mimeType,
      };
    },
  );

  const hashtags =
    await databaseService.tableNameToServicesMap.hashtagTableService.getHashtagsForPublishedItemId(
      { publishedItemId },
    );

  const rootShopItemPreview: RootShopItemPreview = {
    renderableShopItemType: RenderableShopItemType.SHOP_ITEM_PREVIEW,
    type: PublishedItemType.SHOP_ITEM,
    id: publishedItemId,
    authorUserId,
    caption,
    creationTimestamp,
    scheduledPublicationTimestamp,
    expirationTimestamp,
    title: dbShopItem.title,
    hashtags,
    likes: {
      count: 0,
    },
    comments: {
      count: 0,
    },
    isLikedByClient: false,
    isSavedByClient: false,
    price: parseInt(dbShopItem.price),
    previewMediaElements,
  };

  return rootShopItemPreview;
}
