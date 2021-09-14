import { spawn as defaultSpawn, SpawnOptionsWithoutStdio } from "child_process";
import { existsSync, mkdirSync, promises as fs } from "fs";
import path from "path";

export function capitalizeFirstLetter(word: string) {
  return word.charAt(0).toUpperCase() + word.slice(1);
}

export function kebabToPascalCase(kebabString: string) {
  const words = kebabString.split("-");
  const pascalString = words.map(capitalizeFirstLetter).join("");
  return pascalString;
}

export async function removeFile(filePath: string) {
  if (existsSync(filePath)) {
    await fs.unlink(filePath);
  }
}

export function createDirectory(directory: string) {
  if (!existsSync(directory)) {
    mkdirSync(directory);
  }
}

export async function emptyDirectory(directory: string) {
  const files = await fs.readdir(directory);
  const unlinkPromises = files.map((filename) => fs.unlink(`${directory}/${filename}`));
  return Promise.all(unlinkPromises);
}

export async function removeDirectory(directory: string) {
  const files = await fs.readdir(directory);
  const unlinkPromises = files.map(async (filename) => {
    const fullPath = path.resolve(directory, filename);
    const fileStatus = await fs.lstat(fullPath);
    if (fileStatus.isDirectory()) {
      return removeDirectory(fullPath);
    }
    return fs.unlink(fullPath);
  });
  await Promise.all(unlinkPromises);
  await fs.rmdir(directory);
}

export async function spawn(
  command: string,
  args: string[],
  options?: SpawnOptionsWithoutStdio,
) {
  return new Promise((resolve, reject) => {
    const process = defaultSpawn(command, args, options);
    process.stdout?.resume();
    process.on("data", (data) => {
      resolve(data);
    });
    process.on("error", (err) => {
      reject(err);
    });
    process.on("close", (exitCode) => {
      if (exitCode === 0) resolve(exitCode);
      reject(exitCode);
    });
  });
}

export async function formatCode(directory: string) {
  await spawn("prettier", ["--write", directory]);
}
