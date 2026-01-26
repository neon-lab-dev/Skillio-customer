import { addProfile } from "@automapper/core";
import { globalMapper } from "./mapper.global";
import { userSubscriptionMapperProfile } from "./modules/userSubscription/models/mapper/mapper.user.subscriptions";

addProfile(globalMapper, userSubscriptionMapperProfile);