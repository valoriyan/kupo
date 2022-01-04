import { ResetPasswordJWTData } from "./models";
import { sign } from "jsonwebtoken";

const RESET_PASSWORD_TOKEN_EXPIRATION_TIME = 60 * 60 * 2; // one week

export function generateResetPasswordToken({
    userId,
    jwtPrivateKey,
  }: {
    userId: string;
    jwtPrivateKey: string;
  }): string {
    const expiresIn = RESET_PASSWORD_TOKEN_EXPIRATION_TIME;
  
    const jwtData: ResetPasswordJWTData = {
      resetPasswordData: {
        userId,
      },
    };
  
    return sign({ data: jwtData }, jwtPrivateKey, { expiresIn });
  }
  