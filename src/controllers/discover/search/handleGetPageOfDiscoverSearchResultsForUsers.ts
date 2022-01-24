import express from "express";
import { SecuredHTTPResponse } from "../../../types/httpResponse";
import { DiscoverController } from "../discoverController";
import { checkAuthorization } from "../../auth/utilities";
import { RenderableUser } from "../../../controllers/user/models";
import { constructRenderableUsersFromParts } from "../../../controllers/user/utilities";

export interface GetPageOfDiscoverSearchResultsForUsersParams {
  query: string;
  cursor?: string;
  pageSize: number;
}

export enum FailedToGetPageOfDiscoverSearchResultsForUsersResponseReason {
  UnknownCause = "Unknown Cause",
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface FailedToGetPageOfDiscoverSearchResultsForUsersResponse {
  reason: FailedToGetPageOfDiscoverSearchResultsForUsersResponseReason;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface SuccessfullyGotPageOfDiscoverSearchResultsForUsersResponse {
  users: RenderableUser[];
  previousPageCursor?: string;
  nextPageCursor?: string;
}

export async function handleGetPageOfDiscoverSearchResultsForUsers({
  controller,
  request,
  requestBody,
}: {
  controller: DiscoverController;
  request: express.Request;
  requestBody: GetPageOfDiscoverSearchResultsForUsersParams;
}): Promise<
  SecuredHTTPResponse<
    FailedToGetPageOfDiscoverSearchResultsForUsersResponse,
    SuccessfullyGotPageOfDiscoverSearchResultsForUsersResponse
  >
> {
  const { clientUserId, error } = await checkAuthorization(controller, request);
  if (error) return error;

  const { cursor, query, pageSize } = requestBody;
  const trimmedQuery = query.trim();

  const unrenderableUsers =
    await controller.databaseService.tableNameToServicesMap.usersTableService.selectUsersByUsernameMatchingSubstring(
      {
        usernameSubstring: trimmedQuery,
      },
    );

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
