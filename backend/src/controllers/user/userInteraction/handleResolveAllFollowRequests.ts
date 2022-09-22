/* eslint-disable @typescript-eslint/no-empty-interface */
import express from "express";
import { GenericResponseFailedReason } from "../../../controllers/models";
import {
  EitherType,
  ErrorReasonTypes,
  Failure,
  SecuredHTTPResponse,
  Success,
} from "../../../utilities/monads";
import { checkAuthorization } from "../../auth/utilities";
import { UserInteractionController } from "./userInteractionController";

export enum FollowAllRequestsDecision {
  accept = "accept",
  reject = "reject",
}

export interface ResolveAllFollowRequestsRequestBody {
  decision: FollowAllRequestsDecision;
}

export interface ResolveAllFollowRequestsSuccess {}

export enum ResolveAllFollowRequestsFailedReason {
  UnknownCause = "Unknown Cause",
}

export async function handleResolveAllFollowRequests({
  controller,
  request,
  requestBody,
}: {
  controller: UserInteractionController;
  request: express.Request;
  requestBody: ResolveAllFollowRequestsRequestBody;
}): Promise<
  SecuredHTTPResponse<
    ErrorReasonTypes<string | ResolveAllFollowRequestsFailedReason>,
    ResolveAllFollowRequestsSuccess
  >
> {
  const { clientUserId, errorResponse: error } = await checkAuthorization(
    controller,
    request,
  );
  if (error) return error;

  const { decision } = requestBody;

  if (decision === FollowAllRequestsDecision.accept) {
    const approvePendingFollowResponse =
      await controller.databaseService.tableNameToServicesMap.userFollowsTableService.approveAllPendingFollows(
        {
          controller,
          userIdBeingFollowed: clientUserId,
        },
      );
    if (approvePendingFollowResponse.type === EitherType.failure) {
      return approvePendingFollowResponse;
    }
    return Success({});
  } else if (decision === FollowAllRequestsDecision.reject) {
    const deleteUserFollowResponse =
      await controller.databaseService.tableNameToServicesMap.userFollowsTableService.deleteAllPendingUserFollows(
        {
          controller,
          userIdBeingUnfollowed: clientUserId,
        },
      );
    if (deleteUserFollowResponse.type === EitherType.failure) {
      return deleteUserFollowResponse;
    }
    return Success({});
  }

  return Failure({
    controller,
    httpStatusCode: 500,
    reason: GenericResponseFailedReason.BAD_REQUEST,
    error: "Unknown decision type at handleResolveAllFollowRequests",
    additionalErrorInformation: "Unknown decision type at handleResolveAllFollowRequests",
  });
}
