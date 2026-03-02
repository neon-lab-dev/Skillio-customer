import { AppError, AppResponse, AsyncContextService, CONTENT_TYPES, ERROR_CODES, HEADERS, HTTP_STATUS, JsonUtils, Loggable, NotFoundError, RestService, TOKEN } from "@neon-lab-dev/platform";
import { PaymentRequest } from "./models/dto.request.payment";
import { PaymentProxyConfig } from "../../config/config.payment.proxy";
import { PaymentResponseDto } from "./models/dto.payment.response";
import { PaymentLinkStatusRequest } from "./models/dto.request.payment.link.status";


class PaymentProxyService {

    private restService: RestService = new RestService();

    @Loggable()
    public async initate(req: PaymentRequest): Promise<PaymentResponseDto> {
        let headers = this.getHeaders();
        let baseUrl = PaymentProxyConfig.baseUrl as string;
        let response = await this.restService.post<AppResponse>(
            baseUrl,
            req,
            headers
        );
        if (response.status === HTTP_STATUS.CREATED) {
            return JsonUtils.fromJson(JsonUtils.toJson(response.data.data), PaymentResponseDto);
        }
        throw new AppError(
            ERROR_CODES.EXTERNAL_API_ERROR,
            HTTP_STATUS.INTERNAL_SERVER_ERROR,
            `Failed to initiate Payment.`
        )
    }

    public getHeaders(): Record<string, any> {
        let token = AsyncContextService.get(TOKEN);
        if (!token) {
            throw new NotFoundError(`Required token not found.`);
        }
        return {
            [HEADERS.CONTENT_TYPE]: CONTENT_TYPES.APPLICATION_JSON,
            [HEADERS.AUTHORIZATION]: `Bearer ${token}`
        };
    }

    @Loggable()
    public async fetchStatus(req: PaymentLinkStatusRequest): Promise<PaymentResponseDto> {
        let headers = this.getHeaders();
        let baseUrl = PaymentProxyConfig.baseUrl as string;
        let url = `${baseUrl}/status`;
        let response = await this.restService.post<AppResponse>
            (
                url,
                req,
                headers
            );
        if (response.status === HTTP_STATUS.SUCCESS) {
            return JsonUtils.fromJson(JsonUtils.toJson(response.data.data), PaymentResponseDto);
        }
        throw new AppError(
            ERROR_CODES.EXTERNAL_API_ERROR,
            HTTP_STATUS.INTERNAL_SERVER_ERROR,
            `Failed to initiate Payment.`
        )
    }


}

export const paymentProxyService = new PaymentProxyService();
