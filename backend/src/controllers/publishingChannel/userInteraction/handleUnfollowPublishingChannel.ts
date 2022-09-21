/* eslint-disable @typescript-eslint/ban-types */
import express from "express";
import { PublishingChannelController } from "../publishingChannelController";
import { EitherType, SecuredHTTPResponse } from "../../../utilities/monads";
import { checkAuthorization } from "../../auth/utilities";

export interface UnfollowPublishingChannelRequestBody {
  publishingChannelIdBeingUnfollowed: string;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface UnfollowPublishingChannelSuccess {}

export enum UnfollowPublishingChannelFailedReason {
  UnknownCause = "Unknown Cause",
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
  const { publishingChannelIdBeingUnfollowed } = requestBody;

  const { clientUserId, errorResponse: error } = await checkAuthorization(
    controller,
    request,
  );
  if (error) return error;

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
