/* tslint:disable */
/* eslint-disable */
/**
 * kupono-backend
 * No description provided (generated by Openapi Generator https://github.com/openapitools/openapi-generator)
 *
 * The version of the OpenAPI document: 0.0.1
 *
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

import { AuthFailedReason } from "./auth-failed-reason";
import { GenericResponseFailedReason } from "./generic-response-failed-reason";
import { UpdateUserProfilePictureFailedReason } from "./update-user-profile-picture-failed-reason";

/**
 *
 * @export
 * @interface SecuredHTTPResponseUpdateUserProfilePictureFailedReasonUpdateUserProfilePictureSuccessError
 */
export interface SecuredHTTPResponseUpdateUserProfilePictureFailedReasonUpdateUserProfilePictureSuccessError {
  /**
   *
   * @type {string}
   * @memberof SecuredHTTPResponseUpdateUserProfilePictureFailedReasonUpdateUserProfilePictureSuccessError
   */
  additionalErrorInformation?: string;
  /**
   *
   * @type {string}
   * @memberof SecuredHTTPResponseUpdateUserProfilePictureFailedReasonUpdateUserProfilePictureSuccessError
   */
  errorMessage?: string;
  /**
   *
   * @type {UpdateUserProfilePictureFailedReason | GenericResponseFailedReason | AuthFailedReason}
   * @memberof SecuredHTTPResponseUpdateUserProfilePictureFailedReasonUpdateUserProfilePictureSuccessError
   */
  reason:
    | UpdateUserProfilePictureFailedReason
    | GenericResponseFailedReason
    | AuthFailedReason;
}
