import express from "express";
import {
  EitherType,
  ErrorReasonTypes,
  Failure,
  SecuredHTTPResponse,
  Success,
} from "../../utilities/monads";
import { checkAuthorization } from "../auth/utilities";
import { RenderablePublishedItem } from "../publishedItem/models";
import { constructPublishedItemsFromParts } from "../publishedItem/utilities";
import { decodeTimestampCursor, encodeTimestampCursor } from "../utilities/pagination";
import { FeedController } from "./feedController";

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
  const { cursor, pageSize } = requestBody;

  const { clientUserId, errorResponse: error } = await checkAuthorization(
    controller,
    request,
  );
  if (error) return error;

  const selectUserByUserIdResponse =
    await controller.databaseService.tableNameToServicesMap.usersTableService.selectUserByUserId(
      { controller, userId: clientUserId },
    );
  if (selectUserByUserIdResponse.type === EitherType.failure) {
    return selectUserByUserIdResponse;
  }
  const { success: unrenderableUser } = selectUserByUserIdResponse;

  if (!!unrenderableUser && !!unrenderableUser.isAdmin) {
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

    const constructPublishedItemsFromPartsResponse =
      await constructPublishedItemsFromParts({
        controller,
        blobStorageService: controller.blobStorageService,
        databaseService: controller.databaseService,
        uncompiledBasePublishedItems,
        clientUserId,
      });
    if (constructPublishedItemsFromPartsResponse.type === EitherType.failure) {
      return constructPublishedItemsFromPartsResponse;
    }
    const { success: renderablePublishedItems } =
      constructPublishedItemsFromPartsResponse;

    const nextPageCursor =
      renderablePublishedItems.length > 0
        ? encodeTimestampCursor({
            timestamp:
              renderablePublishedItems[renderablePublishedItems.length - 1]
                .scheduledPublicationTimestamp,
          })
        : undefined;

    return Success({
      renderablePublishedItems,
      previousPageCursor: cursor,
      nextPageCursor,
    });
  } else {
    return Failure({
      controller,
      httpStatusCode: 403,
      reason: GetPageOfAllPublishedItemsFailedReason.ILLEGAL_ACCESS,
      error,
      additionalErrorInformation: "Illegal access at handleGetPageOfAllPublishedItems",
    });
  }
}
