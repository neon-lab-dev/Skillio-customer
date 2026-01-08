
import { DecodedToken } from "@neon-lab-dev/platform";

declare global {
  namespace Express {
    interface Request {
      user: DecodedToken;
    }
  }
}


