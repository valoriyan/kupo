/* tslint:disable */
/* eslint-disable */
/**
 * kupo-backend
 * No description provided (generated by Openapi Generator https://github.com/openapitools/openapi-generator)
 *
 * The version of the OpenAPI document: 0.0.1
 *
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

import { EitherTypeSuccess } from "./either-type-success";
import { FailureResponseErrorReasonTypesStringOrUpdateUserBackgroundImageFailedReason } from "./failure-response-error-reason-types-string-or-update-user-background-image-failed-reason";
import { FailureResponseErrorReasonTypesStringOrUpdateUserBackgroundImageFailedReasonError } from "./failure-response-error-reason-types-string-or-update-user-background-image-failed-reason-error";
import { RenderableUser } from "./renderable-user";
import { SuccessResponseUpdateUserBackgroundImageSuccess } from "./success-response-update-user-background-image-success";

/**
 *
 * @export
 * @interface EitherErrorReasonTypesStringOrUpdateUserBackgroundImageFailedReasonUpdateUserBackgroundImageSuccess
 */
export interface EitherErrorReasonTypesStringOrUpdateUserBackgroundImageFailedReasonUpdateUserBackgroundImageSuccess {
  /**
   *
   * @type {EitherTypeSuccess}
   * @memberof EitherErrorReasonTypesStringOrUpdateUserBackgroundImageFailedReasonUpdateUserBackgroundImageSuccess
   */
  type: EitherTypeSuccess;
  /**
   *
   * @type {FailureResponseErrorReasonTypesStringOrUpdateUserBackgroundImageFailedReasonError}
   * @memberof EitherErrorReasonTypesStringOrUpdateUserBackgroundImageFailedReasonUpdateUserBackgroundImageSuccess
   */
  error: FailureResponseErrorReasonTypesStringOrUpdateUserBackgroundImageFailedReasonError;
  /**
   *
   * @type {RenderableUser}
   * @memberof EitherErrorReasonTypesStringOrUpdateUserBackgroundImageFailedReasonUpdateUserBackgroundImageSuccess
   */
  success: RenderableUser;
}
