import { ZodError } from "zod";
import { TErrorSource, TGenericErrorResponse } from "../interface/error";

const handleZodError = (err: ZodError): TGenericErrorResponse => {
  const errorSources: TErrorSource = err.issues.map((issue) => {
    const lastPath = issue.path[issue.path.length - 1];

    return {
      path:
        typeof lastPath === "symbol"
          ? lastPath.toString()
          : lastPath,
      message: issue.message,
    };
  });

  return {
    statusCode: 400,
    message: "Zod Validation Error.",
    errorSources,
  };
};


export default handleZodError