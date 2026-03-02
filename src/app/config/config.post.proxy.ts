import dotenv from "dotenv";
dotenv.config()

export const postProxyConfig = {
    baseUrl: process.env.POST_SERVICE_BASEURL
}