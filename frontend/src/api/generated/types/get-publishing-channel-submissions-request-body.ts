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

/**
 *
 * @export
 * @interface GetPublishingChannelSubmissionsRequestBody
 */
export interface GetPublishingChannelSubmissionsRequestBody {
  /**
   *
   * @type {string}
   * @memberof GetPublishingChannelSubmissionsRequestBody
   */
  cursor?: string;
  /**
   *
   * @type {number}
   * @memberof GetPublishingChannelSubmissionsRequestBody
   */
  pageSize: number;
  /**
   *
   * @type {string}
   * @memberof GetPublishingChannelSubmissionsRequestBody
   */
  publishingChannelId: string;
}
