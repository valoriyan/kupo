import { Controller } from "tsoa";
import { BlobStorageService } from "../../../../services/blobStorageService";
import { DatabaseService } from "../../../../services/databaseService";
import { DBShopItemElementType } from "../../../../services/databaseService/tableServices/publishedItem/shopItemMediaElementsTableService";
import {
  EitherType,
  ErrorReasonTypes,
  InternalServiceResponse,
  Success,
} from "../../../../utilities/monads";
import { BaseRenderablePublishedItem, PublishedItemType } from "../../models";
import { RenderableShopItemType, RootShopItemPreview } from "../models";
import { assembleShopItemMediaElements } from "./assembleShopItemMediaElements";

export async function assembleRootShopItemPreviewFromCachedComponents({
  controller,
  blobStorageService,
  databaseService,
  baseRenderablePublishedItem,
}: {
  controller: Controller;
  blobStorageService: BlobStorageService;
  databaseService: DatabaseService;
  baseRenderablePublishedItem: BaseRenderablePublishedItem;
}): Promise<InternalServiceResponse<ErrorReasonTypes<string>, RootShopItemPreview>> {
  //////////////////////////////////////////////////
  // Inputs
  //////////////////////////////////////////////////

  const {
    id,
    host,
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

  //////////////////////////////////////////////////
  // Read Shop Item From DB
  //////////////////////////////////////////////////

  const getShopItemByPublishedItemIdResponse =
    await databaseService.tableNameToServicesMap.shopItemsTableService.getShopItemByPublishedItemId(
      {
        controller,
        publishedItemId: id,
      },
    );
  if (getShopItemByPublishedItemIdResponse.type === EitherType.failure) {
    return getShopItemByPublishedItemIdResponse;
  }
  const { success: dbShopItem } = getShopItemByPublishedItemIdResponse;

  //////////////////////////////////////////////////
  // Assemble Shop Item
  //////////////////////////////////////////////////

  const assembleShopItemPreviewMediaElementsResponse =
    await assembleShopItemMediaElements({
      controller,
      publishedItemId: id,
      shopItemType: DBShopItemElementType.PREVIEW_MEDIA_ELEMENT,
      blobStorageService,
      databaseService,
    });
  if (assembleShopItemPreviewMediaElementsResponse.type === EitherType.failure) {
    return assembleShopItemPreviewMediaElementsResponse;
  }
  const { success: previewMediaElements } = assembleShopItemPreviewMediaElementsResponse;

  //////////////////////////////////////////////////
  // Get Count of Shop Item Purchased Media Elements
  //////////////////////////////////////////////////

  const getShopItemPurchasedMediaElementsMetadataResponse =
    await databaseService.tableNameToServicesMap.shopItemMediaElementsTableService.getShopItemPurchasedMediaElementsMetadata(
      { controller, publishedItemId: id },
    );
  if (getShopItemPurchasedMediaElementsMetadataResponse.type === EitherType.failure) {
    return getShopItemPurchasedMediaElementsMetadataResponse;
  }
  const { success: purchasedMediaElementsMetadata } =
    getShopItemPurchasedMediaElementsMetadataResponse;

  //////////////////////////////////////////////////
  // Assemble RootShopItemPreview
  //////////////////////////////////////////////////

  const rootShopItemPreview: RootShopItemPreview = {
    renderableShopItemType: RenderableShopItemType.SHOP_ITEM_PREVIEW,
    type: PublishedItemType.SHOP_ITEM,
    id,
    host,
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
    mediaElements: previewMediaElements,
    purchasedMediaElementsMetadata,
  };

  //////////////////////////////////////////////////
  // Return
  //////////////////////////////////////////////////

  return Success(rootShopItemPreview);
}
