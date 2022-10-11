import { Promise as BluebirdPromise } from "bluebird";
import { DatabaseService } from "../../../../services/databaseService";
import { Controller } from "tsoa";
import {
  EitherType,
  ErrorReasonTypes,
  Failure,
  InternalServiceResponse,
} from "../../../../utilities/monads";
import { RenderablePublishingChannel } from "../../models";
import { GenericResponseFailedReason } from "../../../models";
import { BlobStorageServiceInterface } from "../../../../services/blobStorageService/models";
import {
  unwrapListOfEitherResponses,
  UnwrapListOfEitherResponsesFailureHandlingMethod,
} from "../../../../utilities/monads/unwrapListOfResponses";
import { assembleRenderablePublishingChannelFromParts } from "./assembleRenderablePublishingChannelFromParts";

export async function assembleRenderablePublishingChannelsByNames({
  controller,
  blobStorageService,
  databaseService,
  names,
  requestorUserId,
}: {
  controller: Controller;
  blobStorageService: BlobStorageServiceInterface;
  databaseService: DatabaseService;
  names: string[];
  requestorUserId: string;
}): Promise<
  InternalServiceResponse<ErrorReasonTypes<string>, RenderablePublishingChannel[]>
> {
  const assembleRenderablePublishingChannelByNameResponses = await BluebirdPromise.map(
    names,
    async (name) =>
      await assembleRenderablePublishingChannelByName({
        controller,
        requestorUserId: requestorUserId,
        name,
        blobStorageService,
        databaseService,
      }),
  );

  return unwrapListOfEitherResponses({
    eitherResponses: assembleRenderablePublishingChannelByNameResponses,
    failureHandlingMethod:
      UnwrapListOfEitherResponsesFailureHandlingMethod.SUCCEED_WITH_ANY_SUCCESSES_ELSE_RETURN_FIRST_FAILURE,
  });
}

export async function assembleRenderablePublishingChannelsByIds({
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
  const assembleRenderablePublishingChannelByIdResponses = await BluebirdPromise.map(
    publishingChannelIds,
    async (publishingChannelId) =>
      await assembleRenderablePublishingChannelById({
        controller,
        requestorUserId: requestorUserId,
        publishingChannelId,
        blobStorageService,
        databaseService,
      }),
  );

  return unwrapListOfEitherResponses({
    eitherResponses: assembleRenderablePublishingChannelByIdResponses,
    failureHandlingMethod:
      UnwrapListOfEitherResponsesFailureHandlingMethod.SUCCEED_WITH_ANY_SUCCESSES_ELSE_RETURN_FIRST_FAILURE,
  });
}

export async function assembleRenderablePublishingChannelByName({
  controller,
  blobStorageService,
  databaseService,
  name,
  requestorUserId,
}: {
  controller: Controller;
  blobStorageService: BlobStorageServiceInterface;
  databaseService: DatabaseService;
  name: string;
  requestorUserId: string;
}): Promise<
  InternalServiceResponse<ErrorReasonTypes<string>, RenderablePublishingChannel>
> {
  const maybeGetPublishingChannelByNameResponse =
    await databaseService.tableNameToServicesMap.publishingChannelsTableService.getPublishingChannelByName(
      {
        controller,
        name,
      },
    );

  if (maybeGetPublishingChannelByNameResponse.type === EitherType.failure) {
    return maybeGetPublishingChannelByNameResponse;
  }

  const { success: maybePublishingChannel } = maybeGetPublishingChannelByNameResponse;

  if (!maybePublishingChannel) {
    return Failure({
      controller,
      httpStatusCode: 404,
      reason: GenericResponseFailedReason.DATABASE_TRANSACTION_ERROR,
      error: "Missing Publishing Channel at assembleRenderablePublishingChannelByName",
      additionalErrorInformation:
        "Missing Publishing Channel at assembleRenderablePublishingChannelByName",
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

export async function assembleRenderablePublishingChannelById({
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
  const getPublishingChannelByIdResponse =
    await databaseService.tableNameToServicesMap.publishingChannelsTableService.getPublishingChannelById(
      {
        controller,
        publishingChannelId,
      },
    );

  if (getPublishingChannelByIdResponse.type === EitherType.failure) {
    return getPublishingChannelByIdResponse;
  }

  const { success: maybePublishingChannel } = getPublishingChannelByIdResponse;

  if (!maybePublishingChannel) {
    return Failure({
      controller,
      httpStatusCode: 404,
      reason: GenericResponseFailedReason.DATABASE_TRANSACTION_ERROR,
      error: "Missing Publishing Channel at assembleRenderablePublishingChannelById",
      additionalErrorInformation:
        "Missing Publishing Channel at assembleRenderablePublishingChannelById",
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
