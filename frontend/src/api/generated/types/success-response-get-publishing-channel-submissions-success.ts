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
import { GetPublishingChannelSubmissionsSuccess } from "./get-publishing-channel-submissions-success";

/**
 *
 * @export
 * @interface SuccessResponseGetPublishingChannelSubmissionsSuccess
 */
export interface SuccessResponseGetPublishingChannelSubmissionsSuccess {
  /**
   *
   * @type {EitherTypeSuccess}
   * @memberof SuccessResponseGetPublishingChannelSubmissionsSuccess
   */
  type: EitherTypeSuccess;
  /**
   *
   * @type {GetPublishingChannelSubmissionsSuccess}
   * @memberof SuccessResponseGetPublishingChannelSubmissionsSuccess
   */
  success: GetPublishingChannelSubmissionsSuccess;
}
