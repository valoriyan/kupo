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
import { ReadPageOfCommentsByPublishedItemIdSuccess } from "./read-page-of-comments-by-published-item-id-success";

/**
 *
 * @export
 * @interface SuccessResponseReadPageOfCommentsByPublishedItemIdSuccess
 */
export interface SuccessResponseReadPageOfCommentsByPublishedItemIdSuccess {
  /**
   *
   * @type {EitherTypeSuccess}
   * @memberof SuccessResponseReadPageOfCommentsByPublishedItemIdSuccess
   */
  type: EitherTypeSuccess;
  /**
   *
   * @type {ReadPageOfCommentsByPublishedItemIdSuccess}
   * @memberof SuccessResponseReadPageOfCommentsByPublishedItemIdSuccess
   */
  success: ReadPageOfCommentsByPublishedItemIdSuccess;
}