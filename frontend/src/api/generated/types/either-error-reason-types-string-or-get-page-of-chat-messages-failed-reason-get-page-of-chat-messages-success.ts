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

import { EitherTypeSuccess } from "./either-type-success";
import { FailureResponseErrorReasonTypesStringOrGetPageOfChatMessagesFailedReason } from "./failure-response-error-reason-types-string-or-get-page-of-chat-messages-failed-reason";
import { FailureResponseErrorReasonTypesStringOrGetPageOfChatMessagesFailedReasonError } from "./failure-response-error-reason-types-string-or-get-page-of-chat-messages-failed-reason-error";
import { GetPageOfChatMessagesSuccess } from "./get-page-of-chat-messages-success";
import { SuccessResponseGetPageOfChatMessagesSuccess } from "./success-response-get-page-of-chat-messages-success";

/**
 *
 * @export
 * @interface EitherErrorReasonTypesStringOrGetPageOfChatMessagesFailedReasonGetPageOfChatMessagesSuccess
 */
export interface EitherErrorReasonTypesStringOrGetPageOfChatMessagesFailedReasonGetPageOfChatMessagesSuccess {
  /**
   *
   * @type {EitherTypeSuccess}
   * @memberof EitherErrorReasonTypesStringOrGetPageOfChatMessagesFailedReasonGetPageOfChatMessagesSuccess
   */
  type: EitherTypeSuccess;
  /**
   *
   * @type {FailureResponseErrorReasonTypesStringOrGetPageOfChatMessagesFailedReasonError}
   * @memberof EitherErrorReasonTypesStringOrGetPageOfChatMessagesFailedReasonGetPageOfChatMessagesSuccess
   */
  error: FailureResponseErrorReasonTypesStringOrGetPageOfChatMessagesFailedReasonError;
  /**
   *
   * @type {GetPageOfChatMessagesSuccess}
   * @memberof EitherErrorReasonTypesStringOrGetPageOfChatMessagesFailedReasonGetPageOfChatMessagesSuccess
   */
  success: GetPageOfChatMessagesSuccess;
}
