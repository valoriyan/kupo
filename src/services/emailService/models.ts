import { UnrenderableUser } from "../../controllers/user/models";

export enum EmailServiceType {
  SEND_GRID = "SEND_GRID",
  LOCAL = "LOCAL",
}


export abstract class EmailServiceInterface {
  abstract sendResetPasswordEmail({ user }: { user: UnrenderableUser }): Promise<void>;
}


export interface ResetPasswordJWTData {
  resetPasswordData: {
    userId: string;
  };
}

