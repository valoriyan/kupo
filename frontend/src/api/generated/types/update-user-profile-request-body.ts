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

import { Color } from "./color";
import { ProfilePrivacySetting } from "./profile-privacy-setting";

/**
 *
 * @export
 * @interface UpdateUserProfileRequestBody
 */
export interface UpdateUserProfileRequestBody {
  /**
   *
   * @type {string}
   * @memberof UpdateUserProfileRequestBody
   */
  username: string;
  /**
   *
   * @type {string}
   * @memberof UpdateUserProfileRequestBody
   */
  shortBio: string;
  /**
   *
   * @type {string}
   * @memberof UpdateUserProfileRequestBody
   */
  userWebsite: string;
  /**
   *
   * @type {string}
   * @memberof UpdateUserProfileRequestBody
   */
  userEmail: string;
  /**
   *
   * @type {string}
   * @memberof UpdateUserProfileRequestBody
   */
  phoneNumber: string;
  /**
   *
   * @type {Color}
   * @memberof UpdateUserProfileRequestBody
   */
  preferredPagePrimaryColor: Color;
  /**
   *
   * @type {ProfilePrivacySetting}
   * @memberof UpdateUserProfileRequestBody
   */
  profileVisibility: ProfilePrivacySetting;
}
