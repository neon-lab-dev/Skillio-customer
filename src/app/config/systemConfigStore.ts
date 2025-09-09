import { logger } from "../utils/logger";
import { loadOtpConfig } from "../modules/verification/config/otpConfig";
import { loadVerificationConfig } from "../modules/verification/config/verificationAttemptsConfig";
import { loadTwoFactorConfig } from "../modules/notification/config/twoFactorConfig";

class SystemConfigStore{

    loadConfigs = async () => {
        try {

            await loadOtpConfig()

            await loadVerificationConfig()

            await loadTwoFactorConfig()

        } catch (error) {
            logger.error("Error loading system  configurations:", error);
            console.error("Error loading system configurations:", error);
        }
    }
 
}

export default new SystemConfigStore();