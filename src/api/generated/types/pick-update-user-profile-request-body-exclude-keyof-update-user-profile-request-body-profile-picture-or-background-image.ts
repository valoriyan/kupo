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

import { Color } from "./color";
import { ProfilePrivacySetting } from "./profile-privacy-setting";

/**
 * From T, pick a set of properties whose keys are in the union K
 * @export
 * @interface PickUpdateUserProfileRequestBodyExcludeKeyofUpdateUserProfileRequestBodyProfilePictureOrBackgroundImage
 */
export interface PickUpdateUserProfileRequestBodyExcludeKeyofUpdateUserProfileRequestBodyProfilePictureOrBackgroundImage {
  /**
   *
   * @type {string}
   * @memberof PickUpdateUserProfileRequestBodyExcludeKeyofUpdateUserProfileRequestBodyProfilePictureOrBackgroundImage
   */
  username?: string;
  /**
   *
   * @type {string}
   * @memberof PickUpdateUserProfileRequestBodyExcludeKeyofUpdateUserProfileRequestBodyProfilePictureOrBackgroundImage
   */
  shortBio?: string;
  /**
   *
   * @type {string}
   * @memberof PickUpdateUserProfileRequestBodyExcludeKeyofUpdateUserProfileRequestBodyProfilePictureOrBackgroundImage
   */
  userWebsite?: string;
  /**
   *
   * @type {string}
   * @memberof PickUpdateUserProfileRequestBodyExcludeKeyofUpdateUserProfileRequestBodyProfilePictureOrBackgroundImage
   */
  userEmail?: string;
  /**
   *
   * @type {string}
   * @memberof PickUpdateUserProfileRequestBodyExcludeKeyofUpdateUserProfileRequestBodyProfilePictureOrBackgroundImage
   */
  phoneNumber?: string;
  /**
   *
   * @type {Color}
   * @memberof PickUpdateUserProfileRequestBodyExcludeKeyofUpdateUserProfileRequestBodyProfilePictureOrBackgroundImage
   */
  preferredPagePrimaryColor?: Color;
  /**
   *
   * @type {ProfilePrivacySetting}
   * @memberof PickUpdateUserProfileRequestBodyExcludeKeyofUpdateUserProfileRequestBodyProfilePictureOrBackgroundImage
   */
  profileVisibility?: ProfilePrivacySetting;
}
