// Enable env vars for local dev
if (process.env.NODE_ENV !== "production") {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  require("dotenv").config({ path: ".env" });
}

module.exports = {
  reactStrictMode: true,
  publicRuntimeConfig: {
    API_BASE_URL: process.env.API_BASE_URL,
    API_WEBSOCKET_URL: process.env.API_WEBSOCKET_URL,
  },
  images: {
    domains: ["localhost", "kupono.io"],
  },
};
