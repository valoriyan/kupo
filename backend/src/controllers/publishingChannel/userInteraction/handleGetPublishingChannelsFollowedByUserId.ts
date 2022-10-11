/* eslint-disable @typescript-eslint/ban-types */
import express from "express";
import { PublishingChannelController } from "../publishingChannelController";
import { EitherType, SecuredHTTPResponse } from "../../../utilities/monads";
import { checkAuthorization } from "../../auth/utilities";
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

// eslint-disable-next-line @typescript-eslint/no-empty-interface
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
  const { cursor, pageSize, areFollowsPending } = requestBody;

  const { clientUserId, errorResponse: error } = await checkAuthorization(
    controller,
    request,
  );
  if (error) return error;

  //////////////////////////////////////////////////
  // GET Publishing Channels Ids
  //////////////////////////////////////////////////

  const getPublishingChannelFollowsByUserIdResponse =
    await controller.databaseService.tableNameToServicesMap.publishingChannelFollowsTableService.getPublishingChannelFollowsByUserId(
      {
        controller,
        userIdDoingFollowing: clientUserId,
        areFollowsPending,
        limit: pageSize,
        createdBeforeTimestamp: cursor
          ? decodeTimestampCursor({ encodedCursor: cursor })
          : undefined,
      },
    );

  if (getPublishingChannelFollowsByUserIdResponse.type === EitherType.failure) {
    return getPublishingChannelFollowsByUserIdResponse;
  }

  const { success: publishingChannelFollows } =
    getPublishingChannelFollowsByUserIdResponse;

  //////////////////////////////////////////////////
  // GET Publishing Channels
  //////////////////////////////////////////////////

  const publishingChannelIds = publishingChannelFollows.map(
    ({ publishing_channel_id_being_followed }) => publishing_channel_id_being_followed,
  );

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
  // GET nextPageCursor
  //////////////////////////////////////////////////

  let nextPageCursor;

  if (publishingChannels.length > 0) {
    const lastPageItem = publishingChannels[publishingChannels.length - 1];

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const lastPageItemFollow = publishingChannelFollows.find(
      (publishingChannelFollow) =>
        publishingChannelFollow.publishing_channel_id_being_followed ===
        lastPageItem.publishingChannelId,
    )!;

    nextPageCursor = encodeTimestampCursor({
      timestamp: parseInt(lastPageItemFollow.timestamp),
    });
  }

  return {
    type: EitherType.success,
    success: {
      publishingChannels,
      previousPageCursor: requestBody.cursor,
      nextPageCursor,
    },
  };
}
