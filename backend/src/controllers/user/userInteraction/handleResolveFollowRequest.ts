/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/no-empty-interface */
import express from "express";
import {
  EitherType,
  ErrorReasonTypes,
  Failure,
  InternalServiceResponse,
  SecuredHTTPResponse,
  Success,
} from "../../../utilities/monads";
import { checkAuthentication } from "../../auth/utilities";
import { UserInteractionController } from "./userInteractionController";
import { GenericResponseFailedReason } from "../../models";
import { assembleRecordAndSendAcceptedUserFollowRequestNotification } from "../../../controllers/notification/notificationSenders/assembleRecordAndSendAcceptedUserFollowRequestNotification";
import { Controller } from "tsoa";
import { DatabaseService } from "../../../services/databaseService";
import { WebSocketService } from "../../../services/webSocketService";
import { BlobStorageService } from "../../../services/blobStorageService";

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
  SecuredHTTPResponse<
    ErrorReasonTypes<string | ResolveFollowRequestFailedReason>,
    ResolveFollowRequestSuccess
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

  const { decision, userIdDoingFollowing } = requestBody;

  if (decision === FollowRequestDecision.accept) {
    //////////////////////////////////////////////////
    // Handle Acccepted Decision
    //////////////////////////////////////////////////

    const handleResolveFollowRequestAcceptResponse =
      await handleResolveFollowRequestAccept({
        controller,
        databaseService: controller.databaseService,
        blobStorageService: controller.blobStorageService,
        webSocketService: controller.webSocketService,
        userIdBeingFollowed: clientUserId,
        userIdDoingFollowing,
      });
    if (handleResolveFollowRequestAcceptResponse.type === EitherType.failure) {
      return handleResolveFollowRequestAcceptResponse;
    }
  } else if (decision === FollowRequestDecision.reject) {
    //////////////////////////////////////////////////
    // Handle Rejected Decision
    //////////////////////////////////////////////////
    const handleResolveFollowRequestRejectResponse =
      await handleResolveFollowRequestReject({
        controller,
        databaseService: controller.databaseService,
        userIdBeingFollowed: clientUserId,
        userIdDoingFollowing: userIdDoingFollowing,
      });
    if (handleResolveFollowRequestRejectResponse.type === EitherType.failure) {
      return handleResolveFollowRequestRejectResponse;
    }
  } else {
    //////////////////////////////////////////////////
    // Handle Unknown Decision Type
    //////////////////////////////////////////////////

    return Failure({
      controller,
      httpStatusCode: 500,
      reason: GenericResponseFailedReason.BAD_REQUEST,
      error: "Unknown decision type at handleResolveFollowRequest",
      additionalErrorInformation: "Unknown decision type at handleResolveFollowRequest",
    });
  }

  //////////////////////////////////////////////////
  // RETURN
  //////////////////////////////////////////////////

  return Success({});
}

async function handleResolveFollowRequestAccept({
  controller,
  databaseService,
  blobStorageService,
  webSocketService,
  userIdBeingFollowed,
  userIdDoingFollowing,
}: {
  controller: Controller;
  databaseService: DatabaseService;
  blobStorageService: BlobStorageService;
  webSocketService: WebSocketService;
  userIdBeingFollowed: string;
  userIdDoingFollowing: string;
}): Promise<InternalServiceResponse<ErrorReasonTypes<string>, {}>> {
  //////////////////////////////////////////////////
  // Write Update To DB
  //////////////////////////////////////////////////

  const approvePendingFollowResponse =
    await databaseService.tableNameToServicesMap.userFollowsTableService.approvePendingFollow(
      {
        controller,
        userIdBeingFollowed,
        userIdDoingFollowing,
      },
    );
  if (approvePendingFollowResponse.type === EitherType.failure) {
    return approvePendingFollowResponse;
  }
  const {
    success: { userFollowEventId },
  } = approvePendingFollowResponse;

  const assembleRecordAndSendAcceptedUserFollowRequestNotificationResponse =
    await assembleRecordAndSendAcceptedUserFollowRequestNotification({
      controller,
      databaseService: databaseService,
      blobStorageService: blobStorageService,
      webSocketService: webSocketService,
      recipientUserId: userIdDoingFollowing,
      userFollowEventId,
    });
  if (
    assembleRecordAndSendAcceptedUserFollowRequestNotificationResponse.type ===
    EitherType.failure
  ) {
    return assembleRecordAndSendAcceptedUserFollowRequestNotificationResponse;
  }

  return Success({});
}

async function handleResolveFollowRequestReject({
  controller,
  databaseService,
  userIdBeingFollowed,
  userIdDoingFollowing,
}: {
  controller: Controller;
  databaseService: DatabaseService;
  userIdBeingFollowed: string;
  userIdDoingFollowing: string;
}): Promise<InternalServiceResponse<ErrorReasonTypes<string>, {}>> {
  //////////////////////////////////////////////////
  // Write Update To DB
  //////////////////////////////////////////////////

  const deleteUserFollowResponse =
    await databaseService.tableNameToServicesMap.userFollowsTableService.deleteUserFollow(
      {
        controller,
        userIdBeingUnfollowed: userIdBeingFollowed,
        userIdDoingUnfollowing: userIdDoingFollowing,
      },
    );
  if (deleteUserFollowResponse.type === EitherType.failure) {
    return deleteUserFollowResponse;
  }

  return Success({});
}
