import { BlobStorageServiceInterface } from "../../../services/blobStorageService/models";
import { DatabaseService } from "../../../services/databaseService";
import { Promise as BluebirdPromise } from "bluebird";
import {
  RenderableShopItem,
  RenderableShopItemType,
  RootPurchasedShopItemDetails,
  RootShopItemPreview,
  SharedShopItem,
} from "./models";
import { MediaElement } from "../../models";
import { BaseRenderablePublishedItem, PublishedItemType, UncompiledBasePublishedItem } from "../models";
import { DBShopItemElementType } from "../../../services/databaseService/tableServices/shopItemMediaElementsTableService";
import { assembleBaseRenderablePublishedItem } from "../utilities";

export async function constructRenderableShopItemsFromParts({
  blobStorageService,
  databaseService,
  uncompiledBasePublishedItems,
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
  clientUserId,
}:
{
  blobStorageService: BlobStorageServiceInterface;
  databaseService: DatabaseService;
  uncompiledBasePublishedItem: UncompiledBasePublishedItem;
  clientUserId: string | undefined;
}): Promise<RenderableShopItem> {

  const baseRenderablePublishedItem = await assembleBaseRenderablePublishedItem({
    databaseService,
    uncompiledBasePublishedItem,
    clientUserId,
  });  

  const {
    id,
    idOfPublishedItemBeingShared,
  } = baseRenderablePublishedItem;



  if (!!idOfPublishedItemBeingShared) {
    const sharedShopItem =  await assembleSharedShopItemFromParts({
      blobStorageService,
      databaseService,
      baseRenderablePublishedItem,
      clientUserId,
    });

    return sharedShopItem;
  } else {
    const hasPublishedItemBeenPurchasedByUserId = !!clientUserId && await databaseService.tableNameToServicesMap.publishedItemTransactionsTableService.hasPublishedItemBeenPurchasedByUserId({
      publishedItemId: id,
      nonCreatorUserId: clientUserId,
    });

    if (hasPublishedItemBeenPurchasedByUserId) {
      const rootPurchasedShopItemDetails = await assembleRootPurchasedShopItemDetailsFromParts({
        blobStorageService,
        databaseService,
        baseRenderablePublishedItem,
      });
      return rootPurchasedShopItemDetails;
    } else {
      const rootShopItemPreview = await assembleRootShopItemPreviewFromParts({
        blobStorageService,
        databaseService,
        baseRenderablePublishedItem,
      });
      return rootShopItemPreview;
    }
  }


}



async function assembleSharedShopItemFromParts({
  blobStorageService,
  databaseService,
  baseRenderablePublishedItem,
  clientUserId,
}:
{
  blobStorageService: BlobStorageServiceInterface;
  databaseService: DatabaseService;
  baseRenderablePublishedItem: BaseRenderablePublishedItem;
  clientUserId: string | undefined;
}): Promise<SharedShopItem> {

  const {
    id,
    creationTimestamp,
    authorUserId,
    caption,
    scheduledPublicationTimestamp,
    expirationTimestamp,
    hashtags,
    likes,
    comments,
    isLikedByClient,
    isSavedByClient,
    idOfPublishedItemBeingShared
  } = baseRenderablePublishedItem;

  const sharedUncompiledBasePublishedItem = await databaseService.tableNameToServicesMap.publishedItemsTableService.getPublishedItemById({id: idOfPublishedItemBeingShared!});

  const sharedBaseRenderablePublishedItem = await assembleBaseRenderablePublishedItem({
    databaseService,
    uncompiledBasePublishedItem: sharedUncompiledBasePublishedItem,
    clientUserId,
  });

  const hasSharedPublishedItemBeenPurchasedByUserId = !!clientUserId && await databaseService.tableNameToServicesMap.publishedItemTransactionsTableService.hasPublishedItemBeenPurchasedByUserId({
    publishedItemId: sharedBaseRenderablePublishedItem.id,
    nonCreatorUserId: clientUserId,
  });

    
  const sharedItem =
    (hasSharedPublishedItemBeenPurchasedByUserId) ?
      await assembleRootPurchasedShopItemDetailsFromParts({
        blobStorageService,
        databaseService,
        baseRenderablePublishedItem: sharedBaseRenderablePublishedItem,
      }) :
      await assembleRootShopItemPreviewFromParts({
        blobStorageService,
        databaseService,
        baseRenderablePublishedItem: sharedBaseRenderablePublishedItem,
      })      
      ;



  const sharedShopItem: SharedShopItem = {
    type: PublishedItemType.SHOP_ITEM,
    id,
    creationTimestamp,
    authorUserId,
    caption,
    scheduledPublicationTimestamp,
    expirationTimestamp,
    hashtags,
    likes,
    comments,
    isLikedByClient,
    isSavedByClient,
    sharedItem,
  };
  return sharedShopItem;
}

async function assembleRootShopItemPreviewFromParts({
  blobStorageService,
  databaseService,
  baseRenderablePublishedItem,
}:
{
  blobStorageService: BlobStorageServiceInterface;
  databaseService: DatabaseService;
  baseRenderablePublishedItem: BaseRenderablePublishedItem;
}): Promise<RootShopItemPreview> {
  const {
    id,
    creationTimestamp,
    authorUserId,
    caption,
    scheduledPublicationTimestamp,
    expirationTimestamp,
    hashtags,
    likes,
    comments,
    isLikedByClient,
    isSavedByClient,
  } = baseRenderablePublishedItem;


  const dbShopItem =
    await databaseService.tableNameToServicesMap.shopItemTableService.getShopItemByPublishedItemId(
      {
        publishedItemId: id,
      },
    );

  const previewMediaElements = await assembleShopItemPreviewMediaElements({
    publishedItemId: id,
    blobStorageService,
    databaseService,  
  });

  const rootShopItemPreview: RootShopItemPreview = {
    renderableShopItemType: RenderableShopItemType.SHOP_ITEM_PREVIEW,
    type: PublishedItemType.SHOP_ITEM,
    id,
    authorUserId,
    caption,
    creationTimestamp,
    scheduledPublicationTimestamp,
    expirationTimestamp,
    title: dbShopItem.title,
    hashtags,
    likes,
    comments,
    isLikedByClient,
    isSavedByClient,
    price: parseInt(dbShopItem.price),
    previewMediaElements,
  };

  return rootShopItemPreview;
}


async function assembleRootPurchasedShopItemDetailsFromParts({
  blobStorageService,
  databaseService,
  baseRenderablePublishedItem,
}:
{
  blobStorageService: BlobStorageServiceInterface;
  databaseService: DatabaseService;
  baseRenderablePublishedItem: BaseRenderablePublishedItem;
}): Promise<RootPurchasedShopItemDetails> {

  const {
    id,
    creationTimestamp,
    authorUserId,
    caption,
    scheduledPublicationTimestamp,
    expirationTimestamp,
    hashtags,
    likes,
    comments,
    isLikedByClient,
    isSavedByClient,
  } = baseRenderablePublishedItem;


  const dbShopItem =
    await databaseService.tableNameToServicesMap.shopItemTableService.getShopItemByPublishedItemId(
      {
        publishedItemId: id,
      },
    );

  const previewMediaElements = await assembleShopItemPreviewMediaElements({
    publishedItemId: id,
    blobStorageService,
    databaseService,  
  });

  const rootPurchasedShopItemDetails: RootPurchasedShopItemDetails = {
    renderableShopItemType: RenderableShopItemType.PURCHASED_SHOP_ITEM_DETAILS,
    type: PublishedItemType.SHOP_ITEM,
    id,
    authorUserId,
    caption,
    creationTimestamp,
    scheduledPublicationTimestamp,
    expirationTimestamp,
    title: dbShopItem.title,
    hashtags,
    likes,
    comments,
    isLikedByClient,
    isSavedByClient,
    price: parseInt(dbShopItem.price),
    previewMediaElements,
    purchasedMediaElements: [],
  };

  return rootPurchasedShopItemDetails;

}


async function assembleShopItemPreviewMediaElements({
  publishedItemId,
  blobStorageService,
  databaseService,
}: {
  publishedItemId: string;
  blobStorageService: BlobStorageServiceInterface;
  databaseService: DatabaseService;  
}): Promise<MediaElement[]> {
  const filedShopItemPreviewMediaElements =
    await databaseService.tableNameToServicesMap.shopItemMediaElementTableService.getShopItemMediaElementsByPublishedItemId(
      {
        publishedItemId,
        shopItemType: DBShopItemElementType.PREVIEW_MEDIA_ELEMENT,
      },
    );

  const previewMediaElements: MediaElement[] = await BluebirdPromise.map(
    filedShopItemPreviewMediaElements,
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

  return previewMediaElements;
}