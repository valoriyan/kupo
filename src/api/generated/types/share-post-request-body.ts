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
 * @interface SharePostRequestBody
 */
export interface SharePostRequestBody {
  /**
   *
   * @type {string}
   * @memberof SharePostRequestBody
   */
  sharedPublishedItemId: string;
  /**
   *
   * @type {string}
   * @memberof SharePostRequestBody
   */
  caption: string;
  /**
   *
   * @type {Array<string>}
   * @memberof SharePostRequestBody
   */
  hashtags: Array<string>;
  /**
   *
   * @type {number}
   * @memberof SharePostRequestBody
   */
  scheduledPublicationTimestamp?: number;
  /**
   *
   * @type {number}
   * @memberof SharePostRequestBody
   */
  expirationTimestamp?: number;
}
