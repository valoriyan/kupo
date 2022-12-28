/* eslint-disable @typescript-eslint/ban-types */
import express from "express";
import { PublishingChannelController } from "../publishingChannelController";
import { EitherType, Failure, SecuredHTTPResponse } from "../../../utilities/monads";
import { checkAuthentication } from "../../auth/utilities";
import { doesUserIdHaveRightsToModeratePublishingChannel } from "../utilities/permissions";

export interface UnfollowPublishingChannelRequestBody {
  publishingChannelIdBeingUnfollowed: string;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface UnfollowPublishingChannelSuccess {}

export enum UnfollowPublishingChannelFailedReason {
  UnknownCause = "Unknown Cause",
  CAN_NOT_UNFOLLOW_OWN_CHANNEL = "CAN_NOT_UNFOLLOW_OWN_CHANNEL",
}

export async function handleUnfollowPublishingChannel({
  controller,
  request,
  requestBody,
}: {
  controller: PublishingChannelController;
  request: express.Request;
  requestBody: UnfollowPublishingChannelRequestBody;
}): Promise<
  SecuredHTTPResponse<
    UnfollowPublishingChannelFailedReason | string,
    UnfollowPublishingChannelSuccess
  >
> {
  //////////////////////////////////////////////////
  // Inputs & Authentication
  //////////////////////////////////////////////////
  const { publishingChannelIdBeingUnfollowed } = requestBody;

  const { clientUserId, errorResponse: error } = await checkAuthentication(
    controller,
    request,
  );
  if (error) return error;

  //////////////////////////////////////////////////
  // CHECK THAT CLIENT IS NOT OWNER OR MODERATOR OF THE CHANNEL
  //////////////////////////////////////////////////

  const doesUserIdHaveRightsToModeratePublishingChannelResponse =
    await doesUserIdHaveRightsToModeratePublishingChannel({
      controller,
      databaseService: controller.databaseService,
      requestingUserId: clientUserId,
      publishingChannelId: publishingChannelIdBeingUnfollowed,
    });
  if (
    doesUserIdHaveRightsToModeratePublishingChannelResponse.type === EitherType.failure
  ) {
    return doesUserIdHaveRightsToModeratePublishingChannelResponse;
  }
  const { success: userHasRightsToModeration } =
    doesUserIdHaveRightsToModeratePublishingChannelResponse;

  if (!!userHasRightsToModeration) {
    return Failure({
      controller,
      httpStatusCode: 404,
      reason: UnfollowPublishingChannelFailedReason.CAN_NOT_UNFOLLOW_OWN_CHANNEL,
      error:
        "CAN NOT UNFOLLOW PUBLISHING CHANNEL IF CLIENT IS MODERATOR OR OWNER @ handleUnfollowPublishingChannel",
      additionalErrorInformation:
        "CAN NOT UNFOLLOW PUBLISHING CHANNEL IF CLIENT IS MODERATOR OR OWNER @ handleUnfollowPublishingChannel",
    });
  }

  //////////////////////////////////////////////////
  // DELETE FOLLOW
  //////////////////////////////////////////////////

  const deletePublishingChannelFollowResponse =
    await controller.databaseService.tableNameToServicesMap.publishingChannelFollowsTableService.deletePublishingChannelFollow(
      {
        controller,
        userIdDoingUnfollowing: clientUserId,
        publishingChannelIdBeingUnfollowed,
      },
    );

  if (deletePublishingChannelFollowResponse.type === EitherType.failure) {
    return deletePublishingChannelFollowResponse;
  }

  return {
    type: EitherType.success,
    success: {},
  };
}
