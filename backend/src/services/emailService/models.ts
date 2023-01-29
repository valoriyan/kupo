/* eslint-disable @typescript-eslint/ban-types */
import { ErrorReasonTypes, InternalServiceResponse } from "../../utilities/monads";
import { UnrenderableUser } from "../../controllers/user/models";
import { RenderableShopItemPurchaseSummary } from "../../controllers/publishedItem/shopItem/payments/models";
import { Controller } from "tsoa";
import { KupoTeamUpdateMetrics } from "./templates/generateKupoTeamUpdateEmailHtml";

export enum EmailServiceType {
  SEND_GRID = "SEND_GRID",
  LOCAL = "LOCAL",
}

export abstract class EmailServiceInterface {
  abstract sendResetPasswordEmail({
    controller,
    user,
  }: {
    controller: Controller;
    user: UnrenderableUser;
  }): Promise<InternalServiceResponse<ErrorReasonTypes<string>, {}>>;

  abstract sendWelcomeEmail({
    controller,
    user,
  }: {
    controller: Controller;
    user: UnrenderableUser;
  }): Promise<InternalServiceResponse<ErrorReasonTypes<string>, {}>>;

  abstract sendOrderReceiptEmail({
    controller,
    user,
    renderableShopItemPurchaseSummary,
  }: {
    controller: Controller;
    user: UnrenderableUser;
    renderableShopItemPurchaseSummary: RenderableShopItemPurchaseSummary;
  }): Promise<InternalServiceResponse<ErrorReasonTypes<string>, {}>>;

  abstract sendVerifyUserEmailEmail({
    controller,
    user,
  }: {
    controller: Controller;
    user: UnrenderableUser;
  }): Promise<InternalServiceResponse<ErrorReasonTypes<string>, {}>>;

  abstract sendKupoTeamUpdate({
    controller,
    name,
    email,
    kupoTeamUpdateMetrics,
  }: {
    controller: Controller;
    name: string;
    email: string;
    kupoTeamUpdateMetrics: KupoTeamUpdateMetrics;
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
