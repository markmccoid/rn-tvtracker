import { useEffect, useState } from "react";
import { movieGetWatchProviders } from "@markmccoid/tmdb_api";
import _ from "lodash";

type providerInfo = {
  provider: string;
  logoURL: string;
  providerId: number;
  displayPriority: number;
};
type watchProvidersType = {
  justWatchLink: string;
  stream: providerInfo[];
  rent: providerInfo[];
  buy: providerInfo[];
};
const initWatchProviders = { justWatchLink: null, stream: [], rent: [], buy: [] };
export function useWatchProviderData(movieId) {
  let [watchProviders, setWatchProviders] = useState<watchProvidersType>(initWatchProviders);
  let [isLoading, setIsLoading] = useState<boolean>(true);

  // looks for data first in local storage
  // if not there, then reads from API and saves to local storage
  const loadWatchProviderData = async () => {
    setIsLoading(true);
    if (!movieId) {
      setWatchProviders(initWatchProviders);
      setIsLoading(false);
      return;
    }
    // not passing country codes, which means we will only get back 'US'
    const tempData = await movieGetWatchProviders(movieId);
    const tempDataUS: watchProvidersType = tempData.data.results.US;
    // Sort each array "rent, buy, stream" by their displayPriority
    const finalData = {
      ...tempDataUS,
      rent: _.sortBy(tempDataUS.rent, ["displayPriority"]),
      buy: _.sortBy(tempDataUS.buy, ["displayPriority"]),
      stream: _.sortBy(tempDataUS.stream, ["displayPriority"]),
    };

    setIsLoading(false);
    // { justWatchLink, stream: { provider, logoURL, providerId, displayPriority}, rent, buy}
    setWatchProviders(finalData);
  };

  useEffect(() => {
    loadWatchProviderData();
  }, [movieId]);
  return [watchProviders, isLoading];
}
