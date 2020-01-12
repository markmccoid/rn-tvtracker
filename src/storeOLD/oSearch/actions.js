import _ from "lodash";
import { pipe, debounce, mutate, filter } from "overmind";

import * as internalActions from "./internalActions";
// export internalActions as standard actions but in an object
// called internal.  Access by internal.actionName()
export const internal = internalActions;
// ----------------------------------------------------------------

export const searchByTitle = async ({ state, effects, actions }, payload) => {
  let searchResults = state.oSearch.searchResults;
  searchResults.isNewSearch =
    !payload.page || payload.page === 1 ? true : false;
  let newSearchResults = await effects.oSearch.searchMovieByTitle(
    payload.title,
    payload.page
  );
  let searchData = newSearchResults.data;
  // Check results to see if each movie already exists in savedMovies state
  let taggedResults = [];

  searchData.forEach(result => {
    result = _.omit(result, ["getMovieDetails"]);
    if (_.some(state.savedMovies, { id: result.id })) {
      taggedResults.push({ ...result, existsInSaved: true });
    } else {
      taggedResults.push({ ...result, existsInSaved: false });
    }
  });

  // state.movies =
  //   payload.page === 1 ? taggedResults : [...state.movies, ...taggedResults];
  searchResults.data =
    payload.page === 1 || !payload.page
      ? taggedResults
      : [...searchResults.data, ...taggedResults];
  searchResults.totalPages = searchResults.totalPages;
  searchResults.currentPage = searchResults.currentPage;
};
