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
import { FailureResponseErrorReasonTypesStringOrSubmitPublishedItemToPublishingChannelFailedReason } from "./failure-response-error-reason-types-string-or-submit-published-item-to-publishing-channel-failed-reason";
import { FailureResponseErrorReasonTypesStringOrSubmitPublishedItemToPublishingChannelFailedReasonError } from "./failure-response-error-reason-types-string-or-submit-published-item-to-publishing-channel-failed-reason-error";
import { SuccessResponseSubmitPublishedItemToPublishingChannelSuccess } from "./success-response-submit-published-item-to-publishing-channel-success";

/**
 *
 * @export
 * @interface EitherErrorReasonTypesStringOrSubmitPublishedItemToPublishingChannelFailedReasonSubmitPublishedItemToPublishingChannelSuccess
 */
export interface EitherErrorReasonTypesStringOrSubmitPublishedItemToPublishingChannelFailedReasonSubmitPublishedItemToPublishingChannelSuccess {
  /**
   *
   * @type {EitherTypeSuccess}
   * @memberof EitherErrorReasonTypesStringOrSubmitPublishedItemToPublishingChannelFailedReasonSubmitPublishedItemToPublishingChannelSuccess
   */
  type: EitherTypeSuccess;
  /**
   *
   * @type {FailureResponseErrorReasonTypesStringOrSubmitPublishedItemToPublishingChannelFailedReasonError}
   * @memberof EitherErrorReasonTypesStringOrSubmitPublishedItemToPublishingChannelFailedReasonSubmitPublishedItemToPublishingChannelSuccess
   */
  error: FailureResponseErrorReasonTypesStringOrSubmitPublishedItemToPublishingChannelFailedReasonError;
  /**
   *
   * @type {object}
   * @memberof EitherErrorReasonTypesStringOrSubmitPublishedItemToPublishingChannelFailedReasonSubmitPublishedItemToPublishingChannelSuccess
   */
  success: object;
}