import _ from "lodash";
import { pipe, debounce, mutate, filter } from "overmind";

import * as internalActions from "./internalActions";
// export internalActions as standard actions but in an object
// called internal.  Access by internal.actionName()
export const internal = internalActions;
// ----------------------------------------------------------------

export const setIsNewQuery = ({ state }, value) => {
  state.oSearch.isNewQuery = value;
};
/**
 * Action called when searching automatically
 * This search will always overwrite the old resultData
 *
 */
export const searchPassingTitle = pipe(
  mutate(({ state }, movieTitle) => {
    state.oSearch.searchString = movieTitle;
    state.oSearch.isNewQuery = true;
  }),
  debounce(500),
  mutate(async ({ state, effects, actions }) => {
    let { oSearch } = state;
    oSearch.isLoading = true;
    if (oSearch.searchString.length === 0) {
      oSearch.resultData = [];
      oSearch.resultTotalPages = undefined;
      oSearch.resultCurrentPage = undefined;
      oSearch.isLoading = false;
      return;
    }
    let results = await effects.oSearch.searchMovieByTitle(
      oSearch.searchString
    );
    let taggedMovies = actions.oSearch.internal.tagResults(results.data);
    oSearch.resultData = taggedMovies;
    oSearch.resultTotalPages = results.totalPages;
    oSearch.resultCurrentPage = results.currentPage;
    oSearch.isLoading = false;
  })
);

export const tagOtherMovieResults = ({ actions }, movies) => {
  return actions.oSearch.internal.tagResults(movies);
};
export const clearSearchStringAndData = ({ state }) => {
  state.oSearch.searchString = "";
  state.oSearch.resultData = [];
  // state.oSearch.isMoreData = false;
  state.oSearch.isNewQuery = true;
};
/**
 * Assumes that the searchString has/is set
 */
export const searchByTitle = async ({ state, effects, actions }, page = 1) => {
  let { oSearch } = state;
  oSearch.isLoading = true;
  // oSearch.isNewQuery = false;
  let results = await effects.oSearch.searchMovieByTitle(
    oSearch.searchString,
    page
  );
  let taggedMovies = actions.oSearch.internal.tagResults(results.data);
  oSearch.resultData = oSearch.isNewQuery
    ? taggedMovies
    : [...oSearch.resultData, ...taggedMovies];
  oSearch.resultTotalPages = results.totalPages;
  oSearch.resultCurrentPage = results.currentPage;
  oSearch.isLoading = false;
};
/**
 * Action called when searching automatically
 * This search will always overwrite the old resultData
 *
 * @param {object} context
 * @param {object} payload { title, page = 1}
 */
// export const searchByTitleOld = async (
//   { state, effects, actions },
//   payload
// ) => {
//   // Get oSearch namespaces context broken out
//   let oSearchState = state.oSearch;
//   let oSearchEffects = effects.oSearch;

//   // ** Needed for Tagging results, should be moved to internal actions
//   let savedMovies = state.oSaved.savedMovies;
//   oSearchState.searchString = payload.title;
//   // oSearchState.isNewSearch = !payload.page || payload.page === 1 ? true : false;
//   let newSearchResults = await oSearchEffects.searchMovieByTitle(
//     oSearchState.searchString,
//     payload.page
//   );

//   // Check results to see if each movie already exists in savedMovies state
//   let taggedResults = [];

//   newSearchResults.data.forEach(result => {
//     result = _.omit(result, ["getMovieDetails"]);
//     if (_.some(savedMovies, { id: result.id })) {
//       taggedResults.push({ ...result, existsInSaved: true });
//     } else {
//       taggedResults.push({ ...result, existsInSaved: false });
//     }
//   });

//   // state.movies =
//   //   payload.page === 1 ? taggedResults : [...state.movies, ...taggedResults];
//   // oSearchState.resultData =
//   //   payload.page === 1 || !payload.page
//   //     ? taggedResults
//   //     : [...oSearchState.resultData, ...taggedResults];
//   oSearchState.resultData = taggedResults;
//   oSearchState.resultTotalPages = searchResults.totalPages;
//   oSearchState.resultCurrentPage = searchResults.currentPage;
// };
