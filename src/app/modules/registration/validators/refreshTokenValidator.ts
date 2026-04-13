import { AppValidationError, ERROR_CODES } from "@neon-lab-dev/platform";
import { RefreshTokenRequest } from "../models/request/refreshTokenRequest";

class RefreshTokenValidator {
  async validate(req: RefreshTokenRequest): Promise<void> {
    if (!req.refreshToken || req.refreshToken.trim() === "") {
      throw new AppValidationError(
        "Refresh token is required",
        ERROR_CODES.VALIDATION_ERROR,
      );
    }
  }
}

export default new RefreshTokenValidator();
