/* tslint:disable */
/* eslint-disable */
/**
 * playhouse-backend-2
 * No description provided (generated by Openapi Generator https://github.com/openapitools/openapi-generator)
 *
 * The version of the OpenAPI document: 1.0.0
 *
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

import { FailedAuthResponse } from "./failed-auth-response";
import { FailedtoGetChatRoomWithUserIds } from "./failedto-get-chat-room-with-user-ids";
import { SuccessfullyGotChatRoomWithUserIdsResponse } from "./successfully-got-chat-room-with-user-ids-response";

/**
 *
 * @export
 * @interface SecuredHTTPResponseFailedtoGetChatRoomWithUserIdsSuccessfullyGotChatRoomWithUserIdsResponse
 */
export interface SecuredHTTPResponseFailedtoGetChatRoomWithUserIdsSuccessfullyGotChatRoomWithUserIdsResponse {
  /**
   *
   * @type {FailedtoGetChatRoomWithUserIds | FailedAuthResponse}
   * @memberof SecuredHTTPResponseFailedtoGetChatRoomWithUserIdsSuccessfullyGotChatRoomWithUserIdsResponse
   */
  error?: FailedtoGetChatRoomWithUserIds | FailedAuthResponse;
  /**
   *
   * @type {SuccessfullyGotChatRoomWithUserIdsResponse}
   * @memberof SecuredHTTPResponseFailedtoGetChatRoomWithUserIdsSuccessfullyGotChatRoomWithUserIdsResponse
   */
  success?: SuccessfullyGotChatRoomWithUserIdsResponse;
}
