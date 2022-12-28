import express from "express";
import {
  EitherType,
  ErrorReasonTypes,
  SecuredHTTPResponse,
  Success,
} from "../../../utilities/monads";
import { checkAuthentication } from "../../auth/utilities";
import { UserInteractionController } from "./userInteractionController";

export interface UnblockUserRequestBody {
  blockedUserId: string;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface UnblockUserSuccess {}

export enum UnblockUserFailedReason {
  UnknownCause = "Unknown Cause",
}

export async function handleUnblockUser({
  controller,
  request,
  requestBody,
}: {
  controller: UserInteractionController;
  request: express.Request;
  requestBody: UnblockUserRequestBody;
}): Promise<
  SecuredHTTPResponse<
    ErrorReasonTypes<string | UnblockUserFailedReason>,
    UnblockUserSuccess
  >
> {
  const { blockedUserId } = requestBody;

  const { clientUserId, errorResponse: error } = await checkAuthentication(
    controller,
    request,
  );
  if (error) return error;

  const removeBlockOfUserIdAgainstUserIdResponse =
    await controller.databaseService.tableNameToServicesMap.userBlocksTableService.removeBlockOfUserIdAgainstUserId(
      {
        controller,
        blockedUserId,
        executorUserId: clientUserId,
      },
    );

  if (removeBlockOfUserIdAgainstUserIdResponse.type === EitherType.failure) {
    return removeBlockOfUserIdAgainstUserIdResponse;
  }

  return Success({});
}
