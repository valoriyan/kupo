import express from "express";
import { Color } from "../../types/color";
import {
  EitherType,
  ErrorReasonTypes,
  Failure,
  SecuredHTTPResponse,
} from "../../utilities/monads";
import { checkAuthentication } from "../auth/utilities";
import { GenericResponseFailedReason } from "../models";
import { ProfilePrivacySetting, RenderableUser } from "./models";
import { UserPageController } from "./userPageController";
import { assembleRenderableUserFromCachedComponents } from "./utilities/assembleRenderableUserFromCachedComponents";

export enum UpdateUserProfileFailedReason {
  Unknown = "Unknown",
}

export type UpdateUserProfileSuccess = RenderableUser;

export interface UpdateUserProfileRequestBody {
  username: string;
  shortBio: string;
  userWebsite: string;
  userEmail: string;
  phoneNumber: string;
  preferredPagePrimaryColor: Color;
  profileVisibility: ProfilePrivacySetting;
}

export async function handleUpdateUserProfile({
  controller,
  request,
  requestBody,
}: {
  controller: UserPageController;
  request: express.Request;
  requestBody: UpdateUserProfileRequestBody;
}): Promise<
  SecuredHTTPResponse<
    ErrorReasonTypes<string | UpdateUserProfileFailedReason>,
    UpdateUserProfileSuccess
  >
> {
  const { clientUserId, errorResponse: error } = await checkAuthentication(
    controller,
    request,
  );
  if (error) return error;

  const {
    username,
    shortBio,
    userWebsite,
    profileVisibility,
    userEmail,
    preferredPagePrimaryColor,
  } = requestBody;

  if (!!userEmail) {
    const unrenderableUser_WITH_PAYMENT_PROCESSOR_CUSTOMER_IDResponse =
      await controller.databaseService.tableNameToServicesMap.usersTableService.selectMaybeUserByUserId_WITH_PAYMENT_PROCESSOR_CUSTOMER_ID(
        {
          controller,
          userId: clientUserId,
        },
      );

    if (
      unrenderableUser_WITH_PAYMENT_PROCESSOR_CUSTOMER_IDResponse.type ===
      EitherType.failure
    ) {
      return unrenderableUser_WITH_PAYMENT_PROCESSOR_CUSTOMER_IDResponse;
    }

    const { success: unrenderableUser_WITH_PAYMENT_PROCESSOR_CUSTOMER_ID } =
      unrenderableUser_WITH_PAYMENT_PROCESSOR_CUSTOMER_IDResponse;

    if (!!unrenderableUser_WITH_PAYMENT_PROCESSOR_CUSTOMER_ID) {
      const updateCustomerEmailResponse =
        await controller.paymentProcessingService.updateCustomerEmail({
          controller,
          paymentProcessorCustomerId:
            unrenderableUser_WITH_PAYMENT_PROCESSOR_CUSTOMER_ID?.paymentProcessorCustomerId,
          updatedEmail: userEmail,
        });
      if (updateCustomerEmailResponse.type === EitherType.failure) {
        return updateCustomerEmailResponse;
      }
    }
  }

  const updateUserByUserIdResponse =
    await controller.databaseService.tableNameToServicesMap.usersTableService.updateUserByUserId(
      {
        controller,
        userId: clientUserId,

        username: username,
        shortBio: shortBio || "",
        userWebsite: userWebsite || "",
        profilePrivacySetting: profileVisibility,
        email: userEmail,
        preferredPagePrimaryColor: preferredPagePrimaryColor,
      },
    );

  if (updateUserByUserIdResponse.type === EitherType.failure) {
    return updateUserByUserIdResponse;
  }
  const { success: updatedUnrenderableUser } = updateUserByUserIdResponse;

  if (!updatedUnrenderableUser) {
    return Failure({
      controller,
      httpStatusCode: 404,
      reason: GenericResponseFailedReason.DATABASE_TRANSACTION_ERROR,
      error: "User not found at handleUpdateUserProfile",
      additionalErrorInformation: "Error at handleUpdateUserProfile",
    });
  }

  const constructRenderableUserFromPartsResponse =
    await assembleRenderableUserFromCachedComponents({
      controller,
      requestorUserId: clientUserId,
      unrenderableUser: updatedUnrenderableUser,
      blobStorageService: controller.blobStorageService,
      databaseService: controller.databaseService,
    });

  return constructRenderableUserFromPartsResponse;
}
