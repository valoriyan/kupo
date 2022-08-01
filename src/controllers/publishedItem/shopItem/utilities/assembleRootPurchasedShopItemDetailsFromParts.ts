import { BlobStorageServiceInterface } from "../../../../services/blobStorageService/models";
import { DatabaseService } from "../../../../services/databaseService";
import { RenderableShopItemType, RootPurchasedShopItemDetails } from "../models";
import { BaseRenderablePublishedItem, PublishedItemType } from "../../models";
import { Controller } from "tsoa";
import {
  EitherType,
  ErrorReasonTypes,
  InternalServiceResponse,
  Success,
} from "../../../../utilities/monads";
import { assembleShopItemPreviewMediaElements } from "./assembleShopItemPreviewMediaElements";

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
    await assembleShopItemPreviewMediaElements({
      controller,
      publishedItemId: id,
      blobStorageService,
      databaseService,
    });
  if (assembleShopItemPreviewMediaElementsResponse.type === EitherType.failure) {
    return assembleShopItemPreviewMediaElementsResponse;
  }
  const { success: previewMediaElements } = assembleShopItemPreviewMediaElementsResponse;

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
    purchasedMediaElements: [],
  };

  return Success(rootPurchasedShopItemDetails);
}
