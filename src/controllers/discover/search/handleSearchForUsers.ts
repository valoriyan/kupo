import express from "express";
import { SecuredHTTPResponse } from "../../../types/httpResponse";
import { DiscoverController } from "../discoverController";
import { checkAuthorization } from "../../auth/utilities";
import { RenderableUser } from "../../user/models";
import {
  constructRenderableUsersFromParts,
  mergeArraysOfUnrenderableUsers,
} from "../../user/utilities";

export interface SearchForUsersParams {
  query: string;
  cursor?: string;
  pageSize: number;
}

export enum SearchForUsersFailedReason {
  UnknownCause = "Unknown Cause",
}

export interface SearchForUsersFailed {
  reason: SearchForUsersFailedReason;
}

export interface SearchForUsersSuccess {
  users: RenderableUser[];
  previousPageCursor?: string;
  nextPageCursor?: string;
}

export async function handleSearchForUsers({
  controller,
  request,
  requestBody,
}: {
  controller: DiscoverController;
  request: express.Request;
  requestBody: SearchForUsersParams;
}): Promise<SecuredHTTPResponse<SearchForUsersFailed, SearchForUsersSuccess>> {
  const { clientUserId, error } = await checkAuthorization(controller, request);
  if (error) return error;

  const { cursor, query, pageSize } = requestBody;
  const trimmedQuery = query.trim();

  const unrenderableUsersMatchingUsername =
    await controller.databaseService.tableNameToServicesMap.usersTableService.selectUsersByUsernameMatchingSubstring(
      {
        usernameSubstring: trimmedQuery,
      },
    );

  const unrenderableUsersMatchingBio =
    await controller.databaseService.tableNameToServicesMap.usersTableService.selectUsersByShortBioMatchingSubstring(
      {
        shortBioSubstring: trimmedQuery,
      },
    );

  const unrenderableUsersIdsMatchingHashtag =
    await controller.databaseService.tableNameToServicesMap.userHashtagsTableService.getUserIdsWithHashtag(
      {
        hashtag: trimmedQuery,
      },
    );

  const unrenderableUsersMatchingHashtag =
    await controller.databaseService.tableNameToServicesMap.usersTableService.selectUsersByUserIds(
      { userIds: unrenderableUsersIdsMatchingHashtag },
    );

  const unrenderableUsers = mergeArraysOfUnrenderableUsers({
    arrays: [
      unrenderableUsersMatchingUsername,
      unrenderableUsersMatchingHashtag,
      unrenderableUsersMatchingBio,
    ],
  });

  if (unrenderableUsers.length === 0) {
    // controller.setStatus(404);
    return {
      success: {
        users: [],
        previousPageCursor: cursor,
      },
    };
  }

  const renderableUsers = await constructRenderableUsersFromParts({
    clientUserId,
    unrenderableUsers,
    blobStorageService: controller.blobStorageService,
    databaseService: controller.databaseService,
  });

  const pageNumber = parseInt(cursor || "0") || 0;
  const startIndexForPage = pageSize * pageNumber;
  const endIndexForPage = startIndexForPage + pageSize;

  const pageOfRenderableUsers = renderableUsers.slice(startIndexForPage, endIndexForPage);

  return {
    success: {
      users: pageOfRenderableUsers,
      previousPageCursor: cursor,
      nextPageCursor: (pageNumber + 1).toString(),
    },
  };
}
