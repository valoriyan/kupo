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

import { RenderableChatMessage } from "./renderable-chat-message";

/**
 *
 * @export
 * @interface GetPageOfChatMessagesSuccess
 */
export interface GetPageOfChatMessagesSuccess {
  /**
   *
   * @type {Array<RenderableChatMessage>}
   * @memberof GetPageOfChatMessagesSuccess
   */
  chatMessages: Array<RenderableChatMessage>;
  /**
   *
   * @type {string}
   * @memberof GetPageOfChatMessagesSuccess
   */
  previousPageCursor?: string;
  /**
   *
   * @type {string}
   * @memberof GetPageOfChatMessagesSuccess
   */
  nextPageCursor?: string;
}
