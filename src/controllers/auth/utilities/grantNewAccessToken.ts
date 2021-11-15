import { DateTime } from "luxon";
import { HTTPResponse } from "src/types/httpResponse";
import { Controller } from "tsoa";
import {
  generateAccessToken,
  generateRefreshToken,
  REFRESH_TOKEN_EXPIRATION_TIME,
} from ".";
import { FailedAuthResponse, SuccessfulAuthResponse } from "../authController";

export function grantNewAccessToken({
  controller,
  userId,
  jwtPrivateKey,
  successStatusCode = 200,
}: {
  controller: Controller;
  userId: string;
  jwtPrivateKey: string;
  successStatusCode?: number;
}): HTTPResponse<FailedAuthResponse, SuccessfulAuthResponse> {
  const accessToken = generateAccessToken({
    userId,
    jwtPrivateKey,
  });
  const refreshToken = generateRefreshToken({
    userId,
    jwtPrivateKey,
  });

  const tokenExpirationTime = DateTime.now()
    .plus(REFRESH_TOKEN_EXPIRATION_TIME * 1000)
    .toJSDate()
    .toUTCString();

  controller.setHeader(
    "Set-Cookie",
    `refreshToken=${refreshToken}; HttpOnly; Secure; Expires=${tokenExpirationTime}`,
  );

  controller.setStatus(successStatusCode);
  return { success: { accessToken } };
}
