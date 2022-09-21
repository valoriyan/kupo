/* eslint-disable @typescript-eslint/ban-types */
import { v4 as uuidv4 } from "uuid";
import express from "express";
import { EitherType, Failure, SecuredHTTPResponse } from "../../../../utilities/monads";
import { checkAuthorization } from "../../../auth/utilities";
import { UserInteractionController } from "../userInteractionController";
import { GenericResponseFailedReason } from "../../../models";
import { ProfilePrivacySetting } from "../../models";
import { generateAndEmitNewFollowerNotification } from "./generateAndEmitNewFollowerNotification";
import { generateAndEmitNewUserFollowRequestNotification } from "./generateAndEmitNewUserFollowRequestNotification";

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
  const { userIdBeingFollowed } = requestBody;

  const { clientUserId, errorResponse: error } = await checkAuthorization(
    controller,
    request,
  );
  if (error) return error;

  const userFollowEventId = uuidv4();

  const selectMaybeUserByUserIdResponse =
    await controller.databaseService.tableNameToServicesMap.usersTableService.selectMaybeUserByUserId(
      { controller, userId: userIdBeingFollowed },
    );
  if (selectMaybeUserByUserIdResponse.type === EitherType.failure) {
    return selectMaybeUserByUserIdResponse;
  }
  const { success: maybeUserBeingFollowed } = selectMaybeUserByUserIdResponse;

  if (!maybeUserBeingFollowed) {
    return Failure({
      controller,
      httpStatusCode: 404,
      reason: GenericResponseFailedReason.DATABASE_TRANSACTION_ERROR,
      error: "User not found at handleFollowUser",
      additionalErrorInformation: "Error at handleFollowUser",
    });
  }

  const isPending =
    maybeUserBeingFollowed.profilePrivacySetting === ProfilePrivacySetting.Private;

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

  if (userIdBeingFollowed !== clientUserId) {
    if (!pending) {
      await generateAndEmitNewFollowerNotification({
        controller,
        databaseService: controller.databaseService,
        blobStorageService: controller.blobStorageService,
        webSocketService: controller.webSocketService,
        recipientUserId: userIdBeingFollowed,
        userFollowEventId,
      });
    } else {
      await generateAndEmitNewUserFollowRequestNotification({
        controller,
        databaseService: controller.databaseService,
        blobStorageService: controller.blobStorageService,
        webSocketService: controller.webSocketService,
        recipientUserId: userIdBeingFollowed,
        followRequestingUserId: clientUserId,
      });
    }
  }

  return {
    type: EitherType.success,
    success: {},
  };
}
