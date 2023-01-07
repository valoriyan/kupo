/* eslint-disable @typescript-eslint/ban-types */
import { ErrorReasonTypes, InternalServiceResponse } from "../../utilities/monads";
import { UnrenderableUser } from "../../controllers/user/models";
import { RenderableShopItemPurchaseSummary } from "../../controllers/publishedItem/shopItem/payments/models";

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

  abstract sendOrderReceiptEmail({
    user,
    renderableShopItemPurchaseSummary,
  }: {
    user: UnrenderableUser;
    renderableShopItemPurchaseSummary: RenderableShopItemPurchaseSummary;
  }): Promise<InternalServiceResponse<ErrorReasonTypes<string>, {}>>;

  abstract sendVerifyUserEmailEmail({
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

export interface VerifyUserEmailJWTData {
  verifyUserEmailData: {
    userId: string;
    email: string;
  };
}
