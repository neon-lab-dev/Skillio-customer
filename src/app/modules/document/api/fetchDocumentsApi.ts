import { Api, HTTP_STATUS, RESPONSE_MESSAGES } from "@neon-lab-dev/platform";
import { FetchDocumentsRequest } from "../models/request/fetchDocumentsRequest";
import { AppResponse } from "@neon-lab-dev/platform";
import fetchDocumentsValidator from "../validators/fetchDocumentsValidator";
import documentServices from "../services/document.services";

export class FetchDocumentApi implements Api<FetchDocumentsRequest , AppResponse>{
    async preprocess(req: FetchDocumentsRequest):  Promise<void> | never {
        fetchDocumentsValidator.validate(req);
    }
    
    async process(req: FetchDocumentsRequest): Promise<AppResponse> {
        const res= await documentServices.fetchDocuments(req);

        return{
            status: HTTP_STATUS.SUCCESS,
            message: RESPONSE_MESSAGES.SUCCESS,
            data: res
        }
    }
}