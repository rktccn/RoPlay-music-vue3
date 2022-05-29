import axios from "axios";
import Cookie from "js-cookie";
import { useStore } from "../store/index";

let baseURL = import.meta.env.VITE_BASE_URL;

const service = axios.create({
  baseURL,
  withCredentials: true,
  timeout: 15000,
});

service.interceptors.request.use(function (config) {
  const store = useStore();
  if (config.method === "post") {
    config.data = {
      ...config.data,
      realIP: "211.161.244.70",
      cookie: useStore().userCookie || useStore().defaultCookie,
    };
  } else if (config.method === "get") {
    config.params = {
      ...config.params,
      realIP: "211.161.244.70",
      cookie: useStore().userCookie || useStore().defaultCookie,
    };
  }

  return config;
});

service.interceptors.response.use(
  (response) => {
    const res = response.data;
    return res;
  },
  (err) => {
    return err.response.data;
  }
);

export default service;
