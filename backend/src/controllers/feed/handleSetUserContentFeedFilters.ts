import express from "express";
import {
  EitherType,
  ErrorReasonTypes,
  SecuredHTTPResponse,
  Success,
} from "../../utilities/monads";
import { checkAuthentication } from "../auth/utilities";
import { FeedController } from "./feedController";
import { UserContentFeedFilter } from "./models";
import { v4 as uuidv4 } from "uuid";

export interface SetUserContentFeedFiltersRequestBody {
  requestedContentFeedFilters: UserContentFeedFilter[];
}

export enum SetUserContentFeedFiltersFailedReason {
  UnknownCause = "Unknown Cause",
}

export interface SetUserContentFeedFiltersSuccess {
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
    ErrorReasonTypes<string | SetUserContentFeedFiltersFailedReason>,
    SetUserContentFeedFiltersSuccess
  >
> {
  const { requestedContentFeedFilters } = requestBody;

  const { clientUserId, errorResponse: error } = await checkAuthentication(
    controller,
    request,
  );
  if (error) return error;

  const userContentFeedFilters: UserContentFeedFilter[] = [
    ...requestedContentFeedFilters.map((requestedContentFeedFilter) => {
      return {
        contentFeedFilterId: uuidv4(),
        userId: clientUserId,
        type: requestedContentFeedFilter.type,
        value: requestedContentFeedFilter.value.toLowerCase(),
        creationTimestamp: Date.now(),
      };
    }),
  ];

  const getUserContentFeedFiltersByUserIdResponse =
    await controller.databaseService.tableNameToServicesMap.userContentFeedFiltersTableService.getUserContentFeedFiltersByUserId(
      { controller, userId: clientUserId },
    );
  if (getUserContentFeedFiltersByUserIdResponse.type === EitherType.failure) {
    return getUserContentFeedFiltersByUserIdResponse;
  }
  const { success: existingUserContentFeedFilters } =
    getUserContentFeedFiltersByUserIdResponse;

  if (existingUserContentFeedFilters.length > 0) {
    const deleteUserContentFeedFiltersByUserIdResponse =
      await controller.databaseService.tableNameToServicesMap.userContentFeedFiltersTableService.deleteUserContentFeedFiltersByUserId(
        { controller, userId: clientUserId },
      );
    if (deleteUserContentFeedFiltersByUserIdResponse.type === EitherType.failure) {
      return deleteUserContentFeedFiltersByUserIdResponse;
    }
  }

  const createUserContentFeedFiltersResponse =
    await controller.databaseService.tableNameToServicesMap.userContentFeedFiltersTableService.createUserContentFeedFilters(
      { controller, userContentFeedFilters },
    );
  if (createUserContentFeedFiltersResponse.type === EitherType.failure) {
    return createUserContentFeedFiltersResponse;
  }

  return Success({
    userContentFeedFilters,
  });
}
