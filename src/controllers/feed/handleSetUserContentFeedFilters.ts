import express from "express";
import { SecuredHTTPResponse } from "../../types/httpResponse";
import { checkAuthorization } from "../auth/utilities";
import { FeedController } from "./feedController";
import { UserContentFeedFilter } from "./models";
import { v4 as uuidv4 } from "uuid";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface SetUserContentFeedFiltersRequestBody {
  requestedContentFeedFilters: UserContentFeedFilter[];
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
  const { requestedContentFeedFilters } = requestBody;

  const { clientUserId, error } = await checkAuthorization(controller, request);
  if (error) return error;

  const userContentFeedFilters: UserContentFeedFilter[] = [
    ...requestedContentFeedFilters.map((requestedContentFeedFilter) => {
      return {
        contentFeedFilterId: uuidv4(),
        userId: clientUserId,
        type: requestedContentFeedFilter.type,
        value: requestedContentFeedFilter.value,
        creationTimestamp: Date.now(),
      };
    }),
  ];

  const existingUserContentFeedFilters =
    await controller.databaseService.tableNameToServicesMap.userContentFeedFiltersTableService.getUserContentFeedFiltersByUserId(
      { userId: clientUserId },
    );

  if (existingUserContentFeedFilters.length > 0) {
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
