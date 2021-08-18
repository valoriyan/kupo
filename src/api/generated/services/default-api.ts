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

import globalAxios, { AxiosPromise, AxiosInstance } from "axios";
import { Configuration } from "../configuration";
// Some imports not used depending on template conditions
// @ts-ignore
import {
  DUMMY_BASE_URL,
  assertParamExists,
  setApiKeyToObject,
  setBasicAuthToObject,
  setBearerAuthToObject,
  setOAuthToObject,
  setSearchParams,
  serializeDataIfNeeded,
  toPathString,
  createRequestFunction,
} from "../common";
// @ts-ignore
import {
  BASE_PATH,
  COLLECTION_FORMATS,
  RequestArgs,
  BaseAPI,
  RequiredError,
} from "../base";
// @ts-ignore
import { HTTPResponseDeniedGetUserPageResponseSuccessfulGetUserPageResponse } from "../types";
// @ts-ignore
import { HTTPResponseDeniedPasswordResetResponseSuccessfulPasswordResetResponse } from "../types";
// @ts-ignore
import { HTTPResponseFailedAuthResponseSuccessfulAuthResponse } from "../types";
// @ts-ignore
import { HTTPResponseFailedToCreatePostResponseSuccessfulPostCreationResponse } from "../types";
// @ts-ignore
import { HTTPResponseFailedToUpdateUserSettingsResponseSuccessfulUpdateToUserSettingsResponse } from "../types";
// @ts-ignore
import { LoginUserParams } from "../types";
// @ts-ignore
import { RegisterUserParams } from "../types";
// @ts-ignore
import { RequestPasswordResetParams } from "../types";
// @ts-ignore
import { SecuredHTTPRequestGetUserPageParams } from "../types";
// @ts-ignore
import { SecuredHTTPRequestSetUserSettingsParams } from "../types";
/**
 * DefaultApi - axios parameter creator
 * @export
 */
export const DefaultApiAxiosParamCreator = function (configuration?: Configuration) {
  return {
    /**
     *
     * @param {string} imageId
     * @param {string} caption
     * @param {string} visibility
     * @param {string} duration
     * @param {string} title
     * @param {string} price
     * @param {string} collaboratorUsernames
     * @param {string} scheduledPublicationTimestamp
     * @param {any} file
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    createPost: async (
      imageId: string,
      caption: string,
      visibility: string,
      duration: string,
      title: string,
      price: string,
      collaboratorUsernames: string,
      scheduledPublicationTimestamp: string,
      file: any,
      options: any = {},
    ): Promise<RequestArgs> => {
      // verify required parameter 'imageId' is not null or undefined
      assertParamExists("createPost", "imageId", imageId);
      // verify required parameter 'caption' is not null or undefined
      assertParamExists("createPost", "caption", caption);
      // verify required parameter 'visibility' is not null or undefined
      assertParamExists("createPost", "visibility", visibility);
      // verify required parameter 'duration' is not null or undefined
      assertParamExists("createPost", "duration", duration);
      // verify required parameter 'title' is not null or undefined
      assertParamExists("createPost", "title", title);
      // verify required parameter 'price' is not null or undefined
      assertParamExists("createPost", "price", price);
      // verify required parameter 'collaboratorUsernames' is not null or undefined
      assertParamExists("createPost", "collaboratorUsernames", collaboratorUsernames);
      // verify required parameter 'scheduledPublicationTimestamp' is not null or undefined
      assertParamExists(
        "createPost",
        "scheduledPublicationTimestamp",
        scheduledPublicationTimestamp,
      );
      // verify required parameter 'file' is not null or undefined
      assertParamExists("createPost", "file", file);
      const localVarPath = `/post/create`;
      // use dummy base URL string because the URL constructor only accepts absolute URLs.
      const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
      let baseOptions;
      if (configuration) {
        baseOptions = configuration.baseOptions;
      }

      const localVarRequestOptions = { method: "POST", ...baseOptions, ...options };
      const localVarHeaderParameter = {} as any;
      const localVarQueryParameter = {} as any;
      const localVarFormParams = new ((configuration && configuration.formDataCtor) ||
        FormData)();

      if (imageId !== undefined) {
        localVarFormParams.append("imageId", imageId as any);
      }

      if (caption !== undefined) {
        localVarFormParams.append("caption", caption as any);
      }

      if (visibility !== undefined) {
        localVarFormParams.append("visibility", visibility as any);
      }

      if (duration !== undefined) {
        localVarFormParams.append("duration", duration as any);
      }

      if (title !== undefined) {
        localVarFormParams.append("title", title as any);
      }

      if (price !== undefined) {
        localVarFormParams.append("price", price as any);
      }

      if (collaboratorUsernames !== undefined) {
        localVarFormParams.append("collaboratorUsernames", collaboratorUsernames as any);
      }

      if (scheduledPublicationTimestamp !== undefined) {
        localVarFormParams.append(
          "scheduledPublicationTimestamp",
          scheduledPublicationTimestamp as any,
        );
      }

      if (file !== undefined) {
        localVarFormParams.append("file", file as any);
      }

      localVarHeaderParameter["Content-Type"] = "multipart/form-data";

      setSearchParams(localVarUrlObj, localVarQueryParameter, options.query);
      let headersFromBaseOptions =
        baseOptions && baseOptions.headers ? baseOptions.headers : {};
      localVarRequestOptions.headers = {
        ...localVarHeaderParameter,
        ...headersFromBaseOptions,
        ...options.headers,
      };
      localVarRequestOptions.data = localVarFormParams;

      return {
        url: toPathString(localVarUrlObj),
        options: localVarRequestOptions,
      };
    },
    /**
     *
     * @param {SecuredHTTPRequestGetUserPageParams} securedHTTPRequestGetUserPageParams
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    getPostsPage: async (
      securedHTTPRequestGetUserPageParams: SecuredHTTPRequestGetUserPageParams,
      options: any = {},
    ): Promise<RequestArgs> => {
      // verify required parameter 'securedHTTPRequestGetUserPageParams' is not null or undefined
      assertParamExists(
        "getPostsPage",
        "securedHTTPRequestGetUserPageParams",
        securedHTTPRequestGetUserPageParams,
      );
      const localVarPath = `/user/GetPosts`;
      // use dummy base URL string because the URL constructor only accepts absolute URLs.
      const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
      let baseOptions;
      if (configuration) {
        baseOptions = configuration.baseOptions;
      }

      const localVarRequestOptions = { method: "POST", ...baseOptions, ...options };
      const localVarHeaderParameter = {} as any;
      const localVarQueryParameter = {} as any;

      localVarHeaderParameter["Content-Type"] = "application/json";

      setSearchParams(localVarUrlObj, localVarQueryParameter, options.query);
      let headersFromBaseOptions =
        baseOptions && baseOptions.headers ? baseOptions.headers : {};
      localVarRequestOptions.headers = {
        ...localVarHeaderParameter,
        ...headersFromBaseOptions,
        ...options.headers,
      };
      localVarRequestOptions.data = serializeDataIfNeeded(
        securedHTTPRequestGetUserPageParams,
        localVarRequestOptions,
        configuration,
      );

      return {
        url: toPathString(localVarUrlObj),
        options: localVarRequestOptions,
      };
    },
    /**
     *
     * @param {LoginUserParams} loginUserParams
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    loginUser: async (
      loginUserParams: LoginUserParams,
      options: any = {},
    ): Promise<RequestArgs> => {
      // verify required parameter 'loginUserParams' is not null or undefined
      assertParamExists("loginUser", "loginUserParams", loginUserParams);
      const localVarPath = `/auth/login`;
      // use dummy base URL string because the URL constructor only accepts absolute URLs.
      const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
      let baseOptions;
      if (configuration) {
        baseOptions = configuration.baseOptions;
      }

      const localVarRequestOptions = { method: "POST", ...baseOptions, ...options };
      const localVarHeaderParameter = {} as any;
      const localVarQueryParameter = {} as any;

      localVarHeaderParameter["Content-Type"] = "application/json";

      setSearchParams(localVarUrlObj, localVarQueryParameter, options.query);
      let headersFromBaseOptions =
        baseOptions && baseOptions.headers ? baseOptions.headers : {};
      localVarRequestOptions.headers = {
        ...localVarHeaderParameter,
        ...headersFromBaseOptions,
        ...options.headers,
      };
      localVarRequestOptions.data = serializeDataIfNeeded(
        loginUserParams,
        localVarRequestOptions,
        configuration,
      );

      return {
        url: toPathString(localVarUrlObj),
        options: localVarRequestOptions,
      };
    },
    /**
     *
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    logout: async (options: any = {}): Promise<RequestArgs> => {
      const localVarPath = `/auth/logout`;
      // use dummy base URL string because the URL constructor only accepts absolute URLs.
      const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
      let baseOptions;
      if (configuration) {
        baseOptions = configuration.baseOptions;
      }

      const localVarRequestOptions = { method: "GET", ...baseOptions, ...options };
      const localVarHeaderParameter = {} as any;
      const localVarQueryParameter = {} as any;

      setSearchParams(localVarUrlObj, localVarQueryParameter, options.query);
      let headersFromBaseOptions =
        baseOptions && baseOptions.headers ? baseOptions.headers : {};
      localVarRequestOptions.headers = {
        ...localVarHeaderParameter,
        ...headersFromBaseOptions,
        ...options.headers,
      };

      return {
        url: toPathString(localVarUrlObj),
        options: localVarRequestOptions,
      };
    },
    /**
     *
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    refreshAccessToken: async (options: any = {}): Promise<RequestArgs> => {
      const localVarPath = `/auth/refresh-access-token`;
      // use dummy base URL string because the URL constructor only accepts absolute URLs.
      const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
      let baseOptions;
      if (configuration) {
        baseOptions = configuration.baseOptions;
      }

      const localVarRequestOptions = { method: "GET", ...baseOptions, ...options };
      const localVarHeaderParameter = {} as any;
      const localVarQueryParameter = {} as any;

      setSearchParams(localVarUrlObj, localVarQueryParameter, options.query);
      let headersFromBaseOptions =
        baseOptions && baseOptions.headers ? baseOptions.headers : {};
      localVarRequestOptions.headers = {
        ...localVarHeaderParameter,
        ...headersFromBaseOptions,
        ...options.headers,
      };

      return {
        url: toPathString(localVarUrlObj),
        options: localVarRequestOptions,
      };
    },
    /**
     *
     * @param {RegisterUserParams} registerUserParams
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    registerUser: async (
      registerUserParams: RegisterUserParams,
      options: any = {},
    ): Promise<RequestArgs> => {
      // verify required parameter 'registerUserParams' is not null or undefined
      assertParamExists("registerUser", "registerUserParams", registerUserParams);
      const localVarPath = `/auth/register`;
      // use dummy base URL string because the URL constructor only accepts absolute URLs.
      const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
      let baseOptions;
      if (configuration) {
        baseOptions = configuration.baseOptions;
      }

      const localVarRequestOptions = { method: "POST", ...baseOptions, ...options };
      const localVarHeaderParameter = {} as any;
      const localVarQueryParameter = {} as any;

      localVarHeaderParameter["Content-Type"] = "application/json";

      setSearchParams(localVarUrlObj, localVarQueryParameter, options.query);
      let headersFromBaseOptions =
        baseOptions && baseOptions.headers ? baseOptions.headers : {};
      localVarRequestOptions.headers = {
        ...localVarHeaderParameter,
        ...headersFromBaseOptions,
        ...options.headers,
      };
      localVarRequestOptions.data = serializeDataIfNeeded(
        registerUserParams,
        localVarRequestOptions,
        configuration,
      );

      return {
        url: toPathString(localVarUrlObj),
        options: localVarRequestOptions,
      };
    },
    /**
     *
     * @param {RequestPasswordResetParams} requestPasswordResetParams
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    requestPasswordReset: async (
      requestPasswordResetParams: RequestPasswordResetParams,
      options: any = {},
    ): Promise<RequestArgs> => {
      // verify required parameter 'requestPasswordResetParams' is not null or undefined
      assertParamExists(
        "requestPasswordReset",
        "requestPasswordResetParams",
        requestPasswordResetParams,
      );
      const localVarPath = `/auth/resetPassword`;
      // use dummy base URL string because the URL constructor only accepts absolute URLs.
      const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
      let baseOptions;
      if (configuration) {
        baseOptions = configuration.baseOptions;
      }

      const localVarRequestOptions = { method: "POST", ...baseOptions, ...options };
      const localVarHeaderParameter = {} as any;
      const localVarQueryParameter = {} as any;

      localVarHeaderParameter["Content-Type"] = "application/json";

      setSearchParams(localVarUrlObj, localVarQueryParameter, options.query);
      let headersFromBaseOptions =
        baseOptions && baseOptions.headers ? baseOptions.headers : {};
      localVarRequestOptions.headers = {
        ...localVarHeaderParameter,
        ...headersFromBaseOptions,
        ...options.headers,
      };
      localVarRequestOptions.data = serializeDataIfNeeded(
        requestPasswordResetParams,
        localVarRequestOptions,
        configuration,
      );

      return {
        url: toPathString(localVarUrlObj),
        options: localVarRequestOptions,
      };
    },
    /**
     *
     * @param {SecuredHTTPRequestSetUserSettingsParams} securedHTTPRequestSetUserSettingsParams
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    setUserSettings: async (
      securedHTTPRequestSetUserSettingsParams: SecuredHTTPRequestSetUserSettingsParams,
      options: any = {},
    ): Promise<RequestArgs> => {
      // verify required parameter 'securedHTTPRequestSetUserSettingsParams' is not null or undefined
      assertParamExists(
        "setUserSettings",
        "securedHTTPRequestSetUserSettingsParams",
        securedHTTPRequestSetUserSettingsParams,
      );
      const localVarPath = `/user/SetSettings`;
      // use dummy base URL string because the URL constructor only accepts absolute URLs.
      const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
      let baseOptions;
      if (configuration) {
        baseOptions = configuration.baseOptions;
      }

      const localVarRequestOptions = { method: "POST", ...baseOptions, ...options };
      const localVarHeaderParameter = {} as any;
      const localVarQueryParameter = {} as any;

      localVarHeaderParameter["Content-Type"] = "application/json";

      setSearchParams(localVarUrlObj, localVarQueryParameter, options.query);
      let headersFromBaseOptions =
        baseOptions && baseOptions.headers ? baseOptions.headers : {};
      localVarRequestOptions.headers = {
        ...localVarHeaderParameter,
        ...headersFromBaseOptions,
        ...options.headers,
      };
      localVarRequestOptions.data = serializeDataIfNeeded(
        securedHTTPRequestSetUserSettingsParams,
        localVarRequestOptions,
        configuration,
      );

      return {
        url: toPathString(localVarUrlObj),
        options: localVarRequestOptions,
      };
    },
  };
};

/**
 * DefaultApi - functional programming interface
 * @export
 */
export const DefaultApiFp = function (configuration?: Configuration) {
  const localVarAxiosParamCreator = DefaultApiAxiosParamCreator(configuration);
  return {
    /**
     *
     * @param {string} imageId
     * @param {string} caption
     * @param {string} visibility
     * @param {string} duration
     * @param {string} title
     * @param {string} price
     * @param {string} collaboratorUsernames
     * @param {string} scheduledPublicationTimestamp
     * @param {any} file
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    async createPost(
      imageId: string,
      caption: string,
      visibility: string,
      duration: string,
      title: string,
      price: string,
      collaboratorUsernames: string,
      scheduledPublicationTimestamp: string,
      file: any,
      options?: any,
    ): Promise<
      (
        axios?: AxiosInstance,
        basePath?: string,
      ) => AxiosPromise<HTTPResponseFailedToCreatePostResponseSuccessfulPostCreationResponse>
    > {
      const localVarAxiosArgs = await localVarAxiosParamCreator.createPost(
        imageId,
        caption,
        visibility,
        duration,
        title,
        price,
        collaboratorUsernames,
        scheduledPublicationTimestamp,
        file,
        options,
      );
      return createRequestFunction(
        localVarAxiosArgs,
        globalAxios,
        BASE_PATH,
        configuration,
      );
    },
    /**
     *
     * @param {SecuredHTTPRequestGetUserPageParams} securedHTTPRequestGetUserPageParams
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    async getPostsPage(
      securedHTTPRequestGetUserPageParams: SecuredHTTPRequestGetUserPageParams,
      options?: any,
    ): Promise<
      (
        axios?: AxiosInstance,
        basePath?: string,
      ) => AxiosPromise<HTTPResponseDeniedGetUserPageResponseSuccessfulGetUserPageResponse>
    > {
      const localVarAxiosArgs = await localVarAxiosParamCreator.getPostsPage(
        securedHTTPRequestGetUserPageParams,
        options,
      );
      return createRequestFunction(
        localVarAxiosArgs,
        globalAxios,
        BASE_PATH,
        configuration,
      );
    },
    /**
     *
     * @param {LoginUserParams} loginUserParams
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    async loginUser(
      loginUserParams: LoginUserParams,
      options?: any,
    ): Promise<
      (
        axios?: AxiosInstance,
        basePath?: string,
      ) => AxiosPromise<HTTPResponseFailedAuthResponseSuccessfulAuthResponse>
    > {
      const localVarAxiosArgs = await localVarAxiosParamCreator.loginUser(
        loginUserParams,
        options,
      );
      return createRequestFunction(
        localVarAxiosArgs,
        globalAxios,
        BASE_PATH,
        configuration,
      );
    },
    /**
     *
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    async logout(
      options?: any,
    ): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<void>> {
      const localVarAxiosArgs = await localVarAxiosParamCreator.logout(options);
      return createRequestFunction(
        localVarAxiosArgs,
        globalAxios,
        BASE_PATH,
        configuration,
      );
    },
    /**
     *
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    async refreshAccessToken(
      options?: any,
    ): Promise<
      (
        axios?: AxiosInstance,
        basePath?: string,
      ) => AxiosPromise<HTTPResponseFailedAuthResponseSuccessfulAuthResponse>
    > {
      const localVarAxiosArgs = await localVarAxiosParamCreator.refreshAccessToken(
        options,
      );
      return createRequestFunction(
        localVarAxiosArgs,
        globalAxios,
        BASE_PATH,
        configuration,
      );
    },
    /**
     *
     * @param {RegisterUserParams} registerUserParams
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    async registerUser(
      registerUserParams: RegisterUserParams,
      options?: any,
    ): Promise<
      (
        axios?: AxiosInstance,
        basePath?: string,
      ) => AxiosPromise<HTTPResponseFailedAuthResponseSuccessfulAuthResponse>
    > {
      const localVarAxiosArgs = await localVarAxiosParamCreator.registerUser(
        registerUserParams,
        options,
      );
      return createRequestFunction(
        localVarAxiosArgs,
        globalAxios,
        BASE_PATH,
        configuration,
      );
    },
    /**
     *
     * @param {RequestPasswordResetParams} requestPasswordResetParams
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    async requestPasswordReset(
      requestPasswordResetParams: RequestPasswordResetParams,
      options?: any,
    ): Promise<
      (
        axios?: AxiosInstance,
        basePath?: string,
      ) => AxiosPromise<HTTPResponseDeniedPasswordResetResponseSuccessfulPasswordResetResponse>
    > {
      const localVarAxiosArgs = await localVarAxiosParamCreator.requestPasswordReset(
        requestPasswordResetParams,
        options,
      );
      return createRequestFunction(
        localVarAxiosArgs,
        globalAxios,
        BASE_PATH,
        configuration,
      );
    },
    /**
     *
     * @param {SecuredHTTPRequestSetUserSettingsParams} securedHTTPRequestSetUserSettingsParams
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    async setUserSettings(
      securedHTTPRequestSetUserSettingsParams: SecuredHTTPRequestSetUserSettingsParams,
      options?: any,
    ): Promise<
      (
        axios?: AxiosInstance,
        basePath?: string,
      ) => AxiosPromise<HTTPResponseFailedToUpdateUserSettingsResponseSuccessfulUpdateToUserSettingsResponse>
    > {
      const localVarAxiosArgs = await localVarAxiosParamCreator.setUserSettings(
        securedHTTPRequestSetUserSettingsParams,
        options,
      );
      return createRequestFunction(
        localVarAxiosArgs,
        globalAxios,
        BASE_PATH,
        configuration,
      );
    },
  };
};

/**
 * DefaultApi - factory interface
 * @export
 */
export const DefaultApiFactory = function (
  configuration?: Configuration,
  basePath?: string,
  axios?: AxiosInstance,
) {
  const localVarFp = DefaultApiFp(configuration);
  return {
    /**
     *
     * @param {string} imageId
     * @param {string} caption
     * @param {string} visibility
     * @param {string} duration
     * @param {string} title
     * @param {string} price
     * @param {string} collaboratorUsernames
     * @param {string} scheduledPublicationTimestamp
     * @param {any} file
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    createPost(
      imageId: string,
      caption: string,
      visibility: string,
      duration: string,
      title: string,
      price: string,
      collaboratorUsernames: string,
      scheduledPublicationTimestamp: string,
      file: any,
      options?: any,
    ): AxiosPromise<HTTPResponseFailedToCreatePostResponseSuccessfulPostCreationResponse> {
      return localVarFp
        .createPost(
          imageId,
          caption,
          visibility,
          duration,
          title,
          price,
          collaboratorUsernames,
          scheduledPublicationTimestamp,
          file,
          options,
        )
        .then((request) => request(axios, basePath));
    },
    /**
     *
     * @param {SecuredHTTPRequestGetUserPageParams} securedHTTPRequestGetUserPageParams
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    getPostsPage(
      securedHTTPRequestGetUserPageParams: SecuredHTTPRequestGetUserPageParams,
      options?: any,
    ): AxiosPromise<HTTPResponseDeniedGetUserPageResponseSuccessfulGetUserPageResponse> {
      return localVarFp
        .getPostsPage(securedHTTPRequestGetUserPageParams, options)
        .then((request) => request(axios, basePath));
    },
    /**
     *
     * @param {LoginUserParams} loginUserParams
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    loginUser(
      loginUserParams: LoginUserParams,
      options?: any,
    ): AxiosPromise<HTTPResponseFailedAuthResponseSuccessfulAuthResponse> {
      return localVarFp
        .loginUser(loginUserParams, options)
        .then((request) => request(axios, basePath));
    },
    /**
     *
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    logout(options?: any): AxiosPromise<void> {
      return localVarFp.logout(options).then((request) => request(axios, basePath));
    },
    /**
     *
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    refreshAccessToken(
      options?: any,
    ): AxiosPromise<HTTPResponseFailedAuthResponseSuccessfulAuthResponse> {
      return localVarFp
        .refreshAccessToken(options)
        .then((request) => request(axios, basePath));
    },
    /**
     *
     * @param {RegisterUserParams} registerUserParams
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    registerUser(
      registerUserParams: RegisterUserParams,
      options?: any,
    ): AxiosPromise<HTTPResponseFailedAuthResponseSuccessfulAuthResponse> {
      return localVarFp
        .registerUser(registerUserParams, options)
        .then((request) => request(axios, basePath));
    },
    /**
     *
     * @param {RequestPasswordResetParams} requestPasswordResetParams
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    requestPasswordReset(
      requestPasswordResetParams: RequestPasswordResetParams,
      options?: any,
    ): AxiosPromise<HTTPResponseDeniedPasswordResetResponseSuccessfulPasswordResetResponse> {
      return localVarFp
        .requestPasswordReset(requestPasswordResetParams, options)
        .then((request) => request(axios, basePath));
    },
    /**
     *
     * @param {SecuredHTTPRequestSetUserSettingsParams} securedHTTPRequestSetUserSettingsParams
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    setUserSettings(
      securedHTTPRequestSetUserSettingsParams: SecuredHTTPRequestSetUserSettingsParams,
      options?: any,
    ): AxiosPromise<HTTPResponseFailedToUpdateUserSettingsResponseSuccessfulUpdateToUserSettingsResponse> {
      return localVarFp
        .setUserSettings(securedHTTPRequestSetUserSettingsParams, options)
        .then((request) => request(axios, basePath));
    },
  };
};

/**
 * DefaultApi - object-oriented interface
 * @export
 * @class DefaultApi
 * @extends {BaseAPI}
 */
export class DefaultApi extends BaseAPI {
  /**
   *
   * @param {string} imageId
   * @param {string} caption
   * @param {string} visibility
   * @param {string} duration
   * @param {string} title
   * @param {string} price
   * @param {string} collaboratorUsernames
   * @param {string} scheduledPublicationTimestamp
   * @param {any} file
   * @param {*} [options] Override http request option.
   * @throws {RequiredError}
   * @memberof DefaultApi
   */
  public createPost(
    imageId: string,
    caption: string,
    visibility: string,
    duration: string,
    title: string,
    price: string,
    collaboratorUsernames: string,
    scheduledPublicationTimestamp: string,
    file: any,
    options?: any,
  ) {
    return DefaultApiFp(this.configuration)
      .createPost(
        imageId,
        caption,
        visibility,
        duration,
        title,
        price,
        collaboratorUsernames,
        scheduledPublicationTimestamp,
        file,
        options,
      )
      .then((request) => request(this.axios, this.basePath));
  }

  /**
   *
   * @param {SecuredHTTPRequestGetUserPageParams} securedHTTPRequestGetUserPageParams
   * @param {*} [options] Override http request option.
   * @throws {RequiredError}
   * @memberof DefaultApi
   */
  public getPostsPage(
    securedHTTPRequestGetUserPageParams: SecuredHTTPRequestGetUserPageParams,
    options?: any,
  ) {
    return DefaultApiFp(this.configuration)
      .getPostsPage(securedHTTPRequestGetUserPageParams, options)
      .then((request) => request(this.axios, this.basePath));
  }

  /**
   *
   * @param {LoginUserParams} loginUserParams
   * @param {*} [options] Override http request option.
   * @throws {RequiredError}
   * @memberof DefaultApi
   */
  public loginUser(loginUserParams: LoginUserParams, options?: any) {
    return DefaultApiFp(this.configuration)
      .loginUser(loginUserParams, options)
      .then((request) => request(this.axios, this.basePath));
  }

  /**
   *
   * @param {*} [options] Override http request option.
   * @throws {RequiredError}
   * @memberof DefaultApi
   */
  public logout(options?: any) {
    return DefaultApiFp(this.configuration)
      .logout(options)
      .then((request) => request(this.axios, this.basePath));
  }

  /**
   *
   * @param {*} [options] Override http request option.
   * @throws {RequiredError}
   * @memberof DefaultApi
   */
  public refreshAccessToken(options?: any) {
    return DefaultApiFp(this.configuration)
      .refreshAccessToken(options)
      .then((request) => request(this.axios, this.basePath));
  }

  /**
   *
   * @param {RegisterUserParams} registerUserParams
   * @param {*} [options] Override http request option.
   * @throws {RequiredError}
   * @memberof DefaultApi
   */
  public registerUser(registerUserParams: RegisterUserParams, options?: any) {
    return DefaultApiFp(this.configuration)
      .registerUser(registerUserParams, options)
      .then((request) => request(this.axios, this.basePath));
  }

  /**
   *
   * @param {RequestPasswordResetParams} requestPasswordResetParams
   * @param {*} [options] Override http request option.
   * @throws {RequiredError}
   * @memberof DefaultApi
   */
  public requestPasswordReset(
    requestPasswordResetParams: RequestPasswordResetParams,
    options?: any,
  ) {
    return DefaultApiFp(this.configuration)
      .requestPasswordReset(requestPasswordResetParams, options)
      .then((request) => request(this.axios, this.basePath));
  }

  /**
   *
   * @param {SecuredHTTPRequestSetUserSettingsParams} securedHTTPRequestSetUserSettingsParams
   * @param {*} [options] Override http request option.
   * @throws {RequiredError}
   * @memberof DefaultApi
   */
  public setUserSettings(
    securedHTTPRequestSetUserSettingsParams: SecuredHTTPRequestSetUserSettingsParams,
    options?: any,
  ) {
    return DefaultApiFp(this.configuration)
      .setUserSettings(securedHTTPRequestSetUserSettingsParams, options)
      .then((request) => request(this.axios, this.basePath));
  }
}
