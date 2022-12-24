import express from "express";
import { Controller, FormField, Post, Request, Route, UploadedFile } from "tsoa";
import { injectable } from "tsyringe";
import { DatabaseService } from "../../services/databaseService";

import { BlobStorageService } from "../../services/blobStorageService";
import { ErrorReasonTypes, SecuredHTTPResponse } from "../../utilities/monads";
import {
  UploadFileFailedReason,
  UploadFileSuccess,
  handleUploadFile,
} from "./handleUploadFile";

@injectable()
@Route("file_upload")
export class FileUploadController extends Controller {
  constructor(
    public blobStorageService: BlobStorageService,
    public databaseService: DatabaseService,
  ) {
    super();
  }

  //////////////////////////////////////////////////
  // CREATE ////////////////////////////////////////
  //////////////////////////////////////////////////

  @Post("uploadFile")
  public async uploadFile(
    @Request() request: express.Request,
    @UploadedFile() mediaFile: Express.Multer.File,
    @FormField() mimeType: string,
  ): Promise<
    SecuredHTTPResponse<
      ErrorReasonTypes<string | UploadFileFailedReason>,
      UploadFileSuccess
    >
  > {
    return await handleUploadFile({
      controller: this,
      request,
      requestBody: {
        mediaFile,
        mimeType,
      },
    });
  }

  //////////////////////////////////////////////////
  // READ //////////////////////////////////////////
  //////////////////////////////////////////////////

  //////////////////////////////////////////////////
  // UPDATE ////////////////////////////////////////
  //////////////////////////////////////////////////

  //////////////////////////////////////////////////
  // DELETE ////////////////////////////////////////
  //////////////////////////////////////////////////
}
