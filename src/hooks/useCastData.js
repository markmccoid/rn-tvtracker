import { useEffect, useState } from "react";
import { tvGetShowCredits } from "@markmccoid/tmdb_api";
import { loadFromAsyncStorage, saveToAsyncStorage } from "../storage/asyncStorage";

export function useCastData(tvShowId) {
  let [castData, setCastData] = useState([]);

  // looks for data first in local storage
  // if not there, then reads from API and saves to local storage
  const loadCastData = async () => {
    let tempData;
    const castStorageKey = `castdata-${tvShowId}`;
    // Try to get cast Data from Async storage
    tempData = await loadFromAsyncStorage(castStorageKey);
    if (!tempData) {
      // No data in local storage, get from API
      tempData = await tvGetShowCredits(tvShowId);
      tempData = tempData.data.cast;
      // Save to Async Storage
      await saveToAsyncStorage(castStorageKey, tempData);
    }

    setCastData(tempData);
  };

  useEffect(() => {
    loadCastData();
  }, [tvShowId]);

  return castData;
}
