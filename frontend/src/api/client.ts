import axios, { AxiosInstance } from "axios";
import getConfig from "next/config";
import Router from "next/router";
import { toast } from "react-toastify";
import { getAccessToken } from "#/contexts/auth";
import { jsonDateReviver } from "#/utils/jsonRevivers";

const { publicRuntimeConfig } = getConfig();

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
    const errorReason = error?.response?.data?.error?.reason;

    if (errorReason) {
      toast.error(errorReason, { toastId: errorReason });
    } else if (error?.response?.status === 500) {
      toast.error("An internal server error occurred", { toastId: "500-error" });
    } else {
      toast.error("An unknown error ocurred", { toastId: "unknown-error" });
    }

    if (error?.response?.status === 401) Router.push("/login");

    return error?.response;
  },
);
