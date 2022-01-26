import axios from "axios";
import Cookie from "js-cookie";

let baseURL = "https://apimusic.rokeey.cn/";
let timestamp = new Date().getTime();

const service = axios.create({
  baseURL,
  withCredentials: true,
  timeout: 15000,
});

service.interceptors.request.use(function (config) {
  if (config.method === "post") {
    config.data = {
      ...config.data,
      timestamp,
      cookie: `MUSIC_U=${Cookie.get("MUSIC_U")};`,
    };
  } else if (config.method === "get") {
    config.params = {
      timestamp,
      ...config.params,
      cookie: `MUSIC_U=${Cookie.get("MUSIC_U")};`,
    };
  }

  return config;
});

service.interceptors.response.use(
  (response) => {
    const res = response.data;
    return res;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default service;
