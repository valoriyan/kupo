import express from "express";
import {
  EitherType,
  ErrorReasonTypes,
  Failure,
  HTTPResponse,
} from "../../../utilities/monads";
import { AuthController } from "../authController";
import { checkAuthentication } from "../utilities";
import { GenericResponseFailedReason } from "../../../controllers/models";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface GetVerifyUserEmailRequestBody {}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface GetVerifyUserEmailSuccess {}

export enum GetVerifyUserEmailFailedReason {
  InvalidToken = "InvalidToken",
}

export async function handleGetVerifyUserEmail({
  controller,
  request,
}: {
  controller: AuthController;
  request: express.Request;
}): Promise<
  HTTPResponse<
    ErrorReasonTypes<string | GetVerifyUserEmailFailedReason>,
    GetVerifyUserEmailSuccess
  >
> {
  //////////////////////////////////////////////////
  // Inputs & Authentication
  //////////////////////////////////////////////////

  const { clientUserId, errorResponse } = await checkAuthentication(controller, request);
  if (errorResponse) return errorResponse;

  //////////////////////////////////////////////////
  // Get Client User
  //////////////////////////////////////////////////

  const selectMaybeUserByUserIdResponse =
    await controller.databaseService.tableNameToServicesMap.usersTableService.selectMaybeUserByUserId(
      {
        controller,
        userId: clientUserId,
      },
    );
  if (selectMaybeUserByUserIdResponse.type === EitherType.failure) {
    return selectMaybeUserByUserIdResponse;
  }
  const { success: maybeClientUser } = selectMaybeUserByUserIdResponse;
  if (!maybeClientUser) {
    return Failure({
      controller,
      httpStatusCode: 404,
      reason: GenericResponseFailedReason.DATABASE_TRANSACTION_ERROR,
      error: "User not found at handleGetVerifyUserEmail",
      additionalErrorInformation: "User not found at handleGetVerifyUserEmail",
    });
  }
  const clientUser = maybeClientUser;

  //////////////////////////////////////////////////
  // Send 'Verify User Email' Email
  //////////////////////////////////////////////////

  return await controller.emailService.sendVerifyUserEmailEmail({ user: clientUser });
}
