/* eslint-disable @typescript-eslint/ban-types */
import { ErrorReasonTypes, InternalServiceResponse } from "../../utilities/monads";
import { UnrenderableUser } from "../../controllers/user/models";

export enum EmailServiceType {
  SEND_GRID = "SEND_GRID",
  LOCAL = "LOCAL",
}

export abstract class EmailServiceInterface {
  abstract sendResetPasswordEmail({
    user,
  }: {
    user: UnrenderableUser;
  }): Promise<InternalServiceResponse<ErrorReasonTypes<string>, {}>>;
  abstract sendWelcomeEmail({
    user,
  }: {
    user: UnrenderableUser;
  }): Promise<InternalServiceResponse<ErrorReasonTypes<string>, {}>>;
}

export interface ResetPasswordJWTData {
  resetPasswordData: {
    userId: string;
  };
}
