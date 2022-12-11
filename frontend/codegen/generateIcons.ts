import { transform } from "@svgr/core";
import axios from "axios";
import { promises as fs } from "fs";
import path from "path";
import { createDirectory, emptyDirectory, formatCode, kebabToPascalCase } from "./utils";

const ICONS_TO_GENERATE = [
  "add",
  "add-r",
  "arrow-left",
  "bell",
  "bookmark",
  "calendar",
  "chevron-down",
  "chevron-down-o",
  "chevron-left",
  "chevron-right",
  "chevron-up",
  "chevron-up-o",
  "clipboard",
  "close",
  "comment",
  "community",
  "credit-card",
  "duplicate",
  "eye",
  "file-document",
  "heart",
  "home",
  "image",
  "info",
  "link",
  "list",
  "lock",
  "log-out",
  "options",
  "mail",
  "menu",
  "menu-boxed",
  "math-plus",
  "pen",
  "more-vertical-alt",
  "play-button-o",
  "remove",
  "search",
  "share",
  "shield",
  "shopping-bag",
  "software-download",
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
    const componentName = kebabToPascalCase(icon) + "Icon";
    return { name: icon, componentName, markup };
  });

  const svgs = await Promise.all(svgPromises);

  console.log("Removing Existing Files...");
  createDirectory(COMPONENT_DIRECTORY);
  await emptyDirectory(COMPONENT_DIRECTORY);

  console.log("Generating Icon Components...");
  const componentPromises = svgs.map(async (svg) => {
    let code = await transform(
      svg.markup,
      { typescript: true, jsxRuntime: "automatic" },
      { componentName: svg.componentName },
    );

    // Add comments to top of file
    code =
      `// CODE GENERATED FILE; DO NOT EDIT\n\n/** ${svg.componentName} icon sourced from https://css.gg/${svg.name} */` +
      code;

    // Get SVGProps type from React namespace instead of explicit import
    code = code.replace(`import { SVGProps } from "react";\n`, ``);
    code = code.replace(`SVGProps`, `React.SVGProps`);

    // Remove unneeded xmlns attribute
    code = code.replace(`xmlns="http://www.w3.org/2000/svg"`, ``);

    // Switch to named exports
    code = code.replace(`const`, `export const`);
    code = code.replace(`export default ${svg.componentName};`, ``);

    return fs.writeFile(
      path.resolve(COMPONENT_DIRECTORY, `${svg.componentName}.tsx`),
      code,
    );
  });

  await Promise.all(componentPromises);

  const providedComponents = await fs.readdir(
    path.resolve(OUTPUT_DIRECTORY, "./provided"),
  );
  const providedComponentNames = providedComponents.map((c) => c.split(".")[0]);

  const indexCode = svgs
    .map((svg) => `export * from "./generated/${svg.componentName}";`)
    .join("\n")
    .concat(
      providedComponentNames
        .map((name) => `export * from "./provided/${name}";`)
        .join("\n"),
    );

  await fs.writeFile(path.resolve(OUTPUT_DIRECTORY, `./index.tsx`), indexCode);

  console.log("Formatting Generated Code...");
  await formatCode(path.resolve(OUTPUT_DIRECTORY));

  console.log("Done! 🎉");
}

generateIcons();
