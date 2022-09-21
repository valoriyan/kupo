import express from "express";
import { getEnvironmentVariable } from "../../../utilities";
import { EitherType, ErrorReasonTypes, HTTPResponse } from "../../../utilities/monads";
import { AuthController } from "../authController";
import { verify } from "jsonwebtoken";
import { ResetPasswordJWTData } from "../../../services/emailService/models";
import { encryptPassword } from "../utilities";
import { getClientIp } from "request-ip";

export interface ResetPasswordRequestBody {
  token: string;
  password: string;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ResetPasswordSuccess {}

export enum ResetPasswordFailedReason {
  InvalidToken = "InvalidToken",
  InvalidPassword = "InvalidPassword",
}

export async function handleResetPassword({
  controller,
  request,
  requestBody,
}: {
  controller: AuthController;
  request: express.Request;
  requestBody: ResetPasswordRequestBody;
}): Promise<
  HTTPResponse<ErrorReasonTypes<string | ResetPasswordFailedReason>, ResetPasswordSuccess>
> {
  const jwtPrivateKey = getEnvironmentVariable("JWT_PRIVATE_KEY");

  const { token, password } = requestBody;
  const now = Date.now();
  const clientIpAddress = getClientIp(request);

  try {
    const jwtData = verify(token, jwtPrivateKey) as ResetPasswordJWTData;
    const userId = jwtData.resetPasswordData.userId;

    const encryptedPassword = encryptPassword({ password });

    await controller.databaseService.tableNameToServicesMap.usersTableService.updateUserPassword(
      {
        controller,
        userId,
        encryptedPassword,
      },
    );

    const selectUserByUserIdResponse =
      await controller.databaseService.tableNameToServicesMap.usersTableService.selectMaybeUserByUserId(
        {
          controller,
          userId,
        },
      );
    if (selectUserByUserIdResponse.type === EitherType.failure) {
      return selectUserByUserIdResponse;
    }
    const { success: unrenderableUser } = selectUserByUserIdResponse;

    const recordLoginAttemptResponse =
      await controller.databaseService.tableNameToServicesMap.userLoginAttemptsTableService.recordLoginAttempt(
        {
          controller,
          email: unrenderableUser!.email,
          timestamp: now,
          ipAddress: clientIpAddress || "",
          wasSuccessful: true,
        },
      );
    if (recordLoginAttemptResponse.type === EitherType.failure) {
      return recordLoginAttemptResponse;
    }

    return {
      type: EitherType.success,
      success: {},
    };
  } catch (error) {
    console.log(`handleResetPassword error: ${error}`);
    return {
      type: EitherType.failure,
      error: { reason: ResetPasswordFailedReason.InvalidToken },
    };
  }
}
