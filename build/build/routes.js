"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegisterRoutes = void 0;
/* tslint:disable */
/* eslint-disable */
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
const runtime_1 = require("@tsoa/runtime");
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
const authController_1 = require("./../src/controllers/auth/authController");
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
const postController_1 = require("./../src/controllers/postController");
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
const userPageController_1 = require("./../src/controllers/userPageController");
const inversionOfControl_1 = require("./../src/inversionOfControl");
const multer = require('multer');
const upload = multer();
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
const models = {
    "AuthFailureReason": {
        "dataType": "refEnum",
        "enums": ["Wrong Password", "Unknown Cause", "No Refresh Token Found", "Failed To Validate Token", "Failed To Generate Access Token", "You Must Be Logged In"],
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "FailedAuthResponse": {
        "dataType": "refObject",
        "properties": {
            "reason": { "ref": "AuthFailureReason", "required": true },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "SuccessfulAuthResponse": {
        "dataType": "refObject",
        "properties": {
            "accessToken": { "dataType": "string", "required": true },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "HTTPResponse_FailedAuthResponse.SuccessfulAuthResponse_": {
        "dataType": "refObject",
        "properties": {
            "error": { "ref": "FailedAuthResponse" },
            "success": { "ref": "SuccessfulAuthResponse" },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "RegisterUserParams": {
        "dataType": "refObject",
        "properties": {
            "email": { "dataType": "string", "required": true },
            "password": { "dataType": "string", "required": true },
            "username": { "dataType": "string", "required": true },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "LoginUserParams": {
        "dataType": "refObject",
        "properties": {
            "username": { "dataType": "string", "required": true },
            "password": { "dataType": "string", "required": true },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "DeniedPasswordResetResponseReason": {
        "dataType": "refEnum",
        "enums": ["Too Many Attempts"],
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "DeniedPasswordResetResponse": {
        "dataType": "refObject",
        "properties": {
            "reason": { "ref": "DeniedPasswordResetResponseReason", "required": true },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "SuccessfulPasswordResetResponse": {
        "dataType": "refObject",
        "properties": {},
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "HTTPResponse_DeniedPasswordResetResponse.SuccessfulPasswordResetResponse_": {
        "dataType": "refObject",
        "properties": {
            "error": { "ref": "DeniedPasswordResetResponse" },
            "success": { "ref": "SuccessfulPasswordResetResponse" },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "RequestPasswordResetParams": {
        "dataType": "refObject",
        "properties": {
            "email": { "dataType": "string", "required": true },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "FailedToCreatePostResponse": {
        "dataType": "refObject",
        "properties": {},
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "SuccessfulPostCreationResponse": {
        "dataType": "refObject",
        "properties": {},
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "HTTPResponse_FailedToCreatePostResponse.SuccessfulPostCreationResponse_": {
        "dataType": "refObject",
        "properties": {
            "error": { "ref": "FailedToCreatePostResponse" },
            "success": { "ref": "SuccessfulPostCreationResponse" },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "FailedToUpdateUserSettingsResponse": {
        "dataType": "refObject",
        "properties": {},
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "SuccessfulUpdateToUserSettingsResponse": {
        "dataType": "refObject",
        "properties": {},
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "HTTPResponse_FailedToUpdateUserSettingsResponse.SuccessfulUpdateToUserSettingsResponse_": {
        "dataType": "refObject",
        "properties": {
            "error": { "ref": "FailedToUpdateUserSettingsResponse" },
            "success": { "ref": "SuccessfulUpdateToUserSettingsResponse" },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "DefaultPostPrivacySetting": {
        "dataType": "refEnum",
        "enums": ["PublicAndGuestCheckout"],
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "SetUserSettingsParams": {
        "dataType": "refObject",
        "properties": {
            "username": { "dataType": "string", "required": true },
            "bio": { "dataType": "string", "required": true },
            "website": { "dataType": "string", "required": true },
            "profileVisibility": { "ref": "DefaultPostPrivacySetting", "required": true },
            "bannedUsernames": { "dataType": "array", "array": { "dataType": "string" }, "required": true },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "SecuredHTTPRequest_SetUserSettingsParams_": {
        "dataType": "refObject",
        "properties": {
            "accessToken": { "dataType": "string", "required": true },
            "data": { "ref": "SetUserSettingsParams", "required": true },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "DeniedGetUserPageResponseReason": {
        "dataType": "refEnum",
        "enums": ["Blocked"],
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "DeniedGetUserPageResponse": {
        "dataType": "refObject",
        "properties": {
            "reason": { "ref": "DeniedGetUserPageResponseReason", "required": true },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "DisplayedPost": {
        "dataType": "refObject",
        "properties": {
            "imageUrl": { "dataType": "string", "required": true },
            "creatorUsername": { "dataType": "string", "required": true },
            "creationTimestamp": { "dataType": "double", "required": true },
            "caption": { "dataType": "string", "required": true },
            "likes": { "dataType": "nestedObjectLiteral", "nestedProperties": { "count": { "dataType": "double", "required": true } }, "required": true },
            "comments": { "dataType": "nestedObjectLiteral", "nestedProperties": { "count": { "dataType": "double", "required": true } }, "required": true },
            "shares": { "dataType": "nestedObjectLiteral", "nestedProperties": { "count": { "dataType": "double", "required": true } }, "required": true },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "DisplayedShopItems": {
        "dataType": "refObject",
        "properties": {
            "title": { "dataType": "string", "required": true },
            "price": { "dataType": "double", "required": true },
            "description": { "dataType": "string", "required": true },
            "countSold": { "dataType": "double", "required": true },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "SuccessfulGetUserPageResponse": {
        "dataType": "refObject",
        "properties": {
            "username": { "dataType": "string", "required": true },
            "followers": { "dataType": "nestedObjectLiteral", "nestedProperties": { "count": { "dataType": "double", "required": true } }, "required": true },
            "subscribers": { "dataType": "nestedObjectLiteral", "nestedProperties": { "count": { "dataType": "double", "required": true } }, "required": true },
            "follows": { "dataType": "nestedObjectLiteral", "nestedProperties": { "count": { "dataType": "double", "required": true } }, "required": true },
            "bio": { "dataType": "string", "required": true },
            "posts": { "dataType": "array", "array": { "dataType": "refObject", "ref": "DisplayedPost" }, "required": true },
            "shopItems": { "dataType": "array", "array": { "dataType": "refObject", "ref": "DisplayedShopItems" }, "required": true },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "HTTPResponse_DeniedGetUserPageResponse.SuccessfulGetUserPageResponse_": {
        "dataType": "refObject",
        "properties": {
            "error": { "ref": "DeniedGetUserPageResponse" },
            "success": { "ref": "SuccessfulGetUserPageResponse" },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "GetUserPageParams": {
        "dataType": "refObject",
        "properties": {
            "username": { "dataType": "string", "required": true },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "SecuredHTTPRequest_GetUserPageParams_": {
        "dataType": "refObject",
        "properties": {
            "accessToken": { "dataType": "string", "required": true },
            "data": { "ref": "GetUserPageParams", "required": true },
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
};
const validationService = new runtime_1.ValidationService(models);
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
function RegisterRoutes(app) {
    // ###########################################################################################################
    //  NOTE: If you do not see routes for all of your controllers in this file, then you might not have informed tsoa of where to look
    //      Please look into the "controllerPathGlobs" config option described in the readme: https://github.com/lukeautry/tsoa
    // ###########################################################################################################
    app.post('/auth/register', function AuthController_registerUser(request, response, next) {
        const args = {
            requestBody: { "in": "body", "name": "requestBody", "required": true, "ref": "RegisterUserParams" },
        };
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request, response);
        }
        catch (err) {
            return next(err);
        }
        const container = typeof inversionOfControl_1.iocContainer === 'function' ? inversionOfControl_1.iocContainer(request) : inversionOfControl_1.iocContainer;
        const controller = container.get(authController_1.AuthController);
        if (typeof controller['setStatus'] === 'function') {
            controller.setStatus(undefined);
        }
        const promise = controller.registerUser.apply(controller, validatedArgs);
        promiseHandler(controller, promise, response, undefined, next);
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.post('/auth/login', function AuthController_loginUser(request, response, next) {
        const args = {
            requestBody: { "in": "body", "name": "requestBody", "required": true, "ref": "LoginUserParams" },
        };
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request, response);
        }
        catch (err) {
            return next(err);
        }
        const container = typeof inversionOfControl_1.iocContainer === 'function' ? inversionOfControl_1.iocContainer(request) : inversionOfControl_1.iocContainer;
        const controller = container.get(authController_1.AuthController);
        if (typeof controller['setStatus'] === 'function') {
            controller.setStatus(undefined);
        }
        const promise = controller.loginUser.apply(controller, validatedArgs);
        promiseHandler(controller, promise, response, undefined, next);
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.get('/auth/refresh-access-token', function AuthController_refreshAccessToken(request, response, next) {
        const args = {
            request: { "in": "request", "name": "request", "required": true, "dataType": "object" },
        };
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request, response);
        }
        catch (err) {
            return next(err);
        }
        const container = typeof inversionOfControl_1.iocContainer === 'function' ? inversionOfControl_1.iocContainer(request) : inversionOfControl_1.iocContainer;
        const controller = container.get(authController_1.AuthController);
        if (typeof controller['setStatus'] === 'function') {
            controller.setStatus(undefined);
        }
        const promise = controller.refreshAccessToken.apply(controller, validatedArgs);
        promiseHandler(controller, promise, response, undefined, next);
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.post('/auth/resetPassword', function AuthController_requestPasswordReset(request, response, next) {
        const args = {
            requestBody: { "in": "body", "name": "requestBody", "required": true, "ref": "RequestPasswordResetParams" },
        };
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request, response);
        }
        catch (err) {
            return next(err);
        }
        const container = typeof inversionOfControl_1.iocContainer === 'function' ? inversionOfControl_1.iocContainer(request) : inversionOfControl_1.iocContainer;
        const controller = container.get(authController_1.AuthController);
        if (typeof controller['setStatus'] === 'function') {
            controller.setStatus(undefined);
        }
        const promise = controller.requestPasswordReset.apply(controller, validatedArgs);
        promiseHandler(controller, promise, response, undefined, next);
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.get('/auth/logout', function AuthController_logout(request, response, next) {
        const args = {};
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request, response);
        }
        catch (err) {
            return next(err);
        }
        const container = typeof inversionOfControl_1.iocContainer === 'function' ? inversionOfControl_1.iocContainer(request) : inversionOfControl_1.iocContainer;
        const controller = container.get(authController_1.AuthController);
        if (typeof controller['setStatus'] === 'function') {
            controller.setStatus(undefined);
        }
        const promise = controller.logout.apply(controller, validatedArgs);
        promiseHandler(controller, promise, response, undefined, next);
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.post('/post/create', upload.single('file'), function PostController_createPost(request, response, next) {
        const args = {
            caption: { "in": "formData", "name": "caption", "required": true, "dataType": "string" },
            visibility: { "in": "formData", "name": "visibility", "required": true, "dataType": "string" },
            duration: { "in": "formData", "name": "duration", "required": true, "dataType": "string" },
            title: { "in": "formData", "name": "title", "required": true, "dataType": "string" },
            price: { "in": "formData", "name": "price", "required": true, "dataType": "string" },
            collaboratorUsernames: { "in": "formData", "name": "collaboratorUsernames", "required": true, "dataType": "string" },
            scheduledPublicationTimestamp: { "in": "formData", "name": "scheduledPublicationTimestamp", "required": true, "dataType": "string" },
            file: { "in": "formData", "name": "file", "required": true, "dataType": "file" },
        };
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request, response);
        }
        catch (err) {
            return next(err);
        }
        const container = typeof inversionOfControl_1.iocContainer === 'function' ? inversionOfControl_1.iocContainer(request) : inversionOfControl_1.iocContainer;
        const controller = container.get(postController_1.PostController);
        if (typeof controller['setStatus'] === 'function') {
            controller.setStatus(undefined);
        }
        const promise = controller.createPost.apply(controller, validatedArgs);
        promiseHandler(controller, promise, response, undefined, next);
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.post('/user/SetSettings', function UserPageController_setUserSettings(request, response, next) {
        const args = {
            requestBody: { "in": "body", "name": "requestBody", "required": true, "ref": "SecuredHTTPRequest_SetUserSettingsParams_" },
        };
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request, response);
        }
        catch (err) {
            return next(err);
        }
        const container = typeof inversionOfControl_1.iocContainer === 'function' ? inversionOfControl_1.iocContainer(request) : inversionOfControl_1.iocContainer;
        const controller = container.get(userPageController_1.UserPageController);
        if (typeof controller['setStatus'] === 'function') {
            controller.setStatus(undefined);
        }
        const promise = controller.setUserSettings.apply(controller, validatedArgs);
        promiseHandler(controller, promise, response, undefined, next);
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    app.post('/user/GetPosts', function UserPageController_getPostsPage(request, response, next) {
        const args = {
            requestBody: { "in": "body", "name": "requestBody", "required": true, "ref": "SecuredHTTPRequest_GetUserPageParams_" },
        };
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        let validatedArgs = [];
        try {
            validatedArgs = getValidatedArgs(args, request, response);
        }
        catch (err) {
            return next(err);
        }
        const container = typeof inversionOfControl_1.iocContainer === 'function' ? inversionOfControl_1.iocContainer(request) : inversionOfControl_1.iocContainer;
        const controller = container.get(userPageController_1.UserPageController);
        if (typeof controller['setStatus'] === 'function') {
            controller.setStatus(undefined);
        }
        const promise = controller.getPostsPage.apply(controller, validatedArgs);
        promiseHandler(controller, promise, response, undefined, next);
    });
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    function isController(object) {
        return 'getHeaders' in object && 'getStatus' in object && 'setStatus' in object;
    }
    function promiseHandler(controllerObj, promise, response, successStatus, next) {
        return Promise.resolve(promise)
            .then((data) => {
            let statusCode = successStatus;
            let headers;
            if (isController(controllerObj)) {
                headers = controllerObj.getHeaders();
                statusCode = controllerObj.getStatus() || statusCode;
            }
            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
            returnHandler(response, statusCode, data, headers);
        })
            .catch((error) => next(error));
    }
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    function returnHandler(response, statusCode, data, headers = {}) {
        if (response.headersSent) {
            return;
        }
        Object.keys(headers).forEach((name) => {
            response.set(name, headers[name]);
        });
        if (data && typeof data.pipe === 'function' && data.readable && typeof data._read === 'function') {
            data.pipe(response);
        }
        else if (data !== null && data !== undefined) {
            response.status(statusCode || 200).json(data);
        }
        else {
            response.status(statusCode || 204).end();
        }
    }
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    function responder(response) {
        return function (status, data, headers) {
            returnHandler(response, status, data, headers);
        };
    }
    ;
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    function getValidatedArgs(args, request, response) {
        const fieldErrors = {};
        const values = Object.keys(args).map((key) => {
            const name = args[key].name;
            switch (args[key].in) {
                case 'request':
                    return request;
                case 'query':
                    return validationService.ValidateParam(args[key], request.query[name], name, fieldErrors, undefined, { "noImplicitAdditionalProperties": "throw-on-extras" });
                case 'path':
                    return validationService.ValidateParam(args[key], request.params[name], name, fieldErrors, undefined, { "noImplicitAdditionalProperties": "throw-on-extras" });
                case 'header':
                    return validationService.ValidateParam(args[key], request.header(name), name, fieldErrors, undefined, { "noImplicitAdditionalProperties": "throw-on-extras" });
                case 'body':
                    return validationService.ValidateParam(args[key], request.body, name, fieldErrors, undefined, { "noImplicitAdditionalProperties": "throw-on-extras" });
                case 'body-prop':
                    return validationService.ValidateParam(args[key], request.body[name], name, fieldErrors, 'body.', { "noImplicitAdditionalProperties": "throw-on-extras" });
                case 'formData':
                    if (args[key].dataType === 'file') {
                        return validationService.ValidateParam(args[key], request.file, name, fieldErrors, undefined, { "noImplicitAdditionalProperties": "throw-on-extras" });
                    }
                    else if (args[key].dataType === 'array' && args[key].array.dataType === 'file') {
                        return validationService.ValidateParam(args[key], request.files, name, fieldErrors, undefined, { "noImplicitAdditionalProperties": "throw-on-extras" });
                    }
                    else {
                        return validationService.ValidateParam(args[key], request.body[name], name, fieldErrors, undefined, { "noImplicitAdditionalProperties": "throw-on-extras" });
                    }
                case 'res':
                    return responder(response);
            }
        });
        if (Object.keys(fieldErrors).length > 0) {
            throw new runtime_1.ValidateError(fieldErrors, '');
        }
        return values;
    }
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
}
exports.RegisterRoutes = RegisterRoutes;
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
