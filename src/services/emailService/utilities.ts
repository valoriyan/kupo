import { ResetPasswordJWTData } from "./models";
import { sign } from "jsonwebtoken";
import { RESET_PASSWORD_URL_PATH } from "../../config";

const RESET_PASSWORD_TOKEN_EXPIRATION_TIME = 60 * 60 * 24 * 7; // one week

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

  return sign(jwtData, jwtPrivateKey, { expiresIn });
}

export const generateResetPasswordURL = ({
  resetPasswordToken,
  frontendBaseUrl,
}: {
  resetPasswordToken: string;
  frontendBaseUrl: string;
}) => {
  return `${frontendBaseUrl}/${RESET_PASSWORD_URL_PATH}?token=${resetPasswordToken}`;
};
