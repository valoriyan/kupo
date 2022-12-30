/* eslint-disable @typescript-eslint/ban-types */
import { v4 as uuidv4 } from "uuid";
import express from "express";
import { EitherType, Failure, SecuredHTTPResponse } from "../../../utilities/monads";
import { checkAuthentication } from "../../auth/utilities";
import { UserInteractionController } from "./userInteractionController";
import { GenericResponseFailedReason } from "../../models";
import { ProfilePrivacySetting } from "../models";
import { assembleRecordAndSendNewFollowerNotification } from "../../notification/notificationSenders/assembleRecordAndSendNewFollowerNotification";
import { assembleRecordAndSendNewFollowerRequestNotification } from "../../notification/notificationSenders/assembleRecordAndSendNewFollowerRequestNotification";

export interface FollowUserRequestBody {
  userIdBeingFollowed: string;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface FollowUserSuccess {}

export enum FollowUserFailedReason {
  UnknownCause = "Unknown Cause",
}

export async function handleFollowUser({
  controller,
  request,
  requestBody,
}: {
  controller: UserInteractionController;
  request: express.Request;
  requestBody: FollowUserRequestBody;
}): Promise<SecuredHTTPResponse<FollowUserFailedReason | string, FollowUserSuccess>> {
  //////////////////////////////////////////////////
  // Inputs & Authentication
  //////////////////////////////////////////////////

  const { userIdBeingFollowed } = requestBody;

  const { clientUserId, errorResponse: error } = await checkAuthentication(
    controller,
    request,
  );
  if (error) return error;

  const userFollowEventId = uuidv4();

  //////////////////////////////////////////////////
  // Read Unrenderable User Being Followed From DB
  //////////////////////////////////////////////////

  const selectMaybeUserByUserIdResponse =
    await controller.databaseService.tableNameToServicesMap.usersTableService.selectMaybeUserByUserId(
      { controller, userId: userIdBeingFollowed },
    );
  if (selectMaybeUserByUserIdResponse.type === EitherType.failure) {
    return selectMaybeUserByUserIdResponse;
  }
  const { success: maybeUnrenderableUserBeingFollowed } = selectMaybeUserByUserIdResponse;

  if (!maybeUnrenderableUserBeingFollowed) {
    return Failure({
      controller,
      httpStatusCode: 404,
      reason: GenericResponseFailedReason.DATABASE_TRANSACTION_ERROR,
      error: "User not found at handleFollowUser",
      additionalErrorInformation: "Error at handleFollowUser",
    });
  }
  const unrenderableUserBeingFollowed = maybeUnrenderableUserBeingFollowed;

  const isPending =
    unrenderableUserBeingFollowed.profilePrivacySetting === ProfilePrivacySetting.Private;

  //////////////////////////////////////////////////
  // Write User Follow to DB
  //////////////////////////////////////////////////

  const createUserFollowResponse =
    await controller.databaseService.tableNameToServicesMap.userFollowsTableService.createUserFollow(
      {
        controller,
        userFollowEventId,
        userIdDoingFollowing: clientUserId,
        userIdBeingFollowed,
        timestamp: Date.now(),
        isPending,
      },
    );

  if (createUserFollowResponse.type === EitherType.failure) {
    return createUserFollowResponse;
  }

  //////////////////////////////////////////////////
  // Handle Notifications
  //////////////////////////////////////////////////

  if (userIdBeingFollowed !== clientUserId) {
    if (isPending) {
      await assembleRecordAndSendNewFollowerRequestNotification({
        controller,
        userFollowEventId,
        userIdDoingFollowing: clientUserId,
        databaseService: controller.databaseService,
        blobStorageService: controller.blobStorageService,
        webSocketService: controller.webSocketService,
        recipientUserId: userIdBeingFollowed,
      });
    } else {
      await assembleRecordAndSendNewFollowerNotification({
        controller,
        userFollowEventId,
        userIdDoingFollowing: clientUserId,
        databaseService: controller.databaseService,
        blobStorageService: controller.blobStorageService,
        webSocketService: controller.webSocketService,
        recipientUserId: userIdBeingFollowed,
      });
    }
  }

  //////////////////////////////////////////////////
  // Return
  //////////////////////////////////////////////////

  return {
    type: EitherType.success,
    success: {},
  };
}
