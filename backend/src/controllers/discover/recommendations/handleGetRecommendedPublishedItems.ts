import express from "express";
import { RenderablePublishedItem } from "../../../controllers/publishedItem/models";
import {
  EitherType,
  ErrorReasonTypes,
  SecuredHTTPResponse,
  Success,
} from "../../../utilities/monads";
import { checkAuthentication } from "../../auth/utilities";
import { DiscoverController } from "../discoverController";
import { assemblePublishedItemsFromCachedComponents } from "../../../controllers/publishedItem/utilities/assemblePublishedItems";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface GetRecommendedPublishedItemsRequestBody {}

export enum GetRecommendedPublishedItemsFailedReason {
  UnknownCause = "Unknown Cause",
}

export interface GetRecommendedPublishedItemsSuccess {
  renderablePublishedItems: RenderablePublishedItem[];
}

export async function handleGetRecommendedPublishedItems({
  controller,
  request,
}: {
  controller: DiscoverController;
  request: express.Request;
  requestBody: GetRecommendedPublishedItemsRequestBody;
}): Promise<
  SecuredHTTPResponse<
    ErrorReasonTypes<string | GetRecommendedPublishedItemsFailedReason>,
    GetRecommendedPublishedItemsSuccess
  >
> {
  //////////////////////////////////////////////////
  // Inputs & Authentication
  //////////////////////////////////////////////////

  const { clientUserId, errorResponse: error } = await checkAuthentication(
    controller,
    request,
  );
  if (error) return error;

  //////////////////////////////////////////////////
  // Get Unrenderable Published Items
  //////////////////////////////////////////////////

  const getMostPopularPublishedItemsUnlikedByTargetUserResponse =
    await controller.databaseService.tableNameToServicesMap.publishedItemsTableService.getMostPopularPublishedItemsUnlikedByTargetUser(
      { controller, targetUserId: clientUserId, pageSize: 5, offset: 0 },
    );
  if (
    getMostPopularPublishedItemsUnlikedByTargetUserResponse.type === EitherType.failure
  ) {
    return getMostPopularPublishedItemsUnlikedByTargetUserResponse;
  }
  const { success: pageOfUnrenderablePublishedItems } =
    getMostPopularPublishedItemsUnlikedByTargetUserResponse;

  //////////////////////////////////////////////////
  // Get Renderable Published Items
  //////////////////////////////////////////////////

  const assemblePublishedItemsFromCachedComponentsResponse =
    await assemblePublishedItemsFromCachedComponents({
      controller,
      blobStorageService: controller.blobStorageService,
      databaseService: controller.databaseService,
      uncompiledBasePublishedItems: pageOfUnrenderablePublishedItems,
      requestorUserId: clientUserId,
    });
  if (assemblePublishedItemsFromCachedComponentsResponse.type === EitherType.failure) {
    return assemblePublishedItemsFromCachedComponentsResponse;
  }
  const { success: renderablePublishedItems } =
    assemblePublishedItemsFromCachedComponentsResponse;

  //////////////////////////////////////////////////
  // Return
  //////////////////////////////////////////////////

  return Success({
    renderablePublishedItems,
  });
}
