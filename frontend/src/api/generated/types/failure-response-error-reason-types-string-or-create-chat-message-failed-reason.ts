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

import { EitherTypeFailure } from "./either-type-failure";
import { FailureResponseErrorReasonTypesStringOrCreateChatMessageFailedReasonError } from "./failure-response-error-reason-types-string-or-create-chat-message-failed-reason-error";

/**
 *
 * @export
 * @interface FailureResponseErrorReasonTypesStringOrCreateChatMessageFailedReason
 */
export interface FailureResponseErrorReasonTypesStringOrCreateChatMessageFailedReason {
  /**
   *
   * @type {EitherTypeFailure}
   * @memberof FailureResponseErrorReasonTypesStringOrCreateChatMessageFailedReason
   */
  type: EitherTypeFailure;
  /**
   *
   * @type {FailureResponseErrorReasonTypesStringOrCreateChatMessageFailedReasonError}
   * @memberof FailureResponseErrorReasonTypesStringOrCreateChatMessageFailedReason
   */
  error: FailureResponseErrorReasonTypesStringOrCreateChatMessageFailedReasonError;
}