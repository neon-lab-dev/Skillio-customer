import {  AppResponse, CONTENT_TYPES, HEADERS, HTTP_STATUS, JsonUtils, Loggable, RestService } from "@neon-lab-dev/platform";
import { paymentProxyService } from "../payment-proxy/service.payment-proxy"
import { postProxyConfig } from "../../config/config.post.proxy";
import { PostcountResponseDto } from "./models/dto.post.count.response";
import { PrivacyResponseDto } from "./models/dto.privacy.response";
import { ExternalApiError } from "../../errors/externalApiError";
import { FetchFollowRequest } from "./models/fetchFollowRequest";
import { FollowResponseDto } from "./models/dto.follow.response";
import { CreatePrivacyRequest } from "./models/createPrivacyRequest";
import { FetchPrivacyRequest } from "./models/fetchPrivacyRequest";

class PostProxyService{

    private restService: RestService= new RestService()


    @Loggable()
    public async fetchAllMediaCount(): Promise<PostcountResponseDto> {
        let headers = paymentProxyService.getHeaders();
        let baseUrl = postProxyConfig.baseUrl as string;
        let url = `${baseUrl}/media/count`;
        let response = await this.restService.get<AppResponse>
            (
                url,
                undefined,
                headers
            );
        if (response.status === HTTP_STATUS.SUCCESS) {
            return JsonUtils.fromJson(JsonUtils.toJson(response.data.data), PostcountResponseDto);
        }
        throw new ExternalApiError("failed to fetch media count")
    }

    @Loggable()
    public async createPrivacy(req: CreatePrivacyRequest):Promise<PrivacyResponseDto>{
        let baseUrl= postProxyConfig.baseUrl as string;

        let url=`${baseUrl}/privacy`;
        let response= await this.restService.post<AppResponse>(
            url,
            req,
            {
                [HEADERS.CONTENT_TYPE]: CONTENT_TYPES.APPLICATION_JSON
            }
        )
        if(response.status=== HTTP_STATUS.SUCCESS){
            return JsonUtils.fromJson(JsonUtils.toJson(response.data.data) , PrivacyResponseDto);
        }

        throw new ExternalApiError("failed to create privacy");
    }

    @Loggable()
    public async fetchPrivacy(req: FetchPrivacyRequest):Promise<PrivacyResponseDto>{
        let baseUrl= postProxyConfig.baseUrl as string;
        const headers= paymentProxyService.getHeaders();
        let url= `${baseUrl}/privacy`;
        let response= await this.restService.get<AppResponse>(
            url,
            req,
            headers
        );
        if(response.status===HTTP_STATUS.SUCCESS){
            return JsonUtils.fromJson(JsonUtils.toJson(response.data.data) , PrivacyResponseDto);
        }
        throw new ExternalApiError("failed to fetch privacy");
    }

    @Loggable()
    public async fetchFollow(req: FetchFollowRequest):Promise<FollowResponseDto>{
        let headers= paymentProxyService.getHeaders();
        let baseUrl= postProxyConfig.baseUrl as string;
        let url= `${baseUrl}/follow`;

        let response= await this.restService.get<AppResponse>
        (
            url,
            req,
            headers
        )
        if(response.status===HTTP_STATUS.SUCCESS){
            return JsonUtils.fromJson(JsonUtils.toJson(response.data.data) , FollowResponseDto);
        }
        throw new ExternalApiError("failed to fetch follow");
    }
}

export default new PostProxyService();