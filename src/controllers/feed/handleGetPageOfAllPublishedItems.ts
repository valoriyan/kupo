import express from "express";
import { EitherType, SecuredHTTPResponse } from "../../types/monads";
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
    GetPageOfAllPublishedItemsFailedReason,
    GetPageOfAllPublishedItemsSuccess
  >
> {
  const { cursor, pageSize } = requestBody;

  const { clientUserId, errorResponse: error } = await checkAuthorization(
    controller,
    request,
  );
  if (error) return error;

  const unrenderableUser =
    await controller.databaseService.tableNameToServicesMap.usersTableService.selectUserByUserId(
      { userId: clientUserId },
    );

  if (!!unrenderableUser && !!unrenderableUser.isAdmin) {
    const uncompiledBasePublishedItems =
      await controller.databaseService.tableNameToServicesMap.publishedItemsTableService.GET_ALL_PUBLISHED_ITEMS(
        {
          filterOutExpiredAndUnscheduledPublishedItems: true,
          limit: pageSize,
          getPublishedItemsBeforeTimestamp: cursor
            ? decodeTimestampCursor({ encodedCursor: cursor })
            : undefined,
        },
      );

    const renderablePublishedItems = await constructPublishedItemsFromParts({
      blobStorageService: controller.blobStorageService,
      databaseService: controller.databaseService,
      uncompiledBasePublishedItems,
      clientUserId,
    });

    const nextPageCursor =
      renderablePublishedItems.length > 0
        ? encodeTimestampCursor({
            timestamp:
              renderablePublishedItems[renderablePublishedItems.length - 1]
                .scheduledPublicationTimestamp,
          })
        : undefined;

    return {
      type: EitherType.success,
      success: {
        renderablePublishedItems,
        previousPageCursor: cursor,
        nextPageCursor,
      },
    };
  } else {
    return {
      type: EitherType.error,
      error: {
        reason: GetPageOfAllPublishedItemsFailedReason.ILLEGAL_ACCESS,
      },
    };
  }
}
