import {
  Api,
  AppResponse,
  HTTP_STATUS,
  RESPONSE_MESSAGES,
} from "@neon-lab-dev/platform";
import { RefreshTokenRequest } from "../models/request/refreshTokenRequest";
import registrationServices from "../registration.services";
import refreshTokenValidator from "../validators/refreshTokenValidator";

export class RefreshTokenApi implements Api<RefreshTokenRequest, AppResponse> {
  async preprocess(req: RefreshTokenRequest): Promise<void> | never {
    await refreshTokenValidator.validate(req);
  }

  async process(req: RefreshTokenRequest): Promise<AppResponse> {
    const res = await registrationServices.refreshAccessToken(req);

    return {
      status: HTTP_STATUS.SUCCESS,
      message: RESPONSE_MESSAGES.SUCCESS,
      data: res,
    };
  }
}
