/* eslint-disable @typescript-eslint/ban-types */
import { BlobStorageService } from "../../../services/blobStorageService";
import { DatabaseService } from "../../../services/databaseService";
import {
  PublishedItemType,
  RenderablePublishedItem,
  UncompiledBasePublishedItem,
} from "../models";
import { assembleRenderablePostFromCachedComponents } from "../post/utilities";
import { constructRenderableShopItemFromParts } from "../shopItem/utilities";
import { Promise as BluebirdPromise } from "bluebird";
import { Controller } from "tsoa";
import {
  EitherType,
  ErrorReasonTypes,
  InternalServiceResponse,
  Success,
} from "../../../utilities/monads";
import {
  unwrapListOfEitherResponses,
  UnwrapListOfEitherResponsesFailureHandlingMethod,
} from "../../../utilities/monads/unwrapListOfResponses";

export async function assemblePublishedItemsFromCachedComponents({
  controller,
  blobStorageService,
  databaseService,
  uncompiledBasePublishedItems,
  requestorUserId,
}: {
  controller: Controller;
  blobStorageService: BlobStorageService;
  databaseService: DatabaseService;
  uncompiledBasePublishedItems: UncompiledBasePublishedItem[];
  requestorUserId: string | undefined;
}): Promise<
  InternalServiceResponse<ErrorReasonTypes<string>, RenderablePublishedItem[]>
> {
  const constructPublishedItemFromPartsResponses = await BluebirdPromise.map(
    uncompiledBasePublishedItems,
    async (uncompiledBasePublishedItem) =>
      await assemblePublishedItemFromCachedComponents({
        controller,
        blobStorageService,
        databaseService,
        uncompiledBasePublishedItem,
        requestorUserId,
      }),
  );

  return unwrapListOfEitherResponses({
    eitherResponses: constructPublishedItemFromPartsResponses,
    failureHandlingMethod:
      UnwrapListOfEitherResponsesFailureHandlingMethod.SUCCEED_WITH_ANY_SUCCESSES_ELSE_RETURN_FIRST_FAILURE,
  });
}

export async function assemblePublishedItemsByIds({
  controller,
  blobStorageService,
  databaseService,
  publishedItemIds,
  requestorUserId,
  restrictedToType,
}: {
  controller: Controller;
  blobStorageService: BlobStorageService;
  databaseService: DatabaseService;
  publishedItemIds: string[];
  requestorUserId: string | undefined;
  restrictedToType?: PublishedItemType;
}): Promise<
  InternalServiceResponse<ErrorReasonTypes<string>, RenderablePublishedItem[]>
> {
  const getPublishedItemsByIdsResponse =
    await databaseService.tableNameToServicesMap.publishedItemsTableService.getPublishedItemsByIds(
      {
        controller,
        ids: publishedItemIds,
        restrictedToType,
      },
    );
  if (getPublishedItemsByIdsResponse.type === EitherType.failure) {
    return getPublishedItemsByIdsResponse;
  }
  const { success: uncompiledBasePublishedItems } = getPublishedItemsByIdsResponse;

  const constructPublishedItemFromPartsResponses = await BluebirdPromise.map(
    uncompiledBasePublishedItems,
    async (uncompiledBasePublishedItem) =>
      await assemblePublishedItemFromCachedComponents({
        controller,
        blobStorageService,
        databaseService,
        uncompiledBasePublishedItem,
        requestorUserId,
      }),
  );

  return unwrapListOfEitherResponses({
    eitherResponses: constructPublishedItemFromPartsResponses,
    failureHandlingMethod:
      UnwrapListOfEitherResponsesFailureHandlingMethod.SUCCEED_WITH_ANY_SUCCESSES_ELSE_RETURN_FIRST_FAILURE,
  });
}

export async function assemblePublishedItemById({
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
}): Promise<InternalServiceResponse<ErrorReasonTypes<string>, RenderablePublishedItem>> {
  const getPublishedItemByIdResponse =
    await databaseService.tableNameToServicesMap.publishedItemsTableService.getPublishedItemById(
      { controller, id: publishedItemId },
    );

  if (getPublishedItemByIdResponse.type === EitherType.failure) {
    return getPublishedItemByIdResponse;
  }
  const { success: uncompiledBasePublishedItem } = getPublishedItemByIdResponse;

  const constructPublishedItemFromPartsResponse =
    await assemblePublishedItemFromCachedComponents({
      controller,
      blobStorageService: blobStorageService,
      databaseService: databaseService,
      uncompiledBasePublishedItem,
      requestorUserId,
    });
  if (constructPublishedItemFromPartsResponse.type === EitherType.failure) {
    return constructPublishedItemFromPartsResponse;
  }
  const { success: post } = constructPublishedItemFromPartsResponse;

  return Success(post);
}

export async function assemblePublishedItemFromCachedComponents({
  controller,
  blobStorageService,
  databaseService,
  uncompiledBasePublishedItem,
  requestorUserId,
}: {
  controller: Controller;
  blobStorageService: BlobStorageService;
  databaseService: DatabaseService;
  uncompiledBasePublishedItem: UncompiledBasePublishedItem;
  requestorUserId?: string;
}): Promise<InternalServiceResponse<ErrorReasonTypes<string>, RenderablePublishedItem>> {
  if (uncompiledBasePublishedItem.type === PublishedItemType.POST) {
    return await assembleRenderablePostFromCachedComponents({
      controller,
      blobStorageService,
      databaseService,
      uncompiledBasePublishedItem,
      requestorUserId,
    });
  } else {
    return await constructRenderableShopItemFromParts({
      controller,
      blobStorageService,
      databaseService,
      uncompiledBasePublishedItem,
      requestorUserId: requestorUserId,
    });
  }
}
