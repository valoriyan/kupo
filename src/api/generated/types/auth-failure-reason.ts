/* tslint:disable */
/* eslint-disable */
/**
 * playhouse-backend-2
 * No description provided (generated by Openapi Generator https://github.com/openapitools/openapi-generator)
 *
 * The version of the OpenAPI document: 1.0.0
 *
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

/**
 *
 * @export
 * @enum {string}
 */
export enum AuthFailureReason {
  WrongPassword = "Wrong Password",
  UnknownCause = "Unknown Cause",
  NoRefreshTokenFound = "No Refresh Token Found",
  FailedToValidateToken = "Failed To Validate Token",
  FailedToGenerateAccessToken = "Failed To Generate Access Token",
}
