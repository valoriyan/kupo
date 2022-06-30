import { HTTPResponse } from "../../../types/httpResponse";
import { v4 as uuidv4 } from "uuid";
import { encryptPassword } from "../utilities";
import { AuthController } from "../authController";
import { grantNewAccessToken } from "../utilities/grantNewAccessToken";
import { AuthSuccess } from "../models";
import { getEnvironmentVariable } from "../../../utilities";
import { validateUsername } from "./validations";
import { generateErrorResponse } from "../../utilities/generateErrorResponse";

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
}): Promise<HTTPResponse<RegisterUserFailedReason, AuthSuccess>> {
  const userId = uuidv4();
  const { email, username, password } = requestBody;

  console.log(`Creating user ${username}`);

  const usernameErrorReason = validateUsername({ username });
  if (!!usernameErrorReason) {
    console.log(`Not creating user ${username} due to failure to validateUsername`);
    return {
      error: {
        reason: usernameErrorReason,
      },
    };
  }

  const encryptedPassword = encryptPassword({ password });

  const now = Date.now();

  try {
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

    await controller.databaseService.tableNameToServicesMap.usersTableService.createUser({
      userId,
      email,
      username: lowerCaseUsername,
      encryptedPassword,
      creationTimestamp: now,
      isAdmin,
      paymentProcessorCustomerId,
    });

    const newAccessTokenResponse = grantNewAccessToken({
      controller,
      userId,
      jwtPrivateKey: getEnvironmentVariable("JWT_PRIVATE_KEY"),
      successStatusCode: 201,
    });

    if (newAccessTokenResponse.success) {
      try {
        const user =
          await controller.databaseService.tableNameToServicesMap.usersTableService.selectUserByUserId(
            { userId },
          );
        if (!!user) {
          controller.emailService.sendWelcomeEmail({ user });
        }
      } catch (error) {
        console.log(`FAILED TO SEND WELCOME EMAIL | ${error}`);
      }

      return {
        success: newAccessTokenResponse.success,
      };
    }

    console.log(`Failed to create user ${username} | UnknownCause`);

    return generateErrorResponse({
      controller,
      errorReason: RegisterUserFailedReason.UnknownCause,
      httpStatusCode: 500,
    });
  } catch (error) {
    console.log(`Failed to create user ${username} | UnknownCause`);
    console.log("error", error);

    return generateErrorResponse({
      controller,
      errorReason: RegisterUserFailedReason.UnknownCause,
      httpStatusCode: 401,
    });
  }
}
