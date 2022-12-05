import getVideoDurationInSeconds from "get-video-duration";
import { createReadStream } from "streamifier";
import { Promise as BluebirdPromise } from "bluebird";
import { BackendKupoFile } from "../../../controllers/models";

export enum InvalidMediaFileReason {
  VideoLengthTooLong = "Video Length Is Too Long",
}

const FOUR_MINUTES_IN_SECONDS = 4 * 60;

export async function checkValidityOfMediaFiles({
  files,
}: {
  files: BackendKupoFile[];
}): Promise<InvalidMediaFileReason[]> {
  const unfilteredErrors: (InvalidMediaFileReason | null)[] = await BluebirdPromise.map(
    files,
    async (file: BackendKupoFile): Promise<InvalidMediaFileReason | null> => {
      const { mimetype: mimetype, buffer } = file;

      const permittedImageTypes = ["image/jpeg", "image/png", "image/gif"];

      const permittedVideoTypes = ["video/mp4"];

      const permittedMimeTypes = [...permittedImageTypes, ...permittedVideoTypes];

      if (!permittedMimeTypes.includes(mimetype)) {
        throw new Error(`Cannot handle file of type ${mimetype}`);
      }

      if (permittedImageTypes.includes(mimetype)) {
        // TODO: ADD IMAGE VALIDATION
      } else if (permittedVideoTypes.includes(mimetype)) {
        // TODO: ADD VIDEO VALIDATION
        const videoStream = createReadStream(buffer);

        const videoDurationInSeconds = await getVideoDurationInSeconds(videoStream);

        if (videoDurationInSeconds > FOUR_MINUTES_IN_SECONDS) {
          return InvalidMediaFileReason.VideoLengthTooLong;
        }
      }

      return null;
    },
  );

  const errors: InvalidMediaFileReason[] = unfilteredErrors.filter(
    (error) => !!error,
  ) as InvalidMediaFileReason[];

  return errors;
}
