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
import { generateAndEmitAcceptedUserFollowRequestNotification } from "./utilities/generateAndEmitAcceptedUserFollowRequestNotification";

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
    //////////////////////////////////////////////////
    // IF ACCEPTING
    //    UPDATE FOLLOWS TABLE
    //////////////////////////////////////////////////

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
    const {
      success: { userFollowEventId },
    } = approvePendingFollowResponse;

    //////////////////////////////////////////////////
    // IF ACCEPTING
    //    GENERATE NOTIFICATION FOR ACCEPTED FOLLOW REQUEST
    //    AND SEND TO USER
    //////////////////////////////////////////////////
    const generateAndEmitAcceptedUserFollowRequestNotificationResponse =
      await generateAndEmitAcceptedUserFollowRequestNotification({
        controller,
        databaseService: controller.databaseService,
        blobStorageService: controller.blobStorageService,
        webSocketService: controller.webSocketService,
        recipientUserId: userIdDoingFollowing,
        userFollowEventId,
      });
    if (
      generateAndEmitAcceptedUserFollowRequestNotificationResponse.type ===
      EitherType.failure
    ) {
      return generateAndEmitAcceptedUserFollowRequestNotificationResponse;
    }

    //////////////////////////////////////////////////
    // RETURN
    //////////////////////////////////////////////////

    return Success({});
  } else if (decision === FollowRequestDecision.reject) {
    //////////////////////////////////////////////////
    // IF NOT ACCEPTING
    //     UPDATE FOLLOWS TABLE
    //////////////////////////////////////////////////

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

    //////////////////////////////////////////////////
    // RETURN
    //////////////////////////////////////////////////
    return Success({});
  }

  //////////////////////////////////////////////////
  // RETURN
  //////////////////////////////////////////////////

  return Failure({
    controller,
    httpStatusCode: 500,
    reason: GenericResponseFailedReason.BAD_REQUEST,
    error: "Unknown decision type at handleResolveFollowRequest",
    additionalErrorInformation: "Unknown decision type at handleResolveFollowRequest",
  });
}
