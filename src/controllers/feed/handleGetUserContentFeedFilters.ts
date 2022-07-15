import express from "express";
import { EitherType, SecuredHTTPResponse } from "../../types/monads";
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
    GetUserContentFeedFiltersFailedReason,
    GetUserContentFeedFiltersSuccess
  >
> {
  const now = Date.now();

  const { clientUserId, errorResponse: error } = await checkAuthorization(
    controller,
    request,
  );
  if (error) return error;

  const userContentFeedFilters =
    await controller.databaseService.tableNameToServicesMap.userContentFeedFiltersTableService.getUserContentFeedFiltersByUserId(
      { userId: clientUserId },
    );

  const unrenderableUser =
    await controller.databaseService.tableNameToServicesMap.usersTableService.selectUserByUserId(
      { userId: clientUserId },
    );

  // ADD ALL_POSTS_FOR_REVIEW_BY_ADMINS FILTER FOR ADMINS
  if (!!unrenderableUser && !!unrenderableUser.isAdmin) {
    userContentFeedFilters.push({
      contentFeedFilterId: "",
      userId: clientUserId,
      type: UserContentFeedFilterType.ALL_POSTS_FOR_REVIEW_BY_ADMINS,
      value: "",
      creationTimestamp: now,
    });
  }

  return {
    type: EitherType.success,
    success: {
      userContentFeedFilters,
    },
  };
}
