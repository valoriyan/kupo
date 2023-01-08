import { BlobStorageService } from "../../../../services/blobStorageService";
import { DatabaseService } from "../../../../services/databaseService";
import { Promise as BluebirdPromise } from "bluebird";
import {
  RenderableShopItem,
  RootPurchasedShopItemDetails,
  RootShopItemPreview,
} from "../models";
import { PublishedItemType, UnassembledBasePublishedItem } from "../../models";
import { assembleBaseRenderablePublishedItem } from "../../utilities/assembleBaseRenderablePublishedItem";
import { Controller } from "tsoa";
import {
  EitherType,
  ErrorReasonTypes,
  InternalServiceResponse,
  Success,
} from "../../../../utilities/monads";
import {
  unwrapListOfEitherResponses,
  UnwrapListOfEitherResponsesFailureHandlingMethod,
} from "../../../../utilities/monads/unwrapListOfResponses";
import { assembleRootShopItemPreviewFromCachedComponents } from "./assembleRootShopItemPreviewFromParts";
import { assembleRootPurchasedShopItemDetailsFromCachedComponents } from "./assembleRootPurchasedShopItemDetails";
import { assemblePublishedItemById } from "../../utilities/assemblePublishedItems";

export async function assembleRenderableShopItemsFromCachedComponents({
  controller,
  blobStorageService,
  databaseService,
  uncompiledBasePublishedItems,
  requestorUserId,
}: {
  controller: Controller;
  blobStorageService: BlobStorageService;
  databaseService: DatabaseService;
  uncompiledBasePublishedItems: UnassembledBasePublishedItem[];
  requestorUserId: string | undefined;
}): Promise<InternalServiceResponse<ErrorReasonTypes<string>, RenderableShopItem[]>> {
  const assembleRenderableShopItemFromCachedComponentsResponses =
    await BluebirdPromise.map(
      uncompiledBasePublishedItems,
      async (uncompiledBasePublishedItem) =>
        await assembleRenderableShopItemFromCachedComponents({
          controller,
          blobStorageService,
          databaseService,
          uncompiledBasePublishedItem,
          requestorUserId: requestorUserId,
        }),
    );

  return unwrapListOfEitherResponses({
    eitherResponses: assembleRenderableShopItemFromCachedComponentsResponses,
    failureHandlingMethod:
      UnwrapListOfEitherResponsesFailureHandlingMethod.SUCCEED_WITH_ANY_SUCCESSES_ELSE_RETURN_FIRST_FAILURE,
  });
}

export async function assembleRenderableShopItemFromPartsById({
  controller,
  blobStorageService,
  databaseService,
  publishedItemId,
  requestorUserId,
}: {
  controller: Controller;
  blobStorageService: BlobStorageService;
  databaseService: DatabaseService;
  publishedItemId: string;
  requestorUserId: string | undefined;
}): Promise<InternalServiceResponse<ErrorReasonTypes<string>, RenderableShopItem>> {
  //////////////////////////////////////////////////
  // Read Unassembled Base Publishing Item From DB
  //////////////////////////////////////////////////

  const getPublishedItemByIdResponse =
    await databaseService.tableNameToServicesMap.publishedItemsTableService.getPublishedItemById(
      { controller, id: publishedItemId },
    );

  if (getPublishedItemByIdResponse.type === EitherType.failure) {
    return getPublishedItemByIdResponse;
  }
  const { success: uncompiledBasePublishedItem } = getPublishedItemByIdResponse;

  //////////////////////////////////////////////////
  // Assemble From Cache
  //////////////////////////////////////////////////

  const assembleRenderableShopItemFromCachedComponentsResponse =
    await assembleRenderableShopItemFromCachedComponents({
      controller,
      blobStorageService: blobStorageService,
      databaseService: databaseService,
      uncompiledBasePublishedItem,
      requestorUserId,
    });
  if (
    assembleRenderableShopItemFromCachedComponentsResponse.type === EitherType.failure
  ) {
    return assembleRenderableShopItemFromCachedComponentsResponse;
  }
  const { success: shopItem } = assembleRenderableShopItemFromCachedComponentsResponse;

  return Success(shopItem);
}

export async function assembleRenderableShopItemFromCachedComponents({
  controller,
  blobStorageService,
  databaseService,
  uncompiledBasePublishedItem,
  requestorUserId,
}: {
  controller: Controller;
  blobStorageService: BlobStorageService;
  databaseService: DatabaseService;
  uncompiledBasePublishedItem: UnassembledBasePublishedItem;
  requestorUserId: string | undefined;
}): Promise<InternalServiceResponse<ErrorReasonTypes<string>, RenderableShopItem>> {
  //////////////////////////////////////////////////
  // Read BaseRenderablePublishedItem From DB
  //////////////////////////////////////////////////

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
    host,
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
    //////////////////////////////////////////////////
    // If Published Item is a Shared Item
    //
    //     Get Published Item Being Shared
    //////////////////////////////////////////////////

    const constructPublishedItemFromPartsByIdResponse = await assemblePublishedItemById({
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

    //////////////////////////////////////////////////
    // Return
    //////////////////////////////////////////////////

    return Success({
      type: PublishedItemType.SHOP_ITEM,
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
      sharedItem: sharedItem as RootShopItemPreview | RootPurchasedShopItemDetails,
    });
  } else {
    //////////////////////////////////////////////////
    // If Published Item is NOT a Shared Item
    //
    //     Check if base published item has been purchased by user id
    //////////////////////////////////////////////////

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

    if (!!hasPublishedItemBeenPurchasedByUserId || authorUserId === requestorUserId) {
      //////////////////////////////////////////////////
      // If client has purchased the item or if the author is the client
      //
      //     assemble the PURCHASED shop item
      //////////////////////////////////////////////////

      const assembleRootPurchasedShopItemDetailsFromCachedComponentsResponse =
        await assembleRootPurchasedShopItemDetailsFromCachedComponents({
          controller,
          blobStorageService,
          databaseService,
          baseRenderablePublishedItem,
        });
      if (
        assembleRootPurchasedShopItemDetailsFromCachedComponentsResponse.type ===
        EitherType.failure
      ) {
        return assembleRootPurchasedShopItemDetailsFromCachedComponentsResponse;
      }
      const { success: rootPurchasedShopItemDetails } =
        assembleRootPurchasedShopItemDetailsFromCachedComponentsResponse;

      //////////////////////////////////////////////////
      // Return
      //////////////////////////////////////////////////

      return Success(rootPurchasedShopItemDetails);
    } else {
      //////////////////////////////////////////////////
      // If client has NOT purchased the item
      //
      //     assemble the shop item PREVIEW
      //////////////////////////////////////////////////

      const assembleRootShopItemPreviewFromPartsResponse =
        await assembleRootShopItemPreviewFromCachedComponents({
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

      //////////////////////////////////////////////////
      // Return
      //////////////////////////////////////////////////

      return Success(rootShopItemPreview);
    }
  }
}
