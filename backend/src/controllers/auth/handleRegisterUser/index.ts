import { EitherType, ErrorReasonTypes, HTTPResponse } from "../../../utilities/monads";
import { v4 as uuidv4 } from "uuid";
import { encryptPassword } from "../utilities";
import { AuthController } from "../authController";
import { grantNewAccessToken } from "../utilities/grantNewAccessToken";
import { AuthSuccess } from "../models";
import { getEnvironmentVariable } from "../../../utilities";
import { validateUsername } from "./validateUsername";

export interface RegisterUserRequestBody {
  email: string;
  password: string;
  username: string;
}

export enum RegisterUserFailedReason {
  UnknownCause = "Unknown Cause",
  ValidationError = "All Username Characters Must Be Lowercase English Letters Or Digits",
}

export async function handleRegisterUser({
  requestBody,
  controller,
}: {
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
    await controller.emailService.sendWelcomeEmail({ user });
  }

  //////////////////////////////////////////////////
  // Send Email Verification Email to User
  //////////////////////////////////////////////////

  if (!!maybeUser) {
    const user = maybeUser;
    await controller.emailService.sendVerifyUserEmailEmail({ user });
  }

  //////////////////////////////////////////////////
  // Return
  //////////////////////////////////////////////////

  return grantNewAccessTokenResponse;
}
