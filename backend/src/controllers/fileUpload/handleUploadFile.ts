import express from "express";
import { FileUploadController } from "./fileUploadController";
import {
  EitherType,
  ErrorReasonTypes,
  SecuredHTTPResponse,
  Success,
} from "../../utilities/monads";
import { checkAuthorization } from "../auth/utilities";
import { checkValidityOfMediaFile } from "./utilities/checkValidityOfMediaFile";
import { uploadMediaFile } from "./utilities/uploadMediaFile";

export enum UploadFileFailedReason {
  UnknownCause = "Unknown Cause",
}

export interface UploadFileSuccess {
  blobFileKey: string;
}

export interface UploadFileRequestBody {
  mediaFile: Express.Multer.File;
  mimeType: string;
}

export async function handleUploadFile({
  controller,
  request,
  requestBody,
}: {
  controller: FileUploadController;
  request: express.Request;
  requestBody: UploadFileRequestBody;
}): Promise<
  SecuredHTTPResponse<
    ErrorReasonTypes<string | UploadFileFailedReason>,
    UploadFileSuccess
  >
> {
  //////////////////////////////////////////////////
  // Inputs & Authentication
  //////////////////////////////////////////////////
  const { mediaFile, mimeType } = requestBody;

  const { errorResponse: error } = await checkAuthorization(controller, request);
  if (error) return error;

  //////////////////////////////////////////////////
  // Check Validity of File for Upload
  //////////////////////////////////////////////////

  const checkValidityOfMediaFileResponse = await checkValidityOfMediaFile({
    controller,
    file: mediaFile,
  });

  if (checkValidityOfMediaFileResponse.type === EitherType.failure) {
    return checkValidityOfMediaFileResponse;
  }

  //////////////////////////////////////////////////
  // Upload File
  //////////////////////////////////////////////////

  const uploadMediaFileResponse = await uploadMediaFile({
    controller,
    file: mediaFile,
    mimeType,
    blobStorageService: controller.blobStorageService,
  });

  if (uploadMediaFileResponse.type === EitherType.failure) {
    return uploadMediaFileResponse;
  }

  const {
    success: { blobFileKey },
  } = uploadMediaFileResponse;

  //////////////////////////////////////////////////
  // Return
  //////////////////////////////////////////////////

  return Success({
    blobFileKey,
  });
}
