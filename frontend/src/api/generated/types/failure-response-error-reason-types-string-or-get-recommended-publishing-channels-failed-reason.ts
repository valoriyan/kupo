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

import { EitherTypeFailure } from "./either-type-failure";
import { FailureResponseErrorReasonTypesStringOrGetRecommendedPublishingChannelsFailedReasonError } from "./failure-response-error-reason-types-string-or-get-recommended-publishing-channels-failed-reason-error";

/**
 *
 * @export
 * @interface FailureResponseErrorReasonTypesStringOrGetRecommendedPublishingChannelsFailedReason
 */
export interface FailureResponseErrorReasonTypesStringOrGetRecommendedPublishingChannelsFailedReason {
  /**
   *
   * @type {EitherTypeFailure}
   * @memberof FailureResponseErrorReasonTypesStringOrGetRecommendedPublishingChannelsFailedReason
   */
  type: EitherTypeFailure;
  /**
   *
   * @type {FailureResponseErrorReasonTypesStringOrGetRecommendedPublishingChannelsFailedReasonError}
   * @memberof FailureResponseErrorReasonTypesStringOrGetRecommendedPublishingChannelsFailedReason
   */
  error: FailureResponseErrorReasonTypesStringOrGetRecommendedPublishingChannelsFailedReasonError;
}
