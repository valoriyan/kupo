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

import { RenderablePublishingChannel } from "./renderable-publishing-channel";

/**
 *
 * @export
 * @interface SearchForPublishingChannelsSuccess
 */
export interface SearchForPublishingChannelsSuccess {
  /**
   *
   * @type {Array<RenderablePublishingChannel>}
   * @memberof SearchForPublishingChannelsSuccess
   */
  publishingChannels: Array<RenderablePublishingChannel>;
  /**
   *
   * @type {number}
   * @memberof SearchForPublishingChannelsSuccess
   */
  totalCount: number;
}
