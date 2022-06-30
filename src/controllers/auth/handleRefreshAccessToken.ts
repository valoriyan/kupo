import express from "express";
import { getEnvironmentVariable } from "../../utilities";
import { HTTPResponse } from "../../types/httpResponse";
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
  const refreshToken = request.cookies.refreshToken as string | undefined;
  const jwtPrivateKey = getEnvironmentVariable("JWT_PRIVATE_KEY");

  if (!refreshToken) {
    controller.setStatus(401);
    return { error: { reason: AuthFailedReason.NoRefreshToken } };
  }

  let userId: string;

  try {
    userId = validateTokenAndGetUserId({
      token: refreshToken,
      jwtPrivateKey,
    });
  } catch {
    controller.setStatus(401);
    return { error: { reason: AuthFailedReason.InvalidToken } };
  }

  try {
    return grantNewAccessToken({ controller, userId, jwtPrivateKey });
  } catch {
    controller.setStatus(401);
    return { error: { reason: AuthFailedReason.TokenGenerationFailed } };
  }
}
