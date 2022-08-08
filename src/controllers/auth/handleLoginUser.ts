import express from "express";
import {
  EitherType,
  ErrorReasonTypes,
  Failure,
  HTTPResponse,
} from "../../utilities/monads";
import { getEnvironmentVariable } from "../../utilities";
import { AuthController } from "./authController";
import { AuthFailedReason, AuthSuccess } from "./models";
import { encryptPassword } from "./utilities";
import { grantNewAccessToken } from "./utilities/grantNewAccessToken";
import { getClientIp } from "request-ip";

export interface LoginUserRequestBody {
  email: string;
  password: string;
}

export async function handleLoginUser({
  controller,
  request,
  requestBody,
}: {
  controller: AuthController;
  request: express.Request;
  requestBody: LoginUserRequestBody;
}): Promise<HTTPResponse<ErrorReasonTypes<string | AuthFailedReason>, AuthSuccess>> {
  const { email, password } = requestBody;
  const jwtPrivateKey = getEnvironmentVariable("JWT_PRIVATE_KEY");

  const now = Date.now();
  const clientIpAddress = getClientIp(request);

  //////////////////////////////////////////////////
  // CHECK RECENT AUTH ATTEMPTS - ACCOUNT IS LOCKED AT FIVE FAILED CONSECUTIVE ATTEMPTS
  //////////////////////////////////////////////////
  const getLoginAttemptsForEmailResponse =
    await controller.databaseService.tableNameToServicesMap.userLoginAttemptsTableService.getLoginAttemptsForEmail(
      {
        controller,
        email,
        limit: 5,
      },
    );
  if (getLoginAttemptsForEmailResponse.type === EitherType.failure) {
    return getLoginAttemptsForEmailResponse;
  }
  const { success: recentLoginAttempts } = getLoginAttemptsForEmailResponse;

  if (
    recentLoginAttempts.length === 5 &&
    recentLoginAttempts.every((recentLoginAttempt) => !recentLoginAttempt.was_successful)
  ) {
    const recordLoginAttemptResponse =
      await controller.databaseService.tableNameToServicesMap.userLoginAttemptsTableService.recordLoginAttempt(
        {
          controller,
          email,
          timestamp: now,
          ipAddress: clientIpAddress || "",
          wasSuccessful: false,
        },
      );
    if (recordLoginAttemptResponse.type === EitherType.failure) {
      return recordLoginAttemptResponse;
    }

    return Failure({
      controller,
      httpStatusCode: 401,
      reason: AuthFailedReason.AccountLocked,
      error: "Too many failed login attempts at handleLoginUser",
      additionalErrorInformation: "Too many failed login attempts at handleLoginUser",
    });
  }

  //////////////////////////////////////////////////
  // CHECK PASSWORD
  //////////////////////////////////////////////////
  const selectUser_WITH_PASSWORD_ByUsernameResponse =
    await controller.databaseService.tableNameToServicesMap.usersTableService.selectUser_WITH_PASSWORD_ByEmail(
      { controller, email },
    );

  if (selectUser_WITH_PASSWORD_ByUsernameResponse.type === EitherType.failure) {
    return selectUser_WITH_PASSWORD_ByUsernameResponse;
  }
  const { success: user_WITH_PASSWORD } = selectUser_WITH_PASSWORD_ByUsernameResponse;

  if (!!user_WITH_PASSWORD) {
    const hasMatchedPassword =
      encryptPassword({ password }) === user_WITH_PASSWORD.encryptedPassword;
    if (hasMatchedPassword) {
      const recordLoginAttemptResponse =
        await controller.databaseService.tableNameToServicesMap.userLoginAttemptsTableService.recordLoginAttempt(
          {
            controller,
            email,
            timestamp: now,
            ipAddress: clientIpAddress || "",
            wasSuccessful: true,
          },
        );
      if (recordLoginAttemptResponse.type === EitherType.failure) {
        return recordLoginAttemptResponse;
      }

      const userId = user_WITH_PASSWORD.userId;
      return grantNewAccessToken({ controller, userId, jwtPrivateKey });
    }
  }

  const recordLoginAttemptResponse =
    await controller.databaseService.tableNameToServicesMap.userLoginAttemptsTableService.recordLoginAttempt(
      {
        controller,
        email,
        timestamp: now,
        ipAddress: clientIpAddress || "",
        wasSuccessful: false,
      },
    );
  if (recordLoginAttemptResponse.type === EitherType.failure) {
    return recordLoginAttemptResponse;
  }

  return Failure({
    controller,
    httpStatusCode: 401,
    reason: AuthFailedReason.WrongPassword,
    error: "Wrong password at handleLoginUser",
    additionalErrorInformation: "Wrong password at handleLoginUser",
  });
}
