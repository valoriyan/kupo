/* eslint-disable @typescript-eslint/no-non-null-assertion */
import express from "express";
import {
  EitherType,
  ErrorReasonTypes,
  SecuredHTTPResponse,
  InternalServiceResponse,
  Success,
} from "../../../utilities/monads";
import {
  unwrapListOfEitherResponses,
  UnwrapListOfEitherResponsesFailureHandlingMethod,
} from "../../../utilities/monads/unwrapListOfResponses";
import { checkAuthorization } from "../../auth/utilities";
import { UserInteractionController } from "./userInteractionController";
import { constructRenderableUserFromPartsByUserId } from "../utilities";
import { RenderableUser } from "../models";
import { Promise as BluebirdPromise } from "bluebird";
import { decodeTimestampCursor, encodeTimestampCursor } from "../../utilities/pagination";
import { getNextPageCursorOfPage } from "../../publishedItem/utilities/pagination";

export interface GetFollowerRequestsRequestBody {
  cursor?: string;
  pageSize: number;
}

export interface GetFollowerRequestsSuccess {
  users: RenderableUser[];
  previousPageCursor?: string;
  nextPageCursor?: string;
}

export enum GetFollowerRequestsFailedReason {
  UnknownCause = "Unknown Cause",
}

export async function handleGetFollowerRequests({
  controller,
  request,
  requestBody,
}: {
  controller: UserInteractionController;
  request: express.Request;
  requestBody: GetFollowerRequestsRequestBody;
}): Promise<
  SecuredHTTPResponse<
    ErrorReasonTypes<string | GetFollowerRequestsFailedReason>,
    GetFollowerRequestsSuccess
  >
> {
  const { cursor, pageSize } = requestBody;

  const { clientUserId, errorResponse: error } = await checkAuthorization(
    controller,
    request,
  );
  if (error) return error;

  const pageTimestamp = cursor
    ? decodeTimestampCursor({ encodedCursor: cursor })
    : 999999999999999;

  const getUserIdsFollowingUserIdResponse =
    await controller.databaseService.tableNameToServicesMap.userFollowsTableService.getUserIdsFollowingUserId(
      {
        controller,
        userIdBeingFollowed: clientUserId,
        areFollowsPending: true,
        createdBeforeTimestamp: pageTimestamp,
        limit: pageSize,
      },
    );
  if (getUserIdsFollowingUserIdResponse.type === EitherType.failure) {
    return getUserIdsFollowingUserIdResponse;
  }
  const { success: unrenderableUserFollows } = getUserIdsFollowingUserIdResponse;

  const constructRenderableUserFromPartsByUserIdResponses = await BluebirdPromise.map(
    unrenderableUserFollows,
    async (
      unrenderableUserFollow,
    ): Promise<InternalServiceResponse<ErrorReasonTypes<string>, RenderableUser>> => {
      const { userIdDoingFollowing } = unrenderableUserFollow;

      return await constructRenderableUserFromPartsByUserId({
        controller,
        requestorUserId: clientUserId,
        userId: userIdDoingFollowing,
        blobStorageService: controller.blobStorageService,
        databaseService: controller.databaseService,
      });
    },
  );

  const mappedConstructRenderableUserFromPartsByUserIdResponses =
    unwrapListOfEitherResponses({
      eitherResponses: constructRenderableUserFromPartsByUserIdResponses,
      failureHandlingMethod:
        UnwrapListOfEitherResponsesFailureHandlingMethod.SUCCEED_WITH_ANY_SUCCESSES_ELSE_RETURN_FIRST_FAILURE,
    });
  if (
    mappedConstructRenderableUserFromPartsByUserIdResponses.type === EitherType.failure
  ) {
    return mappedConstructRenderableUserFromPartsByUserIdResponses;
  }
  const { success: renderableUsers } =
    mappedConstructRenderableUserFromPartsByUserIdResponses;

  return Success({
    users: renderableUsers,
    previousPageCursor: requestBody.cursor,
    nextPageCursor: getNextPageCursorOfPage({
      items: renderableUsers,
      getTimestampFromItem: (user: RenderableUser) => {
        const { timestamp } = unrenderableUserFollows.find(
          ({ userIdDoingFollowing }) => userIdDoingFollowing === user.userId,
        )!;
        return encodeTimestampCursor({ timestamp });
      },
    }),
  });
}
