import React, { useState, useEffect } from "react";
import { tvGetRecommendations } from "@markmccoid/tmdb_api";
import { useOState, useOActions } from "../store/overmind";

function getNextPage(page, totalPages) {
  let nextPage = page + 1;
  if (nextPage > totalPages) {
    nextPage = page;
  }
  return nextPage;
}

export const useRecommendedData = (tvShowId, page = 1) => {
  const [recommendedData, setRecommendedData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const state = useOState();
  const actions = useOActions();

  const getRecommendedData = async () => {
    setIsLoading(true);
    if (!tvShowId) {
      setRecommendedData([]);
      setIsLoading(false);
      return;
    }
    const result = await tvGetRecommendations(tvShowId);
    // Maybe will use later.  Could expose and let get more data
    const nextPage = getNextPage(result.data.page, result.data.totalPages);
    const prevPage = result.data.page - 1 < 1 ? 1 : result.data.page - 1;
    // the results are not tagged (showing if a movie is already in your saved movies list)
    // tag first and then send back
    const taggedResults = actions.oSearch.tagOtherTVShowResults(result.data.results);
    setRecommendedData(taggedResults);
    setIsLoading(false);
  };
  useEffect(() => {
    getRecommendedData();
  }, [tvShowId, page, state.oSaved.savedTVShows.length]);
  // Not using nextPage, prevPage, but could change recommendedData state to be an object and then separate when returning
  // return [recommendedData.data, recommendedData.nextPage, recommendedData.prevPage, isLoading]
  return [recommendedData, isLoading];
};
