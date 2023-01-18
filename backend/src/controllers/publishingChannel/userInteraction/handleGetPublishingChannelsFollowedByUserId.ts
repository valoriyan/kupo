/* eslint-disable @typescript-eslint/ban-types */
import express from "express";
import { PublishingChannelController } from "../publishingChannelController";
import { EitherType, SecuredHTTPResponse } from "../../../utilities/monads";
import { checkAuthentication } from "../../auth/utilities";
import {
  decodeTimestampCursor,
  encodeTimestampCursor,
} from "../../../controllers/utilities/pagination";
import { assembleRenderablePublishingChannelsByIds } from "../utilities/assembleRenderablePublishingChannel";
import { RenderablePublishingChannel } from "../models";

export interface GetPublishingChannelsFollowedByUserIdRequestBody {
  cursor?: string;
  pageSize: number;
  areFollowsPending: boolean;
}

export interface GetPublishingChannelsFollowedByUserIdSuccess {
  publishingChannels: RenderablePublishingChannel[];
  previousPageCursor?: string;
  nextPageCursor?: string;
}

export enum GetPublishingChannelsFollowedByUserIdFailedReason {
  UnknownCause = "Unknown Cause",
}

export async function handleGetPublishingChannelsFollowedByUserId({
  controller,
  request,
  requestBody,
}: {
  controller: PublishingChannelController;
  request: express.Request;
  requestBody: GetPublishingChannelsFollowedByUserIdRequestBody;
}): Promise<
  SecuredHTTPResponse<
    GetPublishingChannelsFollowedByUserIdFailedReason | string,
    GetPublishingChannelsFollowedByUserIdSuccess
  >
> {
  //////////////////////////////////////////////////
  // Inputs & Authentication
  //////////////////////////////////////////////////
  const { cursor, pageSize, areFollowsPending } = requestBody;

  const { clientUserId, errorResponse: error } = await checkAuthentication(
    controller,
    request,
  );
  if (error) return error;

  //////////////////////////////////////////////////
  // Read Publishing Channels Follows from DB
  //////////////////////////////////////////////////

  const getPublishingChannelFollowsByUserIdResponse =
    await controller.databaseService.tableNameToServicesMap.publishingChannelFollowsTableService.getPublishingChannelFollowsByUserId(
      {
        controller,
        userIdDoingFollowing: clientUserId,
        areFollowsPending,
        limit: pageSize,
        createdBeforeTimestamp: cursor
          ? decodeTimestampCursor({ encodedCursor: cursor }) - 1
          : undefined,
      },
    );

  if (getPublishingChannelFollowsByUserIdResponse.type === EitherType.failure) {
    return getPublishingChannelFollowsByUserIdResponse;
  }

  const { success: publishingChannelFollows } =
    getPublishingChannelFollowsByUserIdResponse;

  const publishingChannelIds = publishingChannelFollows.map(
    ({ publishing_channel_id_being_followed }) => publishing_channel_id_being_followed,
  );

  //////////////////////////////////////////////////
  // Assemble Publishing Channels
  //////////////////////////////////////////////////

  const assembleRenderablePublishingChannelsByIdsResponse =
    await assembleRenderablePublishingChannelsByIds({
      controller,
      blobStorageService: controller.blobStorageService,
      databaseService: controller.databaseService,
      publishingChannelIds,
      requestorUserId: clientUserId,
    });

  if (assembleRenderablePublishingChannelsByIdsResponse.type === EitherType.failure) {
    return assembleRenderablePublishingChannelsByIdsResponse;
  }

  const { success: publishingChannels } =
    assembleRenderablePublishingChannelsByIdsResponse;
  //////////////////////////////////////////////////
  // Get Next-Page Cursor
  //////////////////////////////////////////////////

  const lastPublishingChannelFollow = [...publishingChannelFollows].sort(
    (a, b) => parseFloat(b.timestamp) - parseFloat(a.timestamp),
  )[pageSize - 1];

  const nextPageCursor = lastPublishingChannelFollow
    ? encodeTimestampCursor({
        timestamp: parseInt(lastPublishingChannelFollow.timestamp),
      })
    : undefined;

  //////////////////////////////////////////////////
  // Return
  //////////////////////////////////////////////////

  return {
    type: EitherType.success,
    success: {
      publishingChannels,
      previousPageCursor: requestBody.cursor,
      nextPageCursor,
    },
  };
}
