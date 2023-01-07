import { getEnvironmentVariable } from "../../../utilities";
import { EitherType, ErrorReasonTypes, HTTPResponse } from "../../../utilities/monads";
import { AuthController } from "../authController";
import { verify } from "jsonwebtoken";
import { VerifyUserEmailJWTData } from "../../../services/emailService/models";

export interface VerifyUserEmailRequestBody {
  token: string;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface VerifyUserEmailSuccess {}

export enum VerifyUserEmailFailedReason {
  InvalidToken = "InvalidToken",
}

export async function handleVerifyUserEmail({
  controller,
  requestBody,
}: {
  controller: AuthController;
  requestBody: VerifyUserEmailRequestBody;
}): Promise<
  HTTPResponse<
    ErrorReasonTypes<string | VerifyUserEmailFailedReason>,
    VerifyUserEmailSuccess
  >
> {
  //////////////////////////////////////////////////
  // Inputs
  //////////////////////////////////////////////////

  const jwtPrivateKey = getEnvironmentVariable("JWT_PRIVATE_KEY");

  const { token } = requestBody;

  //////////////////////////////////////////////////
  // Authentication
  //////////////////////////////////////////////////

  let jwtData: VerifyUserEmailJWTData;
  try {
    jwtData = verify(token, jwtPrivateKey) as VerifyUserEmailJWTData;
  } catch (error) {
    console.log(`handleVerifyUserEmail error: ${error}`);
    return {
      type: EitherType.failure,
      error: { reason: VerifyUserEmailFailedReason.InvalidToken },
    };
  }

  const { userId, email } = jwtData.verifyUserEmailData;

  //////////////////////////////////////////////////
  // Update DB to Reflect Verified Email
  //////////////////////////////////////////////////

  const updateUserPasswordResponse =
    await controller.databaseService.tableNameToServicesMap.usersTableService.verifyUserEmail(
      {
        controller,
        userId,
        email,
      },
    );
  if (updateUserPasswordResponse.type === EitherType.failure) {
    return updateUserPasswordResponse;
  }

  //////////////////////////////////////////////////
  // Return
  //////////////////////////////////////////////////

  return {
    type: EitherType.success,
    success: {},
  };
}
