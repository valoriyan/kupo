import axios, { AxiosInstance } from "axios";
import getConfig from "next/config";
import Router from "next/router";
import { toast } from "react-toastify";
import { getAccessToken } from "#/contexts/auth";
import { jsonDateReviver } from "#/utils/jsonRevivers";

const { publicRuntimeConfig } = getConfig();

console.log("publicRuntimeConfig.API_BASE_URL");
console.log(publicRuntimeConfig.API_BASE_URL);

export const client: AxiosInstance = axios.create({
  baseURL: publicRuntimeConfig.API_BASE_URL,
  timeout: 10 * 1000,
  withCredentials: true,
  transformResponse: (res) => {
    try {
      return JSON.parse(res, jsonDateReviver);
    } catch {
      return res;
    }
  },
});
client.interceptors.request.use(async (request) => {
  const authStrat = request.authStrat || "requireToken";
  if (authStrat === "noToken") return request;

  const accessToken = await getAccessToken();

  if (!accessToken && authStrat === "requireToken") {
    Router.push("/login");
  } else {
    request.headers["x-access-token"] = accessToken;
  }

  return request;
});
client.interceptors.response.use(
  async (response) => {
    return response;
  },
  async (error) => {
    if (error?.response?.data?.error?.reason) {
      toast.error(error.response.data.error.reason, {
        toastId: error.response.data.error.reason ?? "unknown-api-error",
      });
    }

    if (error?.response?.status === 500) {
      toast.error("An internal server error occurred", { toastId: "500-error" });
    }

    if (error?.response?.status === 401) Router.push("/login");

    return error?.response;
  },
);
