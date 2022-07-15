import express from "express";
import { Color } from "../../types/color";
import { EitherType, SecuredHTTPResponse } from "../../types/monads";
import { checkAuthorization } from "../auth/utilities";
import { ProfilePrivacySetting, RenderableUser } from "./models";
import { UserPageController } from "./userPageController";
import { constructRenderableUserFromParts } from "./utilities";

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
  SecuredHTTPResponse<UpdateUserProfileFailedReason, UpdateUserProfileSuccess>
> {
  const { clientUserId, errorResponse: error } = await checkAuthorization(
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
    const unrenderableUser_WITH_PAYMENT_PROCESSOR_CUSTOMER_ID =
      await controller.databaseService.tableNameToServicesMap.usersTableService.selectUserByUserId_WITH_PAYMENT_PROCESSOR_CUSTOMER_ID(
        {
          userId: clientUserId,
        },
      );

    if (!!unrenderableUser_WITH_PAYMENT_PROCESSOR_CUSTOMER_ID) {
      await controller.paymentProcessingService.updateCustomerEmail({
        paymentProcessorCustomerId:
          unrenderableUser_WITH_PAYMENT_PROCESSOR_CUSTOMER_ID?.paymentProcessorCustomerId,
        updatedEmail: userEmail,
      });
    }
  }

  const updatedUnrenderableUser =
    await controller.databaseService.tableNameToServicesMap.usersTableService.updateUserByUserId(
      {
        userId: clientUserId,

        username: username,
        shortBio: shortBio || "",
        userWebsite: userWebsite || "",
        profilePrivacySetting: profileVisibility,
        email: userEmail,
        preferredPagePrimaryColor: preferredPagePrimaryColor,
      },
    );

  if (!updatedUnrenderableUser) {
    controller.setStatus(404);
    return {
      type: EitherType.error,
      error: { reason: UpdateUserProfileFailedReason.Unknown },
    };
  }

  const renderableUser = await constructRenderableUserFromParts({
    clientUserId,
    unrenderableUser: updatedUnrenderableUser,
    blobStorageService: controller.blobStorageService,
    databaseService: controller.databaseService,
  });

  return {
    type: EitherType.success,
    success: renderableUser,
  };
}
