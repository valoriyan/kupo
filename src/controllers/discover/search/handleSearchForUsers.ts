import express from "express";
import { EitherType, SecuredHTTPResponse } from "../../../types/monads";
import { DiscoverController } from "../discoverController";
import { checkAuthorization } from "../../auth/utilities";
import { RenderableUser } from "../../user/models";
import {
  constructRenderableUsersFromParts,
  mergeArraysOfUnrenderableUsers,
} from "../../user/utilities";

export interface SearchForUsersRequestBody {
  query: string;
  pageNumber: number;
  pageSize: number;
}

export enum SearchForUsersFailedReason {
  UnknownCause = "Unknown Cause",
}

export interface SearchForUsersSuccess {
  users: RenderableUser[];
  totalCount: number;
}

export async function handleSearchForUsers({
  controller,
  request,
  requestBody,
}: {
  controller: DiscoverController;
  request: express.Request;
  requestBody: SearchForUsersRequestBody;
}): Promise<SecuredHTTPResponse<SearchForUsersFailedReason, SearchForUsersSuccess>> {
  const { clientUserId, errorResponse: error } = await checkAuthorization(
    controller,
    request,
  );
  if (error) return error;

  const { pageNumber, query, pageSize } = requestBody;
  const lowercaseTrimmedQuery = query.trim().toLowerCase();

  const unrenderableUsersMatchingSearchString =
    await controller.databaseService.tableNameToServicesMap.usersTableService.selectUsersBySearchString(
      { searchString: lowercaseTrimmedQuery },
    );

  const unrenderableUsersIdsMatchingHashtag =
    await controller.databaseService.tableNameToServicesMap.userHashtagsTableService.getUserIdsWithHashtag(
      { hashtag: lowercaseTrimmedQuery },
    );

  const unrenderableUsersMatchingHashtag =
    await controller.databaseService.tableNameToServicesMap.usersTableService.selectUsersByUserIds(
      { userIds: unrenderableUsersIdsMatchingHashtag },
    );

  const unrenderableUsers = mergeArraysOfUnrenderableUsers({
    arrays: [unrenderableUsersMatchingSearchString, unrenderableUsersMatchingHashtag],
  });

  if (unrenderableUsers.length === 0) {
    return {
      type: EitherType.success,
      success: {
        users: [],
        totalCount: 0,
      },
    };
  }

  const pageOfUnrenderableUsers = unrenderableUsers.slice(
    pageSize * pageNumber - pageSize,
    pageSize * pageNumber,
  );

  const renderableUsers = await constructRenderableUsersFromParts({
    clientUserId,
    unrenderableUsers: pageOfUnrenderableUsers,
    blobStorageService: controller.blobStorageService,
    databaseService: controller.databaseService,
  });

  return {
    type: EitherType.success,
    success: {
      users: renderableUsers,
      totalCount: unrenderableUsers.length,
    },
  };
}
