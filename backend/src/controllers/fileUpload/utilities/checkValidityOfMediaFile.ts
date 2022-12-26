import {
  ErrorReasonTypes,
  Failure,
  InternalServiceResponse,
  Success,
} from "../../../utilities/monads";
import { Controller } from "tsoa";

export enum InvalidMediaFileReason {
  FileSizeTooLarge = "File Is Too Large",
  UnacceptedFileType = "File Type Not Accepted",
}

const MAX_VIDEO_SIZE_IN_MB = 20; // 20 MB maximum

export async function checkValidityOfMediaFile({
  controller,
  file,
}: {
  controller: Controller;
  file: Express.Multer.File;
}): Promise<
  // eslint-disable-next-line @typescript-eslint/ban-types
  InternalServiceResponse<ErrorReasonTypes<string | InvalidMediaFileReason>, {}>
> {
  const { mimetype, buffer } = file;

  const permittedImageTypes = ["image/jpeg", "image/png", "image/gif"];

  const permittedVideoTypes = ["video/mp4"];

  const permittedMimeTypes = [...permittedImageTypes, ...permittedVideoTypes];

  if (!permittedMimeTypes.includes(mimetype)) {
    return Failure({
      controller,
      httpStatusCode: 400,
      reason: InvalidMediaFileReason.UnacceptedFileType,
      error: "Unhandled error at checkValidityOfMediaFiles",
      additionalErrorInformation: `Cannot handle file of type ${mimetype}.`,
    });
  }

  if (mimetype === "image/gif") {
    // Enforce max size for gifs
    const bufferSizeInMb = buffer.byteLength / 1024 / 1024;
    if (bufferSizeInMb > MAX_VIDEO_SIZE_IN_MB) {
      return Failure({
        controller,
        httpStatusCode: 400,
        reason: InvalidMediaFileReason.FileSizeTooLarge,
        error: "Unhandled error at checkValidityOfMediaFiles",
        additionalErrorInformation: `File exceeded maximum size of ${MAX_VIDEO_SIZE_IN_MB} MB.`,
      });
    }
  } else if (permittedImageTypes.includes(mimetype)) {
    // TODO: ADD IMAGE VALIDATION
  } else if (permittedVideoTypes.includes(mimetype)) {
    // Limit video size until we implement proper video compression and streaming
    const bufferSizeInMb = buffer.byteLength / 1024 / 1024;
    if (bufferSizeInMb > MAX_VIDEO_SIZE_IN_MB) {
      return Failure({
        controller,
        httpStatusCode: 400,
        reason: InvalidMediaFileReason.FileSizeTooLarge,
        error: "Unhandled error at checkValidityOfMediaFiles",
        additionalErrorInformation: `File exceeded maximum size of ${MAX_VIDEO_SIZE_IN_MB} MB.`,
      });
    }
  }
  return Success({});
}
