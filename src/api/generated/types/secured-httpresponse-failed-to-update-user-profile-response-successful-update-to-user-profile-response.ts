/* tslint:disable */
/* eslint-disable */
/**
 * playhouse-backend-2
 * No description provided (generated by Openapi Generator https://github.com/openapitools/openapi-generator)
 *
 * The version of the OpenAPI document: 1.0.0
 *
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

import { FailedAuthResponse } from "./failed-auth-response";
import { FailedToUpdateUserProfileResponse } from "./failed-to-update-user-profile-response";
import { RenderableUser } from "./renderable-user";

/**
 *
 * @export
 * @interface SecuredHTTPResponseFailedToUpdateUserProfileResponseSuccessfulUpdateToUserProfileResponse
 */
export interface SecuredHTTPResponseFailedToUpdateUserProfileResponseSuccessfulUpdateToUserProfileResponse {
  /**
   *
   * @type {FailedToUpdateUserProfileResponse | FailedAuthResponse}
   * @memberof SecuredHTTPResponseFailedToUpdateUserProfileResponseSuccessfulUpdateToUserProfileResponse
   */
  error?: FailedToUpdateUserProfileResponse | FailedAuthResponse;
  /**
   *
   * @type {RenderableUser}
   * @memberof SecuredHTTPResponseFailedToUpdateUserProfileResponseSuccessfulUpdateToUserProfileResponse
   */
  success?: RenderableUser;
}
