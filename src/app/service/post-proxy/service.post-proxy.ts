import { AppError, AppResponse, ERROR_CODES, HTTP_STATUS, JsonUtils, Loggable, RestService } from "@neon-lab-dev/platform";
import { paymentProxyService } from "../payment-proxy/service.payment-proxy"
import { postProxyConfig } from "../../config/config.post.proxy";
import { PostcountResponseDto } from "./models/dto.post.count.response";

class PostProxyService{

    private restService: RestService= new RestService()


    @Loggable()
    public async fetchAllMediaCount(): Promise<PostcountResponseDto> {
        let headers = paymentProxyService.getHeaders();
        let baseUrl = postProxyConfig.baseUrl as string;
        let url = `${baseUrl}/count`;
        let response = await this.restService.get<AppResponse>
            (
                url,
                undefined,
                headers
            );
        if (response.status === HTTP_STATUS.SUCCESS) {
            return JsonUtils.fromJson(JsonUtils.toJson(response.data.data), PostcountResponseDto);
        }
        throw new AppError(
            ERROR_CODES.EXTERNAL_API_ERROR,
            HTTP_STATUS.INTERNAL_SERVER_ERROR,
            `Failed to fetch media count.`
        )
    }
}

export default new PostProxyService();