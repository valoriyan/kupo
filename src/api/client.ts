import axios, { AxiosInstance } from "axios";
import { jsonDateReviver } from "#/utils/jsonRevivers";

export const client: AxiosInstance = axios.create({
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
