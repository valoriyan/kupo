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
import { RenderableShopItemType, RootPurchasedShopItemDetails } from "../models";
import { assembleShopItemMediaElements } from "./assembleShopItemMediaElements";

export async function assembleRootPurchasedShopItemDetailsFromParts({
  controller,
  blobStorageService,
  databaseService,
  baseRenderablePublishedItem,
}: {
  controller: Controller;
  blobStorageService: BlobStorageService;
  databaseService: DatabaseService;
  baseRenderablePublishedItem: BaseRenderablePublishedItem;
}): Promise<
  InternalServiceResponse<ErrorReasonTypes<string>, RootPurchasedShopItemDetails>
> {
  //////////////////////////////////////////////////
  // Parse Inputs
  //////////////////////////////////////////////////

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

  //////////////////////////////////////////////////
  // Get Unrenderable Shop Item
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
  // Get Preview Media Elements
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
  // Get Purchased Media Elements
  //////////////////////////////////////////////////

  const assembleShopItemPurchasedMediaElementsResponse =
    await assembleShopItemMediaElements({
      controller,
      publishedItemId: id,
      shopItemType: DBShopItemElementType.PURCHASED_MEDIA_ELEMENT,
      blobStorageService,
      databaseService,
    });
  if (assembleShopItemPurchasedMediaElementsResponse.type === EitherType.failure) {
    return assembleShopItemPurchasedMediaElementsResponse;
  }
  const { success: purchasedMediaElements } =
    assembleShopItemPurchasedMediaElementsResponse;

  //////////////////////////////////////////////////
  // Assemble Root Purchased Shop Item Details
  //////////////////////////////////////////////////

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
    mediaElements: previewMediaElements,
    purchasedMediaElements,
    purchasedMediaElementsMetadata: { count: purchasedMediaElements.length },
  };

  //////////////////////////////////////////////////
  // Return
  //////////////////////////////////////////////////

  return Success(rootPurchasedShopItemDetails);
}
