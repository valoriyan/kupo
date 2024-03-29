import { MD5 } from "crypto-js";
import { Request } from "express";
import { sign, verify } from "jsonwebtoken";
import { Controller } from "tsoa";
import { getEnvironmentVariable } from "../../../utilities";
import {
  ErrorReasonTypes,
  Failure,
  FailureResponse,
  InternalServiceResponse,
  Success,
} from "../../../utilities/monads";
import { AuthFailedReason } from "../models";

export const REFRESH_TOKEN_EXPIRATION_TIME = 60 * 60 * 24 * 7; // one week
export const ACCESS_TOKEN_EXPIRATION_TIME = 15 * 60; // five minutes

export interface JWTData {
  userId: string;
}

export function encryptPassword({ password }: { password: string }): string {
  const salt = getEnvironmentVariable("SALT");
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
export async function checkAuthentication(
  controller: Controller,
  request: Request,
): Promise<{
  clientUserId: string;
  errorResponse?: FailureResponse<AuthFailedReason>;
}> {
  const jwtPrivateKey = getEnvironmentVariable("JWT_PRIVATE_KEY");
  try {
    const token =
      (request.query.token as string) || (request.headers["x-access-token"] as string);

    if (!token) throw new Error("No token found");

    return { clientUserId: validateTokenAndGetUserId({ token, jwtPrivateKey }) };
  } catch {
    return {
      clientUserId: "",
      errorResponse: Failure({
        controller,
        httpStatusCode: 403,
        reason: AuthFailedReason.AuthorizationError,
        error: "Auth token not found at checkAuthentication",
        additionalErrorInformation: "Error at checkAuthentication",
      }),
    };
  }
}

/**
 * Attempts to read a JWT from the request, decode it, and return a userId from its data.
 * If no JWT or userId is found, undefined will be returned.
 */
export async function getClientUserId(request: Request): Promise<string | undefined> {
  const jwtPrivateKey = getEnvironmentVariable("JWT_PRIVATE_KEY");
  try {
    const token =
      (request.query.token as string) || (request.headers["x-access-token"] as string);

    if (!token) return undefined;

    return validateTokenAndGetUserId({ token, jwtPrivateKey });
  } catch {
    return undefined;
  }
}

export function readNetworkPortalId(
  controller: Controller,
  request: Request,
): InternalServiceResponse<ErrorReasonTypes<string>, string> {
  const networkPortalId = request.headers["x-valoriyan-network-portal-id"];
  if (!networkPortalId) {
    return Failure({
      controller,
      httpStatusCode: 400,
      reason: "Missing Network Portal Id",
    });
  } else {
    return Success(networkPortalId as string);
  }
}
