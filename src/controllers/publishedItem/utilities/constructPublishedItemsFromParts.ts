/* eslint-disable @typescript-eslint/ban-types */
import { BlobStorageServiceInterface } from "../../../services/blobStorageService/models";
import { DatabaseService } from "../../../services/databaseService";
import {
  PublishedItemType,
  RenderablePublishedItem,
  UncompiledBasePublishedItem,
} from "../models";
import { constructRenderablePostFromParts } from "../post/utilities";
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

export async function constructPublishedItemsFromParts({
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
}): Promise<
  InternalServiceResponse<ErrorReasonTypes<string>, RenderablePublishedItem[]>
> {
  const constructPublishedItemFromPartsResponses = await BluebirdPromise.map(
    uncompiledBasePublishedItems,
    async (uncompiledBasePublishedItem) =>
      await constructPublishedItemFromParts({
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

export async function constructPublishedItemFromPartsById({
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
}): Promise<InternalServiceResponse<ErrorReasonTypes<string>, RenderablePublishedItem>> {
  const getPublishedItemByIdResponse =
    await databaseService.tableNameToServicesMap.publishedItemsTableService.getPublishedItemById(
      { controller, id: publishedItemId },
    );

  if (getPublishedItemByIdResponse.type === EitherType.failure) {
    return getPublishedItemByIdResponse;
  }
  const { success: uncompiledBasePublishedItem } = getPublishedItemByIdResponse;

  const constructPublishedItemFromPartsResponse = await constructPublishedItemFromParts({
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

export async function constructPublishedItemFromParts({
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
  requestorUserId?: string;
}): Promise<InternalServiceResponse<ErrorReasonTypes<string>, RenderablePublishedItem>> {
  if (uncompiledBasePublishedItem.type === PublishedItemType.POST) {
    return await constructRenderablePostFromParts({
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
