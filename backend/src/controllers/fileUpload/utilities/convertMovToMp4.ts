/* eslint-disable @typescript-eslint/no-explicit-any */
import ffmpeg from "ffmpeg";
import { readFileSync, unlinkSync, writeFileSync } from "fs";
import { dirSync } from "tmp";

export async function convertMovToMp4(fileBuffer: Buffer): Promise<Buffer> {
  console.log(`Starting convertMovToMp4`);
  const temporaryDirectory = dirSync();

  console.log(`temporaryDirectory: "${temporaryDirectory}"`);

  try {
    const fileWritePath = `${temporaryDirectory.name}/temporaryFile.mov`;
    await writeFileSync(fileWritePath, fileBuffer, "base64");

    console.log(`Wrote .mov file at "${fileWritePath}"`);

    const video = await new ffmpeg(fileWritePath);
    console.log(`Opened .mov file with ffmpeg`);

    // video.setVideoCodec("mpeg4");

    const convertedFilePath = `${temporaryDirectory.name}/temporaryFile.mp4`;

    await video.save(convertedFilePath);

    console.log(`Wrote .mp4 file at "${convertedFilePath}"`);

    const mp4Buffer = await readFileSync(convertedFilePath);

    console.log(`Completed reading mp4 file.`);

    await unlinkSync(fileWritePath);
    console.log(`Cleaned up .mov file.`);
    await unlinkSync(convertedFilePath);
    console.log(`Cleaned up .mp4 file.`);
    temporaryDirectory.removeCallback();
    console.log(`Cleaned up temporary directory`);

    return mp4Buffer;
  } catch (error) {
    console.log("AN ERROR HAS OCCURRED!");
    console.log((error as any).code);
    console.log((error as any).msg);
    throw error;
  }
}
