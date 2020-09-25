import { useEffect, useState } from "react";
import { movieGetCredits } from "@markmccoid/tmdb_api";
import {
  loadLocalCastData,
  saveCastDataToLocal,
} from "../storage/localStorage";

export function useCastData(movieId) {
  let [castData, setCastData] = useState([]);

  // looks for data first in local storage
  // if not there, then reads from API and saves to local storage
  const loadCastData = async () => {
    let tempData;
    // Try to get cast Data from local storage
    tempData = await loadLocalCastData(movieId);
    if (!tempData) {
      // No data in local storage, get from API
      tempData = await movieGetCredits(movieId);
      tempData = tempData.data.cast;
      await saveCastDataToLocal(tempData, movieId);
    }

    setCastData(tempData);
  };

  useEffect(() => {
    loadCastData();
  }, []);

  return castData;
}
