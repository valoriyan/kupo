import express from "express";
import {
  EitherType,
  ErrorReasonTypes,
  Failure,
  SecuredHTTPResponse,
  Success,
} from "../../utilities/monads";
import { checkAuthorization } from "../auth/utilities";
import { GenericResponseFailedReason } from "../models";
import { PublishingChannelController } from "./publishingChannelController";
import { doesUserIdHaveRightsToApprovePublishingChannelSubmissions } from "./utilities";

export enum PublishingChannelSubmissionDecision {
  accept = "accept",
  reject = "reject",
}

export interface ResolvePublishingChannelSubmissionRequestBody {
  decision: PublishingChannelSubmissionDecision;
  publishingChannelSubmissionId: string;
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
  const { decision, publishingChannelSubmissionId } = requestBody;

  const { clientUserId, errorResponse: error } = await checkAuthorization(
    controller,
    request,
  );
  if (error) return error;

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

  if (decision === PublishingChannelSubmissionDecision.accept) {
    const approvePendingChannelSubmissionResponse =
      await controller.databaseService.tableNameToServicesMap.publishingChannelSubmissionsTableService.approvePendingChannelSubmission(
        {
          controller,
          publishingChannelSubmissionId,
        },
      );
    if (approvePendingChannelSubmissionResponse.type === EitherType.failure) {
      return approvePendingChannelSubmissionResponse;
    }
    return Success({});
  } else if (decision === PublishingChannelSubmissionDecision.reject) {
    const deletePublishingChannelSubmissionResponse =
      await controller.databaseService.tableNameToServicesMap.publishingChannelSubmissionsTableService.deletePublishingChannelSubmission(
        {
          controller,
          publishingChannelSubmissionId,
        },
      );
    if (deletePublishingChannelSubmissionResponse.type === EitherType.failure) {
      return deletePublishingChannelSubmissionResponse;
    }
    return Success({});
  }

  return Failure({
    controller,
    httpStatusCode: 500,
    reason: GenericResponseFailedReason.BAD_REQUEST,
    error: "Unknown decision type at handleResolvePublishingChannelSubmission",
    additionalErrorInformation:
      "Unknown decision type at handleResolvePublishingChannelSubmission",
  });
}
