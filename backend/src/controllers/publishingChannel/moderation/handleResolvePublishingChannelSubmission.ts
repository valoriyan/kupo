import express from "express";
import { assembleRecordAndSendRejectedPublishingChannelSubmissionNotification } from "../../../controllers/notification/notificationSenders/assembleRecordAndSendRejectedPublishingChannelSubmissionNotification";
import { assembleRecordAndSendAcceptedPublishingChannelSubmissionNotification } from "../../../controllers/notification/notificationSenders/assembleRecordAndSendAcceptedPublishingChannelSubmissionNotification";
import {
  EitherType,
  ErrorReasonTypes,
  Failure,
  SecuredHTTPResponse,
  Success,
} from "../../../utilities/monads";
import { checkAuthorization } from "../../auth/utilities";
import { GenericResponseFailedReason } from "../../models";
import { PublishingChannelController } from "../publishingChannelController";
import { doesUserIdHaveRightsToApprovePublishingChannelSubmissions } from "../utilities/permissions";

export enum PublishingChannelSubmissionDecision {
  ACCEPT = "accept",
  REJECT = "reject",
}

export interface ResolvePublishingChannelSubmissionRequestBody {
  decision: PublishingChannelSubmissionDecision;
  publishingChannelSubmissionId: string;
  reasonString: string;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ResolvePublishingChannelSubmissionSuccess {}

export enum ResolvePublishingChannelSubmissionFailedReason {
  UnknownCause = "Unknown Cause",
  IllegalAccess = "Illegal Access",
}

export async function handleResolvePublishingChannelSubmission({
  controller,
  request,
  requestBody,
}: {
  controller: PublishingChannelController;
  request: express.Request;
  requestBody: ResolvePublishingChannelSubmissionRequestBody;
}): Promise<
  SecuredHTTPResponse<
    ErrorReasonTypes<string | ResolvePublishingChannelSubmissionFailedReason>,
    ResolvePublishingChannelSubmissionSuccess
  >
> {
  //////////////////////////////////////////////////
  // Inputs & Authentication
  //////////////////////////////////////////////////
  const { decision, publishingChannelSubmissionId } = requestBody;

  const { clientUserId, errorResponse: error } = await checkAuthorization(
    controller,
    request,
  );
  if (error) return error;

  const now = Date.now();

  //////////////////////////////////////////////////
  // Check if client has rights to resolve submission
  //////////////////////////////////////////////////

  const doesUserIdHaveRightsToApprovePublishingChannelSubmissionsResponse =
    await doesUserIdHaveRightsToApprovePublishingChannelSubmissions({
      controller,
      databaseService: controller.databaseService,
      requestingUserId: clientUserId,
      publishingChannelSubmissionId,
    });
  if (
    doesUserIdHaveRightsToApprovePublishingChannelSubmissionsResponse.type ===
    EitherType.failure
  ) {
    return doesUserIdHaveRightsToApprovePublishingChannelSubmissionsResponse;
  }
  const { success: requestorHasApprovalRights } =
    doesUserIdHaveRightsToApprovePublishingChannelSubmissionsResponse;
  if (!requestorHasApprovalRights) {
    return Failure({
      controller,
      httpStatusCode: 500,
      reason: ResolvePublishingChannelSubmissionFailedReason.IllegalAccess,
      error:
        "Requestor not authorized to approve channel submissions at handleResolvePublishingChannelSubmission",
      additionalErrorInformation:
        "Requestor not authorized to approve channel submissions at handleResolvePublishingChannelSubmission",
    });
  }

  //////////////////////////////////////////////////
  // Get Publishing Channel Submission
  //////////////////////////////////////////////////

  const getPublishingChannelSubmissionByIdResponse =
    await controller.databaseService.tableNameToServicesMap.publishingChannelSubmissionsTableService.getPublishingChannelSubmissionById(
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
        "Publishing Channel Submission not found at handleResolvePublishingChannelSubmission",
      additionalErrorInformation:
        "Publishing Channel Submission not found at handleResolvePublishingChannelSubmission",
    });
  }
  const publishingChannelSubmission = maybePublishingChannelSubmission;

  if (decision === PublishingChannelSubmissionDecision.ACCEPT) {
    //////////////////////////////////////////////////
    // If Submission is ACCEPTED
    //
    //     Write to DB
    //////////////////////////////////////////////////

    const approvePendingChannelSubmissionResponse =
      await controller.databaseService.tableNameToServicesMap.publishingChannelSubmissionsTableService.approvePendingChannelSubmission(
        {
          controller,
          publishingChannelSubmissionId,
          timestampOfResolutionDecision: now,
        },
      );
    if (approvePendingChannelSubmissionResponse.type === EitherType.failure) {
      return approvePendingChannelSubmissionResponse;
    }

    //////////////////////////////////////////////////
    // Handle Notifications
    //////////////////////////////////////////////////

    const assembleRecordAndSendAcceptedPublishingChannelSubmissionNotificationResponse =
      await assembleRecordAndSendAcceptedPublishingChannelSubmissionNotification({
        controller,
        publishingChannelSubmissionId,
        publishingChannelId: publishingChannelSubmission.publishing_channel_id,
        publishedItemId: publishingChannelSubmission.published_item_id,
        recipientUserId: publishingChannelSubmission.user_id_submitting_published_item,
        databaseService: controller.databaseService,
        blobStorageService: controller.blobStorageService,
        webSocketService: controller.webSocketService,
      });
    if (
      assembleRecordAndSendAcceptedPublishingChannelSubmissionNotificationResponse.type ===
      EitherType.failure
    ) {
      return assembleRecordAndSendAcceptedPublishingChannelSubmissionNotificationResponse;
    }

    //////////////////////////////////////////////////
    // Return
    //////////////////////////////////////////////////

    return Success({});
  } else if (decision === PublishingChannelSubmissionDecision.REJECT) {
    //////////////////////////////////////////////////
    // If Submission is REJECTED
    //
    //     Write to DB
    //////////////////////////////////////////////////

    const reasonString = requestBody.reasonString;

    const deletePublishingChannelSubmissionResponse =
      await controller.databaseService.tableNameToServicesMap.publishingChannelSubmissionsTableService.rejectPendingChannelSubmissionWithReasonString(
        {
          controller,
          publishingChannelSubmissionId,
          reasonForRejectedSubmission: reasonString,
          timestampOfResolutionDecision: now,
        },
      );
    if (deletePublishingChannelSubmissionResponse.type === EitherType.failure) {
      return deletePublishingChannelSubmissionResponse;
    }

    //////////////////////////////////////////////////
    // Handle Notifications
    //////////////////////////////////////////////////

    const assembleRecordAndSendRejectedPublishingChannelSubmissionNotificationResponse =
      await assembleRecordAndSendRejectedPublishingChannelSubmissionNotification({
        controller,
        publishingChannelSubmissionId,
        publishingChannelId: publishingChannelSubmission.publishing_channel_id,
        publishedItemId: publishingChannelSubmission.published_item_id,
        recipientUserId: publishingChannelSubmission.user_id_submitting_published_item,
        databaseService: controller.databaseService,
        blobStorageService: controller.blobStorageService,
        webSocketService: controller.webSocketService,
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        rejectionReason: publishingChannelSubmission.reason_for_rejected_submission!,
      });
    if (
      assembleRecordAndSendRejectedPublishingChannelSubmissionNotificationResponse.type ===
      EitherType.failure
    ) {
      return assembleRecordAndSendRejectedPublishingChannelSubmissionNotificationResponse;
    }

    //////////////////////////////////////////////////
    // Return
    //////////////////////////////////////////////////

    return Success({});
  }

  //////////////////////////////////////////////////
  // Return Failure if Decision type is unknown
  //////////////////////////////////////////////////

  return Failure({
    controller,
    httpStatusCode: 500,
    reason: GenericResponseFailedReason.BAD_REQUEST,
    error: "Unknown decision type at handleResolvePublishingChannelSubmission",
    additionalErrorInformation:
      "Unknown decision type at handleResolvePublishingChannelSubmission",
  });
}
