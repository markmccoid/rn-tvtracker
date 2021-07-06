import { useEffect, useState } from "react";
import { tvGetWatchProviders } from "@markmccoid/tmdb_api";
import _ from "lodash";

type ProviderInfo = {
  provider: string;
  logoURL: string;
  providerId: number;
  displayPriority: number;
};
export type WatchProvidersType = {
  justWatchLink: string;
  stream: ProviderInfo[];
  rent: ProviderInfo[];
  buy: ProviderInfo[];
};
const initWatchProviders: WatchProvidersType = {
  justWatchLink: "",
  stream: [],
  rent: [],
  buy: [],
};

export function useWatchProviderData(tvShowId: number): [WatchProvidersType, boolean] {
  let [watchProviders, setWatchProviders] = useState<WatchProvidersType>(initWatchProviders);
  let [isLoading, setIsLoading] = useState<boolean>(true);

  // looks for data first in local storage
  // if not there, then reads from API and saves to local storage
  const loadWatchProviderData = async () => {
    setIsLoading(true);
    if (!tvShowId) {
      setWatchProviders(initWatchProviders);
      setIsLoading(false);
      return;
    }
    // not passing country codes, which means we will only get back 'US'
    const tempData = await tvGetWatchProviders(tvShowId);
    const tempDataUS: WatchProvidersType = tempData.data.results.US;
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
  }, [tvShowId]);
  return [watchProviders, isLoading];
}
