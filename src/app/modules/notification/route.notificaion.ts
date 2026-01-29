import { asyncApiHandler, createCriteriaMiddleWare } from "@neon-lab-dev/platform";
import { Router } from "express";
import { FetchNotificationApi } from "./api/api.fetch.notification";
import { verifyToken } from "../../middlewares/requireAuth";
import { NotificatinSearchCriteria } from "./models/request/searchCriteria/notificationSearchCriteria";
import { searchCriteriaBuilderFactory } from "../searchCriteria/search.criteria.builder.factory";

const router= Router();
const fetchNotificationApi= new FetchNotificationApi()

router.get(
    "/" , 
    verifyToken,
    createCriteriaMiddleWare(NotificatinSearchCriteria , searchCriteriaBuilderFactory),
    asyncApiHandler(fetchNotificationApi)
);

export const notificaionRouter= router;