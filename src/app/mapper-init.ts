import { addProfile } from "@automapper/core";
import { globalMapper } from "./mapper.global";
import { userSubscriptionMapperProfile } from "./modules/userSubscription/models/mapper/mapper.user.subscriptions";
import { planAggregatorMapper } from "./modules/planAggregator/models/mapper/planAggregatorMapper";

addProfile(globalMapper, userSubscriptionMapperProfile);
addProfile(globalMapper, planAggregatorMapper);