import { Controller } from "tsoa";
import {
  EitherType,
  ErrorReasonTypes,
  Failure,
  InternalServiceResponse,
  Success,
} from "../../utilities/monads";
import { DatabaseService } from "../../services/databaseService";
import { GenericResponseFailedReason } from "../models";

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

  const { publishing_channel_id: publishingChannelId } = publishingChannelSubmission;

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
        "Publishing Channel not found at doesUserIdHaveRightsToApprovePublishingChannelSubmissions",
      additionalErrorInformation:
        "Publishing Channel not found at doesUserIdHaveRightsToApprovePublishingChannelSubmissions",
    });
  }

  return Success(maybePublishingChannel.ownerUserId === requestingUserId);
}
