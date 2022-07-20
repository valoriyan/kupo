import express from "express";
import {
  EitherType,
  ErrorReasonTypes,
  Failure,
  HTTPResponse,
  Success,
} from "../../../utilities/monads";
import { getClientUserId } from "../../auth/utilities";
import { canUserViewUserContentByUserId } from "../../auth/utilities/canUserViewUserContent";
import { getEncodedCursorOfNextPageOfSequentialItems } from "../pagination/utilities";
import { decodeTimestampCursor } from "../../utilities/pagination";
import { RenderableShopItem } from "./models";
import { ShopItemController } from "./shopItemController";
import { constructRenderableShopItemsFromParts } from "./utilities";
import { RemoveCreditCardFailedReason } from "./payments/removeCreditCard";

export interface GetShopItemsByUserIdRequestBody {
  userId: string;
  cursor?: string;
  pageSize: number;
}

export interface GetShopItemsByUsernameRequestBody {
  username: string;
  cursor?: string;
  pageSize: number;
}

export interface GetShopItemsByUsernameSuccess {
  shopItems: RenderableShopItem[];
  previousPageCursor?: string;
  nextPageCursor?: string;
}

export enum GetShopItemsByUsernameFailedReason {
  UnknownCause = "Unknown Cause",
  UserPrivate = "This User's Shop Items Are Private",
  UnknownUser = "User Not Found",
}

export async function handleGetShopItemsByUsername({
  controller,
  request,
  requestBody,
}: {
  controller: ShopItemController;
  request: express.Request;
  requestBody: GetShopItemsByUsernameRequestBody;
}): Promise<
  HTTPResponse<
    ErrorReasonTypes<string | GetShopItemsByUsernameFailedReason>,
    GetShopItemsByUsernameSuccess
  >
> {
  const { username, ...restRequestBody } = requestBody;
  const selectUserIdByUsernameRequest =
    await controller.databaseService.tableNameToServicesMap.usersTableService.selectUserIdByUsername(
      { controller, username },
    );

  if (selectUserIdByUsernameRequest.type === EitherType.failure) {
    return selectUserIdByUsernameRequest;
  }
  const { success: userId } = selectUserIdByUsernameRequest;

  if (!userId) {
    return Failure({
      controller,
      httpStatusCode: 404,
      reason: RemoveCreditCardFailedReason.UNKNOWN_REASON,
      error: "User not found at handleGetShopItemsByUsername",
      additionalErrorInformation: "User not found at handleGetShopItemsByUsername",
    });
  }

  return handleGetShopItemsByUserId({
    controller,
    request,
    requestBody: { ...restRequestBody, userId },
  });
}

export async function handleGetShopItemsByUserId({
  controller,
  request,
  requestBody,
}: {
  controller: ShopItemController;
  request: express.Request;
  requestBody: GetShopItemsByUserIdRequestBody;
}): Promise<
  HTTPResponse<
    ErrorReasonTypes<string | GetShopItemsByUsernameFailedReason>,
    GetShopItemsByUsernameSuccess
  >
> {
  const { userId, pageSize, cursor } = requestBody;

  const clientUserId = await getClientUserId(request);

  const pageTimestamp = cursor
    ? decodeTimestampCursor({ encodedCursor: cursor })
    : 999999999999999;

  const canUserViewUserContentByUserIdResponse = await canUserViewUserContentByUserId({
    controller,
    clientUserId,
    targetUserId: userId,
    databaseService: controller.databaseService,
  });

  if (canUserViewUserContentByUserIdResponse.type === EitherType.failure) {
    return canUserViewUserContentByUserIdResponse;
  }
  const { success: canViewContent } = canUserViewUserContentByUserIdResponse;

  if (!canViewContent) {
    return Failure({
      controller,
      httpStatusCode: 403,
      reason: GetShopItemsByUsernameFailedReason.UserPrivate,
      error: "Illegal access at handleGetShopItemsByUserId",
      additionalErrorInformation: "Illegal access at handleGetShopItemsByUserId",
    });
  }

  const getPublishedItemsByAuthorUserIdResponse =
    await controller.databaseService.tableNameToServicesMap.publishedItemsTableService.getPublishedItemsByAuthorUserId(
      {
        controller,
        authorUserId: userId,
        filterOutExpiredAndUnscheduledPublishedItems: true,
        limit: pageSize,
        getPublishedItemsBeforeTimestamp: pageTimestamp,
      },
    );
  if (getPublishedItemsByAuthorUserIdResponse.type === EitherType.failure) {
    return getPublishedItemsByAuthorUserIdResponse;
  }
  const { success: uncompiledBasePublishedItems } =
    getPublishedItemsByAuthorUserIdResponse;

  const constructRenderableShopItemsFromPartsResponse =
    await constructRenderableShopItemsFromParts({
      controller,
      blobStorageService: controller.blobStorageService,
      databaseService: controller.databaseService,
      uncompiledBasePublishedItems,
      clientUserId,
    });
  if (constructRenderableShopItemsFromPartsResponse.type === EitherType.failure) {
    return constructRenderableShopItemsFromPartsResponse;
  }
  const { success: renderableShopItemPreview } =
    constructRenderableShopItemsFromPartsResponse;

  return Success({
    shopItems: renderableShopItemPreview,
    previousPageCursor: requestBody.cursor,
    nextPageCursor: getEncodedCursorOfNextPageOfSequentialItems({
      sequentialFeedItems: renderableShopItemPreview,
    }),
  });
}
