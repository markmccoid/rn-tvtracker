import watchProvidersData from "../../assets/watchProviders.json";
import _ from "lodash";

export const watchProviders = _.sortBy(watchProvidersData, "providerOrder");
