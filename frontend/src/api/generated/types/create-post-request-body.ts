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

import { UploadableKupoFile } from "./uploadable-kupo-file";

/**
 *
 * @export
 * @interface CreatePostRequestBody
 */
export interface CreatePostRequestBody {
  /**
   *
   * @type {Array<UploadableKupoFile>}
   * @memberof CreatePostRequestBody
   */
  mediaFiles: Array<UploadableKupoFile>;
  /**
   *
   * @type {string}
   * @memberof CreatePostRequestBody
   */
  caption: string;
  /**
   *
   * @type {Array<string>}
   * @memberof CreatePostRequestBody
   */
  hashtags: Array<string>;
  /**
   *
   * @type {number}
   * @memberof CreatePostRequestBody
   */
  scheduledPublicationTimestamp?: number;
  /**
   *
   * @type {number}
   * @memberof CreatePostRequestBody
   */
  expirationTimestamp?: number;
}