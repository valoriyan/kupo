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

import { DoesChatRoomExistWithUserIdsSuccess } from "./does-chat-room-exist-with-user-ids-success";
import { EitherTypeSuccess } from "./either-type-success";
import { FailureResponseErrorReasonTypesStringOrDoesChatRoomExistWithUserIdsFailedReason } from "./failure-response-error-reason-types-string-or-does-chat-room-exist-with-user-ids-failed-reason";
import { FailureResponseErrorReasonTypesStringOrDoesChatRoomExistWithUserIdsFailedReasonError } from "./failure-response-error-reason-types-string-or-does-chat-room-exist-with-user-ids-failed-reason-error";
import { SuccessResponseDoesChatRoomExistWithUserIdsSuccess } from "./success-response-does-chat-room-exist-with-user-ids-success";

/**
 *
 * @export
 * @interface EitherErrorReasonTypesStringOrDoesChatRoomExistWithUserIdsFailedReasonDoesChatRoomExistWithUserIdsSuccess
 */
export interface EitherErrorReasonTypesStringOrDoesChatRoomExistWithUserIdsFailedReasonDoesChatRoomExistWithUserIdsSuccess {
  /**
   *
   * @type {EitherTypeSuccess}
   * @memberof EitherErrorReasonTypesStringOrDoesChatRoomExistWithUserIdsFailedReasonDoesChatRoomExistWithUserIdsSuccess
   */
  type: EitherTypeSuccess;
  /**
   *
   * @type {FailureResponseErrorReasonTypesStringOrDoesChatRoomExistWithUserIdsFailedReasonError}
   * @memberof EitherErrorReasonTypesStringOrDoesChatRoomExistWithUserIdsFailedReasonDoesChatRoomExistWithUserIdsSuccess
   */
  error: FailureResponseErrorReasonTypesStringOrDoesChatRoomExistWithUserIdsFailedReasonError;
  /**
   *
   * @type {DoesChatRoomExistWithUserIdsSuccess}
   * @memberof EitherErrorReasonTypesStringOrDoesChatRoomExistWithUserIdsFailedReasonDoesChatRoomExistWithUserIdsSuccess
   */
  success: DoesChatRoomExistWithUserIdsSuccess;
}
