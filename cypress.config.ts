/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable import/no-default-export */
import { defineConfig } from "cypress";
import { promisify } from "util";
import { exec } from "child_process";

async function resetDb() {
  console.log("Resetting Local Database");
  const { stdout, stderr } = await promisify(exec)(
    "pwd",
    // "yarn --cwd /Users/julian/Desktop/Valoriyan/playhouse-backend resetFakeLocalData",
  );
  console.log("stdout:", stdout);
  console.log("stderr:", stderr);

  if (stderr) {
    throw new Error(stderr);
  }
}

export default defineConfig({
  e2e: {
    defaultCommandTimeout: 10000,

    // We've imported your old cypress plugins here.
    // You may want to clean this up later by importing these.
    setupNodeEvents(on, config) {
      on("before:spec", async (spec) => {
        await resetDb();
        spec;
      });

      return require("./cypress/plugins/index.js")(on, config);
    },
    baseUrl: "http://localhost:3000",
  },
  env: {
    API_BASE_URL: "https://test-api.kupono.io/",
  },
});
