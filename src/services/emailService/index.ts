import { sign } from "jsonwebtoken";

export interface EmailService {
    sendResetPasswordEmail: ({
        userId,
    }: {
        userId: string;
    }) => void;
}

const RESET_PASSWORD_TOKEN_EXPIRATION_TIME = 60 * 60 * 2; // one week

export interface ResetPasswordJWTData {
    resetPasswordData: {
        userId: string;
    }
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

export async function generateLocalEmailService({
    jwtPrivateKey,
}: {
    jwtPrivateKey: string;
}): Promise<EmailService> {
    async function sendResetPasswordEmail({
        userId,
    }: {
        userId: string;
    }): Promise<void> {
        const resetPasswordToken = generateResetPasswordToken({
            userId,
            jwtPrivateKey,
        });

        console.log(`
            To reset password, go to http://localhost:6006/resetpassword?token=${resetPasswordToken}
        `)

        return;
    }

    return {
        sendResetPasswordEmail,
    }
}