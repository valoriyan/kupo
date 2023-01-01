import express from "express";
import {
  EitherType,
  ErrorReasonTypes,
  Failure,
  SecuredHTTPResponse,
  Success,
} from "../../utilities/monads";
import { checkAuthentication } from "../auth/utilities";
import { RenderablePublishedItem } from "../publishedItem/models";
import { assemblePublishedItemsFromCachedComponents } from "../publishedItem/utilities/assemblePublishedItems";
import { decodeTimestampCursor, encodeTimestampCursor } from "../utilities/pagination";
import { FeedController } from "./feedController";
import { GenericResponseFailedReason } from "../models";

export interface GetPageOfAllPublishedItemsRequestBody {
  cursor?: string;
  pageSize: number;
}

export enum GetPageOfAllPublishedItemsFailedReason {
  ILLEGAL_ACCESS = "ILLEGAL_ACCESS",
  UnknownCause = "Unknown Cause",
}

export interface GetPageOfAllPublishedItemsSuccess {
  renderablePublishedItems: RenderablePublishedItem[];

  previousPageCursor?: string;
  nextPageCursor?: string;
}

export async function handleGetPageOfAllPublishedItems({
  controller,
  request,
  requestBody,
}: {
  controller: FeedController;
  request: express.Request;
  requestBody: GetPageOfAllPublishedItemsRequestBody;
}): Promise<
  SecuredHTTPResponse<
    ErrorReasonTypes<string | GetPageOfAllPublishedItemsFailedReason>,
    GetPageOfAllPublishedItemsSuccess
  >
> {
  //////////////////////////////////////////////////
  // Inputs & Authentication
  //////////////////////////////////////////////////

  const { cursor, pageSize } = requestBody;

  const { clientUserId, errorResponse: error } = await checkAuthentication(
    controller,
    request,
  );
  if (error) return error;

  //////////////////////////////////////////////////
  // Read Unrenderable Client User From DB
  //////////////////////////////////////////////////

  const selectMaybeUserByUserIdesponse =
    await controller.databaseService.tableNameToServicesMap.usersTableService.selectMaybeUserByUserId(
      { controller, userId: clientUserId },
    );
  if (selectMaybeUserByUserIdesponse.type === EitherType.failure) {
    return selectMaybeUserByUserIdesponse;
  }
  const { success: maybeUnrenderableUser } = selectMaybeUserByUserIdesponse;

  if (!maybeUnrenderableUser) {
    return Failure({
      controller,
      httpStatusCode: 403,
      reason: GenericResponseFailedReason.DATABASE_TRANSACTION_ERROR,
      error: "User not found at handleGetPageOfAllPublishedItems",
      additionalErrorInformation: "User not found at handleGetPageOfAllPublishedItems",
    });
  }

  const unrenderableUser = maybeUnrenderableUser;

  //////////////////////////////////////////////////
  // Check Authorization
  //////////////////////////////////////////////////

  if (!unrenderableUser.isAdmin) {
    return Failure({
      controller,
      httpStatusCode: 403,
      reason: GetPageOfAllPublishedItemsFailedReason.ILLEGAL_ACCESS,
      error,
      additionalErrorInformation: "Illegal access at handleGetPageOfAllPublishedItems",
    });
  }

  //////////////////////////////////////////////////
  // Read Page of All Published Items from DB
  //////////////////////////////////////////////////

  const GET_ALL_PUBLISHED_ITEMSResponse =
    await controller.databaseService.tableNameToServicesMap.publishedItemsTableService.GET_ALL_PUBLISHED_ITEMS(
      {
        controller,
        filterOutExpiredAndUnscheduledPublishedItems: true,
        limit: pageSize,
        getPublishedItemsBeforeTimestamp: cursor
          ? decodeTimestampCursor({ encodedCursor: cursor })
          : undefined,
      },
    );
  if (GET_ALL_PUBLISHED_ITEMSResponse.type === EitherType.failure) {
    return GET_ALL_PUBLISHED_ITEMSResponse;
  }
  const { success: uncompiledBasePublishedItems } = GET_ALL_PUBLISHED_ITEMSResponse;

  //////////////////////////////////////////////////
  // Assemble Published Items
  //////////////////////////////////////////////////

  const assemblePublishedItemsFromCachedComponentsResponse =
    await assemblePublishedItemsFromCachedComponents({
      controller,
      blobStorageService: controller.blobStorageService,
      databaseService: controller.databaseService,
      uncompiledBasePublishedItems,
      requestorUserId: clientUserId,
    });
  if (assemblePublishedItemsFromCachedComponentsResponse.type === EitherType.failure) {
    return assemblePublishedItemsFromCachedComponentsResponse;
  }
  const { success: renderablePublishedItems } =
    assemblePublishedItemsFromCachedComponentsResponse;

  //////////////////////////////////////////////////
  // Get Next Page Cursor
  //////////////////////////////////////////////////

  const nextPageCursor =
    renderablePublishedItems.length > 0
      ? encodeTimestampCursor({
          timestamp:
            renderablePublishedItems[renderablePublishedItems.length - 1]
              .scheduledPublicationTimestamp,
        })
      : undefined;

  //////////////////////////////////////////////////
  // Return
  //////////////////////////////////////////////////

  return Success({
    renderablePublishedItems,
    previousPageCursor: cursor,
    nextPageCursor,
  });
}
