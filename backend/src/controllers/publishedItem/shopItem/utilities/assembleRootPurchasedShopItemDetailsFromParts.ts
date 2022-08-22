import { Controller } from "tsoa";
import { BlobStorageServiceInterface } from "../../../../services/blobStorageService/models";
import { DatabaseService } from "../../../../services/databaseService";
import { DBShopItemElementType } from "../../../../services/databaseService/tableServices/shopItemMediaElementsTableService";
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
  blobStorageService: BlobStorageServiceInterface;
  databaseService: DatabaseService;
  baseRenderablePublishedItem: BaseRenderablePublishedItem;
}): Promise<
  InternalServiceResponse<ErrorReasonTypes<string>, RootPurchasedShopItemDetails>
> {
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

  const getShopItemByPublishedItemIdResponse =
    await databaseService.tableNameToServicesMap.shopItemTableService.getShopItemByPublishedItemId(
      {
        controller,
        publishedItemId: id,
      },
    );
  if (getShopItemByPublishedItemIdResponse.type === EitherType.failure) {
    return getShopItemByPublishedItemIdResponse;
  }
  const { success: dbShopItem } = getShopItemByPublishedItemIdResponse;

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

  return Success(rootPurchasedShopItemDetails);
}
