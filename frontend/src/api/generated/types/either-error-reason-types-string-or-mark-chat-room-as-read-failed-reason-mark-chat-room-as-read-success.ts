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
import { FailureResponseErrorReasonTypesStringOrMarkChatRoomAsReadFailedReason } from "./failure-response-error-reason-types-string-or-mark-chat-room-as-read-failed-reason";
import { FailureResponseErrorReasonTypesStringOrMarkChatRoomAsReadFailedReasonError } from "./failure-response-error-reason-types-string-or-mark-chat-room-as-read-failed-reason-error";
import { MarkChatRoomAsReadSuccess } from "./mark-chat-room-as-read-success";
import { SuccessResponseMarkChatRoomAsReadSuccess } from "./success-response-mark-chat-room-as-read-success";

/**
 *
 * @export
 * @interface EitherErrorReasonTypesStringOrMarkChatRoomAsReadFailedReasonMarkChatRoomAsReadSuccess
 */
export interface EitherErrorReasonTypesStringOrMarkChatRoomAsReadFailedReasonMarkChatRoomAsReadSuccess {
  /**
   *
   * @type {EitherTypeSuccess}
   * @memberof EitherErrorReasonTypesStringOrMarkChatRoomAsReadFailedReasonMarkChatRoomAsReadSuccess
   */
  type: EitherTypeSuccess;
  /**
   *
   * @type {FailureResponseErrorReasonTypesStringOrMarkChatRoomAsReadFailedReasonError}
   * @memberof EitherErrorReasonTypesStringOrMarkChatRoomAsReadFailedReasonMarkChatRoomAsReadSuccess
   */
  error: FailureResponseErrorReasonTypesStringOrMarkChatRoomAsReadFailedReasonError;
  /**
   *
   * @type {MarkChatRoomAsReadSuccess}
   * @memberof EitherErrorReasonTypesStringOrMarkChatRoomAsReadFailedReasonMarkChatRoomAsReadSuccess
   */
  success: MarkChatRoomAsReadSuccess;
}
