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

import { ProfilePrivacySetting } from "./profile-privacy-setting";
import { RenderableUserFollowers } from "./renderable-user-followers";

/**
 *
 * @export
 * @interface RenderableUser
 */
export interface RenderableUser {
  /**
   *
   * @type {string}
   * @memberof RenderableUser
   */
  userId: string;
  /**
   *
   * @type {string}
   * @memberof RenderableUser
   */
  email: string;
  /**
   *
   * @type {string}
   * @memberof RenderableUser
   */
  username: string;
  /**
   *
   * @type {string}
   * @memberof RenderableUser
   */
  shortBio?: string;
  /**
   *
   * @type {string}
   * @memberof RenderableUser
   */
  userWebsite?: string;
  /**
   *
   * @type {string}
   * @memberof RenderableUser
   */
  phoneNumber?: string;
  /**
   *
   * @type {ProfilePrivacySetting}
   * @memberof RenderableUser
   */
  profilePrivacySetting: ProfilePrivacySetting;
  /**
   *
   * @type {string}
   * @memberof RenderableUser
   */
  backgroundImageTemporaryUrl?: string;
  /**
   *
   * @type {string}
   * @memberof RenderableUser
   */
  profilePictureTemporaryUrl?: string;
  /**
   *
   * @type {RenderableUserFollowers}
   * @memberof RenderableUser
   */
  followers: RenderableUserFollowers;
  /**
   *
   * @type {RenderableUserFollowers}
   * @memberof RenderableUser
   */
  follows: RenderableUserFollowers;
  /**
   *
   * @type {boolean}
   * @memberof RenderableUser
   */
  clientCanViewContent: boolean;
  /**
   *
   * @type {Array<string>}
   * @memberof RenderableUser
   */
  hashtags: Array<string>;
}
