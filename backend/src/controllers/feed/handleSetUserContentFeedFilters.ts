import express from "express";
import {
  EitherType,
  ErrorReasonTypes,
  InternalServiceResponse,
  SecuredHTTPResponse,
  Success,
} from "../../utilities/monads";
import { checkAuthentication } from "../auth/utilities";
import { FeedController } from "./feedController";
import { UserContentFeedFilter, UserContentFeedFilterType } from "./models";
import { v4 as uuidv4 } from "uuid";
import { Promise as BluebirdPromise } from "bluebird";
import {
  UnwrapListOfEitherResponsesFailureHandlingMethod,
  unwrapListOfEitherResponses,
} from "../../utilities/monads/unwrapListOfResponses";

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
  //////////////////////////////////////////////////
  // Inputs & Authentication
  //////////////////////////////////////////////////

  const { requestedContentFeedFilters } = requestBody;

  const { clientUserId, errorResponse: error } = await checkAuthentication(
    controller,
    request,
  );
  if (error) return error;

  //////////////////////////////////////////////////
  // Process Fields of Request
  //////////////////////////////////////////////////

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

  //////////////////////////////////////////////////
  // Validate that Targets of User Content Feed Filters Exist
  //////////////////////////////////////////////////

  const validateUserContentFeedFilterResponses = await BluebirdPromise.map(
    userContentFeedFilters,
    async (
      userContentFeedFilters,
    ): Promise<
      InternalServiceResponse<ErrorReasonTypes<string>, UserContentFeedFilter>
    > => {
      const { type, value } = userContentFeedFilters;

      if (false) {
      } else if (type === UserContentFeedFilterType.USERNAME) {
        const selectMaybeUserByUsernameResponse =
          await controller.databaseService.tableNameToServicesMap.usersTableService.selectMaybeUserByUsername(
            { controller, username: value },
          );

        if (selectMaybeUserByUsernameResponse.type === EitherType.failure) {
          return selectMaybeUserByUsernameResponse;
        }
        return Success(userContentFeedFilters);
      } else if (type === UserContentFeedFilterType.PUBLISHING_CHANNEL) {
        const getMaybePublishingChannelByNameResponse =
          await controller.databaseService.tableNameToServicesMap.publishingChannelsTableService.getMaybePublishingChannelByName(
            { controller, name: value },
          );
        if (getMaybePublishingChannelByNameResponse.type === EitherType.failure) {
          return getMaybePublishingChannelByNameResponse;
        }
        return Success(userContentFeedFilters);
      } else {
        return Success(userContentFeedFilters);
      }
    },
  );
  const mappedResponse = unwrapListOfEitherResponses({
    eitherResponses: validateUserContentFeedFilterResponses,
    failureHandlingMethod:
      UnwrapListOfEitherResponsesFailureHandlingMethod.SUCCEED_WITH_ANY_SUCCESSES_ELSE_RETURN_FIRST_FAILURE,
  });
  if (mappedResponse.type === EitherType.failure) {
    return mappedResponse;
  }

  const { success: validatedUserContentFeedFilters } = mappedResponse;

  //////////////////////////////////////////////////
  // Delete Existing Content Feed Filters
  //////////////////////////////////////////////////

  const deleteUserContentFeedFiltersByUserIdResponse =
    await controller.databaseService.tableNameToServicesMap.userContentFeedFiltersTableService.deleteUserContentFeedFiltersByUserId(
      { controller, userId: clientUserId },
    );
  if (deleteUserContentFeedFiltersByUserIdResponse.type === EitherType.failure) {
    return deleteUserContentFeedFiltersByUserIdResponse;
  }

  //////////////////////////////////////////////////
  // Write Replacement Content Feed Filters to DB
  //////////////////////////////////////////////////

  const createUserContentFeedFiltersResponse =
    await controller.databaseService.tableNameToServicesMap.userContentFeedFiltersTableService.createUserContentFeedFilters(
      { controller, userContentFeedFilters: validatedUserContentFeedFilters },
    );
  if (createUserContentFeedFiltersResponse.type === EitherType.failure) {
    return createUserContentFeedFiltersResponse;
  }

  //////////////////////////////////////////////////
  // Return
  //////////////////////////////////////////////////

  return Success({
    userContentFeedFilters,
  });
}
