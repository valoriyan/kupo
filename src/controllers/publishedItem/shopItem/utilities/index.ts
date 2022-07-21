import { BlobStorageServiceInterface } from "../../../../services/blobStorageService/models";
import { DatabaseService } from "../../../../services/databaseService";
import { Promise as BluebirdPromise } from "bluebird";
import {
  RenderableShopItem,
  RootPurchasedShopItemDetails,
  RootShopItemPreview,
} from "../models";
import { PublishedItemType, UncompiledBasePublishedItem } from "../../models";
import { assembleBaseRenderablePublishedItem } from "../../utilities/assembleBaseRenderablePublishedItem";
import { Controller } from "tsoa";
import {
  collectMappedResponses,
  EitherType,
  ErrorReasonTypes,
  InternalServiceResponse,
  Success,
} from "../../../../utilities/monads";
import { assembleRootShopItemPreviewFromParts } from "./assembleRootShopItemPreviewFromParts";
import { assembleRootPurchasedShopItemDetailsFromParts } from "./assembleRootPurchasedShopItemDetailsFromParts";
import { constructPublishedItemFromPartsById } from "../../utilities/constructPublishedItemsFromParts";

export async function constructRenderableShopItemsFromParts({
  controller,
  blobStorageService,
  databaseService,
  uncompiledBasePublishedItems,
  requestorUserId,
}: {
  controller: Controller;
  blobStorageService: BlobStorageServiceInterface;
  databaseService: DatabaseService;
  uncompiledBasePublishedItems: UncompiledBasePublishedItem[];
  requestorUserId: string | undefined;
}): Promise<InternalServiceResponse<ErrorReasonTypes<string>, RenderableShopItem[]>> {
  const constructRenderableShopItemFromPartsResponses = await BluebirdPromise.map(
    uncompiledBasePublishedItems,
    async (uncompiledBasePublishedItem) =>
      await constructRenderableShopItemFromParts({
        controller,
        blobStorageService,
        databaseService,
        uncompiledBasePublishedItem,
        requestorUserId: requestorUserId,
      }),
  );

  return collectMappedResponses({
    mappedResponses: constructRenderableShopItemFromPartsResponses,
  });
}

export async function constructRenderableShopItemFromPartsById({
  controller,
  blobStorageService,
  databaseService,
  publishedItemId,
  requestorUserId,
}: {
  controller: Controller;
  blobStorageService: BlobStorageServiceInterface;
  databaseService: DatabaseService;
  publishedItemId: string;
  requestorUserId: string | undefined;
}): Promise<InternalServiceResponse<ErrorReasonTypes<string>, RenderableShopItem>> {
  const getPublishedItemByIdResponse =
    await databaseService.tableNameToServicesMap.publishedItemsTableService.getPublishedItemById(
      { controller, id: publishedItemId },
    );

  if (getPublishedItemByIdResponse.type === EitherType.failure) {
    return getPublishedItemByIdResponse;
  }
  const { success: uncompiledBasePublishedItem } = getPublishedItemByIdResponse;

  const constructRenderableShopItemFromPartsResponse =
    await constructRenderableShopItemFromParts({
      controller,
      blobStorageService: blobStorageService,
      databaseService: databaseService,
      uncompiledBasePublishedItem,
      requestorUserId,
    });
  if (constructRenderableShopItemFromPartsResponse.type === EitherType.failure) {
    return constructRenderableShopItemFromPartsResponse;
  }
  const { success: shopItem } = constructRenderableShopItemFromPartsResponse;

  return Success(shopItem);
}

export async function constructRenderableShopItemFromParts({
  controller,
  blobStorageService,
  databaseService,
  uncompiledBasePublishedItem,
  requestorUserId,
}: {
  controller: Controller;
  blobStorageService: BlobStorageServiceInterface;
  databaseService: DatabaseService;
  uncompiledBasePublishedItem: UncompiledBasePublishedItem;
  requestorUserId: string | undefined;
}): Promise<InternalServiceResponse<ErrorReasonTypes<string>, RenderableShopItem>> {
  const assembleBaseRenderablePublishedItemResponse =
    await assembleBaseRenderablePublishedItem({
      controller,
      databaseService,
      uncompiledBasePublishedItem,
      requestorUserId: requestorUserId,
    });
  if (assembleBaseRenderablePublishedItemResponse.type === EitherType.failure) {
    return assembleBaseRenderablePublishedItemResponse;
  }
  const { success: baseRenderablePublishedItem } =
    assembleBaseRenderablePublishedItemResponse;

  const {
    id,
    creationTimestamp,
    authorUserId,
    caption,
    scheduledPublicationTimestamp,
    expirationTimestamp,
    idOfPublishedItemBeingShared,
    hashtags,
    likes,
    comments,
    isLikedByClient,
    isSavedByClient,
  } = baseRenderablePublishedItem;

  if (!!idOfPublishedItemBeingShared) {
    const constructPublishedItemFromPartsByIdResponse =
      await constructPublishedItemFromPartsById({
        controller,
        blobStorageService,
        databaseService,
        publishedItemId: idOfPublishedItemBeingShared,
        requestorUserId,
      });
    if (constructPublishedItemFromPartsByIdResponse.type === EitherType.failure) {
      return constructPublishedItemFromPartsByIdResponse;
    }
    const { success: sharedItem } = constructPublishedItemFromPartsByIdResponse;

    return Success({
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
      sharedItem: sharedItem as RootShopItemPreview | RootPurchasedShopItemDetails,
    });
  } else {
    let hasPublishedItemBeenPurchasedByUserId = false;
    if (!!requestorUserId) {
      const hasPublishedItemBeenPurchasedByUserIdResponse =
        await databaseService.tableNameToServicesMap.publishedItemTransactionsTableService.hasPublishedItemBeenPurchasedByUserId(
          {
            controller,
            publishedItemId: id,
            nonCreatorUserId: requestorUserId,
          },
        );
      if (hasPublishedItemBeenPurchasedByUserIdResponse.type === EitherType.failure) {
        return hasPublishedItemBeenPurchasedByUserIdResponse;
      }
      hasPublishedItemBeenPurchasedByUserId =
        hasPublishedItemBeenPurchasedByUserIdResponse.success;
    }

    if (hasPublishedItemBeenPurchasedByUserId) {
      const assembleRootPurchasedShopItemDetailsFromPartsResponse =
        await assembleRootPurchasedShopItemDetailsFromParts({
          controller,
          blobStorageService,
          databaseService,
          baseRenderablePublishedItem,
        });
      if (
        assembleRootPurchasedShopItemDetailsFromPartsResponse.type === EitherType.failure
      ) {
        return assembleRootPurchasedShopItemDetailsFromPartsResponse;
      }
      const { success: rootPurchasedShopItemDetails } =
        assembleRootPurchasedShopItemDetailsFromPartsResponse;

      return Success(rootPurchasedShopItemDetails);
    } else {
      const assembleRootShopItemPreviewFromPartsResponse =
        await assembleRootShopItemPreviewFromParts({
          controller,
          blobStorageService,
          databaseService,
          baseRenderablePublishedItem,
        });
      if (assembleRootShopItemPreviewFromPartsResponse.type === EitherType.failure) {
        return assembleRootShopItemPreviewFromPartsResponse;
      }
      const { success: rootShopItemPreview } =
        assembleRootShopItemPreviewFromPartsResponse;

      return Success(rootShopItemPreview);
    }
  }
}
