import express from "express";
import {
  EitherType,
  ErrorReasonTypes,
  SecuredHTTPResponse,
  Success,
} from "../../utilities/monads";
import { checkAuthorization } from "../auth/utilities";
import { FeedController } from "./feedController";
import { UserContentFeedFilter, UserContentFeedFilterType } from "./models";

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
  const now = Date.now();

  const { clientUserId, errorResponse: error } = await checkAuthorization(
    controller,
    request,
  );
  if (error) return error;

  const getUserContentFeedFiltersByUserIdResponse =
    await controller.databaseService.tableNameToServicesMap.userContentFeedFiltersTableService.getUserContentFeedFiltersByUserId(
      { controller, userId: clientUserId },
    );
  if (getUserContentFeedFiltersByUserIdResponse.type === EitherType.failure) {
    return getUserContentFeedFiltersByUserIdResponse;
  }
  const { success: userContentFeedFilters } = getUserContentFeedFiltersByUserIdResponse;

  const selectUserByUserIdResponse =
    await controller.databaseService.tableNameToServicesMap.usersTableService.selectUserByUserId(
      { controller, userId: clientUserId },
    );
  if (selectUserByUserIdResponse.type === EitherType.failure) {
    return selectUserByUserIdResponse;
  }
  const { success: unrenderableUser } = selectUserByUserIdResponse;

  const defaultFilters: UserContentFeedFilter[] = [];

  // ADD ALL_POSTS_FOR_ADMINS FILTER FOR ADMINS
  if (!!unrenderableUser?.isAdmin) {
    defaultFilters.push({
      contentFeedFilterId: "All Posts",
      userId: clientUserId,
      type: UserContentFeedFilterType.ALL_POSTS_FOR_ADMINS,
      value: "",
      creationTimestamp: now,
    });
  }

  return Success({
    userContentFeedFilters: [...defaultFilters, ...userContentFeedFilters],
  });
}
