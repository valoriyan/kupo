/* eslint-disable @typescript-eslint/ban-types */
import { v4 as uuidv4 } from "uuid";
import express from "express";
import { PublishingChannelController } from "../publishingChannelController";
import { EitherType, SecuredHTTPResponse } from "../../../utilities/monads";
import { checkAuthentication } from "../../auth/utilities";
import { assembleRecordAndSendInvitedToFollowPublishingChannelNotification } from "../../../controllers/notification/notificationSenders/assembleRecordAndSendInvitedToFollowPublishingChannelNotification";

export interface InviteUserToFollowPublishingChannelRequestBody {
  invitedUserId: string;
  publishingChannelId: string;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface InviteUserToFollowPublishingChannelSuccess {}

export enum InviteUserToFollowPublishingChannelFailedReason {
  UnknownCause = "Unknown Cause",
}

export async function handleInviteUserToFollowPublishingChannel({
  controller,
  request,
  requestBody,
}: {
  controller: PublishingChannelController;
  request: express.Request;
  requestBody: InviteUserToFollowPublishingChannelRequestBody;
}): Promise<
  SecuredHTTPResponse<
    InviteUserToFollowPublishingChannelFailedReason | string,
    InviteUserToFollowPublishingChannelSuccess
  >
> {
  //////////////////////////////////////////////////
  // Inputs & Authentication
  //////////////////////////////////////////////////

  const { invitedUserId, publishingChannelId } = requestBody;

  const { clientUserId, errorResponse: error } = await checkAuthentication(
    controller,
    request,
  );
  if (error) return error;

  const publishingChannelInvitationId = uuidv4();

  //////////////////////////////////////////////////
  // Write Follow to DB
  //////////////////////////////////////////////////

  const createPublishingChannelFollowResponse =
    await controller.databaseService.tableNameToServicesMap.publishingChannelInvitationsTableService.createPublishingChannelInvitation(
      {
        controller,
        publishingChannelInvitationId,
        userIdBeingInvited: invitedUserId,
        userIdSendingInvitation: clientUserId,
        publishingChannelId,
        creationTimestamp: Date.now(),
      },
    );

  if (createPublishingChannelFollowResponse.type === EitherType.failure) {
    return createPublishingChannelFollowResponse;
  }

  //////////////////////////////////////////////////
  // Handle Notifications
  //////////////////////////////////////////////////

  await assembleRecordAndSendInvitedToFollowPublishingChannelNotification({
    controller,
    publishingChannelInvitationId,
    userIdSendingInvitation: clientUserId,
    publishingChannelId,
    databaseService: controller.databaseService,
    blobStorageService: controller.blobStorageService,
    webSocketService: controller.webSocketService,
    recipientUserId: invitedUserId,
  });

  //////////////////////////////////////////////////
  // Return
  //////////////////////////////////////////////////

  return {
    type: EitherType.success,
    success: {},
  };
}
