import { useState, useEffect } from "react";
import { movieGetPersonCredits } from "@markmccoid/tmdb_api";
import { useOState, useOActions } from "../store/overmind";
import _ from "lodash";

export const useGetPersonMovies = (personId) => {
  const [personMovieData, setPersonMovieData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const state = useOState();
  const actions = useOActions();

  const getPersonMovies = async () => {
    setIsLoading(true);
    if (!personId) {
      setPersonMovieData([]);
      setIsLoading(false);
      return;
    }
    const result = await movieGetPersonCredits(personId);

    // the results are not tagged (showing if a movie is already in your saved movies list)
    // tag first and then send back
    // This dataset returns the id as movieId, however the tagOtherMovieResults needs the movie id
    // to be stored in a property called id.  That is what we are doing here:
    const preppedForTagging = result.data.cast.map((item) => ({ ...item, id: item.movieId }));
    const taggedResults = actions.oSearch.tagOtherMovieResults(preppedForTagging);
    setPersonMovieData(_.reverse(_.sortBy(taggedResults, [(el) => el?.releaseDate?.epoch])));
    setIsLoading(false);
  };
  useEffect(() => {
    getPersonMovies();
  }, [personId, state.oSaved.savedTVShows.length]);
  // Not using nextPage, prevPage, but could change recommendedData state to be an object and then separate when returning
  // return [recommendedData.data, recommendedData.nextPage, recommendedData.prevPage, isLoading]
  return [personMovieData, isLoading];
};
