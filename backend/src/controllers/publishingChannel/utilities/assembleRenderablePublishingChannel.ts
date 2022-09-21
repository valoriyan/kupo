import { Promise as BluebirdPromise } from "bluebird";
import { DatabaseService } from "../../../services/databaseService";
import { Controller } from "tsoa";
import {
  EitherType,
  ErrorReasonTypes,
  Failure,
  InternalServiceResponse,
  Success,
} from "../../../utilities/monads";
import { RenderablePublishingChannel, UnrenderablePublishingChannel } from "../models";
import { GenericResponseFailedReason } from "../../../controllers/models";
import { constructRenderableUserFromPartsByUserId } from "../../../controllers/user/utilities";
import { BlobStorageServiceInterface } from "../../../services/blobStorageService/models";
import {
  unwrapListOfEitherResponses,
  UnwrapListOfEitherResponsesFailureHandlingMethod,
} from "../../../utilities/monads/unwrapListOfResponses";

export async function assembleRenderablePublishingChannelsByPublishingChannelIds({
  controller,
  blobStorageService,
  databaseService,
  publishingChannelIds,
  requestorUserId,
}: {
  controller: Controller;
  blobStorageService: BlobStorageServiceInterface;
  databaseService: DatabaseService;
  publishingChannelIds: string[];
  requestorUserId: string;
}): Promise<
  InternalServiceResponse<ErrorReasonTypes<string>, RenderablePublishingChannel[]>
> {
  const assembleRenderablePublishingChannelByPublishingChannelIdResponses =
    await BluebirdPromise.map(
      publishingChannelIds,
      async (publishingChannelId) =>
        await assembleRenderablePublishingChannelByPublishingChannelId({
          controller,
          requestorUserId: requestorUserId,
          publishingChannelId,
          blobStorageService,
          databaseService,
        }),
    );

  return unwrapListOfEitherResponses({
    eitherResponses: assembleRenderablePublishingChannelByPublishingChannelIdResponses,
    failureHandlingMethod:
      UnwrapListOfEitherResponsesFailureHandlingMethod.SUCCEED_WITH_ANY_SUCCESSES_ELSE_RETURN_FIRST_FAILURE,
  });
}

export async function assembleRenderablePublishingChannelByPublishingChannelId({
  controller,
  blobStorageService,
  databaseService,
  publishingChannelId,
  requestorUserId,
}: {
  controller: Controller;
  blobStorageService: BlobStorageServiceInterface;
  databaseService: DatabaseService;
  publishingChannelId: string;
  requestorUserId: string;
}): Promise<
  InternalServiceResponse<ErrorReasonTypes<string>, RenderablePublishingChannel>
> {
  const maybeGetPublishingChannelByPublishingChannelIdResponse =
    await databaseService.tableNameToServicesMap.publishingChannelsTableService.maybeGetPublishingChannelByPublishingChannelId(
      {
        controller,
        publishingChannelId,
      },
    );

  if (
    maybeGetPublishingChannelByPublishingChannelIdResponse.type === EitherType.failure
  ) {
    return maybeGetPublishingChannelByPublishingChannelIdResponse;
  }

  const { success: maybePublishingChannel } =
    maybeGetPublishingChannelByPublishingChannelIdResponse;

  if (!maybePublishingChannel) {
    return Failure({
      controller,
      httpStatusCode: 404,
      reason: GenericResponseFailedReason.DATABASE_TRANSACTION_ERROR,
      error:
        "Missing Publishing Channel at assembleRenderablePublishingChannelByPublishingChannelId",
      additionalErrorInformation:
        "Missing Publishing Channel at assembleRenderablePublishingChannelByPublishingChannelId",
    });
  }
  const unrenderablePublishingChannel = maybePublishingChannel;

  const assembleRenderablePublishingChannelFromPartsResponse =
    await assembleRenderablePublishingChannelFromParts({
      controller,
      blobStorageService,
      databaseService,
      unrenderablePublishingChannel,
      requestorUserId,
    });

  return assembleRenderablePublishingChannelFromPartsResponse;
}

export async function assembleRenderablePublishingChannelsFromParts({
  controller,
  blobStorageService,
  databaseService,
  unrenderablePublishingChannels,
  requestorUserId,
}: {
  controller: Controller;
  blobStorageService: BlobStorageServiceInterface;
  databaseService: DatabaseService;
  unrenderablePublishingChannels: UnrenderablePublishingChannel[];
  requestorUserId: string;
}): Promise<
  InternalServiceResponse<ErrorReasonTypes<string>, RenderablePublishingChannel[]>
> {
  const assembleRenderablePublishingChannelFromPartsResponses = await BluebirdPromise.map(
    unrenderablePublishingChannels,
    async (unrenderablePublishingChannel) =>
      await assembleRenderablePublishingChannelFromParts({
        controller,
        requestorUserId: requestorUserId,
        unrenderablePublishingChannel,
        blobStorageService,
        databaseService,
      }),
  );

  return unwrapListOfEitherResponses({
    eitherResponses: assembleRenderablePublishingChannelFromPartsResponses,
    failureHandlingMethod:
      UnwrapListOfEitherResponsesFailureHandlingMethod.SUCCEED_WITH_ANY_SUCCESSES_ELSE_RETURN_FIRST_FAILURE,
  });
}

export async function assembleRenderablePublishingChannelFromParts({
  controller,
  blobStorageService,
  databaseService,
  unrenderablePublishingChannel,
  requestorUserId,
}: {
  controller: Controller;
  blobStorageService: BlobStorageServiceInterface;
  databaseService: DatabaseService;
  unrenderablePublishingChannel: UnrenderablePublishingChannel;
  requestorUserId: string;
}): Promise<
  InternalServiceResponse<ErrorReasonTypes<string>, RenderablePublishingChannel>
> {
  const constructRenderableUserFromPartsByUserIdResponse =
    await constructRenderableUserFromPartsByUserId({
      controller,
      requestorUserId,
      userId: unrenderablePublishingChannel.ownerUserId,
      blobStorageService: blobStorageService,
      databaseService: databaseService,
    });
  if (constructRenderableUserFromPartsByUserIdResponse.type === EitherType.failure) {
    return constructRenderableUserFromPartsByUserIdResponse;
  }
  const { success: publishingChannelOwner } =
    constructRenderableUserFromPartsByUserIdResponse;

  //////////////////////////////////////////////////
  // RECORD NOTIFICATION
  //////////////////////////////////////////////////
  const countFollowersOfPublishingChannelIdResponse =
    await databaseService.tableNameToServicesMap.publishingChannelFollowsTableService.countFollowersOfPublishingChannelId(
      {
        controller,
        publishingChannelIdBeingFollowed:
          unrenderablePublishingChannel.publishingChannelId,
        areFollowsPending: false,
      },
    );

  if (countFollowersOfPublishingChannelIdResponse.type === EitherType.failure) {
    return countFollowersOfPublishingChannelIdResponse;
  }

  const { success: countOfUserFollowers } = countFollowersOfPublishingChannelIdResponse;
  //////////////////////////////////////////////////
  // COMPILE
  //////////////////////////////////////////////////

  const renderablePublishingChannel: RenderablePublishingChannel = {
    publishingChannelId: unrenderablePublishingChannel.publishingChannelId,
    ownerUserId: unrenderablePublishingChannel.ownerUserId,
    name: unrenderablePublishingChannel.name,
    description: unrenderablePublishingChannel.description,
    owner: publishingChannelOwner,
    followers: {
      count: countOfUserFollowers,
    },
  };

  return Success(renderablePublishingChannel);
}
