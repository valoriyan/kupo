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

import { AuthFailed } from "./auth-failed";
import { CreatePublishedItemCommentSuccess } from "./create-published-item-comment-success";

/**
 *
 * @export
 * @interface SecuredHTTPResponseCreatePublishedItemCommentFailedCreatePublishedItemCommentSuccess
 */
export interface SecuredHTTPResponseCreatePublishedItemCommentFailedCreatePublishedItemCommentSuccess {
  /**
   *
   * @type {object | AuthFailed}
   * @memberof SecuredHTTPResponseCreatePublishedItemCommentFailedCreatePublishedItemCommentSuccess
   */
  error?: object | AuthFailed;
  /**
   *
   * @type {CreatePublishedItemCommentSuccess}
   * @memberof SecuredHTTPResponseCreatePublishedItemCommentFailedCreatePublishedItemCommentSuccess
   */
  success?: CreatePublishedItemCommentSuccess;
}
