import express from "express";
import {
  EitherType,
  ErrorReasonTypes,
  Failure,
  HTTPResponse,
  InternalServiceResponse,
  Success,
} from "../../utilities/monads";
import { getEnvironmentVariable } from "../../utilities";
import { AuthController } from "./authController";
import { AuthFailedReason, AuthSuccess } from "./models";
import { encryptPassword } from "./utilities";
import { grantNewAccessToken } from "./utilities/grantNewAccessToken";
import { getClientIp } from "request-ip";
import { Controller } from "tsoa";
import { DatabaseService } from "../../services/databaseService";

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
  //////////////////////////////////////////////////
  // Inputs
  //////////////////////////////////////////////////
  const { email, password } = requestBody;
  const jwtPrivateKey = getEnvironmentVariable("JWT_PRIVATE_KEY");

  const now = Date.now();
  const clientIpAddress = getClientIp(request);

  //////////////////////////////////////////////////
  // There Must Not Be Too Many Recent Failed Attempts to Login
  //////////////////////////////////////////////////

  const assertCountOfLoginAttemptsIsBelowLimitResponse =
    await assertCountOfLoginAttemptsIsBelowLimit({
      controller,
      databaseService: controller.databaseService,
      emailUsedForAttemptedLogin: email,
      timestamp: now,
      clientIpAddress,
    });

  if (assertCountOfLoginAttemptsIsBelowLimitResponse.type === EitherType.failure) {
    return assertCountOfLoginAttemptsIsBelowLimitResponse;
  }

  //////////////////////////////////////////////////
  // Get User & Password
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
    //////////////////////////////////////////////////
    // Login User With Correct Password
    //////////////////////////////////////////////////

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

      //////////////////////////////////////////////////
      // Return for User With Correct Password
      //////////////////////////////////////////////////

      return grantNewAccessToken({ controller, userId, jwtPrivateKey });
    }
  }

  //////////////////////////////////////////////////
  // Record Failed Login Attempt For User With Incorrect Password
  //////////////////////////////////////////////////

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

  //////////////////////////////////////////////////
  // Return for User With Incorrect Password
  //////////////////////////////////////////////////

  return Failure({
    controller,
    httpStatusCode: 401,
    reason: AuthFailedReason.WrongPassword,
    error: "Wrong password at handleLoginUser",
    additionalErrorInformation: "Wrong password at handleLoginUser",
  });
}

async function assertCountOfLoginAttemptsIsBelowLimit({
  controller,
  databaseService,
  emailUsedForAttemptedLogin,
  timestamp,
  clientIpAddress,
}: {
  controller: Controller;
  databaseService: DatabaseService;
  emailUsedForAttemptedLogin: string;
  timestamp: number;
  clientIpAddress: string | null;
}): Promise<
  // eslint-disable-next-line @typescript-eslint/ban-types
  InternalServiceResponse<ErrorReasonTypes<string>, {}>
> {
  //////////////////////////////////////////////////
  // Inputs
  //////////////////////////////////////////////////

  const LIMIT_TO_COUNT_OF_LOGIN_ATTEMPTS = 5;

  //////////////////////////////////////////////////
  // Get Number of Failed Login Attempts So Far
  //////////////////////////////////////////////////

  const getLoginAttemptsForEmailResponse =
    await databaseService.tableNameToServicesMap.userLoginAttemptsTableService.getLoginAttemptsForEmail(
      {
        controller,
        email: emailUsedForAttemptedLogin,
        limit: LIMIT_TO_COUNT_OF_LOGIN_ATTEMPTS,
      },
    );
  if (getLoginAttemptsForEmailResponse.type === EitherType.failure) {
    return getLoginAttemptsForEmailResponse;
  }
  const { success: recentLoginAttempts } = getLoginAttemptsForEmailResponse;

  //////////////////////////////////////////////////
  // Handle Failed Login Attempts Above Limit
  //////////////////////////////////////////////////

  if (
    recentLoginAttempts.length === LIMIT_TO_COUNT_OF_LOGIN_ATTEMPTS &&
    recentLoginAttempts.every((recentLoginAttempt) => !recentLoginAttempt.was_successful)
  ) {
    //////////////////////////////////////////////////
    // Record New Failed Login Attempt
    //////////////////////////////////////////////////

    const recordLoginAttemptResponse =
      await databaseService.tableNameToServicesMap.userLoginAttemptsTableService.recordLoginAttempt(
        {
          controller,
          email: emailUsedForAttemptedLogin,
          timestamp,
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

  return Success({});
}
