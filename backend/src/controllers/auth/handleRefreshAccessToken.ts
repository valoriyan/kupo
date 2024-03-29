import express from "express";
import { getEnvironmentVariable } from "../../utilities";
import { EitherType, HTTPResponse } from "../../utilities/monads";
import { AuthController } from "./authController";
import { AuthFailedReason, AuthSuccess } from "./models";
import { validateTokenAndGetUserId } from "./utilities";
import { grantNewAccessToken } from "./utilities/grantNewAccessToken";

export async function handleRefreshAccessToken({
  controller,
  request,
}: {
  controller: AuthController;
  request: express.Request;
}): Promise<HTTPResponse<AuthFailedReason, AuthSuccess>> {
  //////////////////////////////////////////////////
  // Inputs
  //////////////////////////////////////////////////
  const refreshToken = request.cookies.refreshToken as string | undefined;
  const jwtPrivateKey = getEnvironmentVariable("JWT_PRIVATE_KEY");

  //////////////////////////////////////////////////
  // Check for Refresh Token
  //////////////////////////////////////////////////

  if (!refreshToken) {
    controller.setStatus(401);
    return {
      type: EitherType.failure,
      error: { reason: AuthFailedReason.NoRefreshToken },
    };
  }

  //////////////////////////////////////////////////
  // Get User Id From Refresh Token
  //////////////////////////////////////////////////

  let userId: string;

  try {
    userId = validateTokenAndGetUserId({
      token: refreshToken,
      jwtPrivateKey,
    });
  } catch {
    controller.setStatus(401);
    return { type: EitherType.failure, error: { reason: AuthFailedReason.InvalidToken } };
  }

  //////////////////////////////////////////////////
  // Return Access Token
  //////////////////////////////////////////////////

  try {
    return grantNewAccessToken({ controller, userId, jwtPrivateKey });
  } catch {
    controller.setStatus(401);
    return {
      type: EitherType.failure,
      error: { reason: AuthFailedReason.TokenGenerationFailed },
    };
  }
}
