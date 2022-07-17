import {
  EitherType,
  ErrorReasonTypes,
  Failure,
  HTTPResponse,
  Success,
} from "../../../utilities/monads";
import { v4 as uuidv4 } from "uuid";
import { encryptPassword } from "../utilities";
import { AuthController } from "../authController";
import { grantNewAccessToken } from "../utilities/grantNewAccessToken";
import { AuthSuccess } from "../models";
import { getEnvironmentVariable } from "../../../utilities";
import { validateUsername } from "./validations";
import { GenericResponseFailedReason } from "../../../controllers/models";

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
  const userId = uuidv4();
  const { email, username, password } = requestBody;

  console.log(`Creating user ${username}`);

  const usernameErrorReason = validateUsername({ username });
  if (!!usernameErrorReason) {
    console.log(`Not creating user ${username} due to failure to validateUsername`);
    return Failure({
      controller,
      httpStatusCode: 400,
      reason: usernameErrorReason,
      error: `${usernameErrorReason} at handleRegisterUser`,
      additionalErrorInformation: `${usernameErrorReason} at handleRegisterUser`,
    });
  }

  const encryptedPassword = encryptPassword({ password });

  const now = Date.now();

  const INSANELY_HARDCODED_ADMIN_EMAILS = [
    "julian.trajanson@gmail.com",
    "chan.asa.co@gmail.com",
    "blake.zimmerman@icloud.com",
  ];

  const isAdmin = INSANELY_HARDCODED_ADMIN_EMAILS.includes(email);

  const lowerCaseUsername = username.toLowerCase();

  const paymentProcessorCustomerId =
    await controller.paymentProcessingService.registerCustomer({
      customerEmail: email,
    });

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

  const newAccessTokenResponse = grantNewAccessToken({
    controller,
    userId,
    jwtPrivateKey: getEnvironmentVariable("JWT_PRIVATE_KEY"),
    successStatusCode: 201,
  });

  if (newAccessTokenResponse.type === "success") {
    try {
      const selectUserByUserIdResponse =
        await controller.databaseService.tableNameToServicesMap.usersTableService.selectUserByUserId(
          { controller, userId },
        );
      if (selectUserByUserIdResponse.type === EitherType.failure) {
        return selectUserByUserIdResponse;
      }
      const { success: user } = selectUserByUserIdResponse;

      if (!!user) {
        controller.emailService.sendWelcomeEmail({ user });
      }
    } catch (error) {
      console.log(`FAILED TO SEND WELCOME EMAIL | ${error}`);
    }

    return Success(newAccessTokenResponse.success);
  }

  console.log(`Failed to create user ${username} | UnknownCause`);

  return Failure({
    controller,
    httpStatusCode: 500,
    reason: GenericResponseFailedReason.DATABASE_TRANSACTION_ERROR,
    error: "Unable to generate new access token at handleRegisterUser",
    additionalErrorInformation:
      "Unable to generate new access token at handleRegisterUser",
  });
}
