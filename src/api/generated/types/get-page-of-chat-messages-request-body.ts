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

/**
 *
 * @export
 * @interface GetPageOfChatMessagesRequestBody
 */
export interface GetPageOfChatMessagesRequestBody {
  /**
   *
   * @type {string}
   * @memberof GetPageOfChatMessagesRequestBody
   */
  chatRoomId: string;
  /**
   *
   * @type {string}
   * @memberof GetPageOfChatMessagesRequestBody
   */
  cursor?: string;
  /**
   *
   * @type {number}
   * @memberof GetPageOfChatMessagesRequestBody
   */
  pageSize: number;
}
