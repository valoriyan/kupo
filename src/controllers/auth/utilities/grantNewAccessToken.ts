import { DateTime } from "luxon";
import { EitherType, HTTPResponse } from "../../../utilities/monads";
import { Controller } from "tsoa";
import {
  generateAccessToken,
  generateRefreshToken,
  REFRESH_TOKEN_EXPIRATION_TIME,
} from ".";
import { AuthFailedReason, AuthSuccess } from "../models";

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
}): HTTPResponse<AuthFailedReason, AuthSuccess> {
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
  return { type: EitherType.success, success: { accessToken } };
}
