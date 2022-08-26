/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable import/no-default-export */
import { defineConfig } from "cypress";
import { promisify } from "util";
import { exec } from "child_process";

async function resetTestDb() {
  console.log("Resetting Local Database");
  const { stdout, stderr } = await promisify(exec)(
    "cd ../backend && NODE_TLS_REJECT_UNAUTHORIZED=1 yarn resetTestDatabaseWithFakeData",
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
      on("before:run", async (spec) => {
        await resetTestDb();
        spec;
      });

      return require("./cypress/plugins/index.js")(on, config);
    },
    baseUrl: "http://localhost:3000",
  },
  env: {
    API_BASE_URL: "https://test-api.kupo.social/",
  },
});
