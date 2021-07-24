import { sign } from "jsonwebtoken";

export interface JWTData {
  userId: string;
}

export function generateRefreshToken({
  userId,
  jwtPrivateKey,
}: {
  userId: string,
  jwtPrivateKey: string,
}): string {
    const oneHour = 60 * 60;

    const jwtData: JWTData = {
      userId,
    };

    return sign(
      {
        data: jwtData,
      },
      jwtPrivateKey,
      { expiresIn: oneHour },
    );
      
}

export function generateAccessToken({
  userId,
  jwtPrivateKey,
}: {
  userId: string,
  jwtPrivateKey: string,
}): string {
    const fiveMinutes = 5 * 60;

    const jwtData: JWTData = {
      userId,
    };

    return sign(
      {
        data: jwtData,
      },
      jwtPrivateKey,
      { expiresIn: fiveMinutes },
    );
      
}