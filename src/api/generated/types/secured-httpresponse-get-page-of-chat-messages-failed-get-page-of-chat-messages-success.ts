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

import { AuthFailed } from "./auth-failed";
import { GetPageOfChatMessagesFailed } from "./get-page-of-chat-messages-failed";
import { GetPageOfChatMessagesSuccess } from "./get-page-of-chat-messages-success";

/**
 *
 * @export
 * @interface SecuredHTTPResponseGetPageOfChatMessagesFailedGetPageOfChatMessagesSuccess
 */
export interface SecuredHTTPResponseGetPageOfChatMessagesFailedGetPageOfChatMessagesSuccess {
  /**
   *
   * @type {GetPageOfChatMessagesFailed | AuthFailed}
   * @memberof SecuredHTTPResponseGetPageOfChatMessagesFailedGetPageOfChatMessagesSuccess
   */
  error?: GetPageOfChatMessagesFailed | AuthFailed;
  /**
   *
   * @type {GetPageOfChatMessagesSuccess}
   * @memberof SecuredHTTPResponseGetPageOfChatMessagesFailedGetPageOfChatMessagesSuccess
   */
  success?: GetPageOfChatMessagesSuccess;
}
