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

import { CreatePostWithoutMulterSuccess } from "./create-post-without-multer-success";
import { EitherTypeSuccess } from "./either-type-success";
import { FailureResponseErrorReasonTypesStringOrCreatePostWithoutMulterFailedReason } from "./failure-response-error-reason-types-string-or-create-post-without-multer-failed-reason";
import { FailureResponseErrorReasonTypesStringOrCreatePostWithoutMulterFailedReasonError } from "./failure-response-error-reason-types-string-or-create-post-without-multer-failed-reason-error";
import { SuccessResponseCreatePostWithoutMulterSuccess } from "./success-response-create-post-without-multer-success";

/**
 *
 * @export
 * @interface EitherErrorReasonTypesStringOrCreatePostWithoutMulterFailedReasonCreatePostWithoutMulterSuccess
 */
export interface EitherErrorReasonTypesStringOrCreatePostWithoutMulterFailedReasonCreatePostWithoutMulterSuccess {
  /**
   *
   * @type {EitherTypeSuccess}
   * @memberof EitherErrorReasonTypesStringOrCreatePostWithoutMulterFailedReasonCreatePostWithoutMulterSuccess
   */
  type: EitherTypeSuccess;
  /**
   *
   * @type {FailureResponseErrorReasonTypesStringOrCreatePostWithoutMulterFailedReasonError}
   * @memberof EitherErrorReasonTypesStringOrCreatePostWithoutMulterFailedReasonCreatePostWithoutMulterSuccess
   */
  error: FailureResponseErrorReasonTypesStringOrCreatePostWithoutMulterFailedReasonError;
  /**
   *
   * @type {CreatePostWithoutMulterSuccess}
   * @memberof EitherErrorReasonTypesStringOrCreatePostWithoutMulterFailedReasonCreatePostWithoutMulterSuccess
   */
  success: CreatePostWithoutMulterSuccess;
}
