import express from "express";
import { EitherType, ErrorReasonTypes, HTTPResponse } from "../../../utilities/monads";
import { v4 as uuidv4 } from "uuid";
import { encryptPassword, readNetworkPortalId } from "../../auth/utilities";
import { AuthController } from "../../auth/authController";
import { grantNewAccessToken } from "../../auth/utilities/grantNewAccessToken";
import { AuthSuccess } from "../../auth/models";
import { getEnvironmentVariable } from "../../../utilities";
import { validateUsername } from "./validateUsername";
import { userRegistrationPortalHook } from "../../../portalHooks/userRegistrationPortalHook";

export interface RegisterUserRequestBody {
  email: string;
  password: string;
  username: string;
}

export enum RegisterUserFailedReason {
  UnknownCause = "Unknown Cause",
  ValidationError = "Usernames may only include lowercase English letters, digits, hyphens, and underscores",
}

export async function handleRegisterUser({
  request,
  requestBody,
  controller,
}: {
  request: express.Request;
  requestBody: RegisterUserRequestBody;
  controller: AuthController;
}): Promise<
  HTTPResponse<ErrorReasonTypes<string | RegisterUserFailedReason>, AuthSuccess>
> {
  //////////////////////////////////////////////////
  // Inputs
  //////////////////////////////////////////////////
  const userId = uuidv4();
  const { email, username, password } = requestBody;

  const encryptedPassword = encryptPassword({ password });

  const now = Date.now();

  const INSANELY_HARDCODED_ADMIN_EMAILS = [
    "julian.trajanson@gmail.com",
    "chan.asa.co@gmail.com",
    "blake.zimmerman@icloud.com",
  ];

  const isAdmin = INSANELY_HARDCODED_ADMIN_EMAILS.includes(email);

  const lowerCaseUsername = username.toLowerCase();

  const readNetworkPortalIdResponse = readNetworkPortalId(controller, request);
  if (readNetworkPortalIdResponse.type === EitherType.failure) {
    return readNetworkPortalIdResponse;
  }
  const { success: networkPortalId } = readNetworkPortalIdResponse;

  //////////////////////////////////////////////////
  // Validate Username
  //////////////////////////////////////////////////

  const validateUsernameResponse = validateUsername({ controller, username });
  if (validateUsernameResponse.type === EitherType.failure) {
    return validateUsernameResponse;
  }

  //////////////////////////////////////////////////
  // Register New User With Payment Processing Service
  //////////////////////////////////////////////////

  const registerCustomerResponse =
    await controller.paymentProcessingService.registerCustomer({
      controller,
      customerEmail: email,
    });
  if (registerCustomerResponse.type === EitherType.failure) {
    return registerCustomerResponse;
  }
  const { success: paymentProcessorCustomerId } = registerCustomerResponse;

  //////////////////////////////////////////////////
  // Write New User to DB
  //////////////////////////////////////////////////

  const createUserResponse =
    await controller.databaseService.tableNameToServicesMap.usersTableService.createUser({
      controller,
      userId,
      email,
      username: lowerCaseUsername,
      encryptedPassword,
      creationTimestamp: now,
      isAdmin,
      paymentProcessorCustomerId,
    });
  if (createUserResponse.type === EitherType.failure) {
    return createUserResponse;
  }

  //////////////////////////////////////////////////
  // Write New User to DB
  //////////////////////////////////////////////////

  const grantNewAccessTokenResponse = grantNewAccessToken({
    controller,
    userId,
    jwtPrivateKey: getEnvironmentVariable("JWT_PRIVATE_KEY"),
    successStatusCode: 201,
  });
  if (grantNewAccessTokenResponse.type === EitherType.failure) {
    return grantNewAccessTokenResponse;
  }

  //////////////////////////////////////////////////
  // Write New User to DB
  //////////////////////////////////////////////////
  const selectMaybeUserByUserIdResponse =
    await controller.databaseService.tableNameToServicesMap.usersTableService.selectMaybeUserByUserId(
      { controller, userId },
    );
  if (selectMaybeUserByUserIdResponse.type === EitherType.failure) {
    return selectMaybeUserByUserIdResponse;
  }
  const { success: maybeUser } = selectMaybeUserByUserIdResponse;

  //////////////////////////////////////////////////
  // Send welcome email to User
  //////////////////////////////////////////////////

  if (!!maybeUser) {
    const user = maybeUser;
    await controller.emailService.sendWelcomeEmail({ controller, user });
  }

  //////////////////////////////////////////////////
  // Send Email Verification Email to User
  //////////////////////////////////////////////////

  if (!!maybeUser) {
    const user = maybeUser;
    await controller.emailService.sendVerifyUserEmailEmail({ controller, user });
  }

  //////////////////////////////////////////////////
  // Send Email Verification Email to User
  //////////////////////////////////////////////////
  if (!!maybeUser) {
    userRegistrationPortalHook({
      controller,
      networkPortalId,
      unrenderableUser: maybeUser,
    });
  }

  //////////////////////////////////////////////////
  // Return
  //////////////////////////////////////////////////

  return grantNewAccessTokenResponse;
}
