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
import { FailureResponseErrorReasonTypesStringOrInviteUserToFollowPublishingChannelFailedReason } from "./failure-response-error-reason-types-string-or-invite-user-to-follow-publishing-channel-failed-reason";
import { FailureResponseErrorReasonTypesStringOrInviteUserToFollowPublishingChannelFailedReasonError } from "./failure-response-error-reason-types-string-or-invite-user-to-follow-publishing-channel-failed-reason-error";
import { SuccessResponseInviteUserToFollowPublishingChannelSuccess } from "./success-response-invite-user-to-follow-publishing-channel-success";

/**
 *
 * @export
 * @interface EitherErrorReasonTypesStringOrInviteUserToFollowPublishingChannelFailedReasonInviteUserToFollowPublishingChannelSuccess
 */
export interface EitherErrorReasonTypesStringOrInviteUserToFollowPublishingChannelFailedReasonInviteUserToFollowPublishingChannelSuccess {
  /**
   *
   * @type {EitherTypeSuccess}
   * @memberof EitherErrorReasonTypesStringOrInviteUserToFollowPublishingChannelFailedReasonInviteUserToFollowPublishingChannelSuccess
   */
  type: EitherTypeSuccess;
  /**
   *
   * @type {FailureResponseErrorReasonTypesStringOrInviteUserToFollowPublishingChannelFailedReasonError}
   * @memberof EitherErrorReasonTypesStringOrInviteUserToFollowPublishingChannelFailedReasonInviteUserToFollowPublishingChannelSuccess
   */
  error: FailureResponseErrorReasonTypesStringOrInviteUserToFollowPublishingChannelFailedReasonError;
  /**
   *
   * @type {object}
   * @memberof EitherErrorReasonTypesStringOrInviteUserToFollowPublishingChannelFailedReasonInviteUserToFollowPublishingChannelSuccess
   */
  success: object;
}
