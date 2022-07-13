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

import { AuthFailedReason } from "./auth-failed-reason";
import { GenericResponseFailedReason } from "./generic-response-failed-reason";
import { GetPageOfChatMessagesFailedReason } from "./get-page-of-chat-messages-failed-reason";

/**
 *
 * @export
 * @interface SecuredHTTPResponseGetPageOfChatMessagesFailedReasonGetPageOfChatMessagesSuccessError
 */
export interface SecuredHTTPResponseGetPageOfChatMessagesFailedReasonGetPageOfChatMessagesSuccessError {
  /**
   *
   * @type {string}
   * @memberof SecuredHTTPResponseGetPageOfChatMessagesFailedReasonGetPageOfChatMessagesSuccessError
   */
  additionalErrorInformation?: string;
  /**
   *
   * @type {string}
   * @memberof SecuredHTTPResponseGetPageOfChatMessagesFailedReasonGetPageOfChatMessagesSuccessError
   */
  errorMessage?: string;
  /**
   *
   * @type {GetPageOfChatMessagesFailedReason | GenericResponseFailedReason | AuthFailedReason}
   * @memberof SecuredHTTPResponseGetPageOfChatMessagesFailedReasonGetPageOfChatMessagesSuccessError
   */
  reason:
    | GetPageOfChatMessagesFailedReason
    | GenericResponseFailedReason
    | AuthFailedReason;
}
