import getVideoDurationInSeconds from "get-video-duration";
import { createReadStream } from "streamifier";
import {
  ErrorReasonTypes,
  Failure,
  InternalServiceResponse,
  Success,
} from "../../../utilities/monads";
import { Controller } from "tsoa";

export enum InvalidMediaFileReason {
  VideoLengthTooLong = "Video Length Is Too Long",
  UnacceptedFileType = "File Type Not Accepted",
}

const FOUR_MINUTES_IN_SECONDS = 4 * 60;

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

  const permittedImageTypes = ["image/jpeg", "image/png"];

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

  if (permittedImageTypes.includes(mimetype)) {
    // TODO: ADD IMAGE VALIDATION
  } else if (permittedVideoTypes.includes(mimetype)) {
    // TODO: ADD VIDEO VALIDATION
    const videoStream = createReadStream(buffer);

    const videoDurationInSeconds = await getVideoDurationInSeconds(videoStream);

    if (videoDurationInSeconds > FOUR_MINUTES_IN_SECONDS) {
      return Failure({
        controller,
        httpStatusCode: 400,
        reason: InvalidMediaFileReason.VideoLengthTooLong,
        error: "Unhandled error at checkValidityOfMediaFiles",
        additionalErrorInformation: `Video file exceeds maximum length of ${FOUR_MINUTES_IN_SECONDS} seconds.`,
      });
    }
  }
  return Success({});
}
