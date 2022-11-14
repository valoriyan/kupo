/* eslint-disable @typescript-eslint/ban-types */
import { v4 as uuidv4 } from "uuid";
import express from "express";
import { PublishingChannelController } from "../publishingChannelController";
import { EitherType, SecuredHTTPResponse } from "../../../utilities/monads";
import { checkAuthorization } from "../../auth/utilities";

export interface FollowPublishingChannelRequestBody {
  publishingChannelIdBeingFollowed: string;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface FollowPublishingChannelSuccess {}

export enum FollowPublishingChannelFailedReason {
  UnknownCause = "Unknown Cause",
}

export async function handleFollowPublishingChannel({
  controller,
  request,
  requestBody,
}: {
  controller: PublishingChannelController;
  request: express.Request;
  requestBody: FollowPublishingChannelRequestBody;
}): Promise<
  SecuredHTTPResponse<
    FollowPublishingChannelFailedReason | string,
    FollowPublishingChannelSuccess
  >
> {
  //////////////////////////////////////////////////
  // Inputs & Authentication
  //////////////////////////////////////////////////

  const { publishingChannelIdBeingFollowed } = requestBody;

  const { clientUserId, errorResponse: error } = await checkAuthorization(
    controller,
    request,
  );
  if (error) return error;

  const publishingChannelFollowEventId = uuidv4();

  const isPending = false;

  //////////////////////////////////////////////////
  // WRITE FOLLOW
  //////////////////////////////////////////////////

  const createPublishingChannelFollowResponse =
    await controller.databaseService.tableNameToServicesMap.publishingChannelFollowsTableService.createPublishingChannelFollow(
      {
        controller,
        publishingChannelFollowEventId,
        userIdDoingFollowing: clientUserId,
        publishingChannelIdBeingFollowed,
        timestamp: Date.now(),
        isPending,
      },
    );

  if (createPublishingChannelFollowResponse.type === EitherType.failure) {
    return createPublishingChannelFollowResponse;
  }

  return {
    type: EitherType.success,
    success: {},
  };
}
