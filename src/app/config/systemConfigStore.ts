import { logger } from "../utils/logger";
import { loadOtpConfig } from "../modules/verification/config/otpConfig";
import { loadVerificationConfig } from "../modules/verification/config/verificationAttemptsConfig";
import { loadTwoFactorConfig } from "../modules/notification/config/twoFactorConfig";
import { loadCloudinaryConfig } from "../modules/document/config/cloudinaryConfig";
import { loadDocumentConfig } from "../modules/document/config/documentConfig";
import { loadJwtConfig } from "../modules/registration/config/jwtConfig";
import { loadPinConfig } from "../modules/registration/config/pinConfig";
import { loadAddressPinConfig } from "../modules/registration/config/addressPinCodeConfig";

class SystemConfigStore{

    loadConfigs = async () => {
        try {

            await loadOtpConfig()

            await loadVerificationConfig()

            await loadTwoFactorConfig()

            await loadCloudinaryConfig()

            await loadDocumentConfig()

            await loadJwtConfig()

            await loadPinConfig()

            await loadAddressPinConfig()

        } catch (error) {
            logger.error("Error loading system  configurations:", error);
            console.error("Error loading system configurations:", error);
        }
    }
 
}

export default new SystemConfigStore();