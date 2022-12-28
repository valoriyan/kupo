import express from "express";
import {
  EitherType,
  ErrorReasonTypes,
  SecuredHTTPResponse,
  Success,
} from "../../../utilities/monads";
import { DiscoverController } from "../discoverController";
import { checkAuthentication } from "../../auth/utilities";
import { RenderableUser } from "../../user/models";
import { assembleRenderableUsersFromCachedComponents } from "../../user/utilities/assembleRenderableUserFromCachedComponents";
import { mergeArraysOfUnrenderableUsers } from "../../user/utilities/mergeArraysOfUnrenderableUsers";

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
  //////////////////////////////////////////////////
  // Inputs & Authentication
  //////////////////////////////////////////////////
  const { clientUserId, errorResponse: error } = await checkAuthentication(
    controller,
    request,
  );
  if (error) return error;

  const { pageNumber, query, pageSize } = requestBody;
  const lowercaseTrimmedQuery = query.trim().toLowerCase();

  //////////////////////////////////////////////////
  // Select Users with Usernames Matching Search
  //////////////////////////////////////////////////

  const selectUsersBySearchStringResponse =
    await controller.databaseService.tableNameToServicesMap.usersTableService.selectUsersBySearchString(
      { controller, searchString: lowercaseTrimmedQuery },
    );
  if (selectUsersBySearchStringResponse.type === EitherType.failure) {
    return selectUsersBySearchStringResponse;
  }
  const { success: unrenderableUsersMatchingSearchString } =
    selectUsersBySearchStringResponse;

  //////////////////////////////////////////////////
  // Select User Ids with Hashtags Matching Search
  //////////////////////////////////////////////////

  const getUserIdsWithHashtagResponse =
    await controller.databaseService.tableNameToServicesMap.userHashtagsTableService.getUserIdsWithHashtag(
      { controller, hashtag: lowercaseTrimmedQuery },
    );
  if (getUserIdsWithHashtagResponse.type === EitherType.failure) {
    return getUserIdsWithHashtagResponse;
  }
  const { success: unrenderableUsersIdsMatchingHashtag } = getUserIdsWithHashtagResponse;

  //////////////////////////////////////////////////
  // Get Users with Hashtags Matching Search
  //////////////////////////////////////////////////

  const selectUsersByUserIdsResponse =
    await controller.databaseService.tableNameToServicesMap.usersTableService.selectUsersByUserIds(
      { controller, userIds: unrenderableUsersIdsMatchingHashtag },
    );
  if (selectUsersByUserIdsResponse.type === EitherType.failure) {
    return selectUsersByUserIdsResponse;
  }
  const { success: unrenderableUsersMatchingHashtag } = selectUsersByUserIdsResponse;

  //////////////////////////////////////////////////
  // Merge Results of Username and Hashtag Search
  //////////////////////////////////////////////////

  const unrenderableUsers = mergeArraysOfUnrenderableUsers({
    arrays: [unrenderableUsersMatchingSearchString, unrenderableUsersMatchingHashtag],
  });

  if (unrenderableUsers.length === 0) {
    return Success({
      users: [],
      totalCount: 0,
    });
  }

  //////////////////////////////////////////////////
  // Create Page of Results
  //////////////////////////////////////////////////

  const pageOfUnrenderableUsers = unrenderableUsers.slice(
    pageSize * pageNumber - pageSize,
    pageSize * pageNumber,
  );

  //////////////////////////////////////////////////
  // Get Renderable Users
  //////////////////////////////////////////////////

  const constructRenderableUsersFromPartsResponse =
    await assembleRenderableUsersFromCachedComponents({
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

  //////////////////////////////////////////////////
  // Return
  //////////////////////////////////////////////////

  return Success({
    users: renderableUsers,
    totalCount: unrenderableUsers.length,
  });
}
