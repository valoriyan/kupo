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
import { checkAuthentication } from "../../auth/utilities";
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
  //////////////////////////////////////////////////
  // Inputs & Authentication
  //////////////////////////////////////////////////
  const { clientUserId, errorResponse: error } = await checkAuthentication(
    controller,
    request,
  );
  if (error) return error;

  const { decision } = requestBody;

  if (decision === FollowAllRequestsDecision.accept) {
    //////////////////////////////////////////////////
    // Write Accepted Follow Decisions to DB
    //////////////////////////////////////////////////

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
  } else if (decision === FollowAllRequestsDecision.reject) {
    //////////////////////////////////////////////////
    // Write Rejected Follow Decisions to DB
    //////////////////////////////////////////////////

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
  } else {
    //////////////////////////////////////////////////
    // Handle Unknown Decision Type
    //////////////////////////////////////////////////

    return Failure({
      controller,
      httpStatusCode: 500,
      reason: GenericResponseFailedReason.BAD_REQUEST,
      error: "Unknown decision type at handleResolveAllFollowRequests",
      additionalErrorInformation:
        "Unknown decision type at handleResolveAllFollowRequests",
    });
  }

  //////////////////////////////////////////////////
  // Return
  //////////////////////////////////////////////////

  return Success({});
}
