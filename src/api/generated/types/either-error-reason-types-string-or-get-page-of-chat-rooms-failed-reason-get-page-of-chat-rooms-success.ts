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

import { EitherTypeSuccess } from "./either-type-success";
import { FailureResponseErrorReasonTypesStringOrGetPageOfChatRoomsFailedReason } from "./failure-response-error-reason-types-string-or-get-page-of-chat-rooms-failed-reason";
import { FailureResponseErrorReasonTypesStringOrGetPageOfChatRoomsFailedReasonError } from "./failure-response-error-reason-types-string-or-get-page-of-chat-rooms-failed-reason-error";
import { GetPageOfChatRoomsSuccess } from "./get-page-of-chat-rooms-success";
import { SuccessResponseGetPageOfChatRoomsSuccess } from "./success-response-get-page-of-chat-rooms-success";

/**
 *
 * @export
 * @interface EitherErrorReasonTypesStringOrGetPageOfChatRoomsFailedReasonGetPageOfChatRoomsSuccess
 */
export interface EitherErrorReasonTypesStringOrGetPageOfChatRoomsFailedReasonGetPageOfChatRoomsSuccess {
  /**
   *
   * @type {EitherTypeSuccess}
   * @memberof EitherErrorReasonTypesStringOrGetPageOfChatRoomsFailedReasonGetPageOfChatRoomsSuccess
   */
  type: EitherTypeSuccess;
  /**
   *
   * @type {FailureResponseErrorReasonTypesStringOrGetPageOfChatRoomsFailedReasonError}
   * @memberof EitherErrorReasonTypesStringOrGetPageOfChatRoomsFailedReasonGetPageOfChatRoomsSuccess
   */
  error: FailureResponseErrorReasonTypesStringOrGetPageOfChatRoomsFailedReasonError;
  /**
   *
   * @type {GetPageOfChatRoomsSuccess}
   * @memberof EitherErrorReasonTypesStringOrGetPageOfChatRoomsFailedReasonGetPageOfChatRoomsSuccess
   */
  success: GetPageOfChatRoomsSuccess;
}
