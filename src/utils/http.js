import axios from "axios";
import {useStore} from "../store/index";

let baseURL = import.meta.env.VITE_BASE_URL;
const retry = 3; // 重试次数
const retryDelay = 1000; // 重试间隔
let retryCount = 0;


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
            cookie: store.userCookie || store.defaultCookie,
        };
    } else if (config.method === "get") {
        config.params = {
            ...config.params,
            realIP: "211.161.244.70",
            cookie: store.userCookie || store.defaultCookie,
        };
    }

    return config;
});

service.interceptors.response.use(
    (response) => {
        return response.data;
    },
    (err) => {
        console.log(`正在重试 url: ${err.config.url}`);
        if (retryCount >= retry) {
            return err.response.data;
        }
        retryCount++;
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(service(err.config));
            }, retryDelay);
        });
    }

)
;

export default service;
