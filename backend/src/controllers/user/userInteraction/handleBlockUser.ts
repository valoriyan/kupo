import express from "express";
import {
  EitherType,
  ErrorReasonTypes,
  SecuredHTTPResponse,
  Success,
} from "../../../utilities/monads";
import { checkAuthorization } from "../../auth/utilities";
import { UserInteractionController } from "./userInteractionController";

export interface BlockUserRequestBody {
  blockedUserId: string;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface BlockUserSuccess {}

export enum BlockUserFailedReason {
  UnknownCause = "Unknown Cause",
}

export async function handleBlockUser({
  controller,
  request,
  requestBody,
}: {
  controller: UserInteractionController;
  request: express.Request;
  requestBody: BlockUserRequestBody;
}): Promise<
  SecuredHTTPResponse<ErrorReasonTypes<string | BlockUserFailedReason>, BlockUserSuccess>
> {
  const { blockedUserId } = requestBody;

  const now = Date.now();

  const { clientUserId, errorResponse: error } = await checkAuthorization(
    controller,
    request,
  );
  if (error) return error;

  const executeBlockOfUserIdByUserIdResponse =
    await controller.databaseService.tableNameToServicesMap.userBlocksTableService.executeBlockOfUserIdByUserId(
      {
        controller,
        blockedUserId,
        executorUserId: clientUserId,
        executionTimestamp: now,
      },
    );

  if (executeBlockOfUserIdByUserIdResponse.type === EitherType.failure) {
    return executeBlockOfUserIdByUserIdResponse;
  }

  return Success({});
}
