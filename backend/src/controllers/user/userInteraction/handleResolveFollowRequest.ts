/* eslint-disable @typescript-eslint/no-empty-interface */
import express from "express";
import {
  EitherType,
  ErrorReasonTypes,
  Failure,
  HTTPResponse,
  Success,
} from "../../../utilities/monads";
import { checkAuthorization } from "../../auth/utilities";
import { UserInteractionController } from "./userInteractionController";
import { GenericResponseFailedReason } from "../../models";

export enum FollowRequestDecision {
  accept = "accept",
  reject = "reject",
}

export interface ResolveFollowRequestRequestBody {
  decision: FollowRequestDecision;
  userIdDoingFollowing: string;
}

export interface ResolveFollowRequestSuccess {}

export enum ResolveFollowRequestFailedReason {
  UnknownCause = "Unknown Cause",
}

export async function handleResolveFollowRequest({
  controller,
  request,
  requestBody,
}: {
  controller: UserInteractionController;
  request: express.Request;
  requestBody: ResolveFollowRequestRequestBody;
}): Promise<
  HTTPResponse<
    ErrorReasonTypes<string | ResolveFollowRequestFailedReason>,
    ResolveFollowRequestSuccess
  >
> {
  const { clientUserId, errorResponse: error } = await checkAuthorization(
    controller,
    request,
  );
  if (error) return error;

  const { decision, userIdDoingFollowing } = requestBody;

  if (decision === FollowRequestDecision.accept) {
    const approvePendingFollowResponse =
      await controller.databaseService.tableNameToServicesMap.userFollowsTableService.approvePendingFollow(
        {
          controller,
          userIdBeingFollowed: clientUserId,
          userIdDoingFollowing,
        },
      );
    if (approvePendingFollowResponse.type === EitherType.failure) {
      return approvePendingFollowResponse;
    }
    return Success({});
  } else if (decision === FollowRequestDecision.reject) {
    const deleteUserFollowResponse =
      await controller.databaseService.tableNameToServicesMap.userFollowsTableService.deleteUserFollow(
        {
          controller,
          userIdBeingUnfollowed: clientUserId,
          userIdDoingUnfollowing: userIdDoingFollowing,
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
    error: "Unknown decision type at handleResolveFollowRequest",
    additionalErrorInformation: "Unknown decision type at handleResolveFollowRequest",
  });
}
