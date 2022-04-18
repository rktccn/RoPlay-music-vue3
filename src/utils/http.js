import axios from "axios";
import Cookie from "js-cookie";

let baseURL = import.meta.env.VITE_BASE_URL;

const service = axios.create({
  baseURL,
  withCredentials: true,
  timeout: 15000,
});

service.interceptors.request.use(function (config) {
  if (config.method === "post") {
    config.data = {
      ...config.data,
    };
  } else if (config.method === "get") {
    config.params = {
      ...config.params,
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
