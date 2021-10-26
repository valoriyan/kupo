import svgr from "@svgr/core";
import axios from "axios";
import { promises as fs } from "fs";
import path from "path";
import { createDirectory, emptyDirectory, formatCode, kebabToPascalCase } from "./utils";

const ICONS_TO_GENERATE = [
  "add",
  "add-r",
  "bell",
  "bookmark",
  "box",
  "calendar",
  "chevron-down",
  "chevron-down-r",
  "chevron-left",
  "chevron-right",
  "chevron-up-r",
  "close",
  "duplicate",
  "girl",
  "home",
  "list",
  "log-out",
  "options",
  "mail",
  "menu",
  "math-plus",
  "play-button-o",
  "remove",
  "share",
  "support",
  "tag",
  "trash",
  "user",
];

const OUTPUT_DIRECTORY = path.resolve(__dirname, "../src/components/Icons");
const COMPONENT_DIRECTORY = path.resolve(OUTPUT_DIRECTORY, "./generated");

function getIconUrl(icon: string) {
  return `https://unpkg.com/css.gg@2.0.0/icons/svg/${icon}.svg`;
}

async function generateIcons() {
  console.log("Fetching SVG Markup...");
  const svgPromises = ICONS_TO_GENERATE.map(async (icon) => {
    const response = await axios.get<string>(getIconUrl(icon));
    const markup = response.data;
    const componentName = kebabToPascalCase(icon);
    return { name: icon, componentName, markup };
  });

  const svgs = await Promise.all(svgPromises);

  console.log("Removing Existing Files...");
  createDirectory(COMPONENT_DIRECTORY);
  await emptyDirectory(COMPONENT_DIRECTORY);

  console.log("Generating Icon Components...");
  const componentPromises = svgs.map(async (svg) => {
    let code = await svgr(
      svg.markup,
      { typescript: true },
      { componentName: svg.componentName },
    );

    // Remove unneeded React import and replace with comment
    code = code.replace(
      `import * as React from "react";\n`,
      `// CODE GENERATED FILE; DO NOT EDIT\n\n/** ${svg.componentName} icon sourced from https://css.gg/${svg.name} */`,
    );

    // Remove unneeded xmlns attribute
    code = code.replace(`xmlns="http://www.w3.org/2000/svg"`, ``);

    // Switch to named exports
    code = code.replace(`function`, `export function`);
    code = code.replace(`export default ${svg.componentName};`, ``);

    return fs.writeFile(
      path.resolve(COMPONENT_DIRECTORY, `${svg.componentName}.tsx`),
      code,
    );
  });

  await Promise.all(componentPromises);

  const indexCode = svgs
    .map((svg) => `export * from "./generated/${svg.componentName}";`)
    .join("\n");

  await fs.writeFile(path.resolve(OUTPUT_DIRECTORY, `./index.tsx`), indexCode);

  console.log("Formatting Generated Code...");
  await formatCode(path.resolve(OUTPUT_DIRECTORY));

  console.log("Done! 🎉");
}

generateIcons();
