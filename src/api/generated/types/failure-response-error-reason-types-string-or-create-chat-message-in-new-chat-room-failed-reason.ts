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

import { EitherTypeFailure } from "./either-type-failure";
import { FailureResponseErrorReasonTypesStringOrCreateChatMessageInNewChatRoomFailedReasonError } from "./failure-response-error-reason-types-string-or-create-chat-message-in-new-chat-room-failed-reason-error";

/**
 *
 * @export
 * @interface FailureResponseErrorReasonTypesStringOrCreateChatMessageInNewChatRoomFailedReason
 */
export interface FailureResponseErrorReasonTypesStringOrCreateChatMessageInNewChatRoomFailedReason {
  /**
   *
   * @type {EitherTypeFailure}
   * @memberof FailureResponseErrorReasonTypesStringOrCreateChatMessageInNewChatRoomFailedReason
   */
  type: EitherTypeFailure;
  /**
   *
   * @type {FailureResponseErrorReasonTypesStringOrCreateChatMessageInNewChatRoomFailedReasonError}
   * @memberof FailureResponseErrorReasonTypesStringOrCreateChatMessageInNewChatRoomFailedReason
   */
  error: FailureResponseErrorReasonTypesStringOrCreateChatMessageInNewChatRoomFailedReasonError;
}
