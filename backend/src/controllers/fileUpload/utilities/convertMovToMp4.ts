/* eslint-disable @typescript-eslint/no-explicit-any */
import e from "cors";
import ffmpeg from "ffmpeg";
import { readFileSync, unlinkSync, writeFileSync } from "fs";
import { dirSync } from "tmp";

export async function convertMovToMp4(fileBuffer: Buffer): Promise<Buffer> {
  const temporaryDirectory = dirSync();

  try {
    const fileWritePath = `${temporaryDirectory.name}/temporaryFile.mov`;
    await writeFileSync(fileWritePath, fileBuffer, "base64");

    const video = await new ffmpeg(fileWritePath);
    // video.setVideoCodec("mpeg4");

    const convertedFilePath = `${temporaryDirectory.name}/temporaryFile.mp4`;

    await video.save(convertedFilePath);

    const mp4Buffer = await readFileSync(convertedFilePath);

    await unlinkSync(fileWritePath);
    await unlinkSync(convertedFilePath);
    temporaryDirectory.removeCallback();

    return mp4Buffer;
  } catch (error) {
    console.log("AN ERROR HAS OCCURRED!");
    console.log((error as any).code);
    console.log((error as any).msg);
    throw e;
  }
}
