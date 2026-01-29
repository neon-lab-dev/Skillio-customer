import dotenv from "dotenv";
dotenv.config()

export const PaymentProxyConfig = {
    baseUrl: process.env.PAYMENT_SERVICE_BASEURL
}