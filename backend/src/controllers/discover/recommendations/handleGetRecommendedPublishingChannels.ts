import express from "express";
import {
  EitherType,
  ErrorReasonTypes,
  SecuredHTTPResponse,
  Success,
} from "../../../utilities/monads";
import { DiscoverController } from "../discoverController";
import { checkAuthentication } from "../../auth/utilities";
import { RenderablePublishingChannel } from "../../../controllers/publishingChannel/models";
import { assembleRenderablePublishingChannelsFromParts } from "../../../controllers/publishingChannel/utilities/assembleRenderablePublishingChannel/assembleRenderablePublishingChannelFromParts";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface GetRecommendedPublishingChannelsRequestBody {}

export enum GetRecommendedPublishingChannelsFailedReason {
  UnknownCause = "Unknown Cause",
}

export interface GetRecommendedPublishingChannelsSuccess {
  publishingChannels: RenderablePublishingChannel[];
}

export async function handleGetRecommendedPublishingChannels({
  controller,
  request,
}: {
  controller: DiscoverController;
  request: express.Request;
  requestBody: GetRecommendedPublishingChannelsRequestBody;
}): Promise<
  SecuredHTTPResponse<
    ErrorReasonTypes<string | GetRecommendedPublishingChannelsFailedReason>,
    GetRecommendedPublishingChannelsSuccess
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

  //////////////////////////////////////////////////
  // Get Publishing Channels Matching Search
  //////////////////////////////////////////////////

  const getMostPopularPublishingChannelsUnfollowedByTargetUserResponse =
    await controller.databaseService.tableNameToServicesMap.publishingChannelsTableService.getMostPopularPublishingChannelsUnfollowedByTargetUser(
      { controller, targetUserId: clientUserId, pageSize: 5 },
    );
  if (
    getMostPopularPublishingChannelsUnfollowedByTargetUserResponse.type ===
    EitherType.failure
  ) {
    return getMostPopularPublishingChannelsUnfollowedByTargetUserResponse;
  }
  const { success: unrenderablePublishingChannels } =
    getMostPopularPublishingChannelsUnfollowedByTargetUserResponse;

  //////////////////////////////////////////////////
  // Assemble Publishing Channels
  //////////////////////////////////////////////////

  const assembleRenderablePublishingChannelsFromPartsResponse =
    await assembleRenderablePublishingChannelsFromParts({
      controller,
      blobStorageService: controller.blobStorageService,
      databaseService: controller.databaseService,
      unrenderablePublishingChannels,
      requestorUserId: clientUserId,
    });
  if (assembleRenderablePublishingChannelsFromPartsResponse.type === EitherType.failure) {
    return assembleRenderablePublishingChannelsFromPartsResponse;
  }
  const { success: renderablePublishingChannels } =
    assembleRenderablePublishingChannelsFromPartsResponse;

  //////////////////////////////////////////////////
  // Return
  //////////////////////////////////////////////////

  return Success({
    publishingChannels: renderablePublishingChannels,
  });
}
