import { addProfile } from "@automapper/core";
import { globalMapper } from "./mapper.global";
import { userSubscriptionMapperProfile } from "./modules/userSubscription/models/mapper/mapper.user.subscriptions";
import { documentMapper } from "./modules/document/models/mapper/documentMapper";

addProfile(globalMapper, userSubscriptionMapperProfile);
addProfile(globalMapper , documentMapper);