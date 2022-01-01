import express from "express";
import { SecuredHTTPResponse } from "../../types/httpResponse";
import { checkAuthorization } from "../auth/utilities";
import { FeedController } from "./feedController";
import { UserContentFeedFilter, UserContentFeedFilterType } from "./models";
import { v4 as uuidv4 } from "uuid";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface SetUserContentFeedFiltersRequestBody {
  hashtags: string[];
  usernames: string[];
}

export enum FailedToSetUserContentFeedFiltersResponseReason {
  UnknownCause = "Unknown Cause",
}

export interface FailedToSetUserContentFeedFiltersResponse {
  reason: FailedToSetUserContentFeedFiltersResponseReason;
}

export interface SuccessfullySetUserContentFeedFiltersResponse {
  userContentFeedFilters: UserContentFeedFilter[];
}

export async function handleSetUserContentFeedFilters({
  controller,
  request,
  requestBody,
}: {
  controller: FeedController;
  request: express.Request;
  requestBody: SetUserContentFeedFiltersRequestBody;
}): Promise<
  SecuredHTTPResponse<
    FailedToSetUserContentFeedFiltersResponse,
    SuccessfullySetUserContentFeedFiltersResponse
  >
> {
  const { hashtags, usernames } = requestBody;

  const { clientUserId, error } = await checkAuthorization(controller, request);
  if (error) return error;

  const userContentFeedFilters = [
    ...hashtags.map((hashtag) => ({
      contentFeedFilterId: uuidv4(),
      userId: clientUserId,
      type: UserContentFeedFilterType.HASHTAG,
      value: hashtag,
      creationTimestamp: Date.now(),
    })),
    ...usernames.map((username) => ({
      contentFeedFilterId: uuidv4(),
      userId: clientUserId,
      type: UserContentFeedFilterType.USERNAME,
      value: username,
      creationTimestamp: Date.now(),
    })),
  ];

  const existingUserContentFeedFilters =
    await controller.databaseService.tableNameToServicesMap.userContentFeedFiltersTableService.getUserContentFeedFiltersByUserId(
      { userId: clientUserId },
    );

  if (!!existingUserContentFeedFilters) {
    await controller.databaseService.tableNameToServicesMap.userContentFeedFiltersTableService.deleteUserContentFeedFiltersByUserId(
      { userId: clientUserId },
    );
  }

  await controller.databaseService.tableNameToServicesMap.userContentFeedFiltersTableService.createUserContentFeedFilters(
    { userContentFeedFilters },
  );

  return {
    success: {
      userContentFeedFilters,
    },
  };
}
