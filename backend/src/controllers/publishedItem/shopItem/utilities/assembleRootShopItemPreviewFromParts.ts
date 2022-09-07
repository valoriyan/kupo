import { Controller } from "tsoa";
import { BlobStorageServiceInterface } from "../../../../services/blobStorageService/models";
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

export async function assembleRootShopItemPreviewFromParts({
  controller,
  blobStorageService,
  databaseService,
  baseRenderablePublishedItem,
}: {
  controller: Controller;
  blobStorageService: BlobStorageServiceInterface;
  databaseService: DatabaseService;
  baseRenderablePublishedItem: BaseRenderablePublishedItem;
}): Promise<InternalServiceResponse<ErrorReasonTypes<string>, RootShopItemPreview>> {
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

  const getShopItemPurchasedMediaElementsMetadataResponse =
    await databaseService.tableNameToServicesMap.shopItemMediaElementsTableService.getShopItemPurchasedMediaElementsMetadata(
      { controller, publishedItemId: id },
    );
  if (getShopItemPurchasedMediaElementsMetadataResponse.type === EitherType.failure) {
    return getShopItemPurchasedMediaElementsMetadataResponse;
  }
  const { success: purchasedMediaElementsMetadata } =
    getShopItemPurchasedMediaElementsMetadataResponse;

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
    mediaElements: previewMediaElements,
    purchasedMediaElementsMetadata,
  };

  return Success(rootShopItemPreview);
}
