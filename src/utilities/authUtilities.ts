import { sign, verify } from "jsonwebtoken";

export const REFRESH_TOKEN_EXPIRATION_TIME = 60 * 60 * 24 * 7; // one week
export const ACCESS_TOKEN_EXPIRATION_TIME = 5 * 60; // five minutes

export interface JWTData {
  userId: string;
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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const accessTokenData: JWTData = verify(token, jwtPrivateKey) as any;
  const { userId } = accessTokenData;

  return userId;
}
