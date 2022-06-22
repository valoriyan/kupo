import express from "express";
import { HTTPResponse } from "../../../types/httpResponse";
import { getClientUserId } from "../../auth/utilities";
import { canUserViewUserContentByUserId } from "../../auth/utilities/canUserViewUserContent";
import { getEncodedCursorOfNextPageOfSequentialItems } from "../post/pagination/utilities";
import { decodeTimestampCursor } from "../../utilities/pagination";
import { RenderableShopItem } from "./models";
import { ShopItemController } from "./shopItemController";
import { constructRenderableShopItemsFromParts } from "./utilities";

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

export interface GetShopItemsByUsernameFailed {
  reason: GetShopItemsByUsernameFailedReason;
}

export async function handleGetShopItemsByUsername({
  controller,
  request,
  requestBody,
}: {
  controller: ShopItemController;
  request: express.Request;
  requestBody: GetShopItemsByUsernameRequestBody;
}): Promise<HTTPResponse<GetShopItemsByUsernameFailed, GetShopItemsByUsernameSuccess>> {
  const { username, ...restRequestBody } = requestBody;
  const userId =
    await controller.databaseService.tableNameToServicesMap.usersTableService.selectUserIdByUsername(
      username,
    );

  if (!userId) {
    return {
      error: { reason: GetShopItemsByUsernameFailedReason.UnknownUser },
    };
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
}): Promise<HTTPResponse<GetShopItemsByUsernameFailed, GetShopItemsByUsernameSuccess>> {
  const { userId, pageSize, cursor } = requestBody;

  const clientUserId = await getClientUserId(request);

  const pageTimestamp = cursor
    ? decodeTimestampCursor({ encodedCursor: cursor })
    : 999999999999999;

  const canViewContent = await canUserViewUserContentByUserId({
    clientUserId,
    targetUserId: userId,
    databaseService: controller.databaseService,
  });

  if (!canViewContent) {
    return {
      error: { reason: GetShopItemsByUsernameFailedReason.UserPrivate },
    };
  }

  const uncompiledBasePublishedItems = await controller.databaseService.tableNameToServicesMap.publishedItemsTableService.getPublishedItemsByAuthorUserId({
    authorUserId: userId,
    filterOutExpiredAndUnscheduledPublishedItems: true,
    limit: pageSize,
    getPublishedItemsBeforeTimestamp: pageTimestamp,
  });


  const renderableShopItemPreview = await constructRenderableShopItemsFromParts({
    blobStorageService: controller.blobStorageService,
    databaseService: controller.databaseService,
    uncompiledBasePublishedItems,
    clientUserId,
  });

  return {
    success: {
      shopItems: renderableShopItemPreview,
      previousPageCursor: requestBody.cursor,
      nextPageCursor: getEncodedCursorOfNextPageOfSequentialItems({
        sequentialFeedItems: renderableShopItemPreview,
      }),
    },
  };
}
