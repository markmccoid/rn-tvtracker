import React, { useState, useEffect } from "react";
import { tvGetVideos } from "@markmccoid/tmdb_api";
import _ from "lodash";

export const useVideoData = (tvShowId) => {
  const [videoData, setVideoData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const getVideoData = async () => {
    setIsLoading(true);
    if (!tvShowId) {
      setVideoData([]);
      setIsLoading(false);
      return;
    }
    const result = await tvGetVideos(tvShowId);
    // Want trailers to show up first, so sort and then reverse
    setVideoData(_.reverse(_.sortBy(result.data, ["type"])));
    setIsLoading(false);
  };
  useEffect(() => {
    getVideoData();
  }, [tvShowId]);
  // Not using nextPage, prevPage, but could change recommendedData state to be an object and then separate when returning
  // return [recommendedData.data, recommendedData.nextPage, recommendedData.prevPage, isLoading]
  return [videoData, isLoading];
};
