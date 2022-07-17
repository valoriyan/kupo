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
import {
  BaseRenderablePublishedItem,
  PublishedItemType,
  UncompiledBasePublishedItem,
} from "../models";
import { DBShopItemElementType } from "../../../services/databaseService/tableServices/shopItemMediaElementsTableService";
import { assembleBaseRenderablePublishedItem } from "../utilities";
import { Controller } from "tsoa";
import {
  EitherType,
  ErrorReasonTypes,
  FailureResponse,
  InternalServiceResponse,
  Success,
  SuccessResponse,
} from "../../../utilities/monads";

export async function constructRenderableShopItemsFromParts({
  controller,
  blobStorageService,
  databaseService,
  uncompiledBasePublishedItems,
  clientUserId,
}: {
  controller: Controller;
  blobStorageService: BlobStorageServiceInterface;
  databaseService: DatabaseService;
  uncompiledBasePublishedItems: UncompiledBasePublishedItem[];
  clientUserId: string | undefined;
}): Promise<InternalServiceResponse<ErrorReasonTypes<string>, RenderableShopItem[]>> {
  const constructRenderableShopItemFromPartsResponses = await BluebirdPromise.map(
    uncompiledBasePublishedItems,
    async (uncompiledBasePublishedItem) =>
      await constructRenderableShopItemFromParts({
        controller,
        blobStorageService,
        databaseService,
        uncompiledBasePublishedItem,
        clientUserId,
      }),
  );

  const firstOccuringError = constructRenderableShopItemFromPartsResponses.find(
    (responseElement) => {
      return responseElement.type === EitherType.failure;
    },
  );
  if (firstOccuringError) {
    return firstOccuringError as FailureResponse<ErrorReasonTypes<string>>;
  }

  const renderablePosts = constructRenderableShopItemFromPartsResponses.map(
    (responseElement) => (responseElement as SuccessResponse<RenderableShopItem>).success,
  );

  return Success(renderablePosts);
}

export async function constructRenderableShopItemFromParts({
  controller,
  blobStorageService,
  databaseService,
  uncompiledBasePublishedItem,
  clientUserId,
}: {
  controller: Controller;
  blobStorageService: BlobStorageServiceInterface;
  databaseService: DatabaseService;
  uncompiledBasePublishedItem: UncompiledBasePublishedItem;
  clientUserId: string | undefined;
}): Promise<InternalServiceResponse<ErrorReasonTypes<string>, RenderableShopItem>> {
  const assembleBaseRenderablePublishedItemResponse =
    await assembleBaseRenderablePublishedItem({
      controller,
      databaseService,
      uncompiledBasePublishedItem,
      clientUserId,
    });
  if (assembleBaseRenderablePublishedItemResponse.type === EitherType.failure) {
    return assembleBaseRenderablePublishedItemResponse;
  }
  const { success: baseRenderablePublishedItem } =
    assembleBaseRenderablePublishedItemResponse;
  const { id, idOfPublishedItemBeingShared } = baseRenderablePublishedItem;

  if (!!idOfPublishedItemBeingShared) {
    const assembleSharedShopItemFromPartsResponse = await assembleSharedShopItemFromParts(
      {
        controller,
        blobStorageService,
        databaseService,
        baseRenderablePublishedItem,
        clientUserId,
      },
    );
    if (assembleSharedShopItemFromPartsResponse.type === EitherType.failure) {
      return assembleSharedShopItemFromPartsResponse;
    }
    const { success: sharedShopItem } = assembleSharedShopItemFromPartsResponse;

    return Success(sharedShopItem);
  } else {
    let hasPublishedItemBeenPurchasedByUserId = false;
    if (!!clientUserId) {
      const hasPublishedItemBeenPurchasedByUserIdResponse =
        await databaseService.tableNameToServicesMap.publishedItemTransactionsTableService.hasPublishedItemBeenPurchasedByUserId(
          {
            controller,
            publishedItemId: id,
            nonCreatorUserId: clientUserId,
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

async function assembleSharedShopItemFromParts({
  controller,
  blobStorageService,
  databaseService,
  baseRenderablePublishedItem,
  clientUserId,
}: {
  controller: Controller;
  blobStorageService: BlobStorageServiceInterface;
  databaseService: DatabaseService;
  baseRenderablePublishedItem: BaseRenderablePublishedItem;
  clientUserId: string | undefined;
}): Promise<InternalServiceResponse<ErrorReasonTypes<string>, SharedShopItem>> {
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
    idOfPublishedItemBeingShared,
  } = baseRenderablePublishedItem;

  const getPublishedItemByIdResponse =
    await databaseService.tableNameToServicesMap.publishedItemsTableService.getPublishedItemById(
      { controller, id: idOfPublishedItemBeingShared! },
    );
  if (getPublishedItemByIdResponse.type === EitherType.failure) {
    return getPublishedItemByIdResponse;
  }
  const { success: sharedUncompiledBasePublishedItem } = getPublishedItemByIdResponse;

  const assembleBaseRenderablePublishedItemResponse =
    await assembleBaseRenderablePublishedItem({
      controller,
      databaseService,
      uncompiledBasePublishedItem: sharedUncompiledBasePublishedItem,
      clientUserId,
    });
  if (assembleBaseRenderablePublishedItemResponse.type === EitherType.failure) {
    return assembleBaseRenderablePublishedItemResponse;
  }
  const { success: sharedBaseRenderablePublishedItem } =
    assembleBaseRenderablePublishedItemResponse;

  let hasSharedPublishedItemBeenPurchasedByUserId = false;
  if (!!clientUserId) {
    const hasPublishedItemBeenPurchasedByUserIdResponse =
      await databaseService.tableNameToServicesMap.publishedItemTransactionsTableService.hasPublishedItemBeenPurchasedByUserId(
        {
          controller,
          publishedItemId: sharedBaseRenderablePublishedItem.id,
          nonCreatorUserId: clientUserId,
        },
      );
    if (hasPublishedItemBeenPurchasedByUserIdResponse.type === EitherType.failure) {
      return hasPublishedItemBeenPurchasedByUserIdResponse;
    }
    hasSharedPublishedItemBeenPurchasedByUserId =
      hasPublishedItemBeenPurchasedByUserIdResponse.success;
  }

  let sharedItem;
  if (hasSharedPublishedItemBeenPurchasedByUserId) {
    const assembleRootPurchasedShopItemDetailsFromPartsResponse =
      await assembleRootPurchasedShopItemDetailsFromParts({
        controller,
        blobStorageService,
        databaseService,
        baseRenderablePublishedItem: sharedBaseRenderablePublishedItem,
      });
    if (
      assembleRootPurchasedShopItemDetailsFromPartsResponse.type === EitherType.failure
    ) {
      return assembleRootPurchasedShopItemDetailsFromPartsResponse;
    }
    sharedItem = assembleRootPurchasedShopItemDetailsFromPartsResponse.success;
  } else {
    const assembleRootShopItemPreviewFromPartsResponse =
      await assembleRootShopItemPreviewFromParts({
        controller,
        blobStorageService,
        databaseService,
        baseRenderablePublishedItem: sharedBaseRenderablePublishedItem,
      });
    if (assembleRootShopItemPreviewFromPartsResponse.type === EitherType.failure) {
      return assembleRootShopItemPreviewFromPartsResponse;
    }
    sharedItem = assembleRootShopItemPreviewFromPartsResponse.success;
  }

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
  return Success(sharedShopItem);
}

async function assembleRootShopItemPreviewFromParts({
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

  return Success(rootShopItemPreview);
}

async function assembleRootPurchasedShopItemDetailsFromParts({
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
    previewMediaElements,
    purchasedMediaElements: [],
  };

  return Success(rootPurchasedShopItemDetails);
}

async function assembleShopItemPreviewMediaElements({
  controller,
  publishedItemId,
  blobStorageService,
  databaseService,
}: {
  controller: Controller;
  publishedItemId: string;
  blobStorageService: BlobStorageServiceInterface;
  databaseService: DatabaseService;
}): Promise<InternalServiceResponse<ErrorReasonTypes<string>, MediaElement[]>> {
  const getShopItemMediaElementsByPublishedItemIdResponse =
    await databaseService.tableNameToServicesMap.shopItemMediaElementTableService.getShopItemMediaElementsByPublishedItemId(
      {
        controller,
        publishedItemId,
        shopItemType: DBShopItemElementType.PREVIEW_MEDIA_ELEMENT,
      },
    );
  if (getShopItemMediaElementsByPublishedItemIdResponse.type === EitherType.failure) {
    return getShopItemMediaElementsByPublishedItemIdResponse;
  }
  const { success: filedShopItemPreviewMediaElements } =
    getShopItemMediaElementsByPublishedItemIdResponse;

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

  return Success(previewMediaElements);
}
