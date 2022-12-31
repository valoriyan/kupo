import express from "express";
import {
  EitherType,
  ErrorReasonTypes,
  Failure,
  SecuredHTTPResponse,
  Success,
} from "../../utilities/monads";
import { checkAuthentication } from "../auth/utilities";
import { FeedController } from "./feedController";
import { UserContentFeedFilter, UserContentFeedFilterType } from "./models";
import { GenericResponseFailedReason } from "../models";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface GetUserContentFeedFiltersRequestBody {}

export enum GetUserContentFeedFiltersFailedReason {
  UnknownCause = "Unknown Cause",
}

export interface GetUserContentFeedFiltersSuccess {
  userContentFeedFilters: UserContentFeedFilter[];
}

export async function handleGetUserContentFeedFilters({
  controller,
  request,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  requestBody,
}: {
  controller: FeedController;
  request: express.Request;
  requestBody: GetUserContentFeedFiltersRequestBody;
}): Promise<
  SecuredHTTPResponse<
    ErrorReasonTypes<string | GetUserContentFeedFiltersFailedReason>,
    GetUserContentFeedFiltersSuccess
  >
> {
  //////////////////////////////////////////////////
  // Inputs & Authentication
  //////////////////////////////////////////////////

  const now = Date.now();

  const { clientUserId, errorResponse: error } = await checkAuthentication(
    controller,
    request,
  );
  if (error) return error;

  //////////////////////////////////////////////////
  // Read Content Feed Filters from DB
  //////////////////////////////////////////////////

  const getUserContentFeedFiltersByUserIdResponse =
    await controller.databaseService.tableNameToServicesMap.userContentFeedFiltersTableService.getUserContentFeedFiltersByUserId(
      { controller, userId: clientUserId },
    );
  if (getUserContentFeedFiltersByUserIdResponse.type === EitherType.failure) {
    return getUserContentFeedFiltersByUserIdResponse;
  }
  const { success: userContentFeedFilters } = getUserContentFeedFiltersByUserIdResponse;

  //////////////////////////////////////////////////
  // Read Client UnrenderableUser from DB
  //////////////////////////////////////////////////

  const selectMaybeUserByUserIdResponse =
    await controller.databaseService.tableNameToServicesMap.usersTableService.selectMaybeUserByUserId(
      { controller, userId: clientUserId },
    );
  if (selectMaybeUserByUserIdResponse.type === EitherType.failure) {
    return selectMaybeUserByUserIdResponse;
  }
  const { success: maybeUnrenderableUser } = selectMaybeUserByUserIdResponse;

  if (!maybeUnrenderableUser) {
    return Failure({
      controller,
      httpStatusCode: 404,
      reason: GenericResponseFailedReason.DATABASE_TRANSACTION_ERROR,
      error: "User not found at handleGetUserContentFeedFilters",
      additionalErrorInformation: "Error at handleGetUserContentFeedFilters",
    });
  }

  const unrenderableUser = maybeUnrenderableUser;

  //////////////////////////////////////////////////
  // Add "All Posts" Content Feed Filter if User is Admin
  //////////////////////////////////////////////////

  const defaultFilters: UserContentFeedFilter[] = [];

  // ADD ALL_POSTS_FOR_ADMINS FILTER FOR ADMINS
  if (!!unrenderableUser.isAdmin) {
    defaultFilters.push({
      contentFeedFilterId: "All Posts",
      userId: clientUserId,
      type: UserContentFeedFilterType.ALL_POSTS_FOR_ADMINS,
      value: "",
      creationTimestamp: now,
    });
  }

  //////////////////////////////////////////////////
  // Return
  //////////////////////////////////////////////////

  return Success({
    userContentFeedFilters: [...defaultFilters, ...userContentFeedFilters],
  });
}
