import { addProfile } from "@automapper/core";
import { globalMapper } from "./mapper.global";
import { userSubscriptionMapperProfile } from "./modules/userSubscription/models/mapper/mapper.user.subscriptions";
import { documentMapper } from "./modules/document/models/mapper/documentMapper";
import { planAggregatorMapper } from "./modules/planAggregator/models/mapper/planAggregatorMapper";
import { callMapper } from "./modules/calling/models/mapper/callMapper";

addProfile(globalMapper, userSubscriptionMapperProfile);
addProfile(globalMapper , documentMapper);
addProfile(globalMapper, planAggregatorMapper);
addProfile(globalMapper, callMapper);