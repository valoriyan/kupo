import { BackendKupoFile, UploadableKupoFile } from "../../../controllers/models";

export const ingestUploadedFile = ({
  uploadableKupoFile,
}: {
  uploadableKupoFile: UploadableKupoFile;
}): BackendKupoFile => {
  // I have no idea why this is necessary
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const strippedBase64Text = uploadableKupoFile.blobText.split(";base64,").pop()!;

  return {
    mimetype: uploadableKupoFile.mimetype,
    buffer: Buffer.from(strippedBase64Text, "base64"),
  };
};
