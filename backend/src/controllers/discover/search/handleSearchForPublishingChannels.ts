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

export interface SearchForPublishingChannelsRequestBody {
  query: string;
  pageNumber: number;
  pageSize: number;
}

export enum SearchForPublishingChannelsFailedReason {
  UnknownCause = "Unknown Cause",
}

export interface SearchForPublishingChannelsSuccess {
  publishingChannels: RenderablePublishingChannel[];
  totalCount: number;
}

export async function handleSearchForPublishingChannels({
  controller,
  request,
  requestBody,
}: {
  controller: DiscoverController;
  request: express.Request;
  requestBody: SearchForPublishingChannelsRequestBody;
}): Promise<
  SecuredHTTPResponse<
    ErrorReasonTypes<string | SearchForPublishingChannelsFailedReason>,
    SearchForPublishingChannelsSuccess
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

  const { pageNumber, query, pageSize } = requestBody;
  const lowercaseTrimmedQuery = query.trim().toLowerCase();

  //////////////////////////////////////////////////
  // Get Publishing Channels Matching Search
  //////////////////////////////////////////////////

  const selectPublishingChannelsBySearchStringResponse =
    await controller.databaseService.tableNameToServicesMap.publishingChannelsTableService.selectPublishingChannelsBySearchString(
      { controller, searchString: lowercaseTrimmedQuery },
    );
  if (selectPublishingChannelsBySearchStringResponse.type === EitherType.failure) {
    return selectPublishingChannelsBySearchStringResponse;
  }
  const { success: unrenderablePublishingChannelMatchingSearchString } =
    selectPublishingChannelsBySearchStringResponse;

  if (unrenderablePublishingChannelMatchingSearchString.length === 0) {
    return Success({
      publishingChannels: [],
      totalCount: 0,
    });
  }

  //////////////////////////////////////////////////
  // Get a Page of the Publishing Channels Matching Search
  //////////////////////////////////////////////////

  const pageOfUnrenderablePublishingChannels =
    unrenderablePublishingChannelMatchingSearchString.slice(
      pageSize * pageNumber - pageSize,
      pageSize * pageNumber,
    );

  const assembleRenderablePublishingChannelsFromPartsResponse =
    await assembleRenderablePublishingChannelsFromParts({
      controller,
      blobStorageService: controller.blobStorageService,
      databaseService: controller.databaseService,
      unrenderablePublishingChannels: pageOfUnrenderablePublishingChannels,
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
    totalCount: unrenderablePublishingChannelMatchingSearchString.length,
  });
}
