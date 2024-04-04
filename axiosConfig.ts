import axios, { AxiosRequestConfig } from "axios";

const API_URL_LOCAL = process.env.API_URL_LOCAL || "http://localhost:3000/api";
const API_URL_REMOTE = process.env.API_URL_REMOTE || "https://wealth-wise-hub-full-stack.vercel.app/api";

const API = axios.create({
  baseURL: API_URL_LOCAL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const get = async (url: string, config?: AxiosRequestConfig) => {
  return await API.get(url, config);
}

export const post = async (url: string, data: any, config?: AxiosRequestConfig) => {
  return await API.post(url, data, config);
}

export const put = async (url: string, data: any, config?: AxiosRequestConfig) => {
  return await API.put(url, data, config);
}

export const remove = async (url: string, config?: AxiosRequestConfig) => {
  return await API.delete(url, config);
}
  