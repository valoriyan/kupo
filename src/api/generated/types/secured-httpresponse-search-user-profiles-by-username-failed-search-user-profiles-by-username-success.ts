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

import { AuthFailed } from "./auth-failed";
import { SearchUserProfilesByUsernameFailed } from "./search-user-profiles-by-username-failed";
import { SearchUserProfilesByUsernameSuccess } from "./search-user-profiles-by-username-success";

/**
 *
 * @export
 * @interface SecuredHTTPResponseSearchUserProfilesByUsernameFailedSearchUserProfilesByUsernameSuccess
 */
export interface SecuredHTTPResponseSearchUserProfilesByUsernameFailedSearchUserProfilesByUsernameSuccess {
  /**
   *
   * @type {SearchUserProfilesByUsernameFailed | AuthFailed}
   * @memberof SecuredHTTPResponseSearchUserProfilesByUsernameFailedSearchUserProfilesByUsernameSuccess
   */
  error?: SearchUserProfilesByUsernameFailed | AuthFailed;
  /**
   *
   * @type {SearchUserProfilesByUsernameSuccess}
   * @memberof SecuredHTTPResponseSearchUserProfilesByUsernameFailedSearchUserProfilesByUsernameSuccess
   */
  success?: SearchUserProfilesByUsernameSuccess;
}
