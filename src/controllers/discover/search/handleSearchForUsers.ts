import express from "express";
import {
  EitherType,
  ErrorReasonTypes,
  SecuredHTTPResponse,
  Success,
} from "../../../utilities/monads";
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
}): Promise<
  SecuredHTTPResponse<
    ErrorReasonTypes<string | SearchForUsersFailedReason>,
    SearchForUsersSuccess
  >
> {
  const { clientUserId, errorResponse: error } = await checkAuthorization(
    controller,
    request,
  );
  if (error) return error;

  const { pageNumber, query, pageSize } = requestBody;
  const lowercaseTrimmedQuery = query.trim().toLowerCase();

  const selectUsersBySearchStringResponse =
    await controller.databaseService.tableNameToServicesMap.usersTableService.selectUsersBySearchString(
      { controller, searchString: lowercaseTrimmedQuery },
    );
  if (selectUsersBySearchStringResponse.type === EitherType.failure) {
    return selectUsersBySearchStringResponse;
  }
  const { success: unrenderableUsersMatchingSearchString } =
    selectUsersBySearchStringResponse;

  const getUserIdsWithHashtagResponse =
    await controller.databaseService.tableNameToServicesMap.userHashtagsTableService.getUserIdsWithHashtag(
      { controller, hashtag: lowercaseTrimmedQuery },
    );
  if (getUserIdsWithHashtagResponse.type === EitherType.failure) {
    return getUserIdsWithHashtagResponse;
  }
  const { success: unrenderableUsersIdsMatchingHashtag } = getUserIdsWithHashtagResponse;

  const selectUsersByUserIdsResponse =
    await controller.databaseService.tableNameToServicesMap.usersTableService.selectUsersByUserIds(
      { controller, userIds: unrenderableUsersIdsMatchingHashtag },
    );
  if (selectUsersByUserIdsResponse.type === EitherType.failure) {
    return selectUsersByUserIdsResponse;
  }
  const { success: unrenderableUsersMatchingHashtag } = selectUsersByUserIdsResponse;

  const unrenderableUsers = mergeArraysOfUnrenderableUsers({
    arrays: [unrenderableUsersMatchingSearchString, unrenderableUsersMatchingHashtag],
  });

  if (unrenderableUsers.length === 0) {
    return Success({
      users: [],
      totalCount: 0,
    });
  }

  const pageOfUnrenderableUsers = unrenderableUsers.slice(
    pageSize * pageNumber - pageSize,
    pageSize * pageNumber,
  );

  const constructRenderableUsersFromPartsResponse =
    await constructRenderableUsersFromParts({
      controller,
      requestorUserId: clientUserId,
      unrenderableUsers: pageOfUnrenderableUsers,
      blobStorageService: controller.blobStorageService,
      databaseService: controller.databaseService,
    });
  if (constructRenderableUsersFromPartsResponse.type === EitherType.failure) {
    return constructRenderableUsersFromPartsResponse;
  }
  const { success: renderableUsers } = constructRenderableUsersFromPartsResponse;

  return Success({
    users: renderableUsers,
    totalCount: unrenderableUsers.length,
  });
}
