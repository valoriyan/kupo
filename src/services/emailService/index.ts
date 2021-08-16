import { sign } from "jsonwebtoken";
import { singleton } from "tsyringe";

export abstract class EmailService {
  abstract sendResetPasswordEmail({ userId }: { userId: string }): Promise<void>;
}

const RESET_PASSWORD_TOKEN_EXPIRATION_TIME = 60 * 60 * 2; // one week

export interface ResetPasswordJWTData {
  resetPasswordData: {
    userId: string;
  };
}

function generateResetPasswordToken({
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

@singleton()
export class LocalEmailService extends EmailService {
  constructor(private jwtPrivateKey: string) {
    super();
  }

  async sendResetPasswordEmail({ userId }: { userId: string }): Promise<void> {
    const resetPasswordToken = generateResetPasswordToken({
      userId,
      jwtPrivateKey: this.jwtPrivateKey,
    });

    console.log(`
            To reset password, go to http://localhost:6006/resetpassword?token=${resetPasswordToken}
        `);

    return;
  }
}