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
import { SetUserContentFeedFiltersSuccess } from "./set-user-content-feed-filters-success";

/**
 *
 * @export
 * @interface SuccessResponseSetUserContentFeedFiltersSuccess
 */
export interface SuccessResponseSetUserContentFeedFiltersSuccess {
  /**
   *
   * @type {EitherTypeSuccess}
   * @memberof SuccessResponseSetUserContentFeedFiltersSuccess
   */
  type: EitherTypeSuccess;
  /**
   *
   * @type {SetUserContentFeedFiltersSuccess}
   * @memberof SuccessResponseSetUserContentFeedFiltersSuccess
   */
  success: SetUserContentFeedFiltersSuccess;
}