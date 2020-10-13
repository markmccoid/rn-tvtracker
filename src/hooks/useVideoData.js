import React, { useState, useEffect } from "react";
import { movieGetVideos } from "@markmccoid/tmdb_api";
import _ from "lodash";

export const useVideoData = (movieId) => {
  const [videoData, setVideoData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const getVideoData = async () => {
    setIsLoading(true);
    if (!movieId) {
      setVideoData([]);
      setIsLoading(false);
      return;
    }
    const result = await movieGetVideos(movieId);
    // Want trailers to show up first, so sort and then reverse
    setVideoData(_.reverse(_.sortBy(result.data, ["type"])));
    setIsLoading(false);
  };
  useEffect(() => {
    getVideoData();
  }, [movieId]);
  // Not using nextPage, prevPage, but could change recommendedData state to be an object and then separate when returning
  // return [recommendedData.data, recommendedData.nextPage, recommendedData.prevPage, isLoading]
  return [videoData, isLoading];
};
