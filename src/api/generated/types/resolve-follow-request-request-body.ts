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

import { FollowRequestDecision } from "./follow-request-decision";

/**
 *
 * @export
 * @interface ResolveFollowRequestRequestBody
 */
export interface ResolveFollowRequestRequestBody {
  /**
   *
   * @type {FollowRequestDecision}
   * @memberof ResolveFollowRequestRequestBody
   */
  decision: FollowRequestDecision;
  /**
   *
   * @type {string}
   * @memberof ResolveFollowRequestRequestBody
   */
  userIdDoingFollowing: string;
}
