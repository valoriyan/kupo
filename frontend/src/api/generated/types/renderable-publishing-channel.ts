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

import { RenderableUser } from "./renderable-user";

/**
 *
 * @export
 * @interface RenderablePublishingChannel
 */
export interface RenderablePublishingChannel {
  /**
   *
   * @type {string}
   * @memberof RenderablePublishingChannel
   */
  publishingChannelId: string;
  /**
   *
   * @type {string}
   * @memberof RenderablePublishingChannel
   */
  ownerUserId: string;
  /**
   *
   * @type {string}
   * @memberof RenderablePublishingChannel
   */
  name: string;
  /**
   *
   * @type {string}
   * @memberof RenderablePublishingChannel
   */
  description: string;
  /**
   *
   * @type {RenderableUser}
   * @memberof RenderablePublishingChannel
   */
  owner: RenderableUser;
}
