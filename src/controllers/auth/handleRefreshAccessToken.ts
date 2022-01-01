import express from "express";
import { HTTPResponse } from "../../types/httpResponse";
import { AuthController } from "./authController";
import { AuthFailureReason, FailedAuthResponse, SuccessfulAuthResponse } from "./models";
import { validateTokenAndGetUserId } from "./utilities";
import { grantNewAccessToken } from "./utilities/grantNewAccessToken";

export async function handleRefreshAccessToken({
  controller,
  request,
}: {
  controller: AuthController;
  request: express.Request;
}): Promise<HTTPResponse<FailedAuthResponse, SuccessfulAuthResponse>> {
  const refreshToken = request.cookies.refreshToken as string | undefined;
  const jwtPrivateKey = process.env.JWT_PRIVATE_KEY as string;

  if (!refreshToken) {
    controller.setStatus(401);
    return { error: { reason: AuthFailureReason.NoRefreshToken } };
  }

  let userId: string;

  try {
    userId = validateTokenAndGetUserId({
      token: refreshToken,
      jwtPrivateKey,
    });
  } catch {
    controller.setStatus(401);
    return { error: { reason: AuthFailureReason.InvalidToken } };
  }

  try {
    return grantNewAccessToken({ controller, userId, jwtPrivateKey });
  } catch {
    controller.setStatus(401);
    return { error: { reason: AuthFailureReason.TokenGenerationFailed } };
  }
}
