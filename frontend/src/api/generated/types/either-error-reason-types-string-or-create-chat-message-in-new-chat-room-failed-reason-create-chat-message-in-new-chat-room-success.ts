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

import { CreateChatMessageInNewChatRoomSuccess } from "./create-chat-message-in-new-chat-room-success";
import { EitherTypeSuccess } from "./either-type-success";
import { FailureResponseErrorReasonTypesStringOrCreateChatMessageInNewChatRoomFailedReason } from "./failure-response-error-reason-types-string-or-create-chat-message-in-new-chat-room-failed-reason";
import { FailureResponseErrorReasonTypesStringOrCreateChatMessageInNewChatRoomFailedReasonError } from "./failure-response-error-reason-types-string-or-create-chat-message-in-new-chat-room-failed-reason-error";
import { SuccessResponseCreateChatMessageInNewChatRoomSuccess } from "./success-response-create-chat-message-in-new-chat-room-success";

/**
 *
 * @export
 * @interface EitherErrorReasonTypesStringOrCreateChatMessageInNewChatRoomFailedReasonCreateChatMessageInNewChatRoomSuccess
 */
export interface EitherErrorReasonTypesStringOrCreateChatMessageInNewChatRoomFailedReasonCreateChatMessageInNewChatRoomSuccess {
  /**
   *
   * @type {EitherTypeSuccess}
   * @memberof EitherErrorReasonTypesStringOrCreateChatMessageInNewChatRoomFailedReasonCreateChatMessageInNewChatRoomSuccess
   */
  type: EitherTypeSuccess;
  /**
   *
   * @type {FailureResponseErrorReasonTypesStringOrCreateChatMessageInNewChatRoomFailedReasonError}
   * @memberof EitherErrorReasonTypesStringOrCreateChatMessageInNewChatRoomFailedReasonCreateChatMessageInNewChatRoomSuccess
   */
  error: FailureResponseErrorReasonTypesStringOrCreateChatMessageInNewChatRoomFailedReasonError;
  /**
   *
   * @type {CreateChatMessageInNewChatRoomSuccess}
   * @memberof EitherErrorReasonTypesStringOrCreateChatMessageInNewChatRoomFailedReasonCreateChatMessageInNewChatRoomSuccess
   */
  success: CreateChatMessageInNewChatRoomSuccess;
}