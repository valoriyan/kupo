// Enable env vars for local dev
if (process.env.NODE_ENV !== "production") {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  require("dotenv").config({ path: ".env" });
}

module.exports = {
  staticPageGenerationTimeout: 1000,
  reactStrictMode: true,
  publicRuntimeConfig: {
    API_BASE_URL: process.env.API_BASE_URL,
    NETWORK_PORTAL_ID: process.env.NETWORK_PORTAL_ID,
  },
  images: {
    domains: [
      "localhost",
      "kupo.social",
      "kupo-dev.s3.wasabisys.com",
      "kupo-test.s3.wasabisys.com",
    ],
  },
};
