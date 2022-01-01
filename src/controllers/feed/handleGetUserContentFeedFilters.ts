import express from "express";
import { SecuredHTTPResponse } from "src/types/httpResponse";
import { checkAuthorization } from "../auth/utilities";
import { FeedController } from "./feedController";
import { UserContentFeedFilter } from "./models";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface GetUserContentFeedFiltersRequestBody {}

export enum FailedToGetUserContentFeedFiltersResponseReason {
  UnknownCause = "Unknown Cause",
}

export interface FailedToGetUserContentFeedFiltersResponse {
  reason: FailedToGetUserContentFeedFiltersResponseReason;
}

export interface SuccessfullyGotUserContentFeedFiltersResponse {
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
    FailedToGetUserContentFeedFiltersResponse,
    SuccessfullyGotUserContentFeedFiltersResponse
  >
> {
  const { clientUserId, error } = await checkAuthorization(controller, request);
  if (error) return error;

  const userContentFeedFilters =
    await controller.databaseService.tableNameToServicesMap.userContentFeedFiltersTableService.getUserContentFeedFiltersByUserId(
      { userId: clientUserId },
    );

  return {
    success: {
      userContentFeedFilters,
    },
  };
}
