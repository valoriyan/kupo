import { Request } from "express";
import { sign, verify } from "jsonwebtoken";
import { Controller } from "tsoa";
import { AuthFailureReason, FailedAuthResponse } from "./authController";
import { MD5 } from "crypto-js";

export const REFRESH_TOKEN_EXPIRATION_TIME = 60 * 60 * 24 * 7; // one week
export const ACCESS_TOKEN_EXPIRATION_TIME = 5 * 60; // five minutes

export interface JWTData {
  userId: string;
}

export function encryptPassword({ password }: { password: string }): string {
  const salt = process.env.SALT;
  return MD5(salt + password).toString();
}

export function generateRefreshToken({
  userId,
  jwtPrivateKey,
}: {
  userId: string;
  jwtPrivateKey: string;
}): string {
  const expiresIn = REFRESH_TOKEN_EXPIRATION_TIME;

  const jwtData: JWTData = {
    userId,
  };

  return sign({ data: jwtData }, jwtPrivateKey, { expiresIn });
}

export function generateAccessToken({
  userId,
  jwtPrivateKey,
}: {
  userId: string;
  jwtPrivateKey: string;
}): string {
  const expiresIn = ACCESS_TOKEN_EXPIRATION_TIME;

  const jwtData: JWTData = {
    userId,
  };

  return sign({ data: jwtData }, jwtPrivateKey, { expiresIn });
}

export function validateTokenAndGetUserId({
  token,
  jwtPrivateKey,
}: {
  token: string;
  jwtPrivateKey: string;
}): string {
  const accessTokenData = verify(token, jwtPrivateKey);
  if (typeof accessTokenData === "string") return accessTokenData;
  const { userId } = accessTokenData.data as JWTData;
  return userId;
}

/**
 * Checks if the user if authorized
 * If they are, their userId is returned
 * If they are not, a 403 error is sent to the client
 */
export async function checkAuthorization(
  controller: Controller,
  request: Request,
): Promise<{ userId: string; error?: { error: FailedAuthResponse } }> {
  const jwtPrivateKey = process.env.JWT_PRIVATE_KEY as string;
  try {
    const token =
      (request.query.token as string) || (request.headers["x-access-token"] as string);

    if (!token) throw new Error("No token found");

    return { userId: validateTokenAndGetUserId({ token, jwtPrivateKey }) };
  } catch {
    controller.setStatus(403);
    return {
      userId: "",
      error: { error: { reason: AuthFailureReason.AuthorizationError } },
    };
  }
}
