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

import { CreateChatMessageSuccess } from "./create-chat-message-success";
import { EitherTypeSuccess } from "./either-type-success";
import { FailureResponseErrorReasonTypesStringOrCreateChatMessageFailedReason } from "./failure-response-error-reason-types-string-or-create-chat-message-failed-reason";
import { FailureResponseErrorReasonTypesStringOrCreateChatMessageFailedReasonError } from "./failure-response-error-reason-types-string-or-create-chat-message-failed-reason-error";
import { SuccessResponseCreateChatMessageSuccess } from "./success-response-create-chat-message-success";

/**
 *
 * @export
 * @interface EitherErrorReasonTypesStringOrCreateChatMessageFailedReasonCreateChatMessageSuccess
 */
export interface EitherErrorReasonTypesStringOrCreateChatMessageFailedReasonCreateChatMessageSuccess {
  /**
   *
   * @type {EitherTypeSuccess}
   * @memberof EitherErrorReasonTypesStringOrCreateChatMessageFailedReasonCreateChatMessageSuccess
   */
  type: EitherTypeSuccess;
  /**
   *
   * @type {FailureResponseErrorReasonTypesStringOrCreateChatMessageFailedReasonError}
   * @memberof EitherErrorReasonTypesStringOrCreateChatMessageFailedReasonCreateChatMessageSuccess
   */
  error: FailureResponseErrorReasonTypesStringOrCreateChatMessageFailedReasonError;
  /**
   *
   * @type {CreateChatMessageSuccess}
   * @memberof EitherErrorReasonTypesStringOrCreateChatMessageFailedReasonCreateChatMessageSuccess
   */
  success: CreateChatMessageSuccess;
}
