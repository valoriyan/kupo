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
import { GetCountOfUnreadChatRoomsSuccess } from "./get-count-of-unread-chat-rooms-success";

/**
 *
 * @export
 * @interface SuccessResponseGetCountOfUnreadChatRoomsSuccess
 */
export interface SuccessResponseGetCountOfUnreadChatRoomsSuccess {
  /**
   *
   * @type {EitherTypeSuccess}
   * @memberof SuccessResponseGetCountOfUnreadChatRoomsSuccess
   */
  type: EitherTypeSuccess;
  /**
   *
   * @type {GetCountOfUnreadChatRoomsSuccess}
   * @memberof SuccessResponseGetCountOfUnreadChatRoomsSuccess
   */
  success: GetCountOfUnreadChatRoomsSuccess;
}
