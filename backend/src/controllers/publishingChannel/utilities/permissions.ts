import { Controller } from "tsoa";
import {
  EitherType,
  ErrorReasonTypes,
  Failure,
  InternalServiceResponse,
  Success,
} from "../../../utilities/monads";
import { DatabaseService } from "../../../services/databaseService";
import { GenericResponseFailedReason } from "../../models";

export async function doesUserIdHaveRightsToModeratePublishingChannel({
  controller,
  databaseService,
  requestingUserId,
  publishingChannelId,
}: {
  controller: Controller;
  databaseService: DatabaseService;
  requestingUserId: string;
  publishingChannelId: string;
}): Promise<InternalServiceResponse<ErrorReasonTypes<string>, boolean>> {
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
        "Publishing Channel not found at doesUserIdHaveRightsToModeratePublishingChannel",
      additionalErrorInformation:
        "Publishing Channel not found at doesUserIdHaveRightsToModeratePublishingChannel",
    });
  }
  const publishingChannel = maybePublishingChannel;

  if (publishingChannel.ownerUserId === requestingUserId) {
    return Success(true);
  }

  const selectPublishingChannelModeratorUserIdsByPublishingChannelIdResponse =
    await databaseService.tableNameToServicesMap.publishingChannelModeratorsTableService.selectPublishingChannelModeratorUserIdsByPublishingChannelId(
      {
        controller,
        publishingChannelId,
      },
    );

  if (
    selectPublishingChannelModeratorUserIdsByPublishingChannelIdResponse.type ===
    EitherType.failure
  ) {
    return selectPublishingChannelModeratorUserIdsByPublishingChannelIdResponse;
  }
  const { success: moderatorUserIds } =
    selectPublishingChannelModeratorUserIdsByPublishingChannelIdResponse;

  return Success(moderatorUserIds.includes(requestingUserId));
}

export async function doesUserIdHaveRightsToApprovePublishingChannelSubmissions({
  controller,
  databaseService,
  requestingUserId,
  publishingChannelSubmissionId,
}: {
  controller: Controller;
  databaseService: DatabaseService;
  requestingUserId: string;
  publishingChannelSubmissionId: string;
}): Promise<InternalServiceResponse<ErrorReasonTypes<string>, boolean>> {
  const getPublishingChannelSubmissionByIdResponse =
    await databaseService.tableNameToServicesMap.publishingChannelSubmissionsTableService.getPublishingChannelSubmissionById(
      {
        controller,
        publishingChannelSubmissionId,
      },
    );

  if (getPublishingChannelSubmissionByIdResponse.type === EitherType.failure) {
    return getPublishingChannelSubmissionByIdResponse;
  }

  const { success: maybePublishingChannelSubmission } =
    getPublishingChannelSubmissionByIdResponse;

  if (!maybePublishingChannelSubmission) {
    return Failure({
      controller,
      httpStatusCode: 404,
      reason: GenericResponseFailedReason.DATABASE_TRANSACTION_ERROR,
      error:
        "Publishing Channel Submission not found at doesUserIdHaveRightsToApprovePublishingChannelSubmissions",
      additionalErrorInformation:
        "Publishing Channel Submission not found at doesUserIdHaveRightsToApprovePublishingChannelSubmissions",
    });
  }
  const publishingChannelSubmission = maybePublishingChannelSubmission;

  return doesUserIdHaveRightsToModeratePublishingChannel({
    controller,
    databaseService,
    requestingUserId,
    publishingChannelId: publishingChannelSubmission.publishing_channel_id,
  });
}
